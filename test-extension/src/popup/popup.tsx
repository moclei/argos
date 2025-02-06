import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

type TabInfo = {
  tabId: number;
  tabInfo: {
    url: string;
    active: boolean;
    frames: Array<{
      frameId: number;
      url: string;
      visible: boolean;
    }>;
  };
};

function Popup() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [port, setPort] = useState<browser.Runtime.Port | null>(null);

  useEffect(() => {
    if (!port) {
      console.log("[ARGOS TEST:POPUP] Establishing port and listener");
      const port = browser.runtime.connect({ name: "argos-frame-tracker" });
      port.onMessage.addListener((message) => {
        if (message.type === "FRAME_VISIBILITY_CHANGE") {
          console.log(
            "[ARGOS TEST:POPUP] Frame visibility change: ",
            message.payload
          );
          setTabs(message.payload.tabs);
        }
      });
      setPort(port);
    }
  }, []);

  const loadTabs = async () => {
    const response = await browser.runtime.sendMessage({ type: "GET_TABS" });
    console.log("[ARGOS TEST:POPUP] Tab/frames response: ", response);
    setTabs(Array.from(response.payload.tabs));
  };

  return (
    <div className="popup">
      <h2>Frame Tracker Test</h2>
      {tabs &&
        tabs.map((tab) => (
          <div key={tab.tabId} className="tab">
            <h3>Tab {tab.tabId}</h3>
            <div>URL: {tab.tabInfo.url}</div>
            <h4>Frames:</h4>
            <ul>
              {tab.tabInfo.frames.map((frame) => (
                <li key={frame.frameId}>
                  Frame {frame.frameId}: {frame.url}
                  {frame.visible ? " (visible)" : " (hidden)"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      <button onClick={() => loadTabs()}>Get Tabs</button>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const rootDiv = document.querySelector("#root");
  if (rootDiv) {
    const root = createRoot(rootDiv);
    root.render(<Popup />);
  } else {
    console.error("[ARGOS TEST:POPUP] rootDiv not found");
  }
});
