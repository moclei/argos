// src/stateful-tab-frame-tracker.ts
import browser2 from "webextension-polyfill";

// src/tab-frame-tracker.ts
import browser from "webextension-polyfill";
var TabFrameTracker = class {
  constructor() {
    this.frameMap = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.initializeListeners();
  }
  notifyListeners(event) {
    this.listeners.forEach((listener) => listener(event));
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  async initializeListeners() {
    browser.tabs.onCreated.addListener((tab) => {
      if (tab.id) {
        this.frameMap.set(tab.id, {
          url: tab.url || "",
          frames: /* @__PURE__ */ new Map([[0, { visible: true, url: tab.url || "" }]])
        });
        this.notifyListeners({
          type: "added",
          tabId: tab.id,
          frameId: 0,
          currentState: {
            url: tab.url || "",
            visible: true
          }
        });
      }
    });
    browser.tabs.onUpdated.addListener(
      (tabId, changeInfo, tab) => {
        const tabInfo = this.frameMap.get(tabId);
        if (!tabInfo)
          return;
        if (changeInfo.url || changeInfo.status === "loading") {
          const previousUrl = tabInfo.url;
          const newUrl = changeInfo.url || tab.url || previousUrl;
          tabInfo.url = newUrl;
          const mainFrame = tabInfo.frames.get(0);
          tabInfo.frames.clear();
          if (mainFrame) {
            tabInfo.frames.set(0, { ...mainFrame, url: newUrl });
          }
          this.notifyListeners({
            type: "modified",
            tabId,
            frameId: 0,
            previousState: { url: previousUrl },
            currentState: { url: newUrl, visible: true }
          });
        }
      }
    );
    browser.tabs.onRemoved.addListener((tabId) => {
      const tabInfo = this.frameMap.get(tabId);
      if (tabInfo) {
        this.frameMap.delete(tabId);
        this.notifyListeners({
          type: "removed",
          tabId,
          previousState: {
            url: tabInfo.url
          }
        });
      }
    });
    browser.webNavigation.onCreatedNavigationTarget.addListener(
      (details) => {
        const tabInfo = this.frameMap.get(details.tabId);
        if (tabInfo && details.sourceFrameId) {
          tabInfo.frames.set(details.sourceFrameId, {
            visible: true,
            url: details.url
          });
          this.notifyListeners({
            type: "added",
            tabId: details.tabId,
            frameId: details.sourceFrameId,
            currentState: {
              visible: true
            }
          });
        }
      }
    );
    browser.webNavigation.onCommitted.addListener(
      (details) => {
        const tabInfo = this.frameMap.get(details.tabId);
        if (tabInfo && details.frameId) {
          const frameExists = tabInfo.frames.has(details.frameId);
          tabInfo.frames.set(details.frameId, {
            visible: true,
            url: details.url
          });
          this.notifyListeners({
            type: frameExists ? "modified" : "added",
            tabId: details.tabId,
            frameId: details.frameId,
            currentState: {
              visible: true
            }
          });
        }
      }
    );
    browser.webNavigation.onBeforeNavigate.addListener(
      (details) => {
        const tabInfo = this.frameMap.get(details.tabId);
        if (tabInfo && details.frameId) {
          if (details.frameId !== 0) {
            const frameInfo = tabInfo.frames.get(details.frameId);
            tabInfo.frames.delete(details.frameId);
            if (frameInfo) {
              this.notifyListeners({
                type: "removed",
                tabId: details.tabId,
                frameId: details.frameId,
                previousState: {
                  visible: frameInfo.visible
                }
              });
            }
          }
        }
      }
    );
    const existingTabs = await browser.tabs.query({});
    for (const tab of existingTabs) {
      if (tab.id) {
        this.frameMap.set(tab.id, {
          url: tab.url || "",
          frames: /* @__PURE__ */ new Map([[0, { visible: true, url: tab.url || "" }]])
        });
        this.notifyListeners({
          type: "added",
          tabId: tab.id,
          frameId: 0,
          currentState: {
            url: tab.url || "",
            visible: true
          }
        });
      }
    }
    browser.windows.onRemoved.addListener(async (windowId) => {
      const tabs = await browser.tabs.query({ windowId });
      for (const tab of tabs) {
        if (tab.id) {
          const tabInfo = this.frameMap.get(tab.id);
          this.frameMap.delete(tab.id);
          if (tabInfo) {
            this.notifyListeners({
              type: "removed",
              tabId: tab.id,
              previousState: {
                url: tabInfo.url
              }
            });
          }
        }
      }
    });
  }
  // Helper methods
  getTabInfo(tabId) {
    return this.frameMap.get(tabId);
  }
  getFrameInfo(tabId, frameId) {
    return this.frameMap.get(tabId)?.frames.get(frameId);
  }
  getAllTabs() {
    return this.frameMap;
  }
};

// src/content-scripts/frame-monitor.ts
console.log("[ARGOS:CS] frame monitor mounted");
var frameMonitorContentScript = function() {
  console.log("[ARGOS:CS] frame monitor running");
  const VISIBILITY_CHECK_INTERVAL = 1e4;
  function isStyleHidden(element) {
    const style = window.getComputedStyle(element);
    return style.display === "none" || style.visibility === "hidden" || style.opacity === "0" || style.width === "0px" || style.height === "0px";
  }
  function isOffscreen(rect) {
    return rect.right <= 0 || rect.bottom <= 0 || rect.left >= window.innerWidth || rect.top >= window.innerHeight;
  }
  function hasZeroDimension(element) {
    return element.offsetWidth <= 0 || element.offsetHeight <= 0;
  }
  function isParentHidden(element) {
    let parent = element.parentElement;
    while (parent) {
      if (isStyleHidden(parent)) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }
  function hasVisibleArea(element) {
    const rects = element.getClientRects();
    if (!rects || rects.length === 0) {
      return false;
    }
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      if (rect.width > 0 && rect.height > 0 && !isOffscreen(rect)) {
        return true;
      }
    }
    return false;
  }
  function checkFrameVisibility(frame) {
    try {
      if (isStyleHidden(frame)) {
        return false;
      }
      if (isParentHidden(frame)) {
        return false;
      }
      if (hasZeroDimension(frame)) {
        return false;
      }
      if (!hasVisibleArea(frame)) {
        return false;
      }
      try {
        const frameDoc = frame.contentDocument;
        if (frameDoc && frameDoc.body) {
          if (hasZeroDimension(frameDoc.body)) {
            return false;
          }
        }
      } catch (e) {
      }
      const rect = frame.getBoundingClientRect();
      if (rect.width < 2 && rect.height < 2) {
        return false;
      }
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const elementAtPoint = document.elementFromPoint(centerX, centerY);
      if (elementAtPoint && !frame.contains(elementAtPoint) && !elementAtPoint.contains(frame)) {
        const coverageThreshold = 0.9;
        const elementsAtCorners = [
          document.elementFromPoint(rect.left + 2, rect.top + 2),
          document.elementFromPoint(rect.right - 2, rect.top + 2),
          document.elementFromPoint(rect.left + 2, rect.bottom - 2),
          document.elementFromPoint(rect.right - 2, rect.bottom - 2)
        ];
        const coveredCorners = elementsAtCorners.filter(
          (el) => el && !frame.contains(el) && !el.contains(frame)
        ).length;
        if (coveredCorners >= 3) {
          return false;
        }
      }
      console.log("[ARGOS:CS] checkFrameVisibility: true");
      return true;
    } catch (error) {
      console.warn("Error checking frame visibility:", error);
      return true;
    }
  }
  function setupFrameMonitoring() {
    const frames = /* @__PURE__ */ new Map();
    console.log("[ARGOS:CS] setupFrameMonitoring");
    document.querySelectorAll("iframe").forEach((frame) => {
      console.log("[ARGOS:CS] setupFrameMonitoring: initial frame discovery");
      frames.set(
        frame,
        checkFrameVisibility(frame)
      );
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLIFrameElement) {
            console.log(
              "[ARGOS:CS] mutation : added node, checking frame visibility"
            );
            frames.set(node, checkFrameVisibility(node));
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLIFrameElement) {
            console.log("[ARGOS:CS] mutation : removed node");
            frames.delete(node);
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLIFrameElement) {
            const frame = entry.target;
            console.log(
              "[ARGOS:CS] intersection observer : checking frame visibility"
            );
            const isVisible = checkFrameVisibility(frame);
            if (frames.get(frame) !== isVisible) {
              frames.set(frame, isVisible);
              chrome.runtime.sendMessage({
                type: "frameVisibilityChange",
                frameId: frame.src,
                visible: isVisible
              });
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1]
        // Check at different visibility thresholds
      }
    );
    setInterval(() => {
      frames.forEach((oldVisible, frame) => {
        const newVisible = checkFrameVisibility(frame);
        console.log(`[ARGOS:CS:${frame.id}] periodic visibility checking`, {
          src: frame.src,
          visible: newVisible
        });
        if (oldVisible !== newVisible) {
          console.log(`[ARGOS:CS:${frame.id}] found visibility change!`);
          frames.set(frame, newVisible);
          chrome.runtime.sendMessage({
            type: "frameVisibilityChange",
            frameId: frame.src,
            visible: newVisible
          });
        }
      });
    }, VISIBILITY_CHECK_INTERVAL);
    return {
      success: true,
      frames: Array.from(frames, ([key, value]) => ({
        frameId: key.src,
        visible: value
      }))
    };
  }
  return setupFrameMonitoring();
};

// src/stateful-tab-frame-tracker.ts
var StatefulTabFrameTracker = class extends TabFrameTracker {
  constructor(options = {}) {
    super();
    this.tabStates = /* @__PURE__ */ new Map();
    this.frameSignatureMap = /* @__PURE__ */ new Map();
    this.useInjection = false;
    this.hasScriptingPermission = false;
    this.useInjection = options.useInjection ?? false;
    this.framePollingOptions = {
      enabled: false,
      interval: 5e3,
      includeChildFrames: true,
      ...options.framePolling
    };
    this.defaultTabState = options.defaultTabState;
    this.defaultFrameState = options.defaultFrameState;
    this.initialize();
  }
  async initialize() {
    const permissions = await browser2.permissions.getAll();
    this.hasScriptingPermission = permissions.permissions?.includes("scripting") || false;
    console.log(
      "Initializing StatefulTabFrameTracker",
      {
        hasScriptingPermission: this.hasScriptingPermission,
        useInjection: this.useInjection
      },
      this.framePollingOptions
    );
    if (this.hasScriptingPermission && this.useInjection) {
      await this.initializeContentScriptSupport();
    } else if (this.framePollingOptions.enabled) {
      await this.initializeFramePolling();
    }
    if (this.defaultTabState) {
      const existingTabs = await browser2.tabs.query({});
      for (const tab of existingTabs) {
        if (tab.id && !this.tabStates.has(tab.id)) {
          this.tabStates.set(tab.id, {
            tabData: { ...this.defaultTabState },
            frameStates: /* @__PURE__ */ new Map()
          });
        }
      }
    }
  }
  async initializeFramePolling() {
    if (!this.framePollingOptions.enabled)
      return;
    const pollFrames = async () => {
      const tabs = await browser2.tabs.query({});
      for (const tab of tabs) {
        if (!tab.id)
          continue;
        try {
          const frames = await browser2.webNavigation.getAllFrames({
            tabId: tab.id
          });
          if (!frames)
            continue;
          const tabInfo = this.frameMap.get(tab.id);
          if (!tabInfo)
            continue;
          const currentFrameIds = /* @__PURE__ */ new Set();
          for (const frame of frames) {
            currentFrameIds.add(frame.frameId);
            const existingFrame = tabInfo.frames.get(frame.frameId);
            const frameUrl = frame.url;
            if (!existingFrame) {
              tabInfo.frames.set(frame.frameId, {
                visible: true,
                url: frameUrl,
                parentFrameId: frame.parentFrameId >= 0 ? frame.parentFrameId : void 0
              });
              if (this.defaultFrameState) {
                const tabState = this.tabStates.get(tab.id);
                if (tabState && !tabState.frameStates.has(frame.frameId)) {
                  tabState.frameStates.set(frame.frameId, {
                    ...this.defaultFrameState
                  });
                }
              }
              this.notifyListeners({
                type: "added",
                tabId: tab.id,
                frameId: frame.frameId,
                currentState: {
                  visible: true,
                  url: frameUrl
                }
              });
            } else if (existingFrame.url !== frameUrl) {
              const previousUrl = existingFrame.url;
              existingFrame.url = frameUrl;
              this.notifyListeners({
                type: "modified",
                tabId: tab.id,
                frameId: frame.frameId,
                previousState: { url: previousUrl },
                currentState: { url: frameUrl }
              });
            }
          }
          for (const [frameId, frameInfo] of tabInfo.frames) {
            if (!currentFrameIds.has(frameId) && frameId !== 0) {
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
                  visible: frameInfo.visible
                }
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
  async initializeContentScriptSupport() {
    console.log("[ARGOS:BG] initializeContentScriptSupport()");
    browser2.runtime.onMessage.addListener(
      (message, sender) => {
        if (message.type === "frameVisibilityChange") {
          console.log(
            "[SHR:BG] StatefulTabFrameTracker, frameVisibilityChange: ",
            message
          );
          const tabId = sender.tab?.id;
          if (!tabId)
            return;
          const frameSignature = message.frameId;
          const tabInfo = this.frameMap.get(tabId);
          if (!tabInfo)
            return;
          const frameEntry = Array.from(tabInfo.frames.entries()).find(
            ([_, frameInfo]) => frameInfo.url === frameSignature
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
      if (event.type === "modified" && event.frameId === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        try {
          const tab = await browser2.tabs.get(event.tabId);
          await this.injectContentScript(tab);
        } catch (err) {
          console.warn(
            `[ARGOS:BG] Failed to inject frame monitor into refreshed tab ${event.tabId}:`,
            err
          );
        }
      }
    });
    const existingTabs = await browser2.tabs.query({});
    for (const tab of existingTabs) {
      if (tab.id) {
        await this.injectContentScript(tab);
      }
    }
  }
  async injectContentScript(tab) {
    if (!this.useInjection || !tab.id)
      return;
    try {
      const frameMonitorResult = await browser2.scripting.executeScript({
        target: { tabId: tab.id },
        func: frameMonitorContentScript
      });
      const frameResult = frameMonitorResult[0]?.result;
      if (frameResult?.success && frameResult.frames) {
        console.log(
          `[ARGOS:BG] Got initial frame visibility for tab ${tab.id}`,
          frameResult.frames
        );
        const tabInfo = this.frameMap.get(tab.id);
        console.log(`[ARGOS:BG] Got tabInfo for comparison `, tabInfo);
        if (!tabInfo)
          return;
        frameResult.frames.forEach((frame) => {
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
              tabId: tab.id,
              visible: frame.visible
            });
          }
        });
      }
    } catch (error) {
      console.warn(
        `[ARGOS:BG] Failed to inject content script into tab ${tab.id}: ${tab.url}:`,
        error
      );
      if (this.framePollingOptions.enabled) {
        console.log(
          `[ARGOS:BG] Script execution not enabled, falling back to polling for tab ${tab.id}`
        );
        this.pollFramesForTab(tab.id);
      }
    }
  }
  async pollFramesForTab(tabId) {
    try {
      const frames = await browser2.webNavigation.getAllFrames({ tabId });
      if (!frames)
        return;
      const tabInfo = this.frameMap.get(tabId);
      if (!tabInfo)
        return;
    } catch (error) {
      console.warn(`Failed to poll frames for tab ${tabId}:`, error);
    }
  }
  handleFrameVisibilityChange(message) {
    const { frameId, tabId, visible } = message;
    const frameInfo = this.getFrameInfo(tabId, frameId);
    if (frameInfo) {
      frameInfo.visible = visible;
      this.notifyListeners({
        type: "visibility_changed",
        tabId,
        frameId,
        previousState: { visible: !visible },
        currentState: { visible }
      });
    }
  }
  setFrameVisibility(tabId, frameId, visible) {
    const frameInfo = this.getFrameInfo(tabId, frameId);
    if (frameInfo) {
      frameInfo.visible = visible;
      this.notifyListeners({
        type: "modified",
        tabId,
        frameId,
        previousState: { visible: !visible },
        currentState: { visible }
      });
    }
  }
  // State management methods
  setTabState(tabId, state) {
    const existing = this.tabStates.get(tabId);
    if (!existing) {
      if (this.isFullState(state)) {
        this.tabStates.set(tabId, {
          tabData: state,
          frameStates: /* @__PURE__ */ new Map()
        });
      } else if (this.defaultTabState) {
        this.tabStates.set(tabId, {
          tabData: { ...this.defaultTabState, ...state },
          frameStates: /* @__PURE__ */ new Map()
        });
      } else {
        throw new Error("Initial state must be a full state");
      }
    } else {
      this.tabStates.set(tabId, {
        tabData: { ...existing.tabData, ...state },
        frameStates: existing.frameStates
      });
    }
  }
  setFrameState(tabId, frameId, state) {
    let tabState = this.tabStates.get(tabId);
    if (!tabState && this.defaultFrameState) {
      tabState = {
        tabData: { ...this.defaultTabState },
        frameStates: /* @__PURE__ */ new Map()
      };
      this.tabStates.set(tabId, tabState);
    }
    if (!tabState)
      return;
    const existingFrameState = tabState.frameStates.get(frameId);
    if (!existingFrameState) {
      if (this.isFullState(state)) {
        tabState.frameStates.set(frameId, state);
      } else if (this.defaultFrameState) {
        tabState.frameStates.set(frameId, {
          ...this.defaultFrameState,
          ...state
        });
      } else {
        throw new Error("Initial frame state must be a full state");
      }
    } else {
      tabState.frameStates.set(frameId, {
        ...existingFrameState,
        ...state
      });
    }
  }
  isFullState(state) {
    const requiredKeys = Object.keys(this.getTypeTemplate());
    const stateKeys = Object.keys(state);
    return requiredKeys.every((key) => stateKeys.includes(key));
  }
  getTypeTemplate() {
    return {};
  }
  getTabState(tabId) {
    return this.tabStates.get(tabId)?.tabData ?? this.defaultTabState;
  }
  getFrameState(tabId, frameId) {
    const tabState = this.tabStates.get(tabId);
    return tabState?.frameStates.get(frameId) ?? this.defaultFrameState;
  }
  // Query methods for tab states
  getAllTabsWithState() {
    const result = /* @__PURE__ */ new Map();
    for (const [tabId, tabState] of this.tabStates) {
      const tabInfo = this.frameMap.get(tabId);
      if (!tabInfo)
        continue;
      result.set(tabId, {
        tabState: tabState.tabData,
        frames: new Map(
          Array.from(tabInfo.frames.entries()).map(([frameId, frameInfo]) => [
            frameId,
            {
              frameInfo,
              state: tabState.frameStates.get(frameId)
            }
          ])
        )
      });
    }
    return result;
  }
  queryTabs(predicate) {
    const result = /* @__PURE__ */ new Map();
    for (const [tabId, tabState] of this.tabStates) {
      if (predicate(tabState.tabData)) {
        const tabInfo = this.frameMap.get(tabId);
        if (!tabInfo)
          continue;
        result.set(tabId, {
          tabState: tabState.tabData,
          frames: new Map(
            Array.from(tabInfo.frames.entries()).map(([frameId, frameInfo]) => [
              frameId,
              { frameInfo, state: tabState.frameStates.get(frameId) }
            ])
          )
        });
      }
    }
    return result;
  }
  // Override cleanup to handle state
  dispose() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    this.tabStates.clear();
  }
};
export {
  StatefulTabFrameTracker
};
//# sourceMappingURL=index.esm.js.map
