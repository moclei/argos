import browser from "webextension-polyfill";
import { PersistentTabFrameTracker } from "./persistent-tab-frame-tracker";
import { CoreFrameInfo, TabFrameTracker } from "./tab-frame-tracker";
import {
  diagnosticScript,
  frameMonitorContentScript,
} from "./content-scripts/frame-monitor";

// Generic state management types
type TabState<T> = {
  tabData: T;
  frameStates: Map<number, any>;
};

// Enhanced query types
type TabWithFrameStates<T, F> = {
  tabState: T;
  frames: Map<
    number,
    {
      frameInfo: CoreFrameInfo;
      state?: F;
    }
  >;
};

type FramePollingOptions = {
  enabled: boolean;
  interval?: number; // milliseconds
  includeChildFrames?: boolean;
};

class StatefulTabFrameTracker<
  TabStateType extends object = any,
  FrameStateType extends object = any
> extends TabFrameTracker {
  private tabStates: Map<number, TabState<TabStateType>> = new Map();
  private frameSignatureMap: Map<number, Map<string, number>> = new Map();
  private useInjection: boolean = false;
  private pollingInterval?: number;
  private framePollingOptions: FramePollingOptions;
  private hasScriptingPermission: boolean = false;
  private defaultTabState?: TabStateType;
  private defaultFrameState?: FrameStateType;

  constructor(
    options: {
      persistenceInterval?: number;
      useInjection?: boolean;
      framePolling?: FramePollingOptions;
      defaultTabState?: TabStateType;
      defaultFrameState?: FrameStateType;
    } = {}
  ) {
    super();

    this.useInjection = options.useInjection ?? false;

    this.framePollingOptions = {
      enabled: false,
      interval: 5000,
      includeChildFrames: true,
      ...options.framePolling,
    };

    this.defaultTabState = options.defaultTabState;
    this.defaultFrameState = options.defaultFrameState;

    this.initialize();
  }

  private async initialize() {
    // Check if we have scripting permission
    const permissions = await browser.permissions.getAll();
    this.hasScriptingPermission =
      permissions.permissions?.includes("scripting") || false;

    console.log(
      "Initializing StatefulTabFrameTracker",
      {
        hasScriptingPermission: this.hasScriptingPermission,
        useInjection: this.useInjection,
      },
      this.framePollingOptions
    );
    if (this.hasScriptingPermission && this.useInjection) {
      await this.initializeContentScriptSupport();
    } else if (this.framePollingOptions.enabled) {
      await this.initializeFramePolling();
    }

    if (this.defaultTabState) {
      const existingTabs = await browser.tabs.query({});
      for (const tab of existingTabs) {
        if (tab.id && !this.tabStates.has(tab.id)) {
          this.tabStates.set(tab.id, {
            tabData: { ...this.defaultTabState },
            frameStates: new Map(),
          });
        }
      }
    }
  }

  private async initializeFramePolling() {
    if (!this.framePollingOptions.enabled) return;

    const pollFrames = async () => {
      const tabs = await browser.tabs.query({});

      for (const tab of tabs) {
        if (!tab.id) continue;

        try {
          const frames = await browser.webNavigation.getAllFrames({
            tabId: tab.id,
          });
          if (!frames) continue;

          const tabInfo = this.frameMap.get(tab.id);
          if (!tabInfo) continue;

          const currentFrameIds = new Set<number>();

          for (const frame of frames) {
            currentFrameIds.add(frame.frameId);

            const existingFrame = tabInfo.frames.get(frame.frameId);
            const frameUrl = frame.url;

            if (!existingFrame) {
              tabInfo.frames.set(frame.frameId, {
                visible: true,
                url: frameUrl,
                parentFrameId:
                  frame.parentFrameId >= 0 ? frame.parentFrameId : undefined,
              });

              if (this.defaultFrameState) {
                const tabState = this.tabStates.get(tab.id);
                if (tabState && !tabState.frameStates.has(frame.frameId)) {
                  tabState.frameStates.set(frame.frameId, {
                    ...this.defaultFrameState,
                  });
                }
              }

              this.notifyListeners({
                type: "added",
                tabId: tab.id,
                frameId: frame.frameId,
                currentState: {
                  visible: true,
                  url: frameUrl,
                },
              });
            } else if (existingFrame.url !== frameUrl) {
              // Frame URL changed

              const previousUrl = existingFrame.url;
              existingFrame.url = frameUrl;

              this.notifyListeners({
                type: "modified",
                tabId: tab.id,
                frameId: frame.frameId,
                previousState: { url: previousUrl },
                currentState: { url: frameUrl },
              });
            }
          }

          for (const [frameId, frameInfo] of tabInfo.frames) {
            if (!currentFrameIds.has(frameId) && frameId !== 0) {
              // Dont remove main frame
              tabInfo.frames.delete(frameId);

              const tabState = this.tabStates.get(tab.id);
              if (tabState) {
                tabState.frameStates.delete(frameId);
              }

              this.notifyListeners({
                type: "removed",
                tabId: tab.id,
                frameId,
                previousState: {
                  url: frameInfo.url,
                  visible: frameInfo.visible,
                },
              });
            }
          }
        } catch (error) {
          console.error(`Error polling frames for tab ${tab.id}:`, error);
        }
      }
    };

    await pollFrames();

    this.pollingInterval = window.setInterval(
      pollFrames,
      this.framePollingOptions.interval
    );
  }

  private async initializeContentScriptSupport() {
    console.log("[ARGOS:BG] initializeContentScriptSupport()");
    // Listen for frame visibility changes from content scripts
    browser.runtime.onMessage.addListener(
      (message: any, sender: browser.Runtime.MessageSender) => {
        if (message.type === "frameVisibilityChange") {
          console.log(
            "[SHR:BG] StatefulTabFrameTracker, frameVisibilityChange: ",
            message
          );
          const tabId = sender.tab?.id;
          if (!tabId) return;

          const frameSignature = message.frameId;

          const tabInfo = this.frameMap.get(tabId!);
          if (!tabInfo) return;

          const frameEntry = Array.from(tabInfo.frames.entries()).find(
            ([_, frameInfo]) => frameInfo.url === frameSignature
          );

          if (frameEntry) {
            const [frameId, frameInfo] = frameEntry;

            frameInfo.visible = message.visible;

            // this.setFrameVisibility(tabId!, frameId, message.visible);
            this.handleFrameVisibilityChange({ ...message, frameId });
          }
        }
        return true;
      }
    );

    this.subscribe(async (event) => {
      if (event.type === "modified" && event.frameId === 0) {
        // this.handleFrameVisibilityChange(event);
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

    // Inject content script into existing tabs
    const existingTabs = await browser.tabs.query({});
    for (const tab of existingTabs) {
      if (tab.id) {
        await this.injectContentScript(tab);
      }
    }
  }

  private async injectContentScript(tab: browser.Tabs.Tab) {
    if (!this.useInjection || !tab.id) return;

    try {
      const frameMonitorResult = await browser.scripting.executeScript({
        target: { tabId: tab.id! },
        func: frameMonitorContentScript,
      });

      const frameResult = frameMonitorResult[0]?.result;

      if (frameResult?.success && frameResult.frames) {
        console.log(
          `[ARGOS:BG] Got initial frame visibility for tab ${tab.id}`,
          frameResult.frames
        );
        const tabInfo = this.frameMap.get(tab.id!);
        console.log(`[ARGOS:BG] Got tabInfo for comparison `, tabInfo);
        if (!tabInfo) return;

        frameResult.frames.forEach((frame: any) => {
          const frameEntry = Array.from(tabInfo.frames.entries()).find(
            ([_, frameInfo]) => frameInfo.url === frame.frameId
          );

          console.log(`[ARGOS:BG] Found frameEntry for comparison`, frameEntry);

          if (frameEntry) {
            console.log(`[ARGOS:BG] Found matching frame entry`, frameEntry);
            const [frameId, frameInfo] = frameEntry;
            frameInfo.visible = frame.visible;

            this.handleFrameVisibilityChange({
              frameId,
              tabId: tab.id!,
              visible: frame.visible,
            });
          }
        });
      }
    } catch (error) {
      console.warn(
        `[ARGOS:BG] Failed to inject content script into tab ${tab.id}: ${tab.url}:`,
        error
      );
      // If content script injection fails, fall back to polling for this tab
      if (this.framePollingOptions.enabled) {
        console.log(
          `[ARGOS:BG] Script execution not enabled, falling back to polling for tab ${tab.id}`
        );
        this.pollFramesForTab(tab.id!);
      }
    }
  }

  private async pollFramesForTab(tabId: number) {
    try {
      const frames = await browser.webNavigation.getAllFrames({ tabId });
      if (!frames) return;

      const tabInfo = this.frameMap.get(tabId);
      if (!tabInfo) return;

      // Update frame information...
      // (Similar logic to initializeFramePolling but for a single tab)
    } catch (error) {
      console.warn(`Failed to poll frames for tab ${tabId}:`, error);
    }
  }

  private handleFrameVisibilityChange(message: any) {
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

  public setFrameVisibility(tabId: number, frameId: number, visible: boolean) {
    const frameInfo = this.getFrameInfo(tabId, frameId);

    if (frameInfo) {
      frameInfo.visible = visible;
      this.notifyListeners({
        type: "modified",
        tabId,
        frameId,
        previousState: { visible: !visible },
        currentState: { visible },
      });
    }
  }

  // State management methods
  public setTabState(
    tabId: number,
    state: TabStateType | Partial<TabStateType>
  ): void {
    const existing = this.tabStates.get(tabId);

    if (!existing) {
      if (this.isFullState<TabStateType>(state)) {
        this.tabStates.set(tabId, {
          tabData: state,
          frameStates: new Map(),
        });
      } else if (this.defaultTabState) {
        this.tabStates.set(tabId, {
          tabData: { ...this.defaultTabState, ...state },
          frameStates: new Map(),
        });
      } else {
        throw new Error("Initial state must be a full state");
      }
    } else {
      this.tabStates.set(tabId, {
        tabData: { ...existing.tabData, ...state },
        frameStates: existing.frameStates,
      });
    }
  }

  public setFrameState(
    tabId: number,
    frameId: number,
    state: FrameStateType | Partial<FrameStateType>
  ): void {
    let tabState = this.tabStates.get(tabId);

    if (!tabState && this.defaultFrameState) {
      tabState = {
        tabData: { ...this.defaultTabState } as TabStateType,
        frameStates: new Map(),
      };
      this.tabStates.set(tabId, tabState);
    }

    if (!tabState) return;

    const existingFrameState = tabState.frameStates.get(frameId);

    if (!existingFrameState) {
      if (this.isFullState<FrameStateType>(state)) {
        tabState.frameStates.set(frameId, state);
      } else if (this.defaultFrameState) {
        tabState.frameStates.set(frameId, {
          ...this.defaultFrameState,
          ...state,
        });
      } else {
        throw new Error("Initial frame state must be a full state");
      }
    } else {
      tabState.frameStates.set(frameId, {
        ...existingFrameState,
        ...state,
      });
    }
  }

  private isFullState<T extends object>(state: T | Partial<T>): state is T {
    const requiredKeys = Object.keys(this.getTypeTemplate<T>());
    const stateKeys = Object.keys(state);

    return requiredKeys.every((key) => stateKeys.includes(key));
  }

  private getTypeTemplate<T>(): Required<T> {
    return {} as Required<T>;
  }

  public getTabState(tabId: number): TabStateType | undefined {
    return this.tabStates.get(tabId)?.tabData ?? this.defaultTabState;
  }

  public getFrameState(
    tabId: number,
    frameId: number
  ): FrameStateType | undefined {
    const tabState = this.tabStates.get(tabId);
    return tabState?.frameStates.get(frameId) ?? this.defaultFrameState;
  }

  // Query methods for tab states
  public getAllTabsWithState(): Map<
    number,
    TabWithFrameStates<TabStateType, FrameStateType>
  > {
    const result = new Map<
      number,
      TabWithFrameStates<TabStateType, FrameStateType>
    >();

    for (const [tabId, tabState] of this.tabStates) {
      const tabInfo = this.frameMap.get(tabId);
      if (!tabInfo) continue;

      result.set(tabId, {
        tabState: tabState.tabData,
        frames: new Map(
          Array.from(tabInfo.frames.entries()).map(([frameId, frameInfo]) => [
            frameId,
            {
              frameInfo,
              state: tabState.frameStates.get(frameId),
            },
          ])
        ),
      });
    }

    return result;
  }

  public queryTabs(
    predicate: (state: TabStateType) => boolean
  ): Map<number, TabWithFrameStates<TabStateType, FrameStateType>> {
    const result = new Map<
      number,
      TabWithFrameStates<TabStateType, FrameStateType>
    >();

    for (const [tabId, tabState] of this.tabStates) {
      if (predicate(tabState.tabData)) {
        const tabInfo = this.frameMap.get(tabId);
        if (!tabInfo) continue;

        result.set(tabId, {
          tabState: tabState.tabData,
          frames: new Map(
            Array.from(tabInfo.frames.entries()).map(([frameId, frameInfo]) => [
              frameId,
              { frameInfo, state: tabState.frameStates.get(frameId) },
            ])
          ),
        });
      }
    }

    return result;
  }

  // Override cleanup to handle state
  public dispose(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    this.tabStates.clear();
  }
}

export { StatefulTabFrameTracker };
