import browser from "webextension-polyfill";
import { VisibleFrameTracker } from "argos";

const tracker = new VisibleFrameTracker({
  useInjection: true,
});

browser.runtime.onMessage.addListener((message, sender, sendResponse: any) => {
  if (message.type === "GET_TABS") {
    console.log(`[ARGOS TEST:BG] Message received:`, message);

    const activeTab = tracker.getActiveTab();
    console.log(`[ARGOS TEST:BG] tracker.getActiveTab():`, activeTab);

    sendResponse({
      type: "TAB_RESPONSE",
      payload: { tabs: [activeTab] },
    });
  }
});

tracker.subscribe((event) => {
  console.log(`[ARGOS TEST:BG] Event received:`, event);
  if (event.type === "visibility_changed") {
    popupPort?.postMessage({
      type: "FRAME_VISIBILITY_CHANGE",
      payload: {
        tabs: [tracker.getActiveTab()],
      },
    });
  }
});

let popupPort: browser.Runtime.Port | null = null;
browser.runtime.onConnect.addListener((port) => {
  if (port.name === "argos-frame-tracker") {
    console.log(`[ARGOS TEST:BG] Popup port connected`);
    port.postMessage({
      type: "FRAME_VISIBILITY_CHANGE",
      payload: {
        tabs: [tracker.getActiveTab()],
      },
    });
    console.log(`[ARGOS TEST:BG] Initial message sent`);
    popupPort = port;
  }
});

if (popupPort) {
  (popupPort as browser.Runtime.Port).onDisconnect.addListener(() => {
    console.log(`[ARGOS TEST:BG] Popup port disconnected`);
    popupPort = null;
  });
}
