import browser from "webextension-polyfill";
import { TabFrameTracker } from "./tab-frame-tracker";

type SerializedFrameInfo = {
  visible: boolean;
  url: string;
  parentFrameId?: number;
};

type SerializedTabInfo = {
  url: string;
  frames: Array<[number, SerializedFrameInfo]>;
};

type SerializedState = {
  version: number;
  timestamp: number;
  tabs: Array<[number, SerializedTabInfo]>;
};

// Enhanced TabFrameTracker with persistence
class PersistentTabFrameTracker extends TabFrameTracker {
  private static readonly STORAGE_KEY = "tab_frame_state";
  private static readonly STATE_VERSION = 1;
  private persistenceTimeout: NodeJS.Timeout | undefined;
  constructor(
    options: {
      persistenceInterval?: number; // How often to persist state (ms)
    } = {}
  ) {
    super();

    // Initialize persistence
    this.initializePersistence(options.persistenceInterval || 30000);

    // Listen for extension lifecycle events
    this.setupLifecycleHandlers();
  }

  private async initializePersistence(interval: number) {
    // Try to restore state
    await this.restoreState();

    // Set up periodic persistence
    this.persistenceTimeout = setInterval(() => {
      this.persistState();
    }, interval);
  }

  private setupLifecycleHandlers() {
    // Handle extension install/update
    browser.runtime.onInstalled.addListener(async (details) => {
      if (details.reason === "install") {
        await this.clearPersistedState();
      } else if (details.reason === "update") {
        // Optionally handle version updates differently
        await this.restoreState();
      }
    });

    // Handle extension startup
    browser.runtime.onStartup.addListener(async () => {
      await this.restoreState();
    });
  }

  private async persistState(): Promise<void> {
    const serializedState: SerializedState = {
      version: PersistentTabFrameTracker.STATE_VERSION,
      timestamp: Date.now(),
      tabs: Array.from(this.frameMap.entries()).map(([tabId, tabInfo]) => [
        tabId,
        {
          url: tabInfo.url,
          frames: Array.from(tabInfo.frames.entries()),
        },
      ]),
    };

    try {
      await browser.storage.local.set({
        [PersistentTabFrameTracker.STORAGE_KEY]: serializedState,
      });
    } catch (error) {
      console.error("Failed to persist tab frame state:", error);
    }
  }

  private async restoreState(): Promise<void> {
    try {
      const result = await browser.storage.local.get(
        PersistentTabFrameTracker.STORAGE_KEY
      );

      const savedState = result[PersistentTabFrameTracker.STORAGE_KEY] as
        | SerializedState
        | undefined;

      if (
        !savedState ||
        savedState.version !== PersistentTabFrameTracker.STATE_VERSION
      ) {
        return;
      }

      // Verify tabs still exist before restoration
      const existingTabs = await browser.tabs.query({});
      const existingTabIds = new Set(existingTabs.map((tab) => tab.id));

      // Restore only existing tabs
      savedState.tabs.forEach(([tabId, tabInfo]) => {
        if (existingTabIds.has(tabId)) {
          this.frameMap.set(tabId, {
            url: tabInfo.url,
            frames: new Map(tabInfo.frames),
          });
        }
      });
    } catch (error) {
      console.error("Failed to restore tab frame state:", error);
    }
  }

  private async clearPersistedState(): Promise<void> {
    try {
      await browser.storage.local.remove(PersistentTabFrameTracker.STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear persisted state:", error);
    }
  }

  // Override dispose method to clean up
  public dispose(): void {
    if (this.persistenceTimeout) {
      clearInterval(this.persistenceTimeout);
    }
    // super.dispose?.(); // Call parent dispose if it exists
  }
}

export { PersistentTabFrameTracker };
