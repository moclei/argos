//import browser from "webextension-polyfill";

// import browser from "webextension-polyfill";
// declare const browser: typeof import("webextension-polyfill");
// frame-monitor.ts - Content script for frame monitoring

console.log("[ARGOS:CS] frame monitor mounted");
export const frameMonitorContentScript = function () {
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

  function checkFrameVisibility(frame: HTMLIFrameElement): boolean {
    try {
      // 1. Basic style checks
      if (isStyleHidden(frame)) {
        return false;
      }

      // 2. Check parent elements
      if (isParentHidden(frame)) {
        return false;
      }

      // 3. Check dimensions
      if (hasZeroDimension(frame)) {
        return false;
      }

      // 4. Check if frame has any visible rectangles
      if (!hasVisibleArea(frame)) {
        return false;
      }

      // 5. Try to check frame content if same-origin
      try {
        const frameDoc = frame.contentDocument;
        if (frameDoc && frameDoc.body) {
          if (hasZeroDimension(frameDoc.body)) {
            return false;
          }
        }
      } catch (e) {
        // Cross-origin access will fail - that's okay
        // We'll rely on the other checks in this case
      }

      // Additional checks for specific scenarios
      const rect = frame.getBoundingClientRect();

      // Check if frame is too small to be meaningful
      if (rect.width < 2 && rect.height < 2) {
        return false;
      }

      // Check if frame is covered by other elements
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const elementAtPoint = document.elementFromPoint(centerX, centerY);
      if (
        elementAtPoint &&
        !frame.contains(elementAtPoint) &&
        !elementAtPoint.contains(frame)
      ) {
        // Something else is covering the center of the frame
        // But only consider it hidden if a significant portion is covered
        const coverageThreshold = 0.9; // 90% coverage to consider hidden
        const elementsAtCorners = [
          document.elementFromPoint(rect.left + 2, rect.top + 2),
          document.elementFromPoint(rect.right - 2, rect.top + 2),
          document.elementFromPoint(rect.left + 2, rect.bottom - 2),
          document.elementFromPoint(rect.right - 2, rect.bottom - 2),
        ];

        const coveredCorners = elementsAtCorners.filter(
          (el) => el && !frame.contains(el) && !el.contains(frame)
        ).length;

        if (coveredCorners >= 3) {
          // If 3 or more corners are covered
          return false;
        }
      }

      console.log("[ARGOS:CS] checkFrameVisibility: true");
      return true;
    } catch (error) {
      console.warn("Error checking frame visibility:", error);
      // In case of error, default to considering it visible
      return true;
    }
  }

  function setupFrameMonitoring() {
    // Track all iframes
    const frames = new Map<HTMLIFrameElement, boolean>();

    console.log("[ARGOS:CS] setupFrameMonitoring");
    // Initial frame discovery
    document.querySelectorAll("iframe").forEach((frame) => {
      console.log("[ARGOS:CS] setupFrameMonitoring: initial frame discovery");
      frames.set(
        frame as HTMLIFrameElement,
        checkFrameVisibility(frame as HTMLIFrameElement)
      );
    });

    // Set up mutation observer for frame changes
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
      subtree: true,
    });

    // Monitor visibility changes
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
                visible: isVisible,
              });
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1.0], // Check at different visibility thresholds
      }
    );

    // Periodic visibility checking for other cases
    setInterval(() => {
      frames.forEach((oldVisible, frame) => {
        const newVisible = checkFrameVisibility(frame);
        console.log(`[ARGOS:CS:${frame.id}] periodic visibility checking`, {
          src: frame.src,
          visible: newVisible,
        });
        if (oldVisible !== newVisible) {
          console.log(`[ARGOS:CS:${frame.id}] found visibility change!`);
          frames.set(frame, newVisible);
          chrome.runtime.sendMessage({
            type: "frameVisibilityChange",
            frameId: frame.src,
            visible: newVisible,
          });
        }
      });
    }, VISIBILITY_CHECK_INTERVAL);

    return {
      success: true,
      frames: Array.from(frames, ([key, value]) => ({
        frameId: key.src,
        visible: value,
      })),
    };
  }

  return setupFrameMonitoring();
};

export const diagnosticScript = function () {
  console.log("[ARGOS:CS] Diagnostic running");
  console.log("[ARGOS:CS] Window location:", window.location.href);
  console.log("[ARGOS:CS] Document readyState:", document.readyState);

  // Test if browser API is available
  if (typeof chrome !== "undefined") {
    console.log("[ARGOS:CS] browser API is available");
    chrome.runtime
      .sendMessage({
        type: "diagnostic",
        message: "Diagnostic script successfully ran",
      })
      .catch((e) => console.log("[ARGOS:CS] Failed to send message:", e));
  } else {
    console.log("[ARGOS:CS] browser API is NOT available!");
  }

  return {
    success: true,
    iframes: document.getElementsByTagName("iframe").length,
  };
};
