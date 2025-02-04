"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!globalThis.chrome?.runtime?.id) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(
                  req,
                  {},
                  {
                    getContent: {
                      minArgs: 0,
                      maxArgs: 0
                    }
                  }
                );
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // ../node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill2 = __commonJS({
    "../node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!globalThis.chrome?.runtime?.id) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(
                  req,
                  {},
                  {
                    getContent: {
                      minArgs: 0,
                      maxArgs: 0
                    }
                  }
                );
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // ../dist/index.js
  var require_dist = __commonJS({
    "../dist/index.js"(exports, module) {
      "use strict";
      var __create2 = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf2 = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var src_exports = {};
      __export(src_exports, {
        StatefulTabFrameTracker: () => StatefulTabFrameTracker2
      });
      module.exports = __toCommonJS(src_exports);
      var import_webextension_polyfill2 = __toESM2(require_browser_polyfill2());
      var import_webextension_polyfill3 = __toESM2(require_browser_polyfill2());
      var TabFrameTracker = class {
        constructor() {
          this.frameMap = /* @__PURE__ */ new Map();
          this.listeners = /* @__PURE__ */ new Set();
          this.initializeListeners();
        }
        notifyListeners(event) {
          this.listeners.forEach((listener) => listener(event));
        }
        subscribe(listener) {
          this.listeners.add(listener);
          return () => this.listeners.delete(listener);
        }
        async initializeListeners() {
          import_webextension_polyfill3.default.tabs.onCreated.addListener((tab) => {
            if (tab.id) {
              this.frameMap.set(tab.id, {
                url: tab.url || "",
                frames: /* @__PURE__ */ new Map([[0, { visible: true, url: tab.url || "" }]])
              });
              this.notifyListeners({
                type: "added",
                tabId: tab.id,
                frameId: 0,
                currentState: {
                  url: tab.url || "",
                  visible: true
                }
              });
            }
          });
          import_webextension_polyfill3.default.tabs.onUpdated.addListener(
            (tabId, changeInfo, tab) => {
              const tabInfo = this.frameMap.get(tabId);
              if (!tabInfo)
                return;
              if (changeInfo.url || changeInfo.status === "loading") {
                const previousUrl = tabInfo.url;
                const newUrl = changeInfo.url || tab.url || previousUrl;
                tabInfo.url = newUrl;
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
                  currentState: { url: newUrl, visible: true }
                });
              }
            }
          );
          import_webextension_polyfill3.default.tabs.onRemoved.addListener((tabId) => {
            const tabInfo = this.frameMap.get(tabId);
            if (tabInfo) {
              this.frameMap.delete(tabId);
              this.notifyListeners({
                type: "removed",
                tabId,
                previousState: {
                  url: tabInfo.url
                }
              });
            }
          });
          import_webextension_polyfill3.default.webNavigation.onCreatedNavigationTarget.addListener(
            (details) => {
              const tabInfo = this.frameMap.get(details.tabId);
              if (tabInfo && details.sourceFrameId) {
                tabInfo.frames.set(details.sourceFrameId, {
                  visible: true,
                  url: details.url
                });
                this.notifyListeners({
                  type: "added",
                  tabId: details.tabId,
                  frameId: details.sourceFrameId,
                  currentState: {
                    visible: true
                  }
                });
              }
            }
          );
          import_webextension_polyfill3.default.webNavigation.onCommitted.addListener(
            (details) => {
              const tabInfo = this.frameMap.get(details.tabId);
              if (tabInfo && details.frameId) {
                const frameExists = tabInfo.frames.has(details.frameId);
                tabInfo.frames.set(details.frameId, {
                  visible: true,
                  url: details.url
                });
                this.notifyListeners({
                  type: frameExists ? "modified" : "added",
                  tabId: details.tabId,
                  frameId: details.frameId,
                  currentState: {
                    visible: true
                  }
                });
              }
            }
          );
          import_webextension_polyfill3.default.webNavigation.onBeforeNavigate.addListener(
            (details) => {
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
                        visible: frameInfo.visible
                      }
                    });
                  }
                }
              }
            }
          );
          const existingTabs = await import_webextension_polyfill3.default.tabs.query({});
          for (const tab of existingTabs) {
            if (tab.id) {
              this.frameMap.set(tab.id, {
                url: tab.url || "",
                frames: /* @__PURE__ */ new Map([[0, { visible: true, url: tab.url || "" }]])
              });
              this.notifyListeners({
                type: "added",
                tabId: tab.id,
                frameId: 0,
                currentState: {
                  url: tab.url || "",
                  visible: true
                }
              });
            }
          }
          import_webextension_polyfill3.default.windows.onRemoved.addListener(async (windowId) => {
            const tabs = await import_webextension_polyfill3.default.tabs.query({ windowId });
            for (const tab of tabs) {
              if (tab.id) {
                const tabInfo = this.frameMap.get(tab.id);
                this.frameMap.delete(tab.id);
                if (tabInfo) {
                  this.notifyListeners({
                    type: "removed",
                    tabId: tab.id,
                    previousState: {
                      url: tabInfo.url
                    }
                  });
                }
              }
            }
          });
        }
        // Helper methods
        getTabInfo(tabId) {
          return this.frameMap.get(tabId);
        }
        getFrameInfo(tabId, frameId) {
          return this.frameMap.get(tabId)?.frames.get(frameId);
        }
        getAllTabs() {
          return this.frameMap;
        }
      };
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
      var StatefulTabFrameTracker2 = class extends TabFrameTracker {
        constructor(options = {}) {
          super();
          this.tabStates = /* @__PURE__ */ new Map();
          this.frameSignatureMap = /* @__PURE__ */ new Map();
          this.useInjection = false;
          this.hasScriptingPermission = false;
          this.useInjection = options.useInjection ?? false;
          this.framePollingOptions = {
            enabled: false,
            interval: 5e3,
            includeChildFrames: true,
            ...options.framePolling
          };
          this.defaultTabState = options.defaultTabState;
          this.defaultFrameState = options.defaultFrameState;
          this.initialize();
        }
        async initialize() {
          const permissions = await import_webextension_polyfill2.default.permissions.getAll();
          this.hasScriptingPermission = permissions.permissions?.includes("scripting") || false;
          console.log(
            "Initializing StatefulTabFrameTracker",
            {
              hasScriptingPermission: this.hasScriptingPermission,
              useInjection: this.useInjection
            },
            this.framePollingOptions
          );
          if (this.hasScriptingPermission && this.useInjection) {
            await this.initializeContentScriptSupport();
          } else if (this.framePollingOptions.enabled) {
            await this.initializeFramePolling();
          }
          if (this.defaultTabState) {
            const existingTabs = await import_webextension_polyfill2.default.tabs.query({});
            for (const tab of existingTabs) {
              if (tab.id && !this.tabStates.has(tab.id)) {
                this.tabStates.set(tab.id, {
                  tabData: { ...this.defaultTabState },
                  frameStates: /* @__PURE__ */ new Map()
                });
              }
            }
          }
        }
        async initializeFramePolling() {
          if (!this.framePollingOptions.enabled)
            return;
          const pollFrames = async () => {
            const tabs = await import_webextension_polyfill2.default.tabs.query({});
            for (const tab of tabs) {
              if (!tab.id)
                continue;
              try {
                const frames = await import_webextension_polyfill2.default.webNavigation.getAllFrames({
                  tabId: tab.id
                });
                if (!frames)
                  continue;
                const tabInfo = this.frameMap.get(tab.id);
                if (!tabInfo)
                  continue;
                const currentFrameIds = /* @__PURE__ */ new Set();
                for (const frame of frames) {
                  currentFrameIds.add(frame.frameId);
                  const existingFrame = tabInfo.frames.get(frame.frameId);
                  const frameUrl = frame.url;
                  if (!existingFrame) {
                    tabInfo.frames.set(frame.frameId, {
                      visible: true,
                      url: frameUrl,
                      parentFrameId: frame.parentFrameId >= 0 ? frame.parentFrameId : void 0
                    });
                    if (this.defaultFrameState) {
                      const tabState = this.tabStates.get(tab.id);
                      if (tabState && !tabState.frameStates.has(frame.frameId)) {
                        tabState.frameStates.set(frame.frameId, {
                          ...this.defaultFrameState
                        });
                      }
                    }
                    this.notifyListeners({
                      type: "added",
                      tabId: tab.id,
                      frameId: frame.frameId,
                      currentState: {
                        visible: true,
                        url: frameUrl
                      }
                    });
                  } else if (existingFrame.url !== frameUrl) {
                    const previousUrl = existingFrame.url;
                    existingFrame.url = frameUrl;
                    this.notifyListeners({
                      type: "modified",
                      tabId: tab.id,
                      frameId: frame.frameId,
                      previousState: { url: previousUrl },
                      currentState: { url: frameUrl }
                    });
                  }
                }
                for (const [frameId, frameInfo] of tabInfo.frames) {
                  if (!currentFrameIds.has(frameId) && frameId !== 0) {
                    tabInfo.frames.delete(frameId);
                    const tabState = this.tabStates.get(tab.id);
                    if (tabState) {
                      tabState.frameStates.delete(frameId);
                    }
                    this.notifyListeners({
                      type: "removed",
                      tabId: tab.id,
                      frameId,
                      previousState: {
                        url: frameInfo.url,
                        visible: frameInfo.visible
                      }
                    });
                  }
                }
              } catch (error) {
                console.error(`Error polling frames for tab ${tab.id}:`, error);
              }
            }
          };
          await pollFrames();
          this.pollingInterval = window.setInterval(
            pollFrames,
            this.framePollingOptions.interval
          );
        }
        async initializeContentScriptSupport() {
          console.log("[ARGOS:BG] initializeContentScriptSupport()");
          import_webextension_polyfill2.default.runtime.onMessage.addListener(
            (message, sender) => {
              if (message.type === "frameVisibilityChange") {
                console.log(
                  "[SHR:BG] StatefulTabFrameTracker, frameVisibilityChange: ",
                  message
                );
                const tabId = sender.tab?.id;
                if (!tabId)
                  return;
                const frameSignature = message.frameId;
                const tabInfo = this.frameMap.get(tabId);
                if (!tabInfo)
                  return;
                const frameEntry = Array.from(tabInfo.frames.entries()).find(
                  ([_, frameInfo]) => frameInfo.url === frameSignature
                );
                if (frameEntry) {
                  const [frameId, frameInfo] = frameEntry;
                  frameInfo.visible = message.visible;
                  this.handleFrameVisibilityChange({ ...message, frameId });
                }
              }
              return true;
            }
          );
          this.subscribe(async (event) => {
            if (event.type === "modified" && event.frameId === 0) {
              await new Promise((resolve) => setTimeout(resolve, 1e3));
              try {
                const tab = await import_webextension_polyfill2.default.tabs.get(event.tabId);
                await this.injectContentScript(tab);
              } catch (err) {
                console.warn(
                  `[ARGOS:BG] Failed to inject frame monitor into refreshed tab ${event.tabId}:`,
                  err
                );
              }
            }
          });
          const existingTabs = await import_webextension_polyfill2.default.tabs.query({});
          for (const tab of existingTabs) {
            if (tab.id) {
              await this.injectContentScript(tab);
            }
          }
        }
        async injectContentScript(tab) {
          if (!this.useInjection || !tab.id)
            return;
          try {
            const frameMonitorResult = await import_webextension_polyfill2.default.scripting.executeScript({
              target: { tabId: tab.id },
              func: frameMonitorContentScript
            });
            const frameResult = frameMonitorResult[0]?.result;
            if (frameResult?.success && frameResult.frames) {
              console.log(
                `[ARGOS:BG] Got initial frame visibility for tab ${tab.id}`,
                frameResult.frames
              );
              const tabInfo = this.frameMap.get(tab.id);
              console.log(`[ARGOS:BG] Got tabInfo for comparison `, tabInfo);
              if (!tabInfo)
                return;
              frameResult.frames.forEach((frame) => {
                const frameEntry = Array.from(tabInfo.frames.entries()).find(
                  ([_, frameInfo]) => frameInfo.url === frame.frameId
                );
                console.log(`[ARGOS:BG] Found frameEntry for comparison`, frameEntry);
                if (frameEntry) {
                  console.log(`[ARGOS:BG] Found matching frame entry`, frameEntry);
                  const [frameId, frameInfo] = frameEntry;
                  frameInfo.visible = frame.visible;
                  this.handleFrameVisibilityChange({
                    frameId,
                    tabId: tab.id,
                    visible: frame.visible
                  });
                }
              });
            }
          } catch (error) {
            console.warn(
              `[ARGOS:BG] Failed to inject content script into tab ${tab.id}: ${tab.url}:`,
              error
            );
            if (this.framePollingOptions.enabled) {
              console.log(
                `[ARGOS:BG] Script execution not enabled, falling back to polling for tab ${tab.id}`
              );
              this.pollFramesForTab(tab.id);
            }
          }
        }
        async pollFramesForTab(tabId) {
          try {
            const frames = await import_webextension_polyfill2.default.webNavigation.getAllFrames({ tabId });
            if (!frames)
              return;
            const tabInfo = this.frameMap.get(tabId);
            if (!tabInfo)
              return;
          } catch (error) {
            console.warn(`Failed to poll frames for tab ${tabId}:`, error);
          }
        }
        handleFrameVisibilityChange(message) {
          const { frameId, tabId, visible } = message;
          const frameInfo = this.getFrameInfo(tabId, frameId);
          if (frameInfo) {
            frameInfo.visible = visible;
            this.notifyListeners({
              type: "visibility_changed",
              tabId,
              frameId,
              previousState: { visible: !visible },
              currentState: { visible }
            });
          }
        }
        setFrameVisibility(tabId, frameId, visible) {
          const frameInfo = this.getFrameInfo(tabId, frameId);
          if (frameInfo) {
            frameInfo.visible = visible;
            this.notifyListeners({
              type: "modified",
              tabId,
              frameId,
              previousState: { visible: !visible },
              currentState: { visible }
            });
          }
        }
        // State management methods
        setTabState(tabId, state) {
          const existing = this.tabStates.get(tabId);
          if (!existing) {
            if (this.isFullState(state)) {
              this.tabStates.set(tabId, {
                tabData: state,
                frameStates: /* @__PURE__ */ new Map()
              });
            } else if (this.defaultTabState) {
              this.tabStates.set(tabId, {
                tabData: { ...this.defaultTabState, ...state },
                frameStates: /* @__PURE__ */ new Map()
              });
            } else {
              throw new Error("Initial state must be a full state");
            }
          } else {
            this.tabStates.set(tabId, {
              tabData: { ...existing.tabData, ...state },
              frameStates: existing.frameStates
            });
          }
        }
        setFrameState(tabId, frameId, state) {
          let tabState = this.tabStates.get(tabId);
          if (!tabState && this.defaultFrameState) {
            tabState = {
              tabData: { ...this.defaultTabState },
              frameStates: /* @__PURE__ */ new Map()
            };
            this.tabStates.set(tabId, tabState);
          }
          if (!tabState)
            return;
          const existingFrameState = tabState.frameStates.get(frameId);
          if (!existingFrameState) {
            if (this.isFullState(state)) {
              tabState.frameStates.set(frameId, state);
            } else if (this.defaultFrameState) {
              tabState.frameStates.set(frameId, {
                ...this.defaultFrameState,
                ...state
              });
            } else {
              throw new Error("Initial frame state must be a full state");
            }
          } else {
            tabState.frameStates.set(frameId, {
              ...existingFrameState,
              ...state
            });
          }
        }
        isFullState(state) {
          const requiredKeys = Object.keys(this.getTypeTemplate());
          const stateKeys = Object.keys(state);
          return requiredKeys.every((key) => stateKeys.includes(key));
        }
        getTypeTemplate() {
          return {};
        }
        getTabState(tabId) {
          return this.tabStates.get(tabId)?.tabData ?? this.defaultTabState;
        }
        getFrameState(tabId, frameId) {
          const tabState = this.tabStates.get(tabId);
          return tabState?.frameStates.get(frameId) ?? this.defaultFrameState;
        }
        // Query methods for tab states
        getAllTabsWithState() {
          const result = /* @__PURE__ */ new Map();
          for (const [tabId, tabState] of this.tabStates) {
            const tabInfo = this.frameMap.get(tabId);
            if (!tabInfo)
              continue;
            result.set(tabId, {
              tabState: tabState.tabData,
              frames: new Map(
                Array.from(tabInfo.frames.entries()).map(([frameId, frameInfo]) => [
                  frameId,
                  {
                    frameInfo,
                    state: tabState.frameStates.get(frameId)
                  }
                ])
              )
            });
          }
          return result;
        }
        queryTabs(predicate) {
          const result = /* @__PURE__ */ new Map();
          for (const [tabId, tabState] of this.tabStates) {
            if (predicate(tabState.tabData)) {
              const tabInfo = this.frameMap.get(tabId);
              if (!tabInfo)
                continue;
              result.set(tabId, {
                tabState: tabState.tabData,
                frames: new Map(
                  Array.from(tabInfo.frames.entries()).map(([frameId, frameInfo]) => [
                    frameId,
                    { frameInfo, state: tabState.frameStates.get(frameId) }
                  ])
                )
              });
            }
          }
          return result;
        }
        // Override cleanup to handle state
        dispose() {
          if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
          }
          this.tabStates.clear();
        }
      };
    }
  });

  // src/background.ts
  var import_webextension_polyfill = __toESM(require_browser_polyfill());
  var import_argos = __toESM(require_dist());
  var tracker = new import_argos.StatefulTabFrameTracker({
    useInjection: true,
    defaultTabState: {
      activatedDate: 0,
      isActive: false
    },
    defaultFrameState: {
      scanning: false
    }
  });
  import_webextension_polyfill.default.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_TABS") {
      console.log(`[ARGOS TEST:BG] Message received:`, message);
      console.log(`[ARGOS TEST:BG] tracker.getAllTabs():`, tracker.getAllTabs());
      const tabArray = [];
      tracker.getAllTabs().forEach((value, key) => {
        const frameArray = Array.from(value.frames.entries()).map(
          ([frameId, frameInfo]) => {
            return {
              frameId,
              frameInfo
            };
          }
        );
        if (value.url.includes("google.com")) {
          tabArray.push({
            tabId: key,
            tabInfo: value,
            frames: frameArray
          });
        }
      });
      console.log(`[ARGOS TEST:BG] tracker.getAllTabs():`, tabArray);
      sendResponse({
        type: "TAB_RESPONSE",
        payload: { tabs: tabArray }
      });
    }
  });
})();
//# sourceMappingURL=background.js.map
