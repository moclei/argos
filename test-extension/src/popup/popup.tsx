import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

type TabInfo = {
  tabId: number;
  tabInfo: {
    url: string;
  };
  frames: Array<{
    frameId: number;
    frameInfo: {
      url: string;
      visible: boolean;
    };
  }>;
};

function Popup() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);

  useEffect(() => {
    // const loadTabs = async () => {
    //   const response = await browser.runtime.sendMessage({ type: "GET_TABS" });
    //   console.log("response", response);
    //   setTabs(response.payload.tabs);
    // };
    // loadTabs();
  }, []);

  const loadTabs = async () => {
    const response = await browser.runtime.sendMessage({ type: "GET_TABS" });
    console.log("response: ", response);
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
              {tab.frames.map((frame) => (
                <li key={frame.frameId}>
                  Frame {frame.frameId}: {frame.frameInfo.url}
                  {frame.frameInfo.visible ? " (visible)" : " (hidden)"}
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
    console.error("rootDiv not found");
  }
});
