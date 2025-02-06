import browser from "webextension-polyfill";
import { CoreFrameInfo, TabFrameTracker } from "./tab-frame-tracker";
import { frameMonitorContentScript } from "./content-scripts/frame-monitor";

class VisibleFrameTracker extends TabFrameTracker {
  private useInjection: boolean = false;
  private hasScriptingPermission: boolean = false;

  constructor(
    options: {
      useInjection?: boolean;
    } = {}
  ) {
    super();

    this.useInjection = options.useInjection ?? false;

    this.initialize();
  }

  private async initialize() {
    // Check if we have scripting permission
    const permissions = await browser.permissions.getAll();
    this.hasScriptingPermission =
      permissions.permissions?.includes("scripting") || false;

    console.log("Initializing StatefulTabFrameTracker", {
      hasScriptingPermission: this.hasScriptingPermission,
      useInjection: this.useInjection,
    });
    if (this.hasScriptingPermission && this.useInjection) {
      await this.initializeContentScriptSupport();
    }
  }

  private async initializeContentScriptSupport() {
    console.log("[FrameTracker] initializeContentScriptSupport()");
    // Listen for frame visibility changes from content scripts
    browser.runtime.onMessage.addListener(
      (message: any, sender: browser.Runtime.MessageSender) => {
        if (message.type === "frameVisibilityChange") {
          console.log("[FrameTracker] frameVisibilityChange heard: ", message);
          const tabId = sender.tab?.id;
          if (!tabId || tabId !== this.activeTabId) return true;

          const tabInfo = this.frameMap.get(tabId!);
          if (!tabInfo) return true;

          const frameEntry = Array.from(tabInfo.frames.entries()).find(
            ([_, frameInfo]) => frameInfo.url === message.frameId
          );

          if (frameEntry) {
            const [frameId, frameInfo] = frameEntry;
            frameInfo.visible = message.visible;

            this.handleFrameVisibilityChange({ ...message, frameId });
          }
        }
        return true;
      }
    );

    this.subscribe(async (event) => {
      if (
        (event.type === "modified" || event.type === "tab_activated") &&
        event.tabId === this.activeTabId
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const tab = await browser.tabs.get(event.tabId);
          await this.injectContentScript(tab);
        } catch (err) {
          console.warn(
            `[ARGOS:BG] Failed to inject frame monitor into refreshed tab ${event.tabId}:`,
            err
          );
        }
      }
    });
  }

  private async injectContentScript(tab: browser.Tabs.Tab) {
    if (!this.useInjection || !tab.id || tab.id !== this.activeTabId) return;

    const tabInfo = this.frameMap.get(tab.id!);
    if (!tabInfo) return;

    for (const [frameId, frameInfo] of tabInfo.frames) {
      console.log("injecting content script into frame: ", frameId);
      try {
        const result = await browser.scripting.executeScript({
          target: { tabId: tab.id!, frameIds: [frameId] },
          func: frameMonitorContentScript,
          args: [frameId],
        });

        console.log("raw frameMonitorResult: ", result);

        if (result[0]?.result?.success) {
          frameInfo.visible = result[0]?.result.visible;
          this.handleFrameVisibilityChange({
            frameId,
            tabId: tab.id!,
            visible: result[0]?.result.visible,
          });
        }
      } catch (error) {
        console.warn(
          `[ARGOS:BG] Failed to inject content script into tab ${tab.id}: ${tab.url}:`,
          error
        );
      }
    }
  }

  private handleFrameVisibilityChange(message: any) {
    console.log("[FrameTracker] handleFrameVisibilityChange()");
    const { frameId, tabId, visible } = message;
    const frameInfo = this.getFrameInfo(tabId, frameId);

    if (frameInfo) {
      frameInfo.visible = visible;
      this.notifyListeners({
        type: "visibility_changed",
        tabId,
        frameId,
        previousState: { visible: !visible },
        currentState: { visible },
      });
    }
  }
}

export { VisibleFrameTracker };
