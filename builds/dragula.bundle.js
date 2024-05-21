var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
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

// ../node_modules/.pnpm/dragula@3.7.3/node_modules/dragula/dist/dragula.js
var require_dragula = __commonJS({
  "../node_modules/.pnpm/dragula@3.7.3/node_modules/dragula/dist/dragula.js"(exports, module) {
    (function(f) {
      if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
      } else if (typeof define === "function" && define.amd) {
        define([], f);
      } else {
        var g;
        if (typeof window !== "undefined") {
          g = window;
        } else if (typeof global !== "undefined") {
          g = global;
        } else if (typeof self !== "undefined") {
          g = self;
        } else {
          g = this;
        }
        g.dragula = f();
      }
    })(function() {
      var define2, module2, exports2;
      return (/* @__PURE__ */ function() {
        function r(e, n, t) {
          function o(i2, f) {
            if (!n[i2]) {
              if (!e[i2]) {
                var c = "function" == typeof __require && __require;
                if (!f && c) return c(i2, true);
                if (u) return u(i2, true);
                var a = new Error("Cannot find module '" + i2 + "'");
                throw a.code = "MODULE_NOT_FOUND", a;
              }
              var p = n[i2] = { exports: {} };
              e[i2][0].call(p.exports, function(r2) {
                var n2 = e[i2][1][r2];
                return o(n2 || r2);
              }, p, p.exports, r, e, n, t);
            }
            return n[i2].exports;
          }
          for (var u = "function" == typeof __require && __require, i = 0; i < t.length; i++) o(t[i]);
          return o;
        }
        return r;
      }())({ 1: [function(require2, module3, exports3) {
        "use strict";
        var cache = {};
        var start = "(?:^|\\s)";
        var end = "(?:\\s|$)";
        function lookupClass(className) {
          var cached = cache[className];
          if (cached) {
            cached.lastIndex = 0;
          } else {
            cache[className] = cached = new RegExp(start + className + end, "g");
          }
          return cached;
        }
        function addClass(el, className) {
          var current = el.className;
          if (!current.length) {
            el.className = className;
          } else if (!lookupClass(className).test(current)) {
            el.className += " " + className;
          }
        }
        function rmClass(el, className) {
          el.className = el.className.replace(lookupClass(className), " ").trim();
        }
        module3.exports = {
          add: addClass,
          rm: rmClass
        };
      }, {}], 2: [function(require2, module3, exports3) {
        (function(global2) {
          "use strict";
          var emitter = require2("contra/emitter");
          var crossvent = require2("crossvent");
          var classes = require2("./classes");
          var doc = document;
          var documentElement = doc.documentElement;
          function dragula2(initialContainers, options) {
            var len = arguments.length;
            if (len === 1 && Array.isArray(initialContainers) === false) {
              options = initialContainers;
              initialContainers = [];
            }
            var _mirror;
            var _source;
            var _item;
            var _offsetX;
            var _offsetY;
            var _moveX;
            var _moveY;
            var _initialSibling;
            var _currentSibling;
            var _copy;
            var _renderTimer;
            var _lastDropTarget = null;
            var _grabbed;
            var o = options || {};
            if (o.moves === void 0) {
              o.moves = always;
            }
            if (o.accepts === void 0) {
              o.accepts = always;
            }
            if (o.invalid === void 0) {
              o.invalid = invalidTarget;
            }
            if (o.containers === void 0) {
              o.containers = initialContainers || [];
            }
            if (o.isContainer === void 0) {
              o.isContainer = never;
            }
            if (o.copy === void 0) {
              o.copy = false;
            }
            if (o.copySortSource === void 0) {
              o.copySortSource = false;
            }
            if (o.revertOnSpill === void 0) {
              o.revertOnSpill = false;
            }
            if (o.removeOnSpill === void 0) {
              o.removeOnSpill = false;
            }
            if (o.direction === void 0) {
              o.direction = "vertical";
            }
            if (o.ignoreInputTextSelection === void 0) {
              o.ignoreInputTextSelection = true;
            }
            if (o.mirrorContainer === void 0) {
              o.mirrorContainer = doc.body;
            }
            var drake = emitter({
              containers: o.containers,
              start: manualStart,
              end,
              cancel,
              remove,
              destroy,
              canMove,
              dragging: false
            });
            if (o.removeOnSpill === true) {
              drake.on("over", spillOver).on("out", spillOut);
            }
            events();
            return drake;
            function isContainer(el) {
              return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
            }
            function events(remove2) {
              var op = remove2 ? "remove" : "add";
              touchy(documentElement, op, "mousedown", grab);
              touchy(documentElement, op, "mouseup", release);
            }
            function eventualMovements(remove2) {
              var op = remove2 ? "remove" : "add";
              touchy(documentElement, op, "mousemove", startBecauseMouseMoved);
            }
            function movements(remove2) {
              var op = remove2 ? "remove" : "add";
              crossvent[op](documentElement, "selectstart", preventGrabbed);
              crossvent[op](documentElement, "click", preventGrabbed);
            }
            function destroy() {
              events(true);
              release({});
            }
            function preventGrabbed(e) {
              if (_grabbed) {
                e.preventDefault();
              }
            }
            function grab(e) {
              _moveX = e.clientX;
              _moveY = e.clientY;
              var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
              if (ignore) {
                return;
              }
              var item = e.target;
              var context = canStart(item);
              if (!context) {
                return;
              }
              _grabbed = context;
              eventualMovements();
              if (e.type === "mousedown") {
                if (isInput(item)) {
                  item.focus();
                } else {
                  e.preventDefault();
                }
              }
            }
            function startBecauseMouseMoved(e) {
              if (!_grabbed) {
                return;
              }
              if (whichMouseButton(e) === 0) {
                release({});
                return;
              }
              if (e.clientX !== void 0 && Math.abs(e.clientX - _moveX) <= (o.slideFactorX || 0) && (e.clientY !== void 0 && Math.abs(e.clientY - _moveY) <= (o.slideFactorY || 0))) {
                return;
              }
              if (o.ignoreInputTextSelection) {
                var clientX = getCoord("clientX", e) || 0;
                var clientY = getCoord("clientY", e) || 0;
                var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
                if (isInput(elementBehindCursor)) {
                  return;
                }
              }
              var grabbed = _grabbed;
              eventualMovements(true);
              movements();
              end();
              start(grabbed);
              var offset = getOffset(_item);
              _offsetX = getCoord("pageX", e) - offset.left;
              _offsetY = getCoord("pageY", e) - offset.top;
              classes.add(_copy || _item, "gu-transit");
              renderMirrorImage();
              drag(e);
            }
            function canStart(item) {
              if (drake.dragging && _mirror) {
                return;
              }
              if (isContainer(item)) {
                return;
              }
              var handle = item;
              while (getParent(item) && isContainer(getParent(item)) === false) {
                if (o.invalid(item, handle)) {
                  return;
                }
                item = getParent(item);
                if (!item) {
                  return;
                }
              }
              var source = getParent(item);
              if (!source) {
                return;
              }
              if (o.invalid(item, handle)) {
                return;
              }
              var movable = o.moves(item, source, handle, nextEl(item));
              if (!movable) {
                return;
              }
              return {
                item,
                source
              };
            }
            function canMove(item) {
              return !!canStart(item);
            }
            function manualStart(item) {
              var context = canStart(item);
              if (context) {
                start(context);
              }
            }
            function start(context) {
              if (isCopy(context.item, context.source)) {
                _copy = context.item.cloneNode(true);
                drake.emit("cloned", _copy, context.item, "copy");
              }
              _source = context.source;
              _item = context.item;
              _initialSibling = _currentSibling = nextEl(context.item);
              drake.dragging = true;
              drake.emit("drag", _item, _source);
            }
            function invalidTarget() {
              return false;
            }
            function end() {
              if (!drake.dragging) {
                return;
              }
              var item = _copy || _item;
              drop(item, getParent(item));
            }
            function ungrab() {
              _grabbed = false;
              eventualMovements(true);
              movements(true);
            }
            function release(e) {
              ungrab();
              if (!drake.dragging) {
                return;
              }
              var item = _copy || _item;
              var clientX = getCoord("clientX", e) || 0;
              var clientY = getCoord("clientY", e) || 0;
              var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
              var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
              if (dropTarget && (_copy && o.copySortSource || (!_copy || dropTarget !== _source))) {
                drop(item, dropTarget);
              } else if (o.removeOnSpill) {
                remove();
              } else {
                cancel();
              }
            }
            function drop(item, target) {
              var parent = getParent(item);
              if (_copy && o.copySortSource && target === _source) {
                parent.removeChild(_item);
              }
              if (isInitialPlacement(target)) {
                drake.emit("cancel", item, _source, _source);
              } else {
                drake.emit("drop", item, target, _source, _currentSibling);
              }
              cleanup();
            }
            function remove() {
              if (!drake.dragging) {
                return;
              }
              var item = _copy || _item;
              var parent = getParent(item);
              if (parent) {
                parent.removeChild(item);
              }
              drake.emit(_copy ? "cancel" : "remove", item, parent, _source);
              cleanup();
            }
            function cancel(revert) {
              if (!drake.dragging) {
                return;
              }
              var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
              var item = _copy || _item;
              var parent = getParent(item);
              var initial = isInitialPlacement(parent);
              if (initial === false && reverts) {
                if (_copy) {
                  if (parent) {
                    parent.removeChild(_copy);
                  }
                } else {
                  _source.insertBefore(item, _initialSibling);
                }
              }
              if (initial || reverts) {
                drake.emit("cancel", item, _source, _source);
              } else {
                drake.emit("drop", item, parent, _source, _currentSibling);
              }
              cleanup();
            }
            function cleanup() {
              var item = _copy || _item;
              ungrab();
              removeMirrorImage();
              if (item) {
                classes.rm(item, "gu-transit");
              }
              if (_renderTimer) {
                clearTimeout(_renderTimer);
              }
              drake.dragging = false;
              if (_lastDropTarget) {
                drake.emit("out", item, _lastDropTarget, _source);
              }
              drake.emit("dragend", item);
              _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
            }
            function isInitialPlacement(target, s) {
              var sibling;
              if (s !== void 0) {
                sibling = s;
              } else if (_mirror) {
                sibling = _currentSibling;
              } else {
                sibling = nextEl(_copy || _item);
              }
              return target === _source && sibling === _initialSibling;
            }
            function findDropTarget(elementBehindCursor, clientX, clientY) {
              var target = elementBehindCursor;
              while (target && !accepted()) {
                target = getParent(target);
              }
              return target;
              function accepted() {
                var droppable = isContainer(target);
                if (droppable === false) {
                  return false;
                }
                var immediate = getImmediateChild(target, elementBehindCursor);
                var reference = getReference(target, immediate, clientX, clientY);
                var initial = isInitialPlacement(target, reference);
                if (initial) {
                  return true;
                }
                return o.accepts(_item, target, _source, reference);
              }
            }
            function drag(e) {
              if (!_mirror) {
                return;
              }
              e.preventDefault();
              var clientX = getCoord("clientX", e) || 0;
              var clientY = getCoord("clientY", e) || 0;
              var x = clientX - _offsetX;
              var y = clientY - _offsetY;
              _mirror.style.left = x + "px";
              _mirror.style.top = y + "px";
              var item = _copy || _item;
              var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
              var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
              var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
              if (changed || dropTarget === null) {
                out();
                _lastDropTarget = dropTarget;
                over();
              }
              var parent = getParent(item);
              if (dropTarget === _source && _copy && !o.copySortSource) {
                if (parent) {
                  parent.removeChild(item);
                }
                return;
              }
              var reference;
              var immediate = getImmediateChild(dropTarget, elementBehindCursor);
              if (immediate !== null) {
                reference = getReference(dropTarget, immediate, clientX, clientY);
              } else if (o.revertOnSpill === true && !_copy) {
                reference = _initialSibling;
                dropTarget = _source;
              } else {
                if (_copy && parent) {
                  parent.removeChild(item);
                }
                return;
              }
              if (reference === null && changed || reference !== item && reference !== nextEl(item)) {
                _currentSibling = reference;
                dropTarget.insertBefore(item, reference);
                drake.emit("shadow", item, dropTarget, _source);
              }
              function moved(type) {
                drake.emit(type, item, _lastDropTarget, _source);
              }
              function over() {
                if (changed) {
                  moved("over");
                }
              }
              function out() {
                if (_lastDropTarget) {
                  moved("out");
                }
              }
            }
            function spillOver(el) {
              classes.rm(el, "gu-hide");
            }
            function spillOut(el) {
              if (drake.dragging) {
                classes.add(el, "gu-hide");
              }
            }
            function renderMirrorImage() {
              if (_mirror) {
                return;
              }
              var rect = _item.getBoundingClientRect();
              _mirror = _item.cloneNode(true);
              _mirror.style.width = getRectWidth(rect) + "px";
              _mirror.style.height = getRectHeight(rect) + "px";
              classes.rm(_mirror, "gu-transit");
              classes.add(_mirror, "gu-mirror");
              o.mirrorContainer.appendChild(_mirror);
              touchy(documentElement, "add", "mousemove", drag);
              classes.add(o.mirrorContainer, "gu-unselectable");
              drake.emit("cloned", _mirror, _item, "mirror");
            }
            function removeMirrorImage() {
              if (_mirror) {
                classes.rm(o.mirrorContainer, "gu-unselectable");
                touchy(documentElement, "remove", "mousemove", drag);
                getParent(_mirror).removeChild(_mirror);
                _mirror = null;
              }
            }
            function getImmediateChild(dropTarget, target) {
              var immediate = target;
              while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
                immediate = getParent(immediate);
              }
              if (immediate === documentElement) {
                return null;
              }
              return immediate;
            }
            function getReference(dropTarget, target, x, y) {
              var horizontal = o.direction === "horizontal";
              var reference = target !== dropTarget ? inside() : outside();
              return reference;
              function outside() {
                var len2 = dropTarget.children.length;
                var i;
                var el;
                var rect;
                for (i = 0; i < len2; i++) {
                  el = dropTarget.children[i];
                  rect = el.getBoundingClientRect();
                  if (horizontal && rect.left + rect.width / 2 > x) {
                    return el;
                  }
                  if (!horizontal && rect.top + rect.height / 2 > y) {
                    return el;
                  }
                }
                return null;
              }
              function inside() {
                var rect = target.getBoundingClientRect();
                if (horizontal) {
                  return resolve(x > rect.left + getRectWidth(rect) / 2);
                }
                return resolve(y > rect.top + getRectHeight(rect) / 2);
              }
              function resolve(after) {
                return after ? nextEl(target) : target;
              }
            }
            function isCopy(item, container) {
              return typeof o.copy === "boolean" ? o.copy : o.copy(item, container);
            }
          }
          function touchy(el, op, type, fn) {
            var touch = {
              mouseup: "touchend",
              mousedown: "touchstart",
              mousemove: "touchmove"
            };
            var pointers = {
              mouseup: "pointerup",
              mousedown: "pointerdown",
              mousemove: "pointermove"
            };
            var microsoft = {
              mouseup: "MSPointerUp",
              mousedown: "MSPointerDown",
              mousemove: "MSPointerMove"
            };
            if (global2.navigator.pointerEnabled) {
              crossvent[op](el, pointers[type], fn);
            } else if (global2.navigator.msPointerEnabled) {
              crossvent[op](el, microsoft[type], fn);
            } else {
              crossvent[op](el, touch[type], fn);
              crossvent[op](el, type, fn);
            }
          }
          function whichMouseButton(e) {
            if (e.touches !== void 0) {
              return e.touches.length;
            }
            if (e.which !== void 0 && e.which !== 0) {
              return e.which;
            }
            if (e.buttons !== void 0) {
              return e.buttons;
            }
            var button = e.button;
            if (button !== void 0) {
              return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
            }
          }
          function getOffset(el) {
            var rect = el.getBoundingClientRect();
            return {
              left: rect.left + getScroll("scrollLeft", "pageXOffset"),
              top: rect.top + getScroll("scrollTop", "pageYOffset")
            };
          }
          function getScroll(scrollProp, offsetProp) {
            if (typeof global2[offsetProp] !== "undefined") {
              return global2[offsetProp];
            }
            if (documentElement.clientHeight) {
              return documentElement[scrollProp];
            }
            return doc.body[scrollProp];
          }
          function getElementBehindPoint(point, x, y) {
            point = point || {};
            var state = point.className || "";
            var el;
            point.className += " gu-hide";
            el = doc.elementFromPoint(x, y);
            point.className = state;
            return el;
          }
          function never() {
            return false;
          }
          function always() {
            return true;
          }
          function getRectWidth(rect) {
            return rect.width || rect.right - rect.left;
          }
          function getRectHeight(rect) {
            return rect.height || rect.bottom - rect.top;
          }
          function getParent(el) {
            return el.parentNode === doc ? null : el.parentNode;
          }
          function isInput(el) {
            return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || isEditable(el);
          }
          function isEditable(el) {
            if (!el) {
              return false;
            }
            if (el.contentEditable === "false") {
              return false;
            }
            if (el.contentEditable === "true") {
              return true;
            }
            return isEditable(getParent(el));
          }
          function nextEl(el) {
            return el.nextElementSibling || manually();
            function manually() {
              var sibling = el;
              do {
                sibling = sibling.nextSibling;
              } while (sibling && sibling.nodeType !== 1);
              return sibling;
            }
          }
          function getEventHost(e) {
            if (e.targetTouches && e.targetTouches.length) {
              return e.targetTouches[0];
            }
            if (e.changedTouches && e.changedTouches.length) {
              return e.changedTouches[0];
            }
            return e;
          }
          function getCoord(coord, e) {
            var host = getEventHost(e);
            var missMap = {
              pageX: "clientX",
              // IE8
              pageY: "clientY"
              // IE8
            };
            if (coord in missMap && !(coord in host) && missMap[coord] in host) {
              coord = missMap[coord];
            }
            return host[coord];
          }
          module3.exports = dragula2;
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, { "./classes": 1, "contra/emitter": 5, "crossvent": 6 }], 3: [function(require2, module3, exports3) {
        module3.exports = function atoa(a, n) {
          return Array.prototype.slice.call(a, n);
        };
      }, {}], 4: [function(require2, module3, exports3) {
        "use strict";
        var ticky = require2("ticky");
        module3.exports = function debounce(fn, args, ctx) {
          if (!fn) {
            return;
          }
          ticky(function run() {
            fn.apply(ctx || null, args || []);
          });
        };
      }, { "ticky": 10 }], 5: [function(require2, module3, exports3) {
        "use strict";
        var atoa = require2("atoa");
        var debounce = require2("./debounce");
        module3.exports = function emitter(thing, options) {
          var opts = options || {};
          var evt = {};
          if (thing === void 0) {
            thing = {};
          }
          thing.on = function(type, fn) {
            if (!evt[type]) {
              evt[type] = [fn];
            } else {
              evt[type].push(fn);
            }
            return thing;
          };
          thing.once = function(type, fn) {
            fn._once = true;
            thing.on(type, fn);
            return thing;
          };
          thing.off = function(type, fn) {
            var c = arguments.length;
            if (c === 1) {
              delete evt[type];
            } else if (c === 0) {
              evt = {};
            } else {
              var et = evt[type];
              if (!et) {
                return thing;
              }
              et.splice(et.indexOf(fn), 1);
            }
            return thing;
          };
          thing.emit = function() {
            var args = atoa(arguments);
            return thing.emitterSnapshot(args.shift()).apply(this, args);
          };
          thing.emitterSnapshot = function(type) {
            var et = (evt[type] || []).slice(0);
            return function() {
              var args = atoa(arguments);
              var ctx = this || thing;
              if (type === "error" && opts.throws !== false && !et.length) {
                throw args.length === 1 ? args[0] : args;
              }
              et.forEach(function emitter2(listen) {
                if (opts.async) {
                  debounce(listen, args, ctx);
                } else {
                  listen.apply(ctx, args);
                }
                if (listen._once) {
                  thing.off(type, listen);
                }
              });
              return thing;
            };
          };
          return thing;
        };
      }, { "./debounce": 4, "atoa": 3 }], 6: [function(require2, module3, exports3) {
        (function(global2) {
          "use strict";
          var customEvent = require2("custom-event");
          var eventmap = require2("./eventmap");
          var doc = global2.document;
          var addEvent = addEventEasy;
          var removeEvent = removeEventEasy;
          var hardCache = [];
          if (!global2.addEventListener) {
            addEvent = addEventHard;
            removeEvent = removeEventHard;
          }
          module3.exports = {
            add: addEvent,
            remove: removeEvent,
            fabricate: fabricateEvent
          };
          function addEventEasy(el, type, fn, capturing) {
            return el.addEventListener(type, fn, capturing);
          }
          function addEventHard(el, type, fn) {
            return el.attachEvent("on" + type, wrap(el, type, fn));
          }
          function removeEventEasy(el, type, fn, capturing) {
            return el.removeEventListener(type, fn, capturing);
          }
          function removeEventHard(el, type, fn) {
            var listener = unwrap(el, type, fn);
            if (listener) {
              return el.detachEvent("on" + type, listener);
            }
          }
          function fabricateEvent(el, type, model) {
            var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
            if (el.dispatchEvent) {
              el.dispatchEvent(e);
            } else {
              el.fireEvent("on" + type, e);
            }
            function makeClassicEvent() {
              var e2;
              if (doc.createEvent) {
                e2 = doc.createEvent("Event");
                e2.initEvent(type, true, true);
              } else if (doc.createEventObject) {
                e2 = doc.createEventObject();
              }
              return e2;
            }
            function makeCustomEvent() {
              return new customEvent(type, { detail: model });
            }
          }
          function wrapperFactory(el, type, fn) {
            return function wrapper(originalEvent) {
              var e = originalEvent || global2.event;
              e.target = e.target || e.srcElement;
              e.preventDefault = e.preventDefault || function preventDefault() {
                e.returnValue = false;
              };
              e.stopPropagation = e.stopPropagation || function stopPropagation() {
                e.cancelBubble = true;
              };
              e.which = e.which || e.keyCode;
              fn.call(el, e);
            };
          }
          function wrap(el, type, fn) {
            var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
            hardCache.push({
              wrapper,
              element: el,
              type,
              fn
            });
            return wrapper;
          }
          function unwrap(el, type, fn) {
            var i = find(el, type, fn);
            if (i) {
              var wrapper = hardCache[i].wrapper;
              hardCache.splice(i, 1);
              return wrapper;
            }
          }
          function find(el, type, fn) {
            var i, item;
            for (i = 0; i < hardCache.length; i++) {
              item = hardCache[i];
              if (item.element === el && item.type === type && item.fn === fn) {
                return i;
              }
            }
          }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, { "./eventmap": 7, "custom-event": 8 }], 7: [function(require2, module3, exports3) {
        (function(global2) {
          "use strict";
          var eventmap = [];
          var eventname = "";
          var ron = /^on/;
          for (eventname in global2) {
            if (ron.test(eventname)) {
              eventmap.push(eventname.slice(2));
            }
          }
          module3.exports = eventmap;
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {}], 8: [function(require2, module3, exports3) {
        (function(global2) {
          var NativeCustomEvent = global2.CustomEvent;
          function useNative() {
            try {
              var p = new NativeCustomEvent("cat", { detail: { foo: "bar" } });
              return "cat" === p.type && "bar" === p.detail.foo;
            } catch (e) {
            }
            return false;
          }
          module3.exports = useNative() ? NativeCustomEvent : (
            // IE >= 9
            "undefined" !== typeof document && "function" === typeof document.createEvent ? function CustomEvent(type, params) {
              var e = document.createEvent("CustomEvent");
              if (params) {
                e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
              } else {
                e.initCustomEvent(type, false, false, void 0);
              }
              return e;
            } : (
              // IE <= 8
              function CustomEvent(type, params) {
                var e = document.createEventObject();
                e.type = type;
                if (params) {
                  e.bubbles = Boolean(params.bubbles);
                  e.cancelable = Boolean(params.cancelable);
                  e.detail = params.detail;
                } else {
                  e.bubbles = false;
                  e.cancelable = false;
                  e.detail = void 0;
                }
                return e;
              }
            )
          );
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {}], 9: [function(require2, module3, exports3) {
        var process = module3.exports = {};
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
          throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
          throw new Error("clearTimeout has not been defined");
        }
        (function() {
          try {
            if (typeof setTimeout === "function") {
              cachedSetTimeout = setTimeout;
            } else {
              cachedSetTimeout = defaultSetTimout;
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout;
          }
          try {
            if (typeof clearTimeout === "function") {
              cachedClearTimeout = clearTimeout;
            } else {
              cachedClearTimeout = defaultClearTimeout;
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
          }
        })();
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            return setTimeout(fun, 0);
          }
          if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }
          try {
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e2) {
              return cachedSetTimeout.call(this, fun, 0);
            }
          }
        }
        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            return clearTimeout(marker);
          }
          if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }
          try {
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              return cachedClearTimeout.call(null, marker);
            } catch (e2) {
              return cachedClearTimeout.call(this, marker);
            }
          }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return;
          }
          draining = false;
          if (currentQueue.length) {
            queue = currentQueue.concat(queue);
          } else {
            queueIndex = -1;
          }
          if (queue.length) {
            drainQueue();
          }
        }
        function drainQueue() {
          if (draining) {
            return;
          }
          var timeout = runTimeout(cleanUpNextTick);
          draining = true;
          var len = queue.length;
          while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run();
              }
            }
            queueIndex = -1;
            len = queue.length;
          }
          currentQueue = null;
          draining = false;
          runClearTimeout(timeout);
        }
        process.nextTick = function(fun) {
          var args = new Array(arguments.length - 1);
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
            }
          }
          queue.push(new Item(fun, args));
          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
          }
        };
        function Item(fun, array) {
          this.fun = fun;
          this.array = array;
        }
        Item.prototype.run = function() {
          this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {
        }
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function(name) {
          return [];
        };
        process.binding = function(name) {
          throw new Error("process.binding is not supported");
        };
        process.cwd = function() {
          return "/";
        };
        process.chdir = function(dir) {
          throw new Error("process.chdir is not supported");
        };
        process.umask = function() {
          return 0;
        };
      }, {}], 10: [function(require2, module3, exports3) {
        (function(setImmediate) {
          var si = typeof setImmediate === "function", tick;
          if (si) {
            tick = function(fn) {
              setImmediate(fn);
            };
          } else {
            tick = function(fn) {
              setTimeout(fn, 0);
            };
          }
          module3.exports = tick;
        }).call(this, require2("timers").setImmediate);
      }, { "timers": 11 }], 11: [function(require2, module3, exports3) {
        (function(setImmediate, clearImmediate) {
          var nextTick = require2("process/browser.js").nextTick;
          var apply = Function.prototype.apply;
          var slice = Array.prototype.slice;
          var immediateIds = {};
          var nextImmediateId = 0;
          exports3.setTimeout = function() {
            return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
          };
          exports3.setInterval = function() {
            return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
          };
          exports3.clearTimeout = exports3.clearInterval = function(timeout) {
            timeout.close();
          };
          function Timeout(id, clearFn) {
            this._id = id;
            this._clearFn = clearFn;
          }
          Timeout.prototype.unref = Timeout.prototype.ref = function() {
          };
          Timeout.prototype.close = function() {
            this._clearFn.call(window, this._id);
          };
          exports3.enroll = function(item, msecs) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = msecs;
          };
          exports3.unenroll = function(item) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = -1;
          };
          exports3._unrefActive = exports3.active = function(item) {
            clearTimeout(item._idleTimeoutId);
            var msecs = item._idleTimeout;
            if (msecs >= 0) {
              item._idleTimeoutId = setTimeout(function onTimeout() {
                if (item._onTimeout)
                  item._onTimeout();
              }, msecs);
            }
          };
          exports3.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
            var id = nextImmediateId++;
            var args = arguments.length < 2 ? false : slice.call(arguments, 1);
            immediateIds[id] = true;
            nextTick(function onNextTick() {
              if (immediateIds[id]) {
                if (args) {
                  fn.apply(null, args);
                } else {
                  fn.call(null);
                }
                exports3.clearImmediate(id);
              }
            });
            return id;
          };
          exports3.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
            delete immediateIds[id];
          };
        }).call(this, require2("timers").setImmediate, require2("timers").clearImmediate);
      }, { "process/browser.js": 9, "timers": 11 }] }, {}, [2])(2);
    });
  }
});

// dragula.js
var import_dragula = __toESM(require_dragula());
var export_dragula = import_dragula.default;
export {
  export_dragula as dragula
};
