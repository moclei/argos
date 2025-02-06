import browser from "webextension-polyfill";

export type CoreFrameInfo = {
  visible: boolean;
  url: string; // Maybe add this if we can get it from events
};

type CoreTabInfo = {
  url: string;
  frames: Map<number, CoreFrameInfo>;
  active: boolean;
};

type FrameMap = Map<number, CoreTabInfo>;

type ChangeType =
  | "added"
  | "removed"
  | "modified"
  | "visibility_changed"
  | "tab_activated";

type ChangeEvent = {
  type: ChangeType;
  tabId: number;
  frameId?: number;
  previousState?: {
    url?: string;
    visible?: boolean;
    active?: boolean;
  };
  currentState?: {
    url?: string;
    visible?: boolean;
    active?: boolean;
  };
};

type ChangeListener = (event: ChangeEvent) => void;

export class TabFrameTracker {
  public frameMap: FrameMap = new Map();
  private listeners: Set<ChangeListener> = new Set();
  protected activeTabId: number | null = null;

  constructor() {
    this.initializeListeners();
  }

  public notifyListeners(event: ChangeEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async initializeListeners() {
    // Listen for tab creation
    browser.tabs.onCreated.addListener((tab: browser.Tabs.Tab) => {
      if (tab.id) {
        this.frameMap.set(tab.id, {
          url: tab.url || "",
          frames: new Map([[0, { visible: true, url: tab.url || "" }]]),
          active: false,
        });

        this.notifyListeners({
          type: "added",
          tabId: tab.id,
          frameId: 0,
          currentState: {
            url: tab.url || "",
            visible: true,
            active: false,
          },
        });
      }
    });

    browser.tabs.onActivated.addListener(async (activeInfo) => {
      const previousTabId = this.activeTabId;
      this.activeTabId = activeInfo.tabId;

      if (previousTabId) {
        const prevTab = this.frameMap.get(previousTabId);
        if (prevTab) {
          prevTab.active = false;
        }
      }

      const newTab = this.frameMap.get(activeInfo.tabId);
      if (newTab) {
        newTab.active = true;
        this.notifyListeners({
          type: "tab_activated",
          tabId: activeInfo.tabId,
          previousState: { active: false },
          currentState: { active: true },
        });
      }
    });

    // Listen for tab updates (URL changes)
    browser.tabs.onUpdated.addListener(
      (
        tabId: number,
        changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
        tab: browser.Tabs.Tab
      ) => {
        const tabInfo = this.frameMap.get(tabId);

        if (!tabInfo) return;

        if (changeInfo.url || changeInfo.status === "loading") {
          const previousUrl = tabInfo.url;
          const newUrl = changeInfo.url || tab.url || previousUrl;
          tabInfo.url = newUrl;

          // Clear all frames except the main frame (0) on navigation
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
            currentState: { url: newUrl, visible: true },
          });
        }
      }
    );

    // Listen for tab removal
    browser.tabs.onRemoved.addListener((tabId: number) => {
      const tabInfo = this.frameMap.get(tabId);
      if (tabInfo) {
        this.frameMap.delete(tabId);

        this.notifyListeners({
          type: "removed",
          tabId,
          previousState: {
            url: tabInfo.url,
          },
        });
      }
    });

    // Listen for frame creation
    browser.webNavigation.onCreatedNavigationTarget.addListener(
      (details: browser.WebNavigation.OnCreatedNavigationTargetDetailsType) => {
        const tabInfo = this.frameMap.get(details.tabId);
        if (tabInfo && details.sourceFrameId) {
          tabInfo.frames.set(details.sourceFrameId, {
            visible: true,
            url: details.url,
          });

          this.notifyListeners({
            type: "added",
            tabId: details.tabId,
            frameId: details.sourceFrameId,
            currentState: {
              visible: true,
            },
          });
        }
      }
    );

    // Listen for frame navigation
    browser.webNavigation.onCommitted.addListener(
      (details: browser.WebNavigation.OnCommittedDetailsType) => {
        const tabInfo = this.frameMap.get(details.tabId);
        if (tabInfo && details.frameId) {
          const frameExists = tabInfo.frames.has(details.frameId);
          tabInfo.frames.set(details.frameId, {
            visible: true,
            url: details.url,
          });

          this.notifyListeners({
            type: frameExists ? "modified" : "added",
            tabId: details.tabId,
            frameId: details.frameId,
            currentState: {
              visible: true,
            },
          });
        }
      }
    );

    // Listen for frame removal
    browser.webNavigation.onBeforeNavigate.addListener(
      (details: browser.WebNavigation.OnBeforeNavigateDetailsType) => {
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
                  visible: frameInfo.visible,
                },
              });
            }
          }
        }
      }
    );

    // Initialize existing tabs
    const existingTabs = await browser.tabs.query({});
    const activeTab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    for (const tab of existingTabs) {
      if (tab.id) {
        const isActive = activeTab[0]?.id === tab.id;
        if (isActive) {
          this.activeTabId = tab.id;
        }
        this.frameMap.set(tab.id, {
          url: tab.url || "",
          frames: new Map([[0, { visible: true, url: tab.url || "" }]]),
          active: isActive,
        });
      }
    }

    // Handle window removal
    browser.windows.onRemoved.addListener(async (windowId: any) => {
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
                url: tabInfo.url,
              },
            });
          }
        }
      }
    });
  }

  public getActiveTab(): {
    tabId: number;
    tabInfo: {
      url: string;
      frames: Record<number, CoreFrameInfo>;
      active: boolean;
    };
  } | null {
    if (!this.activeTabId) return null;
    const tabInfo = this.frameMap.get(this.activeTabId);
    if (!tabInfo) return null;
    return {
      tabId: this.activeTabId,
      tabInfo: {
        url: tabInfo.url,
        frames: Array.from(tabInfo.frames.entries()).map(
          ([frameId, frameInfo]) => ({
            ...frameInfo,
            frameId,
          })
        ),
        active: tabInfo.active,
      },
    };
  }

  public getFrameInfo(
    tabId: number,
    frameId: number
  ): CoreFrameInfo | undefined {
    return this.frameMap.get(tabId)?.frames.get(frameId);
  }

  // Helper methods
  public getTabInfo(tabId: number): CoreTabInfo | undefined {
    return this.frameMap.get(tabId);
  }

  public getAllTabs(): FrameMap {
    return this.frameMap;
  }
}
