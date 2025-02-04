import browser from "webextension-polyfill";
import { StatefulTabFrameTracker } from "argos";

interface TabState {
  activatedDate: number | null;
  isActive: boolean;
}

interface FrameState {
  scanning: boolean;
}

const tracker = new StatefulTabFrameTracker<TabState, FrameState>({
  useInjection: true,
  defaultTabState: {
    activatedDate: 0,
    isActive: false,
  },
  defaultFrameState: {
    scanning: false,
  },
});

browser.runtime.onMessage.addListener((message, sender, sendResponse: any) => {
  if (message.type === "GET_TABS") {
    console.log(`[ARGOS TEST:BG] Message received:`, message);
    console.log(`[ARGOS TEST:BG] tracker.getAllTabs():`, tracker.getAllTabs());
    const tabArray: any[] = [];
    tracker.getAllTabs().forEach((value, key) => {
      const frameArray = Array.from(value.frames.entries()).map(
        ([frameId, frameInfo]) => {
          return {
            frameId,
            frameInfo,
          };
        }
      );
      if (value.url.includes("google.com")) {
        tabArray.push({
          tabId: key,
          tabInfo: value,
          frames: frameArray,
        });
      }
    });

    console.log(`[ARGOS TEST:BG] tracker.getAllTabs():`, tabArray);
    sendResponse({
      type: "TAB_RESPONSE",
      payload: { tabs: tabArray },
    });
  }
});
