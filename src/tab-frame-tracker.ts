import browser from "webextension-polyfill";

export type CoreFrameInfo = {
  visible: boolean;
  url: string; // Maybe add this if we can get it from events
  parentFrameId?: number; // Maybe add this for hierarchy tracking
};

type CoreTabInfo = {
  url: string;
  frames: Map<number, CoreFrameInfo>;
};

type FrameMap = Map<number, CoreTabInfo>;

type ChangeType = "added" | "removed" | "modified" | "visibility_changed";

type ChangeEvent = {
  type: ChangeType;
  tabId: number;
  frameId?: number;
  previousState?: {
    url?: string;
    visible?: boolean;
  };
  currentState?: {
    url?: string;
    visible?: boolean;
  };
};

type ChangeListener = (event: ChangeEvent) => void;

export class TabFrameTracker {
  public frameMap: FrameMap = new Map();
  private listeners: Set<ChangeListener> = new Set();

  constructor() {
    this.initializeListeners();
  }

  public notifyListeners(event: ChangeEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // Returns unsubscribe function
  }

  private async initializeListeners() {
    // Listen for tab creation
    browser.tabs.onCreated.addListener((tab: browser.Tabs.Tab) => {
      if (tab.id) {
        this.frameMap.set(tab.id, {
          url: tab.url || "",
          frames: new Map([[0, { visible: true, url: tab.url || "" }]]),
        });

        this.notifyListeners({
          type: "added",
          tabId: tab.id,
          frameId: 0,
          currentState: {
            url: tab.url || "",
            visible: true,
          },
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
    for (const tab of existingTabs) {
      if (tab.id) {
        this.frameMap.set(tab.id, {
          url: tab.url || "",
          frames: new Map([[0, { visible: true, url: tab.url || "" }]]),
        });

        this.notifyListeners({
          type: "added",
          tabId: tab.id,
          frameId: 0,
          currentState: {
            url: tab.url || "",
            visible: true,
          },
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

  // Helper methods
  public getTabInfo(tabId: number): CoreTabInfo | undefined {
    return this.frameMap.get(tabId);
  }

  public getFrameInfo(
    tabId: number,
    frameId: number
  ): CoreFrameInfo | undefined {
    return this.frameMap.get(tabId)?.frames.get(frameId);
  }

  public getAllTabs(): FrameMap {
    return this.frameMap;
  }
}
