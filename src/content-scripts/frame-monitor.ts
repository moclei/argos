export const frameMonitorContentScript = function (frameId: number) {
  console.log("[ARGOS:CS] frame monitor running");
  const VISIBILITY_CHECK_INTERVAL = 10000; // 1 second

  function isStyleHidden(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      style.width === "0px" ||
      style.height === "0px"
    );
  }

  function isOffscreen(rect: DOMRect): boolean {
    // Check if element is completely off-screen
    return (
      rect.right <= 0 ||
      rect.bottom <= 0 ||
      rect.left >= window.innerWidth ||
      rect.top >= window.innerHeight
    );
  }

  function hasZeroDimension(element: HTMLElement): boolean {
    return element.offsetWidth <= 0 || element.offsetHeight <= 0;
  }

  function isParentHidden(element: HTMLElement): boolean {
    let parent = element.parentElement;
    while (parent) {
      if (isStyleHidden(parent)) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  function hasVisibleArea(element: HTMLElement): boolean {
    const rects = element.getClientRects();
    if (!rects || rects.length === 0) {
      return false;
    }

    // Check if any rect has a meaningful area
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      if (rect.width > 0 && rect.height > 0 && !isOffscreen(rect)) {
        return true;
      }
    }

    return false;
  }

  function checkVisibility(): boolean {
    try {
      if (frameId === 0) {
        return !isStyleHidden(document.body);
      }
      if (isStyleHidden(document.body)) {
        return false;
      }

      if (isParentHidden(document.body)) {
        return false;
      }

      if (hasZeroDimension(document.body)) {
        return false;
      }

      if (!hasVisibleArea(document.body)) {
        return false;
      }

      // Additional checks for specific scenarios
      const rect = document.body.getBoundingClientRect();

      // Check if frame is too small to be meaningful
      if (rect.width < 2 && rect.height < 2) {
        return false;
      }

      return true;
    } catch (error) {
      console.warn("Error checking frame visibility:", error);
      // In case of error, default to considering it visible
      return false;
    }
  }

  const isVisible = checkVisibility();

  // Set up mutation observer for frame changes
  const observer = new MutationObserver(() => {
    const newVisible = checkVisibility();
    chrome.runtime.sendMessage({
      type: "frameVisibilityChange",
      frameId,
      visible: newVisible,
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["style", "class"],
    childList: false,
    subtree: false,
  });

  // Tidy up (not implemented yet)
  function cleanup() {
    observer.disconnect();
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "cleanup" && message.frameId === frameId) {
      cleanup();
    }
  });

  return {
    success: true,
    frameId,
    visible: isVisible,
  };
};
