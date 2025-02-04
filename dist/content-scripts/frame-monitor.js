"use strict";
(() => {
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
  var diagnosticScript = function() {
    console.log("[ARGOS:CS] Diagnostic running");
    console.log("[ARGOS:CS] Window location:", window.location.href);
    console.log("[ARGOS:CS] Document readyState:", document.readyState);
    if (typeof chrome !== "undefined") {
      console.log("[ARGOS:CS] browser API is available");
      chrome.runtime.sendMessage({
        type: "diagnostic",
        message: "Diagnostic script successfully ran"
      }).catch((e) => console.log("[ARGOS:CS] Failed to send message:", e));
    } else {
      console.log("[ARGOS:CS] browser API is NOT available!");
    }
    return {
      success: true,
      iframes: document.getElementsByTagName("iframe").length
    };
  };
})();
//# sourceMappingURL=frame-monitor.js.map
