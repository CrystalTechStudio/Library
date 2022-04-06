(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],3:[function(require,module,exports){
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":5}],4:[function(require,module,exports){
var split = require('browser-split')
var ClassList = require('class-list')

var w = typeof window === 'undefined' ? require('html-element') : window
var document = w.document
var Text = w.Text

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        // Our minimal parser doesn’t understand escaping CSS special
        // characters like `#`. Don’t use them. More reading:
        // https://mathiasbynens.be/notes/css-escapes .

        var m = split(string, /([\.#]?[^\s#.]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              (function (k, l) { // capture k, l in the closure
                if (e.addEventListener){
                  e.addEventListener(k.substring(2), l[k], false)
                  cleanupFuncs.push(function(){
                    e.removeEventListener(k.substring(2), l[k], false)
                  })
                }else{
                  e.attachEvent(k, l[k])
                  cleanupFuncs.push(function(){
                    e.detachEvent(k, l[k])
                  })
                }
              })(k, l)
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  var match = l[k][s].match(/(.*)\W+!important\W*$/);
                  if (match) {
                    e.style.setProperty(s, match[1], 'important')
                  } else {
                    e.style.setProperty(s, l[k][s])
                  }
              })(s, l[k][s])
            }
          } else if(k === 'attrs') {
            for (var v in l[k]) {
              e.setAttribute(v, l[k][v])
            }
          }
          else if (k.substr(0, 5) === "data-") {
            e.setAttribute(k, l[k])
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
    cleanupFuncs.length = 0
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}



},{"browser-split":2,"class-list":3,"html-element":1}],5:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
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
    while(len) {
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

process.nextTick = function (fun) {
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

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":6,"timers":7}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$e = void 0;
function appendChildren($element, children) {
    if (children === undefined || children === null || children === false) {
        return;
    }
    if (Array.isArray(children)) {
        children.forEach(child => appendChildren($element, child));
    }
    else {
        $element.append(children);
    }
}
function $e(tag, attributes, ...children) {
    const $element = document.createElement(tag);
    if (attributes !== null) {
        for (const [key, value] of Object.entries(attributes)) {
            if (value === null) {
                continue;
            }
            if (key === 'style') {
                for (const [cssKey, cssValue] of Object.entries(value)) {
                    $element.style[cssKey] = cssValue;
                }
            }
            else {
                if (Array.isArray(value)) {
                    $element[key] = value.join(' ');
                }
                else {
                    $element[key] = value;
                }
            }
        }
    }
    appendChildren($element, children);
    return $element;
}
exports.$e = $e;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugLogger = void 0;
const materialDarkColors_1 = require("./constant/materialDarkColors");
const settings_1 = require("./data/settings");
const stringHash_1 = require("./util/stringHash");
class DebugLogger {
    constructor(name) {
        this.prefix = '%c' + name;
        this.css = `background-color: #` +
            materialDarkColors_1.materialDarkColors[Math.abs((0, stringHash_1.stringHash)(name)) % materialDarkColors_1.materialDarkColors.length] +
            '; border-radius: 0.3em; padding: 0 0.3em; color: white';
    }
    log(...stuff) {
        if (!settings_1.developerMode.getValue()) {
            return;
        }
        console.info(this.prefix, this.css, ...stuff);
    }
    warn(...stuff) {
        console.warn(this.prefix, this.css, ...stuff);
    }
    error(...stuff) {
        console.error(this.prefix, this.css, ...stuff);
    }
}
exports.DebugLogger = DebugLogger;

},{"./constant/materialDarkColors":12,"./data/settings":44,"./util/stringHash":71}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor() {
        this.listeners = null;
        this.onceListeners = null;
        this.isEmitting = false;
        this.queue = [];
    }
    runWhenNotEmitting(fn) {
        if (this.isEmitting) {
            this.queue.push(fn);
        }
        else {
            fn();
        }
    }
    on(listener) {
        this.runWhenNotEmitting(() => {
            if (this.listeners === null) {
                this.listeners = new Set();
            }
            this.listeners.add(listener);
        });
        return listener;
    }
    onUntil(listener, event) {
        this.runWhenNotEmitting(() => {
            this.on(listener);
            event.once(() => this.off(listener));
        });
    }
    off(listener) {
        this.runWhenNotEmitting(() => {
            if (this.listeners !== null) {
                this.listeners.delete(listener);
            }
            if (this.onceListeners !== null) {
                this.onceListeners.delete(listener);
            }
        });
    }
    once(onceListener) {
        this.runWhenNotEmitting(() => {
            if (this.onceListeners === null) {
                this.onceListeners = new Set();
            }
            this.onceListeners.add(onceListener);
        });
        return onceListener;
    }
    onceUntil(listener, event) {
        this.runWhenNotEmitting(() => {
            this.once(listener);
            event.once(() => this.off(listener));
        });
    }
    expect(filter) {
        if (this.isEmitting) {
            return new Promise(resolve => {
                this.queue.push(() => {
                    this.expect(filter).then(resolve);
                });
            });
        }
        if (filter === undefined) {
            return new Promise(resolve => this.once(resolve));
        }
        return new Promise(resolve => {
            const listener = this.on(arg => {
                if (!filter(arg)) {
                    return;
                }
                this.off(listener);
                resolve(arg);
            });
        });
    }
    emit(arg) {
        this.runWhenNotEmitting(() => {
            this.isEmitting = true;
            if (this.listeners !== null) {
                this.listeners.forEach(listener => listener(arg, listener));
            }
            if (this.onceListeners !== null) {
                this.onceListeners.forEach(onceListener => onceListener(arg, onceListener));
                this.onceListeners = new Set();
            }
            this.isEmitting = false;
            this.queue.forEach(task => task());
            this.queue.length = 0;
        });
    }
}
exports.Event = Event;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = exports.ItemHandle = exports.ItemLocation = exports.ItemDecoration = void 0;
const layoutControl_1 = require("./control/layoutControl");
const DebugLogger_1 = require("./DebugLogger");
const hs_1 = require("./hs");
const DOM_1 = require("./util/DOM");
var ItemDecoration;
(function (ItemDecoration) {
    ItemDecoration[ItemDecoration["SELECTABLE"] = 0] = "SELECTABLE";
    ItemDecoration[ItemDecoration["BACK"] = 1] = "BACK";
    ItemDecoration[ItemDecoration["ICON_FOLDER"] = 2] = "ICON_FOLDER";
    ItemDecoration[ItemDecoration["ICON_LINK"] = 3] = "ICON_LINK";
    ItemDecoration[ItemDecoration["ICON_EQUALIZER"] = 4] = "ICON_EQUALIZER";
    ItemDecoration[ItemDecoration["ICON_FILE"] = 5] = "ICON_FILE";
    ItemDecoration[ItemDecoration["ICON_GAME"] = 6] = "ICON_GAME";
    ItemDecoration[ItemDecoration["ICON_NOTIFICATION"] = 7] = "ICON_NOTIFICATION";
    ItemDecoration[ItemDecoration["ICON_LIST"] = 8] = "ICON_LIST";
    ItemDecoration[ItemDecoration["ICON_CALENDER"] = 9] = "ICON_CALENDER";
    ItemDecoration[ItemDecoration["ICON_HISTORY"] = 10] = "ICON_HISTORY";
    ItemDecoration[ItemDecoration["ICON_CLEAR"] = 11] = "ICON_CLEAR";
    ItemDecoration[ItemDecoration["ICON_PERSON"] = 12] = "ICON_PERSON";
    ItemDecoration[ItemDecoration["ICON_TAG"] = 13] = "ICON_TAG";
})(ItemDecoration = exports.ItemDecoration || (exports.ItemDecoration = {}));
var ItemLocation;
(function (ItemLocation) {
    ItemLocation[ItemLocation["BEFORE"] = 0] = "BEFORE";
    ItemLocation[ItemLocation["AFTER"] = 1] = "AFTER";
})(ItemLocation = exports.ItemLocation || (exports.ItemLocation = {}));
function createSpan(text, ...classNames) {
    const $span = document.createElement('span');
    $span.innerText = text;
    $span.classList.add(...classNames);
    return $span;
}
class ItemHandle {
    constructor(menu, $flexElement, $innerElement) {
        this.menu = menu;
        this.$flexElement = $flexElement;
        this.$innerElement = $innerElement;
        this.$prependSpan = null;
        this.$appendSpan = null;
    }
    setSelected(selected) {
        this.$innerElement.classList.toggle('selected', selected);
        return this;
    }
    onClick(handler) {
        this.$innerElement.addEventListener('click', () => {
            handler(this);
        });
        return this;
    }
    setInnerText(innerText) {
        this.$innerElement.innerText = innerText;
        return this;
    }
    addClass(className) {
        this.$innerElement.classList.add(className);
        return this;
    }
    removeClass(className) {
        this.$innerElement.classList.remove(className);
        return this;
    }
    prepend(text, className) {
        if (this.$prependSpan === null) {
            this.$prependSpan = createSpan('', 'prepend');
            this.$innerElement.prepend(this.$prependSpan);
        }
        const $span = createSpan(text, 'item-side');
        if (className !== undefined) {
            $span.classList.add(className);
        }
        this.$prependSpan.prepend($span);
        return $span;
    }
    append(text, className) {
        if (this.$appendSpan === null) {
            this.$appendSpan = createSpan('', 'append');
            this.$innerElement.appendChild(this.$appendSpan);
        }
        const $span = createSpan(text, 'item-side');
        if (className !== undefined) {
            $span.classList.add(className);
        }
        this.$appendSpan.appendChild($span);
        return $span;
    }
    remove() {
        this.$flexElement.remove();
    }
}
exports.ItemHandle = ItemHandle;
class Menu {
    constructor(urlBase, layout = layoutControl_1.Layout.OFF) {
        this.urlBase = urlBase;
        this.layout = layout;
        this.subMenus = new Map();
        this.debugLogger = new DebugLogger_1.DebugLogger(`Menu (${urlBase})`);
        this.container = (0, hs_1.h)('.menu.hidden');
        document.body.appendChild(this.container);
        // if (this.fullPath.length >= 1) {
        //   const path = document.createElement('div');
        //   path.classList.add('path');
        //   path.innerText = this.fullPath.join(' > ');
        //   this.container.appendChild(path);
        // }
        // if (parent !== null) {
        //   this.addItem('返回', { button: true, decoration: ItemDecoration.BACK, unclearable: true })
        //     .linkTo(parent);
        // }
    }
    destroy() {
        this.container.classList.add('hidden');
        setTimeout(() => this.container.remove(), 1000);
    }
    hide() {
        this.container.classList.add('hidden');
    }
    show() {
        (0, layoutControl_1.setLayout)(this.layout);
        (0, DOM_1.forceReflow)(this.container);
        this.container.classList.remove('hidden');
    }
    addItem(title, options = {}) {
        let $innerElement;
        if (options.button && options.link !== undefined) {
            $innerElement = document.createElement('a');
            $innerElement.href = options.link;
            $innerElement.rel = 'noopener noreferrer';
            if (!options.link.startsWith('#')) {
                $innerElement.target = '_blank';
            }
        }
        else {
            $innerElement = document.createElement('div');
        }
        $innerElement.innerText = title;
        if (options.hidden) {
            $innerElement.classList.add('display-none');
        }
        if (options.button) {
            $innerElement.classList.add('button');
            switch (options.decoration) {
                case ItemDecoration.BACK:
                    $innerElement.classList.add('back');
                    break;
                case ItemDecoration.SELECTABLE:
                    $innerElement.classList.add('selectable');
                    break;
                case ItemDecoration.ICON_FOLDER:
                    $innerElement.classList.add('icon', 'folder');
                    break;
                case ItemDecoration.ICON_LINK:
                    $innerElement.classList.add('icon', 'link');
                    break;
                case ItemDecoration.ICON_EQUALIZER:
                    $innerElement.classList.add('icon', 'equalizer');
                    break;
                case ItemDecoration.ICON_FILE:
                    $innerElement.classList.add('icon', 'file');
                    break;
                case ItemDecoration.ICON_GAME:
                    $innerElement.classList.add('icon', 'game');
                    break;
                case ItemDecoration.ICON_NOTIFICATION:
                    $innerElement.classList.add('icon', 'notification');
                    break;
                case ItemDecoration.ICON_LIST:
                    $innerElement.classList.add('icon', 'list');
                    break;
                case ItemDecoration.ICON_CALENDER:
                    $innerElement.classList.add('icon', 'calender');
                    break;
                case ItemDecoration.ICON_HISTORY:
                    $innerElement.classList.add('icon', 'history');
                    break;
                case ItemDecoration.ICON_CLEAR:
                    $innerElement.classList.add('icon', 'clear');
                    break;
                case ItemDecoration.ICON_PERSON:
                    $innerElement.classList.add('icon', 'person');
                    break;
                case ItemDecoration.ICON_TAG:
                    $innerElement.classList.add('icon', 'icon-tag');
                    break;
            }
        }
        const $flexElement = (0, hs_1.h)('.flex');
        $flexElement.appendChild($innerElement);
        if (options.location === ItemLocation.BEFORE) {
            this.container.prepend($flexElement);
        }
        else {
            this.container.appendChild($flexElement);
        }
        return new ItemHandle(this, $flexElement, $innerElement);
    }
    buildSubMenu(name, MenuConstructor, ...args) {
        return new SubMenuBuilder(this, name, urlSegment => new MenuConstructor(`${this.urlBase}/${urlSegment}`, ...args));
    }
    registerSubMenu(name, urlSegment, menuFactory) {
        if (this.subMenus.has(urlSegment)) {
            this.debugLogger.error(`Duplicated url segment: ${urlSegment}.`);
        }
        this.subMenus.set(urlSegment, {
            name,
            factory: menuFactory,
        });
    }
}
exports.Menu = Menu;
class SubMenuBuilder {
    constructor(parentMenu, 
    /** Displayed in the parent menu */
    name, subMenuFactory) {
        this.parentMenu = parentMenu;
        this.name = name;
        this.subMenuFactory = subMenuFactory;
        this.decoration = undefined;
        this.hidden = false;
        this.urlSegment = name;
        this.displayName = name;
    }
    /**
     * Used for constructing menu url
     */
    setUrlSegment(urlSegment) {
        this.urlSegment = urlSegment;
        return this;
    }
    setDecoration(decoration) {
        this.decoration = decoration;
        return this;
    }
    /**
     * Shown in the menu (initially); Defaults to name
     */
    setDisplayName(displayName) {
        this.displayName = displayName;
        return this;
    }
    setHidden(hidden = true) {
        this.hidden = hidden;
        return this;
    }
    build() {
        this.parentMenu.registerSubMenu(this.name, this.urlSegment, () => this.subMenuFactory(this.urlSegment));
        return this.parentMenu.addItem(this.displayName, {
            button: true,
            link: `${this.parentMenu.urlBase}/${this.urlSegment}`,
            decoration: this.decoration,
            hidden: this.hidden,
        });
    }
}

},{"./DebugLogger":9,"./control/layoutControl":27,"./hs":45,"./util/DOM":62}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialDarkColors = void 0;
// https://material.io/resources/color/
exports.materialDarkColors = [
    'b71c1c',
    '880e4f',
    '4a148c',
    '311b92',
    '1a237e',
    '0d47a1',
    '01579b',
    '006064',
    '004d40',
    '1b5e20',
    '33691e',
    '827717',
    'bf360c',
    '3e2723',
    '795548',
    '5d4037',
    '1976d2',
    '303f9f',
    '3f51b5',
    '673ab7',
    '9c27b0',
    'c2185b',
    'd32f2f',
    '263238',
    '455a64',
    '616161',
    '212121',
];

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VISIT_COUNT_LOAD_MORE = exports.VISIT_COUNT_FAILED = exports.VISIT_COUNT_LOADING = exports.VISIT_COUNT_DESC_2 = exports.VISIT_COUNT_DESC_1 = exports.VISIT_COUNT_DESC_0 = exports.VISIT_COUNT_TITLE = exports.COMMENTS_SEND_EMAIL_INPUT_PREFIX = exports.COMMENTS_SEND_DISPLAY_NAME_PREFIX = exports.COMMENTS_SEND_HINT = exports.COMMENTS_LOSE_EDITED_CANCEL = exports.COMMENTS_LOSE_EDITED_CONFIRM = exports.COMMENTS_LOSE_EDITED_TITLE = exports.COMMENTS_SEND_CONFIRM = exports.COMMENTS_SEND_TITLE = exports.COMMENTS_DELETE_CONFIRMATION = exports.COMMENTS_REPLY = exports.COMMENTS_DELETE = exports.COMMENTS_SEND_DISPLAY_NAME_EDIT = exports.COMMENTS_SEND_DISPLAY_NAME_1 = exports.COMMENTS_SEND_DISPLAY_NAME_0 = exports.COMMENTS_DELETING = exports.COMMENTS_SENDING = exports.COMMENTS_MODIFIED_DATE = exports.COMMENTS_SUBMIT_BY = exports.COMMENTS_MENTION_REPLIED_OK = exports.COMMENTS_MENTION_REPLIED_TITLE = exports.COMMENTS_MENTION_NO_TOKEN_DESC = exports.COMMENTS_MENTION_NO_TOKEN_TITLE = exports.COMMENTS_MENTION_LOADED = exports.COMMENTS_MENTION_SECTION = exports.COMMENTS_RECENT_LOADED = exports.COMMENTS_RECENT_SECTION = exports.COMMENTS_FAILED = exports.COMMENTS_LOADED = exports.COMMENTS_SEND = exports.COMMENTS_UNAVAILABLE = exports.COMMENTS_LOADING = exports.COMMENTS_SECTION = exports.BROKEN_LINK_OK = exports.BROKEN_LINK_DESC = exports.BROKEN_LINK_TITLE = exports.BUILD_FAILED_OK = exports.BUILD_FAILED_DESC = exports.BUILD_FAILED_TITLE = exports.CHAPTER_FAILED = exports.CHAPTER_LOADING = exports.NEXT_CHAPTER = exports.GO_TO_MENU = exports.PREVIOUS_CHAPTER = void 0;
exports.WTCD_ERROR_INTERNAL_DESC = exports.WTCD_ERROR_INTERNAL_TITLE = exports.WTCD_ERROR_RUNTIME_DESC = exports.WTCD_ERROR_RUNTIME_TITLE = exports.WTCD_ERROR_COMPILE_DESC = exports.WTCD_ERROR_COMPILE_TITLE = exports.WTCD_GAME_NO_DESC = exports.WTCD_GAME_QUICK_LOAD_CONFIRM_CANCEL = exports.WTCD_GAME_QUICK_LOAD_CONFIRM_CONFIRM = exports.WTCD_GAME_QUICK_LOAD_CONFIRM_DESC = exports.WTCD_GAME_QUICK_LOAD_CONFIRM_TITLE = exports.WTCD_GAME_QUICK_LOAD_NOT_EXIST = exports.WTCD_GAME_QUICK_LOAD_OK = exports.WTCD_GAME_QUICK_LOAD = exports.WTCD_GAME_QUICK_SAVE_OK = exports.WTCD_GAME_QUICK_SAVE = exports.WTCD_GAME_LOAD_OK = exports.WTCD_GAME_LOAD_QUICK = exports.WTCD_GAME_LOAD_CANCEL = exports.WTCD_GAME_LOAD_TITLE = exports.WTCD_GAME_LOAD = exports.WTCD_GAME_SAVE_OK = exports.WTCD_GAME_SAVE_OVERWRITE_CANCEL = exports.WTCD_GAME_SAVE_OVERWRITE_CONFIRM = exports.WTCD_GAME_SAVE_OVERWRITE_TITLE = exports.WTCD_GAME_SAVE_NEW = exports.WTCD_GAME_SAVE_CANCEL = exports.WTCD_GAME_SAVE_TITLE = exports.WTCD_GAME_SAVE = exports.WTCD_GAME_RESTART_OK = exports.WTCD_GAME_RESTART_CANCEL = exports.WTCD_GAME_RESTART_DECISION_ONLY = exports.WTCD_GAME_RESTART_ALL = exports.WTCD_GAME_RESTART_DECISION_ONLY_DESC = exports.WTCD_GAME_RESTART_ALL_DESC = exports.WTCD_GAME_RESTART_DESC = exports.WTCD_GAME_RESTART_TITLE = exports.WTCD_GAME_RESTART = exports.CLICK_TO_UNBLOCK = exports.NO_BLOCKED_USERS = exports.VISIT_COUNT_TIMES = exports.VISIT_COUNT_DISPLAYING = exports.VISIT_COUNT_TIME_FRAME_YEAR = exports.VISIT_COUNT_TIME_FRAME_MONTH = exports.VISIT_COUNT_TIME_FRAME_WEEK = exports.VISIT_COUNT_TIME_FRAME_DAY = exports.VISIT_COUNT_TIME_FRAME_HOUR = exports.VISIT_COUNT_TIME_FRAME_ALL = exports.VISIT_COUNT_LOAD_MORE_FAILED = exports.VISIT_COUNT_LOAD_MORE_LOADING = void 0;
exports.USER_UPDATE_PROFILE_SUCCESS = exports.USER_UPDATE_PROFILE_LOADING = exports.USER_UPDATE_PROFILE_DISPLAY_NAME_EMPTY = exports.USER_UPDATE_PROFILE_EMAIL_INPUT_LABEL = exports.USER_UPDATE_PROFILE_DISPLAY_NAME_INPUT_LABEL = exports.USER_UPDATE_PROFILE_USER_NAME_INPUT_LABEL = exports.USER_UPDATE_PROFILE_HINT_EMAIL_1 = exports.USER_UPDATE_PROFILE_HINT_EMAIL_GRAVATAR_LINK = exports.USER_UPDATE_PROFILE_HINT_EMAIL_0 = exports.USER_UPDATE_PROFILE_HINT_DISPLAY_NAME = exports.USER_UPDATE_PROFILE_HINT_USER_NAME = exports.USER_UPDATE_PROFILE_DESC = exports.USER_UPDATE_PROFILE_TITLE = exports.USER_UPDATE_PROFILE_ERROR_NOT_INITIALIZED = exports.USER_TOKEN_DOES_NOT_EXIST = exports.USER_TOKEN_CHANGE_INPUT_LABEL = exports.USER_TOKEN_CHANGE_DESC = exports.USER_TOKEN_CHANGE_TITLE = exports.USER_TOKEN_CHANGE_SUCCESS = exports.USER_TOKEN_CHANGE_CHECKING = exports.USER_TOKEN_CHANGE_INVALID = exports.USER_TOKEN_CHANGE_EMPTY = exports.BACKEND_ERROR_UNKNOWN = exports.BACKEND_ERROR_NAME_INVALID = exports.BACKEND_ERROR_COMMENT_TOO_SHORT = exports.BACKEND_ERROR_NAME_TOO_SHORT = exports.BACKEND_ERROR_TOKEN_INVALID = exports.BACKEND_ERROR_COMMENT_TOO_LONG = exports.BACKEND_ERROR_EMAIL_INVALID = exports.BACKEND_ERROR_EMAIL_TOO_LONG = exports.BACKEND_ERROR_NAME_TOO_LONG = exports.BACKEND_ERROR_EMAIL_DUPLICATED = exports.BACKEND_ERROR_NAME_DUPLICATED = exports.GENERIC_INTERNET_ERROR = exports.GENERIC_CLOSE = exports.GENERIC_CANCEL = exports.GENERIC_CONFIRM = exports.GENERIC_HINT_TITLE = exports.GENERIC_LOADING_DESC = exports.GENERIC_LOADING_TITLE = exports.GENERIC_ERROR_DESC = exports.GENERIC_ERROR_TITLE = exports.GENERIC_SUCCESS_DESC = exports.GENERIC_SUCCESS_TITLE = exports.WTCD_CANVAS_LOADING = exports.WTCD_ERROR_INTERNAL_STACK_DESC = exports.WTCD_ERROR_INTERNAL_STACK_TITLE = exports.WTCD_ERROR_WTCD_STACK_DESC = exports.WTCD_ERROR_WTCD_STACK_TITLE = exports.WTCD_ERROR_MESSAGE = void 0;
exports.MIRROR_LANDING_CONFLICT_KEEP = exports.MIRROR_LANDING_CONFLICT_OVERWRITE = exports.MIRROR_LANDING_CONFLICT_DESC = exports.MIRROR_LANDING_CONFLICT_TITLE = exports.MIRROR_LANDING_SUCCESS_HINT = exports.MIRROR_LANDING_INVALID_REFERRAL = exports.MIRROR_TECHNOLOGY = exports.MIRROR_PROVIDED_BY = exports.MIRROR_URL = exports.MIRROR_DESC_1 = exports.MIRROR_DESC_0 = exports.MIRROR_DESC_0_NO_TOKEN = exports.MIRROR_TITLE = exports.AUTHOR_PAGE_LINK = exports.AUTHOR_PAGE_AS = exports.AUTHOR_PAGE_WORKS_DESC = exports.AUTHOR_PAGE_WORKS = void 0;
exports.PREVIOUS_CHAPTER = '上一章';
exports.GO_TO_MENU = '返回';
exports.NEXT_CHAPTER = '下一章';
exports.CHAPTER_LOADING = '章节加载中...';
exports.CHAPTER_FAILED = '章节加载失败，请检查网络连接。';
exports.BUILD_FAILED_TITLE = '构建失败';
exports.BUILD_FAILED_DESC = '晶体图书馆的网页构建脚本在构建过程中发生了可以恢复的异常。详细内容请参见控制台输出。';
exports.BUILD_FAILED_OK = '我知道了';
exports.BROKEN_LINK_TITLE = '损坏的链接';
exports.BROKEN_LINK_DESC = '对不起，您提供的地址无法被正确解析，所以您现在回到了晶体图书馆的首页。';
exports.BROKEN_LINK_OK = '我知道了';
exports.COMMENTS_SECTION = '评论区';
exports.COMMENTS_LOADING = '评论加载中...';
exports.COMMENTS_UNAVAILABLE = '本文评论不可用。';
exports.COMMENTS_SEND = '+ 发表评论';
exports.COMMENTS_LOADED = '以下为本章节的评论区。';
exports.COMMENTS_FAILED = '评论加载失败，请检查网络连接。';
exports.COMMENTS_RECENT_SECTION = '最新评论';
exports.COMMENTS_RECENT_LOADED = '以下是最新的五十条评论。';
exports.COMMENTS_MENTION_SECTION = '最新回复';
exports.COMMENTS_MENTION_LOADED = '以下是最新回复了您的评论。';
exports.COMMENTS_MENTION_NO_TOKEN_TITLE = '最新回复不可用';
exports.COMMENTS_MENTION_NO_TOKEN_DESC = '请至少发送了一条评论后再来查看。';
exports.COMMENTS_MENTION_REPLIED_TITLE = '回复成功';
exports.COMMENTS_MENTION_REPLIED_OK = '完成';
exports.COMMENTS_SUBMIT_BY = '由$发表于 ';
exports.COMMENTS_MODIFIED_DATE = '（最后修改于$）';
exports.COMMENTS_SENDING = '正在发表评论...';
exports.COMMENTS_DELETING = '正在删除评论...';
exports.COMMENTS_SEND_DISPLAY_NAME_0 = '将以';
exports.COMMENTS_SEND_DISPLAY_NAME_1 = '的身份发表评论。';
exports.COMMENTS_SEND_DISPLAY_NAME_EDIT = '点此修改';
exports.COMMENTS_DELETE = '删除评论';
exports.COMMENTS_REPLY = '回复';
exports.COMMENTS_DELETE_CONFIRMATION = '确定要删除这条评论吗？';
exports.COMMENTS_SEND_TITLE = '发表评论';
exports.COMMENTS_SEND_CONFIRM = '发表';
exports.COMMENTS_LOSE_EDITED_TITLE = '是否放弃编写的内容？';
exports.COMMENTS_LOSE_EDITED_CONFIRM = '放弃编写的内容';
exports.COMMENTS_LOSE_EDITED_CANCEL = '继续编辑';
exports.COMMENTS_SEND_HINT = '请填写评论内容。';
exports.COMMENTS_SEND_DISPLAY_NAME_PREFIX = '昵称（必填）：';
exports.COMMENTS_SEND_EMAIL_INPUT_PREFIX = '邮箱（可选）：';
exports.VISIT_COUNT_TITLE = '访问量统计';
exports.VISIT_COUNT_DESC_0 = '访问量统计信息由晶体图书馆访问统计系统提供。晶体图书馆访问统计系统是专门为本小说编写的高度重视隐私保护的，不记录任何个人信息的数据统计服务。其隐私政策可以在';
exports.VISIT_COUNT_DESC_1 = '这里';
exports.VISIT_COUNT_DESC_2 = '找到。';
exports.VISIT_COUNT_LOADING = '访问量加载中...';
exports.VISIT_COUNT_FAILED = '访问量加载失败，请检查网络连接。';
exports.VISIT_COUNT_LOAD_MORE = '加载更多';
exports.VISIT_COUNT_LOAD_MORE_LOADING = '加载中...';
exports.VISIT_COUNT_LOAD_MORE_FAILED = '加载失败，点此重试';
exports.VISIT_COUNT_TIME_FRAME_ALL = '所有';
exports.VISIT_COUNT_TIME_FRAME_HOUR = '1 小时内';
exports.VISIT_COUNT_TIME_FRAME_DAY = '24 小时内';
exports.VISIT_COUNT_TIME_FRAME_WEEK = '7 天内';
exports.VISIT_COUNT_TIME_FRAME_MONTH = '30 天内';
exports.VISIT_COUNT_TIME_FRAME_YEAR = '365 天内';
exports.VISIT_COUNT_DISPLAYING = '正在显示$的访问量：';
exports.VISIT_COUNT_TIMES = ' 次';
exports.NO_BLOCKED_USERS = '没有用户的评论被屏蔽';
exports.CLICK_TO_UNBLOCK = '(点击用户名以解除屏蔽)';
exports.WTCD_GAME_RESTART = '重置游戏';
exports.WTCD_GAME_RESTART_TITLE = '是否重置游戏种子';
exports.WTCD_GAME_RESTART_DESC = '游戏种子会决定游戏的随机因素。';
exports.WTCD_GAME_RESTART_ALL_DESC = '若选择【重置游戏种子与进度】，那么新游戏中的所有随机因素和本游戏不一致。';
exports.WTCD_GAME_RESTART_DECISION_ONLY_DESC = '若选择【仅重置进度】，那么新游戏中的随机因素将与本游戏完全一致。';
exports.WTCD_GAME_RESTART_ALL = '重置游戏种子与进度';
exports.WTCD_GAME_RESTART_DECISION_ONLY = '仅重置进度';
exports.WTCD_GAME_RESTART_CANCEL = '不重置任何内容';
exports.WTCD_GAME_RESTART_OK = '游戏重置成功';
exports.WTCD_GAME_SAVE = '存储';
exports.WTCD_GAME_SAVE_TITLE = '请选择要存储的位置';
exports.WTCD_GAME_SAVE_CANCEL = '取消';
exports.WTCD_GAME_SAVE_NEW = '- 新存档 -';
exports.WTCD_GAME_SAVE_OVERWRITE_TITLE = '是否覆盖？';
exports.WTCD_GAME_SAVE_OVERWRITE_CONFIRM = '确认覆盖';
exports.WTCD_GAME_SAVE_OVERWRITE_CANCEL = '取消';
exports.WTCD_GAME_SAVE_OK = '存储成功';
exports.WTCD_GAME_LOAD = '读取';
exports.WTCD_GAME_LOAD_TITLE = '请选择要读取的存档';
exports.WTCD_GAME_LOAD_CANCEL = '取消';
exports.WTCD_GAME_LOAD_QUICK = '快';
exports.WTCD_GAME_LOAD_OK = '读取成功';
exports.WTCD_GAME_QUICK_SAVE = '快速存储';
exports.WTCD_GAME_QUICK_SAVE_OK = '快速存储成功';
exports.WTCD_GAME_QUICK_LOAD = '快速读取';
exports.WTCD_GAME_QUICK_LOAD_OK = '快速读取成功';
exports.WTCD_GAME_QUICK_LOAD_NOT_EXIST = '没有可用的快速存档，请先使用【快速存储】来创建快速存档。';
exports.WTCD_GAME_QUICK_LOAD_CONFIRM_TITLE = '是否快速读取？';
exports.WTCD_GAME_QUICK_LOAD_CONFIRM_DESC = '这会丢失当前未保存的数据。（可在【设置】中禁用此确认）';
exports.WTCD_GAME_QUICK_LOAD_CONFIRM_CONFIRM = '确认读取';
exports.WTCD_GAME_QUICK_LOAD_CONFIRM_CANCEL = '取消';
exports.WTCD_GAME_NO_DESC = '无描述文本';
exports.WTCD_ERROR_COMPILE_TITLE = 'WTCD 编译失败';
exports.WTCD_ERROR_COMPILE_DESC = '该 WTCD 文档在编译时发生了错误。请检查是否有语法错误或是其他基本错误。';
exports.WTCD_ERROR_RUNTIME_TITLE = 'WTCD 运行时错误';
exports.WTCD_ERROR_RUNTIME_DESC = '该 WTCD 文档在运行时发生了错误。请检查是否有逻辑错误。';
exports.WTCD_ERROR_INTERNAL_TITLE = 'WTCD 内部错误';
exports.WTCD_ERROR_INTERNAL_DESC = 'WTCD 解释器在解释执行该 WTCD 文档时崩溃了。请务必告诉琳你做了什么好让她来修。';
exports.WTCD_ERROR_MESSAGE = '错误信息：';
exports.WTCD_ERROR_WTCD_STACK_TITLE = 'WTCD 调用栈';
exports.WTCD_ERROR_WTCD_STACK_DESC = 'WTCD 调用栈记录了在错误发生时 WTCD 的解释器状态。这可以帮助理解错误发生的上下文。';
exports.WTCD_ERROR_INTERNAL_STACK_TITLE = '内部调用栈';
exports.WTCD_ERROR_INTERNAL_STACK_DESC = '内部调用栈记录了出现该错误时编译器或是解释器的状态。请注意内部调用栈通常只在调试 WTCD 编译器或是解释器时有用。内部调用栈通常对调试 WTCD 文档没有作用。';
exports.WTCD_CANVAS_LOADING = '资源加载中... 取决于网络情况，这可能需要 1 秒 ~ 10 分钟。';
exports.GENERIC_SUCCESS_TITLE = '成功';
exports.GENERIC_SUCCESS_DESC = '操作已完成。';
exports.GENERIC_ERROR_TITLE = '错误';
exports.GENERIC_ERROR_DESC = '发生了错误。';
exports.GENERIC_LOADING_TITLE = '请稍后';
exports.GENERIC_LOADING_DESC = '正在加载...';
exports.GENERIC_HINT_TITLE = '提示';
exports.GENERIC_CONFIRM = '确认';
exports.GENERIC_CANCEL = '取消';
exports.GENERIC_CLOSE = '关闭';
exports.GENERIC_INTERNET_ERROR = '加载失败，请检查网络连接。';
exports.BACKEND_ERROR_NAME_DUPLICATED = '昵称已存在。如果您在此之前使用别的设备在晶体图书馆评论过，请将之前评论时自动生成的身份令牌复制到“设置” > “评论身份管理” > “身份令牌”。';
exports.BACKEND_ERROR_EMAIL_DUPLICATED = '邮箱已存在。如果您在此之前使用别的设备在晶体图书馆评论过，请将之前评论时自动生成的身份令牌复制到“设置” > “评论身份管理” > “身份令牌”。';
exports.BACKEND_ERROR_NAME_TOO_LONG = '昵称过长。';
exports.BACKEND_ERROR_EMAIL_TOO_LONG = '邮箱过长。';
exports.BACKEND_ERROR_EMAIL_INVALID = '邮箱格式不正确。晶体图书馆评论系统目前只接受常见的邮箱格式。如果您觉得您的邮箱格式并不罕见，请联系琳。';
exports.BACKEND_ERROR_COMMENT_TOO_LONG = '评论过长。';
exports.BACKEND_ERROR_TOKEN_INVALID = '令牌无效。';
exports.BACKEND_ERROR_NAME_TOO_SHORT = '昵称过短。';
exports.BACKEND_ERROR_COMMENT_TOO_SHORT = '评论过短。';
exports.BACKEND_ERROR_NAME_INVALID = '昵称格式不正确。请确保昵称中不包含控制字符。';
exports.BACKEND_ERROR_UNKNOWN = '发生了未知错误，请联系琳。';
exports.USER_TOKEN_CHANGE_EMPTY = '请输入身份令牌。';
exports.USER_TOKEN_CHANGE_INVALID = '身份令牌无效，请再次检查您输入的内容是否正确。';
exports.USER_TOKEN_CHANGE_CHECKING = '正在确认您的身份令牌...';
exports.USER_TOKEN_CHANGE_SUCCESS = '身份令牌设置成功';
exports.USER_TOKEN_CHANGE_TITLE = '修改身份令牌';
exports.USER_TOKEN_CHANGE_DESC = '这是您的身份令牌。\n使用身份令牌可以在晶体图书馆发表评论。\n当您第一次发表评论时，系统就会自动生成一个身份令牌。而后续发表的评论则会使用同一个令牌。\n您可以通过将这个令牌复制到别的电脑上来实现使用多台设备用一个身份回复。';
exports.USER_TOKEN_CHANGE_INPUT_LABEL = '令牌：';
exports.USER_TOKEN_DOES_NOT_EXIST = '您目前不持有身份令牌。请至少评论一次后再尝试。';
exports.USER_UPDATE_PROFILE_ERROR_NOT_INITIALIZED = '身份信息初始化失败，请刷新页面重试。';
exports.USER_UPDATE_PROFILE_TITLE = '修改身份信息';
exports.USER_UPDATE_PROFILE_DESC = '您可以在此修改您在使用评论系统时的身份信息。';
exports.USER_UPDATE_PROFILE_HINT_USER_NAME = '用户名决定他人如何在评论中 @ 您，不可修改。';
exports.USER_UPDATE_PROFILE_HINT_DISPLAY_NAME = '昵称是显示在您发表的每一条评论上的身份标识。';
exports.USER_UPDATE_PROFILE_HINT_EMAIL_0 = '邮箱用于加载头像；若要设置头像，请';
exports.USER_UPDATE_PROFILE_HINT_EMAIL_GRAVATAR_LINK = '点此转到 Gravatar';
exports.USER_UPDATE_PROFILE_HINT_EMAIL_1 = '，使用相同邮箱注册账号并上传头像；您的邮箱永远不会公开给其他用户。';
exports.USER_UPDATE_PROFILE_USER_NAME_INPUT_LABEL = '用户名：';
exports.USER_UPDATE_PROFILE_DISPLAY_NAME_INPUT_LABEL = '昵称：';
exports.USER_UPDATE_PROFILE_EMAIL_INPUT_LABEL = '邮箱：';
exports.USER_UPDATE_PROFILE_DISPLAY_NAME_EMPTY = '昵称不能为空。';
exports.USER_UPDATE_PROFILE_LOADING = '正在更新您的信息...';
exports.USER_UPDATE_PROFILE_SUCCESS = '信息更新成功！';
exports.AUTHOR_PAGE_WORKS = '作品列表';
exports.AUTHOR_PAGE_WORKS_DESC = '以下为$参与创作的作品。';
exports.AUTHOR_PAGE_AS = '作为';
exports.AUTHOR_PAGE_LINK = '链接';
exports.MIRROR_TITLE = '镜像站选择';
exports.MIRROR_DESC_0_NO_TOKEN = '请选择您要使用的镜像站。您的阅读历史和阅读器设置将不会被转移。';
exports.MIRROR_DESC_0 = '请选择您要使用的镜像站。您的评论身份将会被自动转移，但是阅读历史和阅读器设置将不会被转移。（转移后，您依然可以使用同样的身份在之前使用的站点评论。）';
exports.MIRROR_DESC_1 = '所有镜像站都是读者无偿提供的。如果好用，记得和提供者道一声谢哦。';
exports.MIRROR_URL = '网址：';
exports.MIRROR_PROVIDED_BY = '提供者：';
exports.MIRROR_TECHNOLOGY = '技术：';
exports.MIRROR_LANDING_INVALID_REFERRAL = '因为 referrer 错误，您的评论身份信息转移失败。';
exports.MIRROR_LANDING_SUCCESS_HINT = '评论身份转移成功';
exports.MIRROR_LANDING_CONFLICT_TITLE = '评论身份冲突';
exports.MIRROR_LANDING_CONFLICT_DESC = '您刚刚使用的站点请求修改本站的评论身份。但是您之前已经在本站评论过，且使用了不同的评论身份，请问您要？';
exports.MIRROR_LANDING_CONFLICT_OVERWRITE = '用刚刚使用的站点的评论身份覆盖本站的评论身份';
exports.MIRROR_LANDING_CONFLICT_KEEP = '保留本站的评论身份';

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mirrorSitesPlusMainSite = exports.mainSite = exports.mirrorSites = void 0;
exports.mirrorSites = [];
exports.mainSite = {
    name: '主站',
    origin: 'https://crystaltechstudio.github.io/Library',
    provider: 'Crystal Moling',
    technology: 'Github Pages',
};
exports.mirrorSitesPlusMainSite = [exports.mainSite, ...exports.mirrorSites];

},{}],15:[function(require,module,exports){
"use strict";
// ! NOTE: Redirects are only applied after the path fails to match
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirects = void 0;
exports.redirects = [
    input => input.replace(/^chapter\/人设卡\/(.*)$/, 'chapter/主线/人设卡/$1'),
    input => input.replace(/^chapter\/支线\/(.*)$/, 'chapter/$1'),
    input => input.replace(/^menus\/书目选择\/所有书目\/支线\/(.*)$/, 'menu/书目选择/所有书目/$1'),
    input => {
        if (input.startsWith('chapter/') && input.endsWith('.html') && !input.endsWith('第-1-章.html')) {
            return input.replace(/^(chapter\/.*)\.html$/, '$1/第-1-章.html');
        }
        else {
            return input;
        }
    },
];

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRolePriority = exports.rolePriorities = void 0;
exports.rolePriorities = new Map();
const rolesInOrder = [
    '作者',
    '画师',
    '编辑',
];
rolesInOrder.reverse().forEach((role, index) => exports.rolePriorities.set(role, index));
function getRolePriority(role) {
    var _a;
    return (_a = exports.rolePriorities.get(role)) !== null && _a !== void 0 ? _a : -1;
}
exports.getRolePriority = getRolePriority;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylePreviewArticle = void 0;
exports.stylePreviewArticle = `<h1>测试用样例文本</h1>
<p>山性分里团决报织前流重干同今，三高格定程详克葡旷磨行。 具通接变里步群山速织适工，气人力年信料三利原历，说目流二专足称层杏。 <a href="#/menu/阅读器样式">自千有进十列证它子指</a>，想体志变建选转来，王他投询时线果。 运酸论一话目各员，听于指使身律它备，统色统维段当。 色权我克相料必每确候存，动分头越安则特交山往消，十增李霸佣包旷列旷。 <strong>象队酸族各了且适究候知自</strong>，非什消单弦严求园此。</p>
<ul>
<li>应学看张你，很消程，保隶验。</li>
<li>利变马展长间亲，类认六江易联，<a href="#/menu/阅读器样式">老般及现安应</a>，治入员奋。</li>
<li>单可便叫不住般百飞分万地，维信发生平布资交决基，安手容属实每还音。</li>
</ul>
<p>清义然从容主层，光斗则流专类保，九都商管。</p>
<p>料指第接还专称感织，现技号号我平己连，了县葬辆邮资。 事步须被该，门音总示证委主，压该入按基。</p>
<p>周走拉局数米状市越争其，治千认定具置共构须积，及见五提民投材吹。 政我照说长论易期又，离处你基丽事收。</p>
<table>
<thead>
<tr>
<th>会且广受制下东业</th>
<th>重至图院五正况</th>
<th>决述什叫</th>
</tr>
</thead>
<tbody>
<tr>
<td>给变面些列取效想根织压</td>
<td>取流支养世都严数任花切</td>
<td>已劳作会励动批规</td>
</tr>
<tr>
<td>权步成断飞适研强</td>
<td>响起前程置同</td>
<td>目验质小还</td>
</tr>
<tr>
<td>目业农同美高说运</td>
<td>研日询私构</td>
<td>罐报盛方在</td>
</tr>
</tbody>
</table>
<p>铁看联增议上能题商，强龙技使克多改题具。 教无面选学对联设说叫，历身示所见保总委九意，间高孤精克些家。</p>
<p>不层派离约系，样第应民观，与两清。</p>
<p>马时他心的红在少加，强接思王向组影，得意村小精数。 阶相全型改外实阶义关，保品连半越江样提群局，酸结届万即铁传苗。</p>
<p><a href="#/menu/阅读器样式">别干造过养状元外</a>，土面那报极火，理者杨精运长。 大观内又商流力火争学必着，每们军说是查称识场度带，他先写基陕率秧质一。 <em>县象好件周取单计四查叫极</em>，支水传据日们千走际社，名去直世建满孟陕除。 证而当阶较有别查且程有，家线最统打题问整约中，<strong>手战管论吩位周可</strong>。</p>
<p>亲就离标线参细接，<strong>至是进白路七第</strong>，空村七该。 真和从大市我，运该可热速时，先极进业承。 还快正难天听铁直节府消，深向青律向按事点外可群，公增届太赚孝因盛切。 小安术任历形矿，下为使济者议元，传两满化葬。 两进了今切名际事，如多人问离术时节，空居茅低连。</p>
<p>圆治号非江商你明山什，斯后民许之该白机量，两说杨孟励雪。 小据置选论性成政群始该重易，题认指山带文励百铁乱压。 金调连委义场院收员，包干数起格起验，增众医义些情园。 后没或由物长海至，被农色由可建起，界求张听线。</p>
<p>革少已感主题布进，及生组天规东程总，飞层毛边只但孤，象小求标验。</p>
<p>包高她过级定史省少前发议，步资志十图气小己点头做，切叫水县度油更看张。</p>
<p>例会造值面象油会太例，府现阶出低对名边心往，层里更县材周分志。 强不共支常类并决，音他展斗色除片着，照苍清此例。 酸济图将般确头最治选，近行新总青切府权，解安呜定空小。</p>
<p>战经确委件用以却求角除问，它之需装化隶三长身按。</p>
<p>用金转后每状立细文历市，<a href="#/menu/阅读器样式">多马过清中入带表已与</a>，点极日解型苍除坝。 书由四思门始号山存，界林了开此们断，容周回林时秃。 科料装四农千把心根下受，色离与改元切指该高，制水增称多坟。 而多天直引图理电别亲二引，红什事战场没解议情，深结道知批历被象。 <strong>变各育完走发加工基，象斯导角太要眼受习，容束法他苍块命。</strong> 引数安儿放能设片面，为世都时个照济，已周队数成空。 天没书少领精生济，位用求旷极。</p>`;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thanks = void 0;
exports.thanks = [
    { name: 'Crystal-Moling', link: 'https://github.com/Crystal-Moling' },
    { name: 'justcurse', link: 'https://github.com/justcurse' },
].sort(() => Math.random() - 0.5);

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonoDimensionTransitionControl = void 0;
function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}
function solveQuad(a, b, c) {
    const D = (b ** 2) - 4 * a * c;
    return (-b + sign(a) * (D ** 0.5)) / (2 * a);
}
class MonoDimensionTransitionControl {
    constructor(
    /** Initial value */
    lastValue, accelerationPerSecSq) {
        this.lastValue = lastValue;
        /** Start time of the current transition */
        this.initialTime = 0;
        /** Time when the acceleration is reversed of the current transition */
        this.reverseTime = 0;
        /** Value when the acceleration is reversed of the current transition */
        this.reverseValue = 0;
        /** Velocity when the acceleration is reversed of the current transition */
        this.reverseVelocity = 0;
        /** Start velocity of the current transition */
        this.lastStartingVelocity = 0;
        /** Time when the current transition is finished */
        this.finalTime = 0;
        /** Target value of the current transition */
        this.finalValue = 0;
        /** Acceleration in unit per ms */
        this.acceleration = 0;
        this.finalValue = lastValue;
        this.acceleration = accelerationPerSecSq / 1000 / 1000;
    }
    setTarget(targetValue) {
        this.lastValue = this.getValue();
        const x = targetValue - this.lastValue;
        if (x === 0) {
            return;
        }
        const now = Date.now();
        const v = this.getVelocity(now);
        // Find a solution for reverse time
        let t = solveQuad(this.acceleration, 2 * v, 0.5 * (v ** 2) / this.acceleration - x);
        if (Number.isNaN(t) || t < 0) {
            // If a reverse time cannot be found with current sign of acceleration, try again with the opposite of acceleration
            this.acceleration = -this.acceleration;
            t = solveQuad(this.acceleration, 2 * v, 0.5 * (v ** 2) / this.acceleration - x);
        }
        const a = this.acceleration;
        this.initialTime = now;
        this.reverseTime = this.initialTime + t;
        this.reverseValue = this.lastValue + 0.5 * a * (t ** 2) + v * t;
        this.reverseVelocity = v + a * t;
        this.finalTime = this.reverseTime + t + v / a;
        this.lastStartingVelocity = v;
        this.finalValue = targetValue;
    }
    getVelocity(now = Date.now()) {
        return now < this.reverseTime
            ? this.lastStartingVelocity + (now - this.initialTime) * this.acceleration
            : now < this.finalTime
                ? this.lastStartingVelocity + (2 * this.reverseTime - this.initialTime - now) * this.acceleration
                : 0;
    }
    getValue(now = Date.now()) {
        if (now < this.reverseTime) {
            const t = now - this.initialTime;
            return this.lastValue + 0.5 * this.acceleration * (t ** 2) + this.lastStartingVelocity * t;
        }
        else if (now < this.finalTime) {
            const t = now - this.reverseTime;
            return this.reverseValue - 0.5 * this.acceleration * (t ** 2) + this.reverseVelocity * t;
        }
        else {
            return this.finalValue;
        }
    }
    isFinished(now = Date.now()) {
        return now >= this.finalTime;
    }
}
exports.MonoDimensionTransitionControl = MonoDimensionTransitionControl;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backendControl_1 = require("./backendControl");
const AutoCache_1 = require("../data/AutoCache");
const DebugLogger_1 = require("../DebugLogger");
const chapterControl_1 = require("./chapterControl");
// 统计系统
// 本系统服务端开源，并且不收集任何个人信息。
// 其存在目的仅仅是为了让琳知道有多少读者在看，以满足她的虚荣心。
//
// 服务端源代码：https://github.com/SCLeoX/wt_analytics
const analyticsCache = new AutoCache_1.AutoCache(relativePath => {
    return fetch(backendControl_1.backendUrl + '/stats/count', {
        method: 'POST',
        body: relativePath,
    });
}, new DebugLogger_1.DebugLogger('Analytics Cache'));
chapterControl_1.loadChapterEvent.on((chapterRelativePath) => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return;
    }
    const startPageSpecifier = window.location.hash.split('~')[0]; // Remove arguments
    // Wait for 5 seconds in order to confirm the user is still reading the same
    // chapter.
    setTimeout(() => {
        if (startPageSpecifier !== window.location.hash.split('~')[0]) {
            return;
        }
        analyticsCache.get(chapterRelativePath);
    }, 5000);
});

},{"../DebugLogger":9,"../data/AutoCache":39,"./backendControl":21,"./chapterControl":22}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDeleteComment = exports.fetchRegister = exports.fetchSendComment = exports.fetchGetRecentMentionedComments = exports.fetchGetRecentComments = exports.fetchGetChapterComments = exports.fetchUpdateProfile = exports.fetchInit = exports.getErrorMessage = exports.ErrorCode = exports.backendUrl = void 0;
const messages_1 = require("../constant/messages");
exports.backendUrl = 'https://wtb.tepis.me';
// export const backendUrl = 'http://127.0.0.1:8088';
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["NAME_DUPLICATED"] = 1] = "NAME_DUPLICATED";
    ErrorCode[ErrorCode["EMAIL_DUPLICATED"] = 2] = "EMAIL_DUPLICATED";
    ErrorCode[ErrorCode["NAME_TOO_LONG"] = 3] = "NAME_TOO_LONG";
    ErrorCode[ErrorCode["EMAIL_TOO_LONG"] = 4] = "EMAIL_TOO_LONG";
    ErrorCode[ErrorCode["EMAIL_INVALID"] = 5] = "EMAIL_INVALID";
    ErrorCode[ErrorCode["COMMENT_TOO_LONG"] = 6] = "COMMENT_TOO_LONG";
    ErrorCode[ErrorCode["TOKEN_INVALID"] = 7] = "TOKEN_INVALID";
    ErrorCode[ErrorCode["NAME_TOO_SHORT"] = 8] = "NAME_TOO_SHORT";
    ErrorCode[ErrorCode["COMMENT_TOO_SHORT"] = 9] = "COMMENT_TOO_SHORT";
    ErrorCode[ErrorCode["NAME_INVALID"] = 10] = "NAME_INVALID";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case ErrorCode.NAME_DUPLICATED:
            return messages_1.BACKEND_ERROR_NAME_DUPLICATED;
        case ErrorCode.EMAIL_DUPLICATED:
            return messages_1.BACKEND_ERROR_EMAIL_DUPLICATED;
        case ErrorCode.NAME_TOO_LONG:
            return messages_1.BACKEND_ERROR_NAME_TOO_LONG;
        case ErrorCode.EMAIL_TOO_LONG:
            return messages_1.BACKEND_ERROR_EMAIL_TOO_LONG;
        case ErrorCode.EMAIL_INVALID:
            return messages_1.BACKEND_ERROR_EMAIL_INVALID;
        case ErrorCode.COMMENT_TOO_LONG:
            return messages_1.BACKEND_ERROR_COMMENT_TOO_LONG;
        case ErrorCode.TOKEN_INVALID:
            return messages_1.BACKEND_ERROR_TOKEN_INVALID;
        case ErrorCode.NAME_TOO_SHORT:
            return messages_1.BACKEND_ERROR_NAME_TOO_SHORT;
        case ErrorCode.COMMENT_TOO_SHORT:
            return messages_1.BACKEND_ERROR_COMMENT_TOO_SHORT;
        case ErrorCode.NAME_INVALID:
            return messages_1.BACKEND_ERROR_NAME_INVALID;
        default:
            return messages_1.BACKEND_ERROR_UNKNOWN;
    }
}
exports.getErrorMessage = getErrorMessage;
function fetchInit(token) {
    return fetch(`${exports.backendUrl}/user/init`, {
        cache: 'no-cache',
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ token }),
    }).then(response => response.json());
}
exports.fetchInit = fetchInit;
function fetchUpdateProfile(token, displayName, email) {
    return fetch(`${exports.backendUrl}/user/updateProfile`, {
        cache: 'no-cache',
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ token, display_name: displayName, email }),
    }).then(response => response.json());
}
exports.fetchUpdateProfile = fetchUpdateProfile;
function fetchGetChapterComments(pageName) {
    return fetch(`${exports.backendUrl}/comment/getChapter?relative_path=${pageName}`, {
        cache: 'no-cache',
        method: 'GET',
    }).then(response => response.json());
}
exports.fetchGetChapterComments = fetchGetChapterComments;
function fetchGetRecentComments() {
    return fetch(`${exports.backendUrl}/comment/getRecent`, {
        cache: 'no-cache',
        method: 'GET',
    }).then(response => response.json());
}
exports.fetchGetRecentComments = fetchGetRecentComments;
function fetchGetRecentMentionedComments(token) {
    if (token === undefined) {
        return Promise.resolve([]);
    }
    return fetch(`${exports.backendUrl}/comment/getRecentMentioned`, {
        cache: 'no-cache',
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ token }),
    }).then(response => response.json());
}
exports.fetchGetRecentMentionedComments = fetchGetRecentMentionedComments;
function fetchSendComment(token, pageName, content) {
    return fetch(`${exports.backendUrl}/comment/send`, {
        cache: 'no-cache',
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            token,
            relative_path: pageName,
            content,
        }),
    }).then(response => response.json());
}
exports.fetchSendComment = fetchSendComment;
function fetchRegister(displayName, email) {
    return fetch(`${exports.backendUrl}/user/register`, {
        cache: 'no-cache',
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            display_name: displayName,
            email,
        }),
    }).then(response => response.json());
}
exports.fetchRegister = fetchRegister;
function fetchDeleteComment(token, commentId) {
    return fetch(`${exports.backendUrl}/comment/delete`, {
        cache: 'no-cache',
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            token,
            comment_id: commentId,
        }),
    }).then(() => undefined);
}
exports.fetchDeleteComment = fetchDeleteComment;

},{"../constant/messages":13}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterPathHandler = exports.ErrorType = exports.canChapterShown = exports.loadChapterEvent = void 0;
const _e_1 = require("../$e");
const messages_1 = require("../constant/messages");
const AutoCache_1 = require("../data/AutoCache");
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const readingProgress_1 = require("../data/readingProgress");
const settings_1 = require("../data/settings");
const DebugLogger_1 = require("../DebugLogger");
const Event_1 = require("../Event");
const hs_1 = require("../hs");
const gestures_1 = require("../input/gestures");
const keyboard_1 = require("../input/keyboard");
const DOM_1 = require("../util/DOM");
const formatRelativePath_1 = require("../util/formatRelativePath");
const string_1 = require("../util/string");
const tag_1 = require("../util/tag");
const throttle_1 = require("../util/throttle");
const urlArguments_1 = require("../util/urlArguments");
const pushHelper_1 = require("./pushHelper");
const commentsControl_1 = require("./commentsControl");
const contentControl_1 = require("./contentControl");
const followQuery_1 = require("./followQuery");
const layoutControl_1 = require("./layoutControl");
const menuControl_1 = require("./menuControl");
const modalControl_1 = require("./modalControl");
const navbarControl_1 = require("./navbarControl");
const processElements_1 = require("./processElements");
const preloaderBlock_1 = require("./preloaderBlock");
const debugLogger = new DebugLogger_1.DebugLogger('Chapter Control');
exports.loadChapterEvent = new Event_1.Event();
/** This is only used for determining the direction of animation when changing chapter. */
let lastChapterCtx = null;
const select = (textNodes, [anchorNodeIndex, anchorOffset, focusNodeIndex, focusOffset,]) => {
    const anchorNode = textNodes[anchorNodeIndex];
    const focusNode = textNodes[focusNodeIndex];
    if (anchorNode === undefined || focusNode === undefined) {
        return;
    }
    document.getSelection().setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    const element = anchorNode.parentElement;
    if (element !== null && (typeof element.scrollIntoView) === 'function') {
        element.scrollIntoView();
    }
};
function canChapterShown(chapter) {
    return (settings_1.earlyAccess.getValue() || !chapter.isEarlyAccess)
        && (!chapter.hidden)
        && (settings_1.showAbandonedChapters.getValue() || !chapter.abandoned);
}
exports.canChapterShown = canChapterShown;
function findNextChapter(chapterCtx) {
    const index = chapterCtx.inFolderIndex;
    const folderChapters = chapterCtx.folder.children;
    for (let i = index + 1; i < folderChapters.length; i++) {
        const child = folderChapters[i];
        if (child.type !== 'folder' && canChapterShown(child)) {
            return child;
        }
    }
    return null;
}
function findPreviousChapter(chapterCtx) {
    const index = chapterCtx.inFolderIndex;
    const folderChapters = chapterCtx.folder.children;
    for (let i = index - 1; i >= 0; i--) {
        const child = folderChapters[i];
        if (child.type !== 'folder' && canChapterShown(child)) {
            return child;
        }
    }
    return null;
}
function getChapterRelativeLink(chapter) {
    return `${window.location.pathname}#/chapter/${chapter.htmlRelativePath}`;
}
function navigateToChapter(chapter) {
    window.location.href = getChapterRelativeLink(chapter);
}
const chaptersCache = new AutoCache_1.AutoCache(chapterHtmlRelativePath => {
    const url = `./chapters/${chapterHtmlRelativePath}`;
    debugLogger.log(`Loading chapter from ${url}.`);
    return fetch(url).then(response => response.text());
}, new DebugLogger_1.DebugLogger('Chapters Cache'));
function updateNavbar(htmlRelativePath) {
    (0, navbarControl_1.setNavbarPath)([
        {
            display: '所有书目',
            hash: '#/menu/书目选择/所有书目',
        },
        ...htmlRelativePath.split('/').map((segment, index, split) => {
            segment = segment.replace(/-/g, ' ');
            if (index === split.length - 1) {
                // Last element
                return {
                    display: (0, string_1.removePotentialSuffix)(segment, '.html'),
                    hash: null,
                };
            }
            else {
                return {
                    display: segment,
                    hash: `#/menu/书目选择/所有书目/${split.slice(0, index + 1).join('/')}`,
                };
            }
        })
    ]);
}
function addAuthorsInfoBlock(content, chapter) {
    if (chapter.authors.length > 0) {
        const $authorsDiv = (0, hs_1.h)('.authors', (0, hs_1.h)('h3', '本文作者'), (0, hs_1.h)('.outer-container', ...chapter.authors.map(authorRole => {
            var _a;
            const authorInfo = (_a = data_1.authorInfoMap.get(authorRole.name)) !== null && _a !== void 0 ? _a : {
                name: authorRole.name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorRole.name)}`,
            };
            return (0, hs_1.h)('.author-container', {
                onclick: () => {
                    window.history.pushState(null, document.title, (0, hrefs_1.pageHref)(`author/${authorInfo.name}`));
                    (0, followQuery_1.followQuery)();
                },
            }, (0, hs_1.h)('img.avatar', {
                src: authorInfo.avatar,
            }), (0, hs_1.h)('.author-role-container', (0, hs_1.h)('.role', authorRole.role), (0, hs_1.h)('.name', authorInfo.name)));
        }), (0, hs_1.h)('.reprint', {
            href: '#',
            onclick: ((event) => {
                event.preventDefault();
                const modal = new modalControl_1.Modal((0, hs_1.h)('div', (0, hs_1.h)('h1', '转载须知'), (0, hs_1.h)('p', '晶体图书馆内所有文章均以 ', (0, hs_1.h)('a.regular', {
                    target: '_blank',
                    href: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
                    rel: 'noopener noreferrer',
                }, 'CC BY-NC-ND 4.0'), ' 协议发布。转载时请注明以下信息：'), (0, hs_1.h)('pre.wrapping', (0, hs_1.h)('code', '本文内容摘自晶体图书馆（https://crystaltechstudio.github.io/Library）。' +
                    chapter.authors.map(authorInfo => authorInfo.role + '：' + authorInfo.name).join('，') +
                    '。本文以 CC BY-NC-ND 4.0 协议发布，转载请注明上述所有信息。')), (0, hs_1.h)('.button-container', [
                    (0, hs_1.h)('div', {
                        onclick: () => {
                            modal.close();
                        },
                    }, '我知道了'),
                ])));
                modal.setDismissible();
                modal.open();
            }),
        }, (0, hs_1.h)('div', '转载须知'))));
        content.addBlock({ initElement: $authorsDiv, side: contentControl_1.ContentBlockSide.LEFT });
    }
}
function addTagInfoBlock(content, chapter) {
    if (chapter.tags !== undefined) {
        content.addBlock({
            initElement: ((0, _e_1.$e)("div", { className: 'tags' },
                (0, _e_1.$e)("h3", null, "\u672C\u6587\u6807\u7B7E"),
                chapter.tags.map(tag => ((0, _e_1.$e)("a", { href: (0, hrefs_1.tagSearchHref)(tag) }, (0, tag_1.tagSpan)(tag, false)))))),
            side: contentControl_1.ContentBlockSide.LEFT,
        });
    }
    else if (!chapter.htmlRelativePath.includes('META')) {
        content.addBlock({
            initElement: ((0, _e_1.$e)("div", null,
                (0, _e_1.$e)("h3", null, "\u672C\u6587\u6807\u7B7E\u7F3A\u5931"),
                (0, _e_1.$e)("p", null, "\u672C\u6587\u76EE\u524D\u6CA1\u6709\u6807\u7B7E\u3002"))),
            side: contentControl_1.ContentBlockSide.LEFT,
        });
    }
}
function loadChapter(chapterHtmlRelativePath, selection, side = contentControl_1.Side.LEFT) {
    debugLogger.log('Load chapter', chapterHtmlRelativePath, 'with selection', selection);
    exports.loadChapterEvent.emit(chapterHtmlRelativePath);
    const chapterCtx = data_1.relativePathLookUpMap.get(chapterHtmlRelativePath);
    lastChapterCtx = chapterCtx;
    document.title = (0, formatRelativePath_1.formatRelativePath)(chapterHtmlRelativePath) + ' - 晶体图书馆';
    window.history.replaceState(null, document.title);
    updateNavbar(chapterHtmlRelativePath);
    const content = (0, contentControl_1.newContent)(side);
    maybeAddEarlyAccessWarning(chapterCtx, content);
    maybeAddAbandonedWarning(chapterCtx, content);
    maybeAddDevelopDocWarning(chapterCtx, content);
    const loadingBlock = (0, preloaderBlock_1.addPreloaderBlock)(content);
    (0, layoutControl_1.setLayout)(layoutControl_1.Layout.MAIN);
    function loadPrevChapter() {
        const previousChapter = findPreviousChapter(chapterCtx);
        if (previousChapter !== null) {
            navigateToChapter(previousChapter);
        }
    }
    function loadNextChapter() {
        const nextChapter = findNextChapter(chapterCtx);
        if (nextChapter !== null) {
            navigateToChapter(nextChapter);
        }
    }
    registerSwipeEvents(loadPrevChapter, loadNextChapter, content);
    registerArrowKeyEvents(loadPrevChapter, loadNextChapter, content);
    attachEscapeEvent(content);
    chaptersCache.get(chapterHtmlRelativePath).then(text => {
        if (content.isDestroyed) {
            debugLogger.log('Chapter loaded, but abandoned since the original ' +
                'content page is already destroyed.');
            return;
        }
        debugLogger.log('Chapter loaded.');
        loadingBlock.directRemove();
        content.appendLeftSideContainer();
        const mainBlock = insertContent(content, text, chapterCtx.chapter);
        const postMainBlock = mainBlock !== null && mainBlock !== void 0 ? mainBlock : content.addBlock();
        content.appendRightSideContainer();
        addAuthorsInfoBlock(content, chapterCtx.chapter);
        addTagInfoBlock(content, chapterCtx.chapter);
        (0, pushHelper_1.addPushHelperBlock)(content, chapterCtx.chapter);
        const textNodes = (0, DOM_1.getTextNodes)(postMainBlock.element);
        restoreSelections(selection, textNodes);
        registerSelectionChangeListener(textNodes, content);
        addPageSwitcherBlock(chapterCtx, postMainBlock);
        startUpdatingProgressBar(mainBlock, content, chapterCtx);
        // Re-focus the rect so it is arrow-scrollable
        setTimeout(() => {
            (0, contentControl_1.focus)();
        }, 1);
        (0, commentsControl_1.loadChapterComments)(chapterCtx, content);
    }).catch(error => {
        debugLogger.error(`Failed to load chapter.`, error);
        loadingBlock.element.innerText = messages_1.CHAPTER_FAILED;
    });
}
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["COMPILE"] = 0] = "COMPILE";
    ErrorType[ErrorType["RUNTIME"] = 1] = "RUNTIME";
    ErrorType[ErrorType["INTERNAL"] = 2] = "INTERNAL";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
function registerSelectionChangeListener(textNodes, content) {
    const selectionChangeListener = getSelectionChangeListener(textNodes);
    document.addEventListener('selectionchange', selectionChangeListener);
    content.leavingEvent.once(() => {
        document.removeEventListener('selectionchange', selectionChangeListener);
    });
}
function restoreSelections(selection, textNodes) {
    if (selection !== undefined) {
        if ((0, DOM_1.id)('warning') === null) {
            select(textNodes, selection);
        }
        else {
            (0, DOM_1.id)('warning').addEventListener('click', () => {
                select(textNodes, selection);
            });
        }
    }
}
function maybeAddAbandonedWarning(chapterCtx, content) {
    if (chapterCtx.chapter.abandoned) {
        content.addBlock({
            initElement: ((0, _e_1.$e)("div", null,
                (0, _e_1.$e)("h1", null, "\u5F03\u5751\u8B66\u544A"),
                (0, _e_1.$e)("p", null, "\u672C\u6587\u4F5C\u8005\u5DF2\u5F03\u5751\uFF0C\u6587\u7AE0\u5185\u5BB9\u5E76\u4E0D\u5B8C\u6574\u3002"))),
            style: contentControl_1.ContentBlockStyle.WARNING,
        });
    }
}
function maybeAddEarlyAccessWarning(chapterCtx, content) {
    if (chapterCtx.chapter.isEarlyAccess) {
        content.addBlock({
            initElement: ((0, _e_1.$e)("div", null,
                (0, _e_1.$e)("h1", null, "\u7F16\u5199\u4E2D\u7AE0\u8282"),
                (0, _e_1.$e)("p", null, "\u8BF7\u6CE8\u610F\uFF0C\u672C\u6587\u6B63\u5728\u7F16\u5199\u4E2D\uFF0C\u56E0\u6B64\u53EF\u80FD\u4F1A\u542B\u6709\u672A\u5B8C\u6210\u7684\u53E5\u5B50\u6216\u662F\u5C1A\u672A\u66F4\u65B0\u7684\u4FE1\u606F\u3002"))),
            style: contentControl_1.ContentBlockStyle.WARNING,
        });
    }
}
function maybeAddDevelopDocWarning(chapterCtx, content) {
    if (chapterCtx.chapter.htmlRelativePath.startsWith('开发文档留档/')) {
        content.addBlock({
            initElement: ((0, _e_1.$e)("div", null,
                (0, _e_1.$e)("h1", null, "\u672C\u6587\u662F\u5F00\u53D1\u6587\u6863\u7684\u7559\u6863"),
                (0, _e_1.$e)("p", null, "\u8BF7\u6CE8\u610F\uFF0C\u7559\u6863\u4E3A\u539F\u5F00\u53D1\u6587\u6863\u7684\u955C\u50CF\uFF0C\u53EF\u80FD\u65E0\u6CD5\u53CA\u65F6\u66F4\u65B0\uFF0C\u8BF7\u4EE5\u5B98\u65B9\u6587\u6863\u4E3A\u4E3B\u3002"))),
            style: contentControl_1.ContentBlockStyle.WARNING,
        });
        if (chapterCtx.chapter.translated) {
            content.addBlock({
                initElement: ((0, _e_1.$e)("div", null,
                    (0, _e_1.$e)("p", null, "\u8BE5\u6587\u6863\u5DF2\u57FA\u4E8E\u539F\u6587\u6863\u7684\u57FA\u7840\u7FFB\u8BD1\u5B8C\u6210\u3002"))),
                style: contentControl_1.ContentBlockStyle.WARNING,
            });
        }
    }
}
function addPageSwitcherBlock(chapterCtx, postMainBlock) {
    const prevChapter = findPreviousChapter(chapterCtx);
    const nextChapter = findNextChapter(chapterCtx);
    postMainBlock.element.appendChild((0, hs_1.h)('div.page-switcher', [
        // 上一章
        (prevChapter !== null)
            ? (0, hs_1.h)('a', {
                href: getChapterRelativeLink(prevChapter),
            }, messages_1.PREVIOUS_CHAPTER)
            : null,
        // 返回菜单
        (0, hs_1.h)('a', {
            href: window.location.pathname,
            onclick: (event) => {
                event.preventDefault();
                (0, menuControl_1.enterMenuMode)();
            },
        }, messages_1.GO_TO_MENU),
        // 下一章
        (nextChapter !== null)
            ? (0, hs_1.h)('a', {
                href: getChapterRelativeLink(nextChapter),
            }, messages_1.NEXT_CHAPTER)
            : null,
    ]));
}
function startUpdatingProgressBar(mainBlock, content, chapterCtx) {
    if (mainBlock !== undefined) {
        const updateProgress = (0, throttle_1.smartThrottle)(() => {
            const scrollableRange = mainBlock.element.clientHeight - content.$element.clientHeight;
            let progress;
            if (scrollableRange > 0) {
                progress = (content.$element.scrollTop - mainBlock.element.offsetTop) / scrollableRange;
            }
            else {
                progress = (content.$element.scrollTop + content.$element.clientHeight) > (mainBlock.element.offsetTop + mainBlock.element.clientHeight) ? 1 : 0;
            }
            progress = Math.min(progress, 1);
            progress = Math.max(progress, 0);
            (0, navbarControl_1.setProgressIndicator)(progress);
            (0, readingProgress_1.updateChapterProgress)(chapterCtx.chapter.htmlRelativePath, progress)
                .catch(error => debugLogger.warn(`Failed to save chapter progress for ${chapterCtx.chapter.htmlRelativePath}:`, error));
        }, 100);
        content.scrollEvent.on(() => {
            updateProgress();
        });
        content.leavingEvent.on(() => {
            (0, navbarControl_1.resetProgressIndicator)();
        });
    }
}
function getSelectionChangeListener(textNodes) {
    return (0, throttle_1.smartThrottle)(() => {
        const selection = document.getSelection();
        const urlArguments = new Map();
        if (selection !== null) {
            const anchor = ((selection.anchorNode instanceof HTMLElement)
                ? selection.anchorNode.firstChild
                : selection.anchorNode);
            const anchorNodeIndex = textNodes.indexOf(anchor);
            const focus = ((selection.focusNode instanceof HTMLElement)
                ? selection.focusNode.firstChild
                : selection.focusNode);
            const focusNodeIndex = textNodes.indexOf(focus);
            if ((anchorNodeIndex !== -1) && (focusNodeIndex !== -1) &&
                !(anchorNodeIndex === focusNodeIndex && selection.anchorOffset === selection.focusOffset)) {
                if ((anchorNodeIndex < focusNodeIndex) ||
                    (anchorNodeIndex === focusNodeIndex && selection.anchorOffset < selection.focusOffset)) {
                    urlArguments.set('selection', `${anchorNodeIndex},${selection.anchorOffset},${focusNodeIndex},${selection.focusOffset}`);
                }
                else {
                    urlArguments.set('selection', `${focusNodeIndex},${selection.focusOffset},${anchorNodeIndex},${selection.anchorOffset}`);
                }
            }
        }
        (0, urlArguments_1.resetUrlArgumentsTo)(urlArguments);
    }, 250);
}
function attachEscapeEvent(content) {
    keyboard_1.escapeKeyPressEvent.onUntil(() => {
        if ((0, modalControl_1.isAnyModalOpened)()) {
            return;
        }
        (0, menuControl_1.enterMenuMode)();
    }, content.leavingEvent);
}
function registerArrowKeyEvents(loadPrevChapter, loadNextChapter, content) {
    keyboard_1.arrowKeyPressEvent.onUntil(arrowKey => {
        if ((0, modalControl_1.isAnyModalOpened)()) {
            return;
        }
        if (arrowKey === keyboard_1.ArrowKey.LEFT) {
            loadPrevChapter();
        }
        else if (arrowKey === keyboard_1.ArrowKey.RIGHT) {
            loadNextChapter();
        }
    }, content.leavingEvent);
}
function registerSwipeEvents(loadPrevChapter, loadNextChapter, content) {
    gestures_1.swipeEvent.onUntil(direction => {
        if (!settings_1.gestureSwitchChapter.getValue()) {
            return;
        }
        if ((0, modalControl_1.isAnyModalOpened)()) {
            return;
        }
        if (direction === gestures_1.SwipeDirection.TO_RIGHT) {
            // 上一章
            loadPrevChapter();
        }
        else if (direction === gestures_1.SwipeDirection.TO_LEFT) {
            // 下一章
            loadNextChapter();
        }
    }, content.leavingEvent);
}
function insertContent(content, text, chapter) {
    switch (chapter.type) {
        case 'Markdown':
            return loadMarkdown(content, text);
    }
}
function loadMarkdown(content, text) {
    const block = content.addBlock();
    block.element.innerHTML = text;
    (0, processElements_1.processElements)(block.element);
    return block;
}
function followQueryToChapter(relativePath, args) {
    const chapterCtx = data_1.relativePathLookUpMap.get(relativePath);
    if (chapterCtx === undefined) {
        // Cannot find chapter
        return false;
    }
    const side = (lastChapterCtx !== null &&
        chapterCtx.inFolderIndex < lastChapterCtx.inFolderIndex) ? contentControl_1.Side.LEFT : contentControl_1.Side.RIGHT;
    const selection = args.has('selection')
        ? args.get('selection').split(',').map(str => +str)
        : [];
    if (selection.length !== 4 || !selection.every(num => (num >= 0) && (num % 1 === 0) && (!Number.isNaN(num)) && (Number.isFinite(num)))) {
        loadChapter(relativePath, undefined, side);
    }
    else {
        loadChapter(relativePath, selection, side);
    }
    return true;
}
function chapterPathHandler(path, args) {
    const handled = followQueryToChapter(path, args);
    return handled;
}
exports.chapterPathHandler = chapterPathHandler;

},{"../$e":8,"../DebugLogger":9,"../Event":10,"../constant/messages":13,"../data/AutoCache":39,"../data/data":40,"../data/hrefs":42,"../data/readingProgress":43,"../data/settings":44,"../hs":45,"../input/gestures":47,"../input/keyboard":48,"../util/DOM":62,"../util/formatRelativePath":65,"../util/string":70,"../util/tag":72,"../util/throttle":73,"../util/urlArguments":74,"./commentsControl":23,"./contentControl":24,"./followQuery":25,"./layoutControl":27,"./menuControl":28,"./modalControl":30,"./navbarControl":31,"./preloaderBlock":34,"./processElements":35,"./pushHelper":36}],23:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRecentMentions = exports.loadRecentComments = exports.loadChapterComments = exports.promptComment = exports.sendComment = exports.createToMenuButton = void 0;
const messages_1 = require("../constant/messages");
const AutoCache_1 = require("../data/AutoCache");
const hrefs_1 = require("../data/hrefs");
const DebugLogger_1 = require("../DebugLogger");
const hs_1 = require("../hs");
const DOM_1 = require("../util/DOM");
const formatRelativePath_1 = require("../util/formatRelativePath");
const formatTime_1 = require("../util/formatTime");
const padName_1 = require("../util/padName");
const backendControl_1 = require("./backendControl");
const menuControl_1 = require("./menuControl");
const modalControl_1 = require("./modalControl");
const userControl_1 = require("./userControl");
const debugLogger = new DebugLogger_1.DebugLogger('Comments Control');
function promptDeleteComment(pageName, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield (0, modalControl_1.confirm)(messages_1.COMMENTS_DELETE, messages_1.COMMENTS_DELETE_CONFIRMATION, messages_1.GENERIC_CONFIRM, messages_1.GENERIC_CANCEL)) {
            const loadingModal = (0, modalControl_1.showGenericLoading)(messages_1.COMMENTS_DELETING);
            try {
                yield (0, backendControl_1.fetchDeleteComment)(userControl_1.tokenItem.getValue(), commentId);
            }
            catch (error) {
                (0, modalControl_1.showGenericError)(messages_1.GENERIC_INTERNET_ERROR);
                debugLogger.error(error);
                return false;
            }
            finally {
                loadingModal.close();
            }
            recentCommentsCache.delete();
            chapterCommentsCache.delete(pageName);
            return true;
        }
        return false;
    });
}
function createCommentElement(comment, onComment, showPath) {
    var _a;
    const pageName = comment.relative_path;
    const actionButton = (comment.user.user_name === ((_a = (0, userControl_1.getCurrentUser)()) === null || _a === void 0 ? void 0 : _a.userName))
        ? (0, hs_1.h)('a.action', {
            onclick: () => {
                promptDeleteComment(pageName, comment.id).then(deleted => {
                    if (deleted) {
                        $comment.remove();
                    }
                });
            },
        }, messages_1.COMMENTS_DELETE)
        : pageName && (0, hs_1.h)('a.action', {
            onclick: () => {
                promptComment(pageName, '@' + comment.user.user_name + ' ').then(replied => {
                    if (replied) {
                        onComment();
                    }
                });
            },
        }, messages_1.COMMENTS_REPLY);
    const $comment = (0, hs_1.h)('.comment', [
        (0, hs_1.h)('img.avatar', { src: comment.user.avatar_url }),
        (0, hs_1.h)('.author', comment.user.display_name),
        (0, hs_1.h)('.time', messages_1.COMMENTS_SUBMIT_BY.replace('$', ` @${comment.user.user_name} `)
            + (0, formatTime_1.formatTimeRelative)(new Date(comment.create_timestamp))
            + ((comment.create_timestamp === comment.update_timestamp)
                ? '' : messages_1.COMMENTS_MODIFIED_DATE.replace('$', (0, formatTime_1.formatTimeRelative)(new Date(comment.update_timestamp))))),
        actionButton,
        ...comment.body.split('\n\n').map(paragraph => (0, hs_1.h)('p', paragraph)),
        showPath ? (0, hs_1.h)('p', (0, hs_1.h)('a.dimmed', {
            href: (0, hrefs_1.chapterHref)(pageName),
        }, `发表于${(0, padName_1.padName)((0, formatRelativePath_1.formatRelativePath)(pageName))}`)) : null,
    ]);
    return $comment;
}
function loadComments(content, loadComment, title, desc, onComment, backButton = true, commentingPageName) {
    const $commentsStatus = (0, hs_1.h)('p', messages_1.COMMENTS_LOADING);
    const $comments = (0, hs_1.h)('.comments', [
        (0, hs_1.h)('h1', title),
        $commentsStatus,
    ]);
    const block = content.addBlock({
        initElement: $comments,
    });
    block.onEnteringView(() => {
        loadComment().then(data => {
            if (content.isDestroyed) {
                debugLogger.log('Comments loaded, but abandoned since the original ' +
                    'content page is already destroyed.');
                return;
            }
            debugLogger.log('Comments loaded.');
            $commentsStatus.innerText = desc;
            const appendCreateComment = (commentingPageName) => {
                $comments.appendChild((0, hs_1.h)('.create-comment', {
                    onclick: () => {
                        promptComment(commentingPageName).then(commented => {
                            if (commented) {
                                onComment();
                            }
                        });
                    },
                }, messages_1.COMMENTS_SEND));
            };
            if (commentingPageName !== undefined && data.length >= 6) {
                appendCreateComment(commentingPageName);
            }
            data.forEach((comment) => {
                $comments.appendChild(createCommentElement(comment, onComment, commentingPageName === undefined));
            });
            if (commentingPageName !== undefined) {
                appendCreateComment(commentingPageName);
            }
        }).catch(error => {
            $commentsStatus.innerText = messages_1.COMMENTS_FAILED;
            debugLogger.error('Failed to load comments.', error);
        }).then(() => {
            if (backButton) {
                $comments.appendChild(createToMenuButton());
            }
        });
    });
    return block;
}
function createToMenuButton() {
    return (0, hs_1.h)('div.page-switcher', [
        (0, hs_1.h)('a', {
            href: window.location.pathname,
            onclick: (event) => {
                event.preventDefault();
                (0, menuControl_1.enterMenuMode)();
            },
        }, messages_1.GO_TO_MENU),
    ]);
}
exports.createToMenuButton = createToMenuButton;
function sendComment(token, pageName, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield (0, backendControl_1.fetchSendComment)(token, pageName, content);
        }
        catch (error) {
            (0, modalControl_1.showGenericError)(messages_1.GENERIC_INTERNET_ERROR);
            debugLogger.error(error);
            return false;
        }
        if (!result.success) {
            (0, modalControl_1.showGenericError)((0, backendControl_1.getErrorMessage)(result.code));
            return false;
        }
        else {
            // Cache invalidation
            recentCommentsCache.delete();
            chapterCommentsCache.delete(pageName);
            return true;
        }
    });
}
exports.sendComment = sendComment;
function promptComment(pageName, preFilled) {
    return new Promise((resolve, reject) => {
        const $nameInput = (0, hs_1.h)('input');
        const $emailInput = (0, hs_1.h)('input');
        const user = (0, userControl_1.getCurrentUser)();
        const $displayNameSpan = (0, hs_1.h)('span');
        const updateDisplayName = () => {
            if (user !== null) {
                $displayNameSpan.innerText = (0, padName_1.padName)(user.displayName);
            }
        };
        updateDisplayName();
        const name = userControl_1.tokenItem.exists()
            ? user === null
                ? (0, hs_1.h)('div', { style: { 'margin-bottom': '0.8em' } })
                : (0, hs_1.h)('p', [
                    messages_1.COMMENTS_SEND_DISPLAY_NAME_0,
                    $displayNameSpan,
                    messages_1.COMMENTS_SEND_DISPLAY_NAME_1,
                    (0, DOM_1.linkButton)(messages_1.COMMENTS_SEND_DISPLAY_NAME_EDIT, () => {
                        (0, userControl_1.showUpdateProfileModal)().then(updateDisplayName);
                    }),
                ])
            : [
                (0, hs_1.h)('.input-group', [
                    (0, hs_1.h)('span', messages_1.COMMENTS_SEND_DISPLAY_NAME_PREFIX),
                    $nameInput,
                ]),
                (0, hs_1.h)('.input-group', [
                    (0, hs_1.h)('span', messages_1.COMMENTS_SEND_EMAIL_INPUT_PREFIX),
                    $emailInput,
                ]),
            ];
        const $textarea = (0, hs_1.h)('textarea.general.large');
        if (preFilled !== undefined) {
            $textarea.value = preFilled;
        }
        const onSubmit = () => __awaiter(this, void 0, void 0, function* () {
            const loadingModal = (0, modalControl_1.showGenericLoading)(messages_1.COMMENTS_SENDING);
            try {
                if (!userControl_1.tokenItem.exists()) {
                    if (!(yield (0, userControl_1.registerWithResultPopup)($nameInput.value, $emailInput.value.trim() === '' ? null : $emailInput.value))) {
                        return false;
                    }
                }
                return yield sendComment(userControl_1.tokenItem.getValue(), pageName, $textarea.value);
            }
            finally {
                loadingModal.close();
            }
        });
        const modal = new modalControl_1.Modal((0, hs_1.h)('div', [
            (0, hs_1.h)('h1', messages_1.COMMENTS_SEND_TITLE),
            (0, hs_1.h)('p', messages_1.COMMENTS_SEND_HINT),
            $textarea,
            name,
            (0, hs_1.h)('.button-container', [
                (0, hs_1.h)('div', {
                    onclick: () => {
                        onSubmit().then(commented => {
                            if (commented) {
                                modal.close();
                                resolve(true);
                            }
                            return commented;
                        }).catch(reject);
                    }
                }, messages_1.COMMENTS_SEND_CONFIRM),
                (0, hs_1.h)('div', {
                    onclick: () => {
                        if ($textarea.value === '') {
                            modal.close();
                            resolve(false);
                        }
                        else {
                            (0, modalControl_1.confirm)(messages_1.COMMENTS_LOSE_EDITED_TITLE, '', messages_1.COMMENTS_LOSE_EDITED_CONFIRM, messages_1.COMMENTS_LOSE_EDITED_CANCEL).then(confirmed => {
                                if (confirmed) {
                                    modal.close();
                                    resolve(false);
                                }
                            });
                        }
                    }
                }, messages_1.GENERIC_CANCEL),
            ]),
        ]));
        modal.open();
        $textarea.focus();
        (0, DOM_1.autoExpandTextArea)($textarea);
    });
}
exports.promptComment = promptComment;
const chapterCommentsCache = new AutoCache_1.AutoCache(backendControl_1.fetchGetChapterComments, new DebugLogger_1.DebugLogger('Chapter Comments Cache'));
function loadChapterComments(chapterCtx, content) {
    //if (useComments.getValue() === false) {
    return;
    //}
    let block = null;
    const pageName = chapterCtx.chapter.htmlRelativePath;
    function load() {
        if (block !== null) {
            block.directRemove();
        }
        block = loadComments(content, () => chapterCommentsCache.get(pageName), messages_1.COMMENTS_SECTION, messages_1.COMMENTS_LOADED, load, false, chapterCtx.chapter.htmlRelativePath);
    }
    load();
}
exports.loadChapterComments = loadChapterComments;
const recentCommentsCache = new AutoCache_1.AutoSingleCache(backendControl_1.fetchGetRecentComments, new DebugLogger_1.DebugLogger('Recent Comments Cache'));
function loadRecentComments(content) {
    let block = null;
    function load() {
        if (block !== null) {
            block.directRemove();
        }
        block = loadComments(content, () => recentCommentsCache.get(), messages_1.COMMENTS_RECENT_SECTION, messages_1.COMMENTS_RECENT_LOADED, load);
    }
    load();
}
exports.loadRecentComments = loadRecentComments;
const recentMentionedCommentsCache = new AutoCache_1.AutoSingleCache(() => { var _a; return (0, backendControl_1.fetchGetRecentMentionedComments)((_a = userControl_1.tokenItem.getValue()) !== null && _a !== void 0 ? _a : undefined); }, new DebugLogger_1.DebugLogger('Recent Mentioned Comments Cache'));
function loadRecentMentions(content, token) {
    loadComments(content, () => recentMentionedCommentsCache.get(), messages_1.COMMENTS_MENTION_SECTION, messages_1.COMMENTS_MENTION_LOADED, () => {
        (0, modalControl_1.notify)(messages_1.COMMENTS_MENTION_REPLIED_TITLE, '', messages_1.COMMENTS_MENTION_REPLIED_OK);
    });
}
exports.loadRecentMentions = loadRecentMentions;

},{"../DebugLogger":9,"../constant/messages":13,"../data/AutoCache":39,"../data/hrefs":42,"../hs":45,"../util/DOM":62,"../util/formatRelativePath":65,"../util/formatTime":66,"../util/padName":68,"./backendControl":21,"./menuControl":28,"./modalControl":30,"./userControl":38}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentBlock = exports.ContentBlockSide = exports.Content = exports.ContentBlockStyle = exports.newContent = exports.contentChangeEvent = exports.contentScrollEvent = exports.focus = exports.getCurrentContent = exports.Side = void 0;
const _e_1 = require("../$e");
const settings_1 = require("../data/settings");
const DebugLogger_1 = require("../DebugLogger");
const Event_1 = require("../Event");
const hs_1 = require("../hs");
const keyboard_1 = require("../input/keyboard");
const DOM_1 = require("../util/DOM");
const layoutControl_1 = require("./layoutControl");
const MonoDimensionTransitionControl_1 = require("./MonoDimensionTransitionControl");
const $contentContainer = (0, DOM_1.id)('content-container');
const debugLogger = new DebugLogger_1.DebugLogger('Content Control');
var Side;
(function (Side) {
    Side[Side["LEFT"] = 0] = "LEFT";
    Side[Side["RIGHT"] = 1] = "RIGHT";
})(Side = exports.Side || (exports.Side = {}));
function setSide($element, side) {
    if (side === Side.LEFT) {
        $element.classList.add('left');
        $element.classList.remove('right');
    }
    else {
        $element.classList.add('right');
        $element.classList.remove('left');
    }
}
function otherSide(side) {
    return side === Side.LEFT ? Side.RIGHT : Side.LEFT;
}
let currentContent = null;
function getCurrentContent() {
    return currentContent;
}
exports.getCurrentContent = getCurrentContent;
function focus() {
    if (currentContent !== null) {
        currentContent.$element.focus({
            // Why:
            // https://stackoverflow.com/questions/26782998/why-does-calling-focus-break-my-css-transition
            preventScroll: true,
        });
    }
}
exports.focus = focus;
/** Global scrolling event */
exports.contentScrollEvent = new Event_1.Event();
exports.contentChangeEvent = new Event_1.Event();
/**
 * 创建一个新的 Content 并替换之前的 Content。
 *
 * @param side 如果有动画，那么入场位置。
 * @returns 创建的 Content 对象
 */
function newContent(side) {
    const newContent = new Content();
    currentContent === null || currentContent === void 0 ? void 0 : currentContent.ensureLeavingTriggered();
    if ((0, layoutControl_1.getCurrentLayout)() === layoutControl_1.Layout.OFF) {
        if (currentContent !== null) {
            currentContent.destroy();
        }
    }
    else {
        if (settings_1.animation.getValue()) {
            // Animation is enabled
            if (currentContent !== null) {
                setSide(currentContent.$element, otherSide(side));
                // Remove the content after a timeout instead of listening for
                // transition event
                const oldContent = currentContent;
                setTimeout(() => {
                    oldContent.destroy();
                }, 2500);
            }
            setSide(newContent.$element, side);
            // Force reflow, so transition starts now
            (0, DOM_1.forceReflow)(newContent.$element);
            newContent.$element.classList.remove('left', 'right');
        }
        else {
            if (currentContent !== null) {
                currentContent.destroy();
            }
        }
    }
    currentContent = newContent;
    exports.contentChangeEvent.emit({ newContent });
    return newContent;
}
exports.newContent = newContent;
var ContentBlockStyle;
(function (ContentBlockStyle) {
    ContentBlockStyle[ContentBlockStyle["REGULAR"] = 0] = "REGULAR";
    ContentBlockStyle[ContentBlockStyle["WARNING"] = 1] = "WARNING";
})(ContentBlockStyle = exports.ContentBlockStyle || (exports.ContentBlockStyle = {}));
class Content {
    constructor() {
        this.isDestroyed = false;
        this.blocks = [];
        this.scrollTransition = null;
        this.leavingEvent = new Event_1.Event();
        this.scrollEvent = new Event_1.Event();
        this.leavingTriggered = false;
        this.$leftSideContainer = null; // jsx workaround
        this.$rightSideContainer = null; // jsx workaround
        this.onKeyPress = (key) => {
            if (key === keyboard_1.ArrowKey.UP || key === keyboard_1.ArrowKey.DOWN) {
                this.interruptScrolling();
            }
        };
        this.interruptScrolling = () => {
            if (this.scrollTransition !== null) {
                this.scrollTransition = null;
                debugLogger.log('Transition interrupted.');
            }
        };
        this.scrollAnimation = () => {
            if (this.scrollTransition === null) {
                return;
            }
            const now = Date.now();
            this.$element.scrollTop = this.scrollTransition.getValue(now);
            if (this.scrollTransition.isFinished(now)) {
                debugLogger.log('Transition finished.');
                this.scrollTransition = null;
            }
            else {
                requestAnimationFrame(this.scrollAnimation);
            }
        };
        const $content = (0, hs_1.h)('div.content', { tabIndex: -1 });
        $contentContainer.appendChild($content);
        this.$element = $content;
        this.$element.addEventListener('wheel', () => {
            this.interruptScrolling();
        }, { passive: true });
        this.$element.addEventListener('scroll', () => {
            this.scrollEvent.emit({ scrollTop: this.$element.scrollTop });
            exports.contentScrollEvent.emit({ scrollTop: this.$element.scrollTop });
        }, { passive: true });
        keyboard_1.arrowKeyPressEvent.on(this.onKeyPress);
        layoutControl_1.layoutChangeEvent.on(({ newLayout }, listener) => {
            if (newLayout === layoutControl_1.Layout.OFF) {
                this.ensureLeavingTriggered();
                layoutControl_1.layoutChangeEvent.off(listener);
            }
        });
    }
    appendLeftSideContainer() {
        if (this.$leftSideContainer !== null) {
            throw new Error('Left side container already exists.');
        }
        this.$leftSideContainer = (0, _e_1.$e)("div", { className: 'left-side-container' });
        this.$element.append(this.$leftSideContainer);
    }
    appendRightSideContainer() {
        if (this.$rightSideContainer !== null) {
            throw new Error('Right side container already exists.');
        }
        this.$rightSideContainer = (0, _e_1.$e)("div", { className: 'right-side-container' });
        this.$element.append(this.$rightSideContainer);
    }
    getLeftSideContainer() {
        if (this.$leftSideContainer === null) {
            throw new Error('Left side container does not exist.');
        }
        return this.$leftSideContainer;
    }
    getRightSideContainer() {
        if (this.$rightSideContainer === null) {
            throw new Error('Right side container does not exist.');
        }
        return this.$rightSideContainer;
    }
    ensureLeavingTriggered() {
        if (!this.leavingTriggered) {
            debugLogger.log('Triggering leaving event.');
            this.leavingTriggered = true;
            this.leavingEvent.emit();
        }
    }
    addBlock(opts = {}) {
        const block = new ContentBlock(this, opts);
        this.blocks.push(block);
        return block;
    }
    destroy() {
        this.isDestroyed = true;
        this.$element.remove();
        window.removeEventListener('wheel', this.interruptScrolling);
        keyboard_1.arrowKeyPressEvent.off(this.onKeyPress);
    }
    scrollTo(target) {
        if (!settings_1.animation.getValue() || (0, layoutControl_1.getCurrentLayout)() === layoutControl_1.Layout.OFF) {
            debugLogger.log(`Scroll to ${target}, no animation.`);
            this.$element.scrollTop = target;
            return;
        }
        if (this.scrollTransition === null) {
            debugLogger.log(`Scrolling to ${target}, new transition stared.`);
            this.scrollTransition = new MonoDimensionTransitionControl_1.MonoDimensionTransitionControl(this.$element.scrollTop, 20000);
            this.scrollTransition.setTarget(target);
            requestAnimationFrame(this.scrollAnimation);
        }
        else {
            debugLogger.log(`Scrolling to ${target}, existing transition updated.`);
            this.scrollTransition.setTarget(target);
        }
    }
}
exports.Content = Content;
var ContentBlockSide;
(function (ContentBlockSide) {
    ContentBlockSide[ContentBlockSide["LEFT"] = 0] = "LEFT";
    ContentBlockSide[ContentBlockSide["RIGHT"] = 1] = "RIGHT";
})(ContentBlockSide = exports.ContentBlockSide || (exports.ContentBlockSide = {}));
class ContentBlock {
    constructor(content, { initElement = (0, hs_1.h)('div'), style = ContentBlockStyle.REGULAR, slidable = false, prepend = false, side, }) {
        this.slideContainer = null;
        this.heightHolder = null;
        this.sliding = 0;
        if (!(initElement instanceof HTMLDivElement)) {
            throw new Error('Init element must be a div.');
        }
        if (side !== undefined && slidable) {
            throw new Error('"side" and "slidable" are incompatible.');
        }
        this.element = initElement;
        initElement.classList.add('content-block');
        switch (style) {
            case ContentBlockStyle.WARNING:
                initElement.classList.add('warning');
                break;
        }
        let $parent = content.$element;
        let $self = initElement;
        if (slidable) {
            this.slideContainer = (0, hs_1.h)('.slide-container', $self);
            $self = this.slideContainer;
        }
        if (side === ContentBlockSide.LEFT) {
            $parent = content.getLeftSideContainer();
        }
        else if (side === ContentBlockSide.RIGHT) {
            $parent = content.getRightSideContainer();
        }
        if (prepend) {
            $parent.prepend($self);
        }
        else {
            $parent.append($self);
        }
    }
    hide() {
        this.element.classList.add('display-none');
        return this;
    }
    show() {
        this.element.classList.remove('display-none');
        return this;
    }
    onEnteringView(callback) {
        const observer = new IntersectionObserver(entries => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                observer.disconnect();
                callback();
            }
        }, {
            root: $contentContainer,
            threshold: 0,
        });
        observer.observe(this.element);
    }
    directRemove() {
        if (this.slideContainer !== null) {
            this.slideContainer.remove();
        }
        else {
            this.element.remove();
        }
    }
    directReplace($newElement = (0, hs_1.h)('div')) {
        $newElement.classList.add('content-block');
        this.element.parentElement.replaceChild($newElement, this.element);
        this.element = $newElement;
    }
    slideReplace($newElement = (0, hs_1.h)('div')) {
        if (!settings_1.animation.getValue()) {
            this.directReplace($newElement);
            return;
        }
        const $container = this.slideContainer;
        if ($container === null) {
            throw new Error('Content block is not slidable.');
        }
        this.sliding++;
        $container.classList.add('in-transition');
        $newElement.classList.add('content-block');
        const $oldElement = this.element;
        $newElement.classList.add('right');
        // $newElement.style.top = `${$contentContainer.scrollTop - $container.offsetTop + 30}px`;
        $container.prepend($newElement);
        const newHeight = $newElement.offsetHeight; // This also forces reflow
        $newElement.classList.remove('right');
        // $newElement.style.top = null;
        if (this.heightHolder === null) {
            this.heightHolder = (0, hs_1.h)('.height-holder');
            this.heightHolder.style.height = `${$oldElement.offsetHeight}px`;
            $container.appendChild(this.heightHolder);
            (0, DOM_1.forceReflow)(this.heightHolder);
        }
        this.heightHolder.style.height = `${newHeight}px`;
        $oldElement.classList.add('left');
        this.element = $newElement;
        setTimeout(() => {
            $oldElement.remove();
            this.sliding--;
            if (this.sliding === 0) {
                $container.classList.remove('in-transition');
                if (this.heightHolder !== null) {
                    this.heightHolder.remove();
                    this.heightHolder = null;
                }
            }
        }, 2500);
    }
}
exports.ContentBlock = ContentBlock;

},{"../$e":8,"../DebugLogger":9,"../Event":10,"../data/settings":44,"../hs":45,"../input/keyboard":48,"../util/DOM":62,"./MonoDimensionTransitionControl":19,"./layoutControl":27}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followQuery = exports.initPathHandlers = exports.onPathHandled = void 0;
const messages_1 = require("../constant/messages");
const redirects_1 = require("../constant/redirects");
const DebugLogger_1 = require("../DebugLogger");
const Event_1 = require("../Event");
const chapterControl_1 = require("./chapterControl");
const menuControl_1 = require("./menuControl");
const mirrorControl_1 = require("./mirrorControl");
const modalControl_1 = require("./modalControl");
const pageControl_1 = require("./pageControl");
const debugLogger = new DebugLogger_1.DebugLogger('Follow Query');
exports.onPathHandled = new Event_1.Event();
let pathHandlers;
function initPathHandlers() {
    pathHandlers = new Map([
        ['chapter', chapterControl_1.chapterPathHandler],
        ['page', pageControl_1.pagePathHandler],
        ['menu', menuControl_1.menuPathHandler],
        ['mirror-landing', mirrorControl_1.mirrorLandingHandler],
    ]);
}
exports.initPathHandlers = initPathHandlers;
function followQuery() {
    if (window.location.hash === '') {
        document.title = '晶体图书馆';
        // No hash, go to main menu.
        (0, menuControl_1.handleMainMenu)();
        return;
    }
    const segments = window.location.hash.split('~').map(decodeURIComponent);
    // First segment is the page specifier
    let pageSpecifier = segments[0];
    const args = new Map(segments.slice(1).map(arg => {
        const split = arg.split('=');
        if (split.length === 2) {
            return [split[0], split[1]];
        }
        else {
            return [split[0], ''];
        }
    }));
    // Legacy conversion
    if (!pageSpecifier.startsWith('#/')) {
        // URL looks like https://crystaltechstudio.github.io/Library/#a/b
        // This is a legacy URL. Now convert it to the new style.
        pageSpecifier = `#/chapter/${pageSpecifier.substr('#'.length)}`;
        if (window.location.search !== '') {
            // There are query parameters, which were previously used for saving selections
            const match = /^\?selection=((?:0|[1-9][0-9]*),(?:0|[1-9][0-9]*),(?:0|[1-9][0-9]*),(?:0|[1-9][0-9]*))$/.exec(window.location.search);
            if (match !== null) {
                args.set('selection', match[1]);
            }
        }
    }
    // At this point, page specifier should look like #/chapter/xxxx
    pageSpecifier = pageSpecifier.substr('#/'.length); // Removes #/
    let handlerIdEndIndex = pageSpecifier.indexOf('/'); // Finds the "/" after handlerId
    if (handlerIdEndIndex === -1) {
        // If not found, extend to the entire string
        handlerIdEndIndex = pageSpecifier.length;
    }
    const handlerId = pageSpecifier.substr(0, handlerIdEndIndex); // chapter
    const path = pageSpecifier.substr(handlerIdEndIndex + '/'.length); // xxx
    const handler = pathHandlers.get(handlerId);
    let handled = false;
    if (handler !== undefined) {
        // Found handler
        handled = handler(path, args);
        if (handled) {
            exports.onPathHandled.emit({ handlerId });
        }
    }
    if (!handled) {
        // Try redirects
        for (const redirect of redirects_1.redirects) {
            const newPageSpecifier = redirect(pageSpecifier);
            if (newPageSpecifier !== pageSpecifier) {
                // Redirect
                debugLogger.log('Redirect matched: ', redirect, `\nOld page specifier: ${pageSpecifier}\nNew page specifier: ${newPageSpecifier}`);
                window.location.hash = '#/' + [newPageSpecifier, ...segments.slice(1)].join('~');
                return;
            }
        }
        debugLogger.log(`${redirects_1.redirects.length} possible redirects processed. None matched.`);
        (0, modalControl_1.notify)(messages_1.BROKEN_LINK_TITLE, messages_1.BROKEN_LINK_DESC, messages_1.BROKEN_LINK_OK);
        document.title = '晶体图书馆';
        window.history.replaceState(null, '晶体图书馆', window.location.pathname);
        followQuery();
    }
}
exports.followQuery = followQuery;

},{"../DebugLogger":9,"../Event":10,"../constant/messages":13,"../constant/redirects":15,"./chapterControl":22,"./menuControl":28,"./mirrorControl":29,"./modalControl":30,"./pageControl":32}],26:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHint = void 0;
const hs_1 = require("../hs");
// Promise queue
let current = Promise.resolve();
function createHint(text, timeMs = 2000) {
    current = current.then(() => __awaiter(this, void 0, void 0, function* () {
        const $hint = (0, hs_1.h)('.hint', text);
        document.body.appendChild($hint);
        $hint.style.opacity = '0';
        // tslint:disable-next-line:no-unused-expression
        $hint.offsetWidth;
        $hint.style.removeProperty('opacity');
        yield new Promise(resolve => setTimeout(resolve, timeMs));
        $hint.style.opacity = '0';
        yield new Promise(resolve => setTimeout(resolve, 500));
        $hint.remove();
    }));
}
exports.createHint = createHint;

},{"../hs":45}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLayout = exports.getCurrentLayout = exports.layoutChangeEvent = exports.Layout = void 0;
const DebugLogger_1 = require("../DebugLogger");
const Event_1 = require("../Event");
var Layout;
(function (Layout) {
    Layout[Layout["SIDE"] = 0] = "SIDE";
    Layout[Layout["MAIN"] = 1] = "MAIN";
    Layout[Layout["OFF"] = 2] = "OFF";
})(Layout = exports.Layout || (exports.Layout = {}));
const $body = document.body;
const debugLogger = new DebugLogger_1.DebugLogger('Layout');
exports.layoutChangeEvent = new Event_1.Event();
exports.layoutChangeEvent.on(({ newLayout }) => {
    $body.classList.remove('layout-side', 'layout-main', 'layout-off');
    switch (newLayout) {
        case Layout.SIDE:
            $body.classList.add('layout-side');
            break;
        case Layout.MAIN:
            $body.classList.add('layout-main');
            break;
        case Layout.OFF:
            $body.classList.add('layout-off');
            break;
    }
});
let layout = Layout.OFF;
function getCurrentLayout() {
    return layout;
}
exports.getCurrentLayout = getCurrentLayout;
function setLayout(newLayout) {
    if (newLayout !== layout) {
        debugLogger.log(`${Layout[layout]} -> ${Layout[newLayout]}`);
    }
    if (layout === newLayout) {
        return;
    }
    // if (newLayout === Layout.OFF) {
    //   $rect.classList.remove('reading');
    // } else {
    //   if (layout === Layout.MAIN) {
    //     $rect.classList.remove('main');
    //   } else if (layout === Layout.SIDE) {
    //     $rect.classList.remove('side');
    //   } else {
    //     $rect.classList.remove('main', 'side');
    //     $rect.classList.add('reading');
    //   }
    //   if (newLayout === Layout.MAIN) {
    //     $rect.classList.add('main');
    //   } else {
    //     $rect.classList.add('side');
    //   }
    // }
    exports.layoutChangeEvent.emit({
        previousLayout: layout,
        newLayout,
    });
    layout = newLayout;
}
exports.setLayout = setLayout;

},{"../DebugLogger":9,"../Event":10}],28:[function(require,module,exports){
"use strict";
// Provide menu coordination
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuPathHandler = exports.handleMainMenu = exports.exitMenuMode = exports.enterMenuMode = exports.mainMenu = void 0;
const DebugLogger_1 = require("../DebugLogger");
const hs_1 = require("../hs");
const keyboard_1 = require("../input/keyboard");
const MainMenu_1 = require("../menu/MainMenu");
const DOM_1 = require("../util/DOM");
const followQuery_1 = require("./followQuery");
exports.mainMenu = new MainMenu_1.MainMenu('#/menu');
exports.mainMenu.show();
const $path = (0, DOM_1.id)('menu-control-path');
const $back = (0, DOM_1.id)('menu-control-back');
const $control = (0, DOM_1.id)('menu-control');
const $titleContainer = (0, DOM_1.id)('title-container');
const debugLogger = new DebugLogger_1.DebugLogger('Menu Control');
// Root behaves extremely different from other menus, therefore we will not
// include it in the stack.
const menuStack = [];
function getMenu(index) {
    if (index === -1) {
        return exports.mainMenu;
    }
    else {
        return menuStack[index].menu;
    }
}
function getCurrentMenu() {
    return getMenu(menuStack.length - 1);
}
let isMenuMode = true;
/**
 * Used by "enterMenuMode" or regular handling of menu urls.
 */
function enteredMenuMode() {
    isMenuMode = true;
    document.title = '晶体图书馆';
    $titleContainer.classList.remove('hidden');
}
function enterMenuMode() {
    debugLogger.log('Enter menu mode');
    if (menuStack.length === 0) {
        window.location.hash = '#';
    }
    else {
        window.location.hash = '#/menu/' + menuStack.map(({ urlSegment }) => urlSegment).join('/');
    }
    enteredMenuMode();
}
exports.enterMenuMode = enterMenuMode;
function exitMenuMode() {
    isMenuMode = false;
    debugLogger.log('Exit menu mode');
    getCurrentMenu().hide();
    $control.classList.add('hidden');
    $titleContainer.classList.add('hidden');
}
exports.exitMenuMode = exitMenuMode;
function pop() {
    const { menu, pathSpan: $pathSpan } = menuStack.pop();
    menu.destroy();
    const startX = $pathSpan.offsetLeft;
    $pathSpan.classList.add('exiting');
    if (menuStack.length !== 0) {
        // Only play the moving animation when it is not the first element
        $pathSpan.style.left = `${startX}px`;
        (0, DOM_1.forceReflow)($pathSpan);
        $pathSpan.style.left = `${startX + 10}px`;
    }
    else {
        $pathSpan.classList.add('first');
    }
    setTimeout(() => $pathSpan.remove(), 500);
}
function popUntil(targetLength) {
    if (menuStack.length > targetLength) {
        debugLogger.log('Pop until', targetLength);
    }
    while (menuStack.length > targetLength) {
        pop();
    }
    menuStack.length = targetLength;
}
function updateShowingMenuControl() {
    $control.classList.toggle('hidden', menuStack.length === 0);
}
function handleMainMenu() {
    debugLogger.log('Handle main menu');
    enteredMenuMode();
    popUntil(0);
    exports.mainMenu.show();
    updateShowingMenuControl();
}
exports.handleMainMenu = handleMainMenu;
const menuPathHandler = path => {
    debugLogger.log(`Handle path=${path}`);
    enteredMenuMode();
    const urlSegments = path.split('/');
    // Step 0: Hide current menu
    getCurrentMenu().hide();
    // Step 1: Forward iterate until point of diversion
    let index = 0;
    while (index < menuStack.length && index < urlSegments.length && menuStack[index].urlSegment === urlSegments[index]) {
        index++;
    }
    // Step 2: Discard additional menus from menu stack
    popUntil(index);
    // Step 3: Add additional menus
    for (; index < urlSegments.length; index++) {
        const urlSegment = urlSegments[index];
        const parentMenu = getMenu(index - 1);
        if (!parentMenu.subMenus.has(urlSegment)) {
            return false;
        }
        const { factory, name } = parentMenu.subMenus.get(urlSegment);
        const subMenu = factory();
        const $pathSpan = (0, hs_1.h)('span', [
            (0, hs_1.h)('span', '>'),
            (0, hs_1.h)('a.button', {
                href: subMenu.urlBase,
            }, name),
        ]);
        if (index !== 0) {
            $pathSpan.classList.add('pre-entering');
            $path.append($pathSpan);
            (0, DOM_1.forceReflow)($pathSpan);
            $pathSpan.classList.remove('pre-entering');
        }
        else {
            $path.append($pathSpan);
        }
        menuStack.push({
            menu: subMenu,
            pathSpan: $pathSpan,
            urlSegment,
        });
    }
    // Step 4: Show new menu
    getCurrentMenu().show();
    // Step 5: Show/hide menu control
    updateShowingMenuControl();
    // Step 6: Update back URL
    if (menuStack.length > 1) {
        // There are something other than main menu
        $back.href = menuStack[menuStack.length - 2].menu.urlBase;
    }
    else {
        $back.href = '#';
    }
    return true;
};
exports.menuPathHandler = menuPathHandler;
keyboard_1.escapeKeyPressEvent.on(() => {
    if (!isMenuMode) {
        return;
    }
    if (menuStack.length > 1) {
        window.location.hash = menuStack[menuStack.length - 2].menu.urlBase;
    }
    else if (menuStack.length === 1) {
        window.location.hash = '';
    }
});
followQuery_1.onPathHandled.on(({ handlerId }) => {
    if (handlerId !== 'menu') {
        exitMenuMode();
    }
});
const $logo = (0, DOM_1.id)('navbar-logo').cloneNode(true);
$logo.id = 'path-logo';
$path.prepend((0, hs_1.h)('a', {
    href: '#',
}, $logo));

},{"../DebugLogger":9,"../hs":45,"../input/keyboard":48,"../menu/MainMenu":54,"../util/DOM":62,"./followQuery":25}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mirrorLandingHandler = exports.showMirrorSitesModal = void 0;
const _e_1 = require("../$e");
const messages_1 = require("../constant/messages");
const mirrorSites_1 = require("../constant/mirrorSites");
const hrefs_1 = require("../data/hrefs");
const hs_1 = require("../hs");
const hintControl_1 = require("./hintControl");
const modalControl_1 = require("./modalControl");
const userControl_1 = require("./userControl");
function showMirrorSitesModal(scroll) {
    const modal = new modalControl_1.Modal((0, hs_1.h)('.mirror-site-modal', [
        (0, hs_1.h)('h1', messages_1.MIRROR_TITLE),
        (0, hs_1.h)('p', userControl_1.tokenItem.exists() ? messages_1.MIRROR_DESC_0 : messages_1.MIRROR_DESC_0_NO_TOKEN),
        (0, hs_1.h)('p', messages_1.MIRROR_DESC_1),
        (0, hs_1.h)('.button-container', [
            ...mirrorSites_1.mirrorSitesPlusMainSite.map(({ name, origin, provider, technology }) => {
                const $button = (0, hs_1.h)('a.rich', {
                    href: (origin === window.location.origin) ? '#' : (0, hrefs_1.mirrorLandingHref)(origin, userControl_1.tokenItem.getValue()),
                    onclick: (event) => {
                        event.preventDefault();
                        if (origin === window.location.origin) {
                            return;
                        }
                        window.location.replace((0, hrefs_1.mirrorLandingHref)(origin, userControl_1.tokenItem.getValue(), modal.modal.scrollTop));
                    },
                }, [
                    (0, hs_1.h)('h2', name),
                    (0, hs_1.h)('p', [
                        ...origin.startsWith('http://')
                            ? [
                                (0, _e_1.$e)("span", { className: 'http-warning' }, "\u672C\u955C\u50CF\u7AD9\u672A\u52A0\u5BC6\uFF08\u4F7F\u7528 HTTP\uFF09\uFF0C\u975E\u7D27\u6025\u60C5\u51B5\u8BF7\u907F\u514D\u4F7F\u7528\uFF01"),
                                (0, _e_1.$e)("br", null),
                            ]
                            : [],
                        messages_1.MIRROR_URL + origin,
                        (0, hs_1.h)('br'),
                        messages_1.MIRROR_PROVIDED_BY + provider,
                        (0, hs_1.h)('br'),
                        messages_1.MIRROR_TECHNOLOGY + technology,
                    ]),
                ]);
                if (origin === window.location.origin) {
                    $button.classList.add('selected');
                }
                return $button;
            }),
            (0, hs_1.h)('div', {
                onclick: () => modal.close(),
            }, messages_1.GENERIC_CLOSE),
        ]),
    ]));
    modal.setDismissible();
    modal.open();
    if (scroll !== undefined) {
        modal.modal.scrollTop = scroll;
    }
}
exports.showMirrorSitesModal = showMirrorSitesModal;
const mirrorLandingHandler = (_, args) => {
    // Prevent leaving the token in browser history
    window.history.replaceState(null, document.title, '#/mirror-landing');
    window.location.hash = '#';
    showMirrorSitesModal(args.has('scroll') ? +args.get('scroll') : undefined);
    const newToken = args.get('token');
    if (newToken === undefined) {
        return true;
    }
    if (!mirrorSites_1.mirrorSitesPlusMainSite.some(mirror => document.referrer === mirror.origin
        || document.referrer.startsWith(mirror.origin + '/'))) {
        (0, modalControl_1.showGenericError)(messages_1.MIRROR_LANDING_INVALID_REFERRAL);
        return true;
    }
    const oldToken = userControl_1.tokenItem.getValue();
    if (oldToken !== null) {
        if (oldToken !== newToken) {
            (0, modalControl_1.confirm)(messages_1.MIRROR_LANDING_CONFLICT_TITLE, messages_1.MIRROR_LANDING_CONFLICT_DESC, messages_1.MIRROR_LANDING_CONFLICT_OVERWRITE, messages_1.MIRROR_LANDING_CONFLICT_KEEP).then(result => {
                if (result) {
                    // Overwrite
                    userControl_1.tokenItem.setValue(newToken);
                    (0, hintControl_1.createHint)(messages_1.MIRROR_LANDING_SUCCESS_HINT);
                }
            });
        }
    }
    else {
        // No conflict
        userControl_1.tokenItem.setValue(newToken);
        (0, hintControl_1.createHint)(messages_1.MIRROR_LANDING_SUCCESS_HINT);
    }
    return true;
};
exports.mirrorLandingHandler = mirrorLandingHandler;

},{"../$e":8,"../constant/messages":13,"../constant/mirrorSites":14,"../data/hrefs":42,"../hs":45,"./hintControl":26,"./modalControl":30,"./userControl":38}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnyModalOpened = exports.showGenericLoading = exports.showGenericHint = exports.showGenericError = exports.showGenericSuccess = exports.notify = exports.confirm = exports.Modal = void 0;
const messages_1 = require("../constant/messages");
const settings_1 = require("../data/settings");
const hs_1 = require("../hs");
const keyboard_1 = require("../input/keyboard");
const DOM_1 = require("../util/DOM");
const $modalHolder = (0, DOM_1.id)('modal-holder');
class Modal {
    constructor($initElement = (0, hs_1.h)('div')) {
        this.dismissSet = false;
        this.escKeyListener = null;
        $initElement.classList.add('modal');
        this.modal = $initElement;
        this.modalContainer = (0, hs_1.h)('.modal-container.closed', $initElement);
        $modalHolder.appendChild(this.modalContainer);
    }
    open() {
        (0, DOM_1.forceReflow)(this.modalContainer);
        this.modalContainer.classList.remove('closed');
    }
    close() {
        if (settings_1.animation.getValue()) {
            this.modalContainer.classList.add('closed');
            setTimeout(() => {
                this.modalContainer.remove();
            }, 400);
        }
        else {
            this.modalContainer.remove();
        }
        if (this.escKeyListener !== null) {
            keyboard_1.escapeKeyPressEvent.off(this.escKeyListener);
        }
    }
    setDismissible(onDismiss = () => {
        this.close();
    }) {
        if (this.dismissSet) {
            throw new Error('Dismissible already set.');
        }
        this.dismissSet = true;
        keyboard_1.escapeKeyPressEvent.on(onDismiss);
        this.modalContainer.addEventListener('click', event => {
            if (event.target === this.modalContainer) {
                onDismiss();
            }
        });
    }
}
exports.Modal = Modal;
function confirm(title, desc, yes, no) {
    let resolved = false;
    return new Promise(resolve => {
        const modal = new Modal((0, hs_1.h)('div', [
            (0, hs_1.h)('h1', title),
            desc === '' ? null : (0, hs_1.h)('p', desc),
            (0, hs_1.h)('.button-container', [
                (0, hs_1.h)('div', {
                    onclick: () => {
                        if (resolved) {
                            return;
                        }
                        resolved = true;
                        modal.close();
                        resolve(true);
                    },
                }, yes),
                (0, hs_1.h)('div', {
                    onclick: () => {
                        if (resolved) {
                            return;
                        }
                        resolved = true;
                        modal.close();
                        resolve(false);
                    },
                }, no),
            ]),
        ]));
        modal.open();
    });
}
exports.confirm = confirm;
function notify(title, desc, yes) {
    let resolved = false;
    return new Promise(resolve => {
        const modal = new Modal((0, hs_1.h)('div', [
            (0, hs_1.h)('h1', title),
            desc === '' ? null : (0, hs_1.h)('p', desc),
            (0, hs_1.h)('.button-container', [
                (0, hs_1.h)('div', {
                    onclick: () => {
                        if (resolved) {
                            return;
                        }
                        resolved = true;
                        modal.close();
                        resolve();
                    },
                }, yes),
            ]),
        ]));
        modal.open();
    });
}
exports.notify = notify;
function showGenericSuccess(desc) {
    return notify(messages_1.GENERIC_SUCCESS_TITLE, desc !== null && desc !== void 0 ? desc : messages_1.GENERIC_SUCCESS_DESC, messages_1.GENERIC_CONFIRM);
}
exports.showGenericSuccess = showGenericSuccess;
function showGenericError(desc) {
    return notify(messages_1.GENERIC_ERROR_TITLE, desc !== null && desc !== void 0 ? desc : messages_1.GENERIC_ERROR_DESC, messages_1.GENERIC_CONFIRM);
}
exports.showGenericError = showGenericError;
function showGenericHint(desc) {
    return notify(messages_1.GENERIC_HINT_TITLE, desc, messages_1.GENERIC_CONFIRM);
}
exports.showGenericHint = showGenericHint;
function showGenericLoading(desc) {
    const modal = new Modal((0, hs_1.h)('div', [
        (0, hs_1.h)('h1', messages_1.GENERIC_LOADING_TITLE),
        (0, hs_1.h)('p', desc !== null && desc !== void 0 ? desc : messages_1.GENERIC_LOADING_DESC),
    ]));
    modal.open();
    return modal;
}
exports.showGenericLoading = showGenericLoading;
function isAnyModalOpened() {
    return $modalHolder.childElementCount > 0;
}
exports.isAnyModalOpened = isAnyModalOpened;

},{"../constant/messages":13,"../data/settings":44,"../hs":45,"../input/keyboard":48,"../util/DOM":62}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNavbarPath = exports.resetProgressIndicator = exports.setProgressIndicator = void 0;
const settings_1 = require("../data/settings");
const hs_1 = require("../hs");
const DOM_1 = require("../util/DOM");
const contentControl_1 = require("./contentControl");
const layoutControl_1 = require("./layoutControl");
const menuControl_1 = require("./menuControl");
const $navbar = (0, DOM_1.id)('navbar');
const $navbarPathContainer = (0, DOM_1.id)('navbar-path-container');
const $progressIndicator = (0, DOM_1.id)('navbar-progress-indicator');
const $logo = (0, DOM_1.id)('navbar-logo');
const $title = (0, DOM_1.id)('navbar-title');
/**
 * Used for skipping the animation when transitioning from main layout.
 */
let delayedLayout;
function setProgressIndicator(progress) {
    $progressIndicator.style.transform = `scaleX(${progress})`;
    $progressIndicator.classList.toggle('hidden', progress === 1 || progress === 0);
}
exports.setProgressIndicator = setProgressIndicator;
function resetProgressIndicator() {
    setProgressIndicator(0);
}
exports.resetProgressIndicator = resetProgressIndicator;
layoutControl_1.layoutChangeEvent.on(({ newLayout }) => {
    resetProgressIndicator();
    setTimeout(() => delayedLayout = newLayout, 100);
});
$logo.addEventListener('click', () => {
    (0, menuControl_1.enterMenuMode)();
});
$title.addEventListener('click', event => {
    event.preventDefault();
    (0, menuControl_1.enterMenuMode)();
});
contentControl_1.contentScrollEvent.on(({ scrollTop }) => $navbar.classList.toggle('flat', scrollTop < 50));
contentControl_1.contentChangeEvent.on(() => $navbar.classList.add('flat'));
const currentNavbarPath = [];
function compareNavbarPathSegment(a, b) {
    return a.display === b.display && a.hash === b.hash;
}
function removeElement($element) {
    if (settings_1.animation.getValue() && delayedLayout === layoutControl_1.Layout.MAIN) {
        $element.style.left = `${$element.offsetLeft}px`;
        $element.classList.add('exiting');
        setTimeout(() => {
            $element.remove();
        }, 500);
    }
    else {
        $element.remove();
    }
}
function removeNavbarPathSegment(segment) {
    removeElement(segment.$anchor);
    removeElement(segment.$arrow);
}
function createNavbarPathSegment(segmentSpecifier) {
    const $arrow = (0, hs_1.h)('.arrow', '>');
    const $anchor = segmentSpecifier.hash === null
        ? (0, hs_1.h)('.anchor', segmentSpecifier.display)
        : (0, hs_1.h)('a.button.anchor', {
            href: segmentSpecifier.hash,
        }, segmentSpecifier.display);
    $navbarPathContainer.appendChild($arrow);
    $navbarPathContainer.appendChild($anchor);
    if (settings_1.animation.getValue() && delayedLayout === layoutControl_1.Layout.MAIN) {
        $arrow.classList.add('entering');
        $anchor.classList.add('entering');
        (0, DOM_1.forceReflow)($anchor);
        $arrow.classList.remove('entering');
        $anchor.classList.remove('entering');
    }
    return Object.assign({ $arrow,
        $anchor }, segmentSpecifier);
}
function setNavbarPath(newNavbarPath) {
    let firstDifferentIndex = 0;
    while (currentNavbarPath.length > firstDifferentIndex &&
        newNavbarPath.length > firstDifferentIndex &&
        compareNavbarPathSegment(currentNavbarPath[firstDifferentIndex], newNavbarPath[firstDifferentIndex])) {
        firstDifferentIndex++;
    }
    // Remove extras from current navbar path
    for (let i = currentNavbarPath.length - 1; i >= firstDifferentIndex; i--) {
        removeNavbarPathSegment(currentNavbarPath[i]);
    }
    currentNavbarPath.length = firstDifferentIndex; // Shorten the array
    // Add new segments
    for (let i = firstDifferentIndex; i < newNavbarPath.length; i++) {
        currentNavbarPath.push(createNavbarPathSegment(newNavbarPath[i]));
    }
}
exports.setNavbarPath = setNavbarPath;

},{"../data/settings":44,"../hs":45,"../util/DOM":62,"./contentControl":24,"./layoutControl":27,"./menuControl":28}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagePathHandler = void 0;
const keyboard_1 = require("../input/keyboard");
const author_1 = require("../pages/author");
const taggingTool_1 = require("../pages/taggingTool");
const tagSearch_1 = require("../pages/tagSearch");
const visitCount_1 = require("../pages/visitCount");
const contentControl_1 = require("./contentControl");
const layoutControl_1 = require("./layoutControl");
const menuControl_1 = require("./menuControl");
const pages = [
    visitCount_1.visitCount,
    author_1.author,
    taggingTool_1.taggingTool,
    tagSearch_1.tagSearch,
];
class PagePath {
    constructor(current, prefix) {
        this.current = current;
        this.prefix = prefix;
    }
    get() {
        return this.current;
    }
    set(newPath) {
        this.current = newPath;
        window.history.replaceState(null, document.title, this.prefix + newPath);
    }
}
const pagePathHandler = path => {
    for (const page of pages) {
        if (path === page.name || path.startsWith(page.name + '/')) {
            const content = (0, contentControl_1.newContent)(contentControl_1.Side.RIGHT);
            keyboard_1.escapeKeyPressEvent.onceUntil(menuControl_1.enterMenuMode, content.leavingEvent);
            (0, layoutControl_1.setLayout)(layoutControl_1.Layout.MAIN);
            const handleResult = page.handler(content, new PagePath(path.substr(page.name.length + 1), `#/page/${page.name}/`));
            return handleResult;
        }
    }
    return false;
};
exports.pagePathHandler = pagePathHandler;

},{"../input/keyboard":48,"../pages/author":58,"../pages/tagSearch":59,"../pages/taggingTool":60,"../pages/visitCount":61,"./contentControl":24,"./layoutControl":27,"./menuControl":28}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberPersistentItem = exports.StringPersistentItem = exports.PersistentItem = void 0;
class PersistentItem {
    constructor(key, serializer, deserializer) {
        this.key = key;
        this.serializer = serializer;
        this.deserializer = deserializer;
    }
    getValue() {
        const str = window.localStorage.getItem(this.key);
        if (str === null) {
            return null;
        }
        return this.deserializer(str);
    }
    setValue(value) {
        window.localStorage.setItem(this.key, this.serializer(value));
    }
    remove() {
        window.localStorage.removeItem(this.key);
    }
    setValueNullable(value) {
        if (value === null) {
            this.remove();
        }
        else {
            this.setValue(value);
        }
    }
    exists() {
        return this.getValue() !== null;
    }
}
exports.PersistentItem = PersistentItem;
const identity = (input) => input;
class StringPersistentItem extends PersistentItem {
    constructor(key) {
        super(key, identity, identity);
    }
}
exports.StringPersistentItem = StringPersistentItem;
const numberToString = (input) => String(input);
const stringToNumber = (input) => {
    const num = +input;
    if (Number.isNaN(num)) {
        return null;
    }
    return num;
};
class NumberPersistentItem extends PersistentItem {
    constructor(key) {
        super(key, numberToString, stringToNumber);
    }
}
exports.NumberPersistentItem = NumberPersistentItem;

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPreloaderBlock = void 0;
const _e_1 = require("../$e");
const array_1 = require("../util/array");
const math_1 = require("../util/math");
function getLine(percentage) {
    const style = (percentage === 100) ? {} : { clipPath: `inset(0 ${100 - percentage}% 0 0)` };
    return ((0, _e_1.$e)("div", { className: 'flash-container', style: style },
        (0, _e_1.$e)("div", { className: 'flash' })));
}
function getFullLine() {
    return getLine(100);
}
function getPartialLine() {
    return getLine(Math.random() * 60 + 20);
}
function addPreloaderBlock(content) {
    return content.addBlock({
        initElement: ((0, _e_1.$e)("div", { className: 'preloader' },
            (0, _e_1.$e)("div", { className: 'preloader-title' }, getPartialLine()),
            (0, array_1.produce)(12, () => ((0, _e_1.$e)("div", { className: 'preloader-paragraph' },
                (0, array_1.produce)((0, math_1.randomInt)(1, 5), getFullLine),
                getPartialLine()))))),
    });
}
exports.addPreloaderBlock = addPreloaderBlock;

},{"../$e":8,"../util/array":63,"../util/math":67}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processElements = void 0;
const DOM_1 = require("../util/DOM");
function processElements($parent) {
    Array.from($parent.getElementsByTagName('a')).forEach(($anchor) => {
        const hrefAttribute = $anchor.attributes.getNamedItem('href');
        if (hrefAttribute !== null && !hrefAttribute.value.startsWith('#')) {
            $anchor.target = '_blank';
        }
        $anchor.rel = 'noopener noreferrer';
        $anchor.className = 'regular';
    });
    Array.from($parent.getElementsByTagName('code')).forEach($code => $code.addEventListener('dblclick', () => {
        if (!($code.parentNode instanceof HTMLPreElement)) {
            (0, DOM_1.selectNode)($code);
        }
    }));
    Array.from($parent.getElementsByTagName('img')).forEach($image => {
        const src = $image.src;
        const fullResolutionPath = src.replace(/\.([^.]+)$/, '.full.$1');
        $image.style.cursor = 'zoom-in';
        $image.addEventListener('click', () => window.open(fullResolutionPath));
    });
}
exports.processElements = processElements;

},{"../util/DOM":62}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPushHelperBlock = void 0;
const _e_1 = require("../$e");
const settings_1 = require("../data/settings");
const contentControl_1 = require("./contentControl");
const modalControl_1 = require("./modalControl");
function addPushHelperBlock(content, chapter) {
    if (!settings_1.enablePushHelper.getValue()) {
        return;
    }
    content.addBlock({
        initElement: ((0, _e_1.$e)("div", null,
            (0, _e_1.$e)("h3", null, "\u63A8\u9001\u52A9\u624B"),
            (0, _e_1.$e)("div", { className: 'button-container' },
                (0, _e_1.$e)("div", { onclick: () => {
                        openPushHelper(chapter);
                    } }, "\u6253\u5F00\u63A8\u9001\u52A9\u624B")),
            (0, _e_1.$e)("p", null, "\u63A8\u9001\u52A9\u624B\u662F\u7ED9\u300A\u53EF\u7A7F\u6234\u79D1\u6280\u300B\u7684\u7F16\u8F91\u4EEC\u4F7F\u7528\u7684\u5DE5\u5177\u3002\u5982\u679C\u4F60\u4E0D\u662F\u300A\u53EF\u7A7F\u6234\u79D1\u6280\u300B\u7684\u7F16\u8F91\uFF0C\u4F60\u53EF\u4EE5\u524D\u5F80\u8BBE\u7F6E\u5E76\u7981\u7528\u63A8\u9001\u52A9\u624B\u3002"))),
        side: contentControl_1.ContentBlockSide.LEFT,
    });
}
exports.addPushHelperBlock = addPushHelperBlock;
function openPushHelper(chapter) {
    var _a, _b;
    const tags = [...new Set((_b = (_a = chapter.tags) === null || _a === void 0 ? void 0 : _a.map(tagVariant => `#${tagVariant.split('（')[0]}`)) !== null && _b !== void 0 ? _b : [])];
    const modal = new modalControl_1.Modal((0, _e_1.$e)("div", null,
        (0, _e_1.$e)("h1", null, "\u63A8\u9001\u52A9\u624B"),
        (0, _e_1.$e)("p", null,
            "\u5B57\u6570\uFF1A",
            chapter.charsCount),
        (0, _e_1.$e)("p", null, "\u6807\u7B7E\uFF1A"),
        (0, _e_1.$e)("pre", { className: 'wrapping' },
            (0, _e_1.$e)("code", null, tags.join(' '))),
        (0, _e_1.$e)("div", { className: 'button-container' },
            (0, _e_1.$e)("div", { onclick: () => modal.close() }, "\u5173\u95ED"))));
    modal.setDismissible();
    modal.open();
}

},{"../$e":8,"../data/settings":44,"./contentControl":24,"./modalControl":30}],37:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const data_1 = require("../data/data");
function nextTick() {
    return new Promise(resolve => setTimeout(resolve, 1));
}
function matchTag(tagList, searchTag) {
    if (tagList.includes(searchTag)) {
        return searchTag;
    }
    if (searchTag.includes('（')) {
        // Search tag has specified tag variant
        return null;
    }
    // tagList may contain tag variant of search tag
    for (const tag of tagList) {
        if (tag.startsWith(searchTag + '（')) {
            return tag;
        }
    }
    return null;
}
function search(searchInput) {
    return __awaiter(this, void 0, void 0, function* () {
        let sliceStartTime = Date.now();
        const candidates = [];
        eachChapter: for (const { chapter } of data_1.relativePathLookUpMap.values()) {
            if (Date.now() - sliceStartTime > 10) {
                yield nextTick();
                sliceStartTime = Date.now();
            }
            if (chapter.tags === undefined) {
                continue;
            }
            let score = 0;
            const matchedTags = [];
            for (const { searchTag, type } of searchInput) {
                const matchedTag = matchTag(chapter.tags, searchTag);
                if (type === 'excluded') {
                    if (matchedTag !== null) {
                        continue eachChapter;
                    }
                    score++;
                }
                else if (type === 'required') {
                    if (matchedTag === null) {
                        continue eachChapter;
                    }
                    score++;
                    matchedTags.push(matchedTag);
                }
                else if (type === 'favored' && matchedTag !== null) {
                    score++;
                    matchedTags.push(matchedTag);
                }
            }
            if (score > 0) {
                candidates.push({
                    score,
                    chapter,
                    matchedTags,
                });
            }
        }
        candidates.sort((a, b) => (a.score !== b.score)
            ? (b.score - a.score)
            : (b.chapter.creationTime - a.chapter.creationTime));
        return candidates;
    });
}
exports.search = search;

},{"../data/data":40}],38:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showUpdateProfileModal = exports.showLoginModal = exports.init = exports.removeNewMentionLink = exports.getCurrentUser = exports.registerWithResultPopup = exports.tokenItem = void 0;
const messages_1 = require("../constant/messages");
const hrefs_1 = require("../data/hrefs");
const DebugLogger_1 = require("../DebugLogger");
const hs_1 = require("../hs");
const Menu_1 = require("../Menu");
const DOM_1 = require("../util/DOM");
const backendControl_1 = require("./backendControl");
const menuControl_1 = require("./menuControl");
const modalControl_1 = require("./modalControl");
const persistentItem_1 = require("./persistentItem");
const debugLogger = new DebugLogger_1.DebugLogger('User Control');
exports.tokenItem = new persistentItem_1.StringPersistentItem('token');
let initializedData = null;
function registerWithResultPopup(displayName, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield (0, backendControl_1.fetchRegister)(displayName, email !== null && email !== void 0 ? email : undefined);
        }
        catch (error) {
            (0, modalControl_1.showGenericError)(messages_1.GENERIC_INTERNET_ERROR);
            debugLogger.error(error);
            return false;
        }
        if (!result.success) {
            (0, modalControl_1.showGenericError)((0, backendControl_1.getErrorMessage)(result.code));
            return false;
        }
        else {
            exports.tokenItem.setValue(result.token);
            initializedData = {
                displayName,
                userName: result.user_name,
                email,
            };
            return true;
        }
    });
}
exports.registerWithResultPopup = registerWithResultPopup;
function getCurrentUser() {
    return initializedData;
}
exports.getCurrentUser = getCurrentUser;
let newMentionLink = null;
function removeNewMentionLink() {
    if (newMentionLink === null) {
        return;
    }
    newMentionLink.remove();
    newMentionLink = null;
}
exports.removeNewMentionLink = removeNewMentionLink;
var InitResult;
(function (InitResult) {
    InitResult[InitResult["SUCCESS"] = 0] = "SUCCESS";
    InitResult[InitResult["ERROR_NETWORK"] = 1] = "ERROR_NETWORK";
    InitResult[InitResult["ERROR_TOKEN"] = 2] = "ERROR_TOKEN";
})(InitResult || (InitResult = {}));
function init(token) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // 以下代码用于从后端拉取是否有新回复
        // 这一步不会记录任何个人数据
        debugLogger.log('Initializing.');
        removeNewMentionLink();
        let data;
        try {
            data = yield (0, backendControl_1.fetchInit)(token);
        }
        catch (error) {
            debugLogger.warn('Initialization failed: ', error);
            return InitResult.ERROR_NETWORK;
        }
        if (data.success) {
            exports.tokenItem.setValue(token);
            initializedData = {
                displayName: data.display_name,
                email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                userName: data.user_name,
            };
            debugLogger.log(`Initialization result: ${data.mentions} new mentions.`);
            if (data.mentions !== 0) {
                newMentionLink = menuControl_1.mainMenu.addItem(`您有 ${data.mentions} 条新回复`, {
                    button: true,
                    link: (0, hrefs_1.pageHref)('recent-mentions'),
                    decoration: Menu_1.ItemDecoration.ICON_NOTIFICATION,
                    location: Menu_1.ItemLocation.BEFORE,
                });
                newMentionLink.addClass('force-small');
            }
            return InitResult.SUCCESS;
        }
        else {
            debugLogger.warn('Initialization failed: Invalid token.');
            return InitResult.ERROR_TOKEN;
        }
    });
}
exports.init = init;
function showLoginModal() {
    var _a;
    const initialTokenValue = (_a = exports.tokenItem.getValue()) !== null && _a !== void 0 ? _a : '';
    const $tokenInput = (0, hs_1.h)('input', {
        value: initialTokenValue,
    });
    const $confirmButton = (0, hs_1.h)('div.display-none', {
        onclick: () => {
            if ($tokenInput.value === '') {
                (0, modalControl_1.showGenericError)(messages_1.USER_TOKEN_CHANGE_EMPTY);
                return;
            }
            const loadingModal = (0, modalControl_1.showGenericLoading)(messages_1.USER_TOKEN_CHANGE_CHECKING);
            debugLogger.log('Changing token...');
            init($tokenInput.value).then(initResult => {
                if (initResult === InitResult.SUCCESS) {
                    debugLogger.log('Change token successful.');
                    (0, modalControl_1.showGenericSuccess)(messages_1.USER_TOKEN_CHANGE_SUCCESS).then(() => {
                        loginModal.close();
                    });
                }
                else {
                    if (initResult === InitResult.ERROR_NETWORK) {
                        (0, modalControl_1.showGenericError)(messages_1.GENERIC_INTERNET_ERROR);
                    }
                    else {
                        (0, modalControl_1.showGenericError)(messages_1.USER_TOKEN_CHANGE_INVALID);
                    }
                }
            }).finally(() => {
                loadingModal.close();
            });
        },
    }, messages_1.GENERIC_CONFIRM);
    const $closeButton = (0, hs_1.h)('div', {
        onclick: () => {
            loginModal.close();
        }
    }, messages_1.GENERIC_CLOSE);
    $tokenInput.addEventListener('input', () => {
        if ($tokenInput.value === initialTokenValue) {
            $confirmButton.classList.add('display-none');
            $closeButton.innerText = messages_1.GENERIC_CLOSE;
        }
        else {
            $confirmButton.classList.remove('display-none');
            $closeButton.innerText = messages_1.GENERIC_CANCEL;
        }
    });
    const loginModal = new modalControl_1.Modal((0, hs_1.h)('div', [
        (0, hs_1.h)('h1', messages_1.USER_TOKEN_CHANGE_TITLE),
        ...messages_1.USER_TOKEN_CHANGE_DESC.split('\n').map(p => (0, hs_1.h)('p', p)),
        (0, hs_1.h)('.input-group', [
            (0, hs_1.h)('span', messages_1.USER_TOKEN_CHANGE_INPUT_LABEL),
            $tokenInput,
        ]),
        (0, hs_1.h)('.button-container', [
            $confirmButton,
            $closeButton,
        ]),
    ]));
    loginModal.open();
}
exports.showLoginModal = showLoginModal;
function showUpdateProfileModal() {
    return new Promise(resolve => {
        var _a;
        if (!exports.tokenItem.exists()) {
            (0, modalControl_1.showGenericHint)(messages_1.USER_TOKEN_DOES_NOT_EXIST);
            return;
        }
        const userData = initializedData;
        if (userData === null) {
            (0, modalControl_1.showGenericError)(messages_1.USER_UPDATE_PROFILE_ERROR_NOT_INITIALIZED);
            console.error(1);
            return;
        }
        const $nameInput = (0, hs_1.h)('input', {
            value: userData.displayName,
        });
        const $emailInput = (0, hs_1.h)('input', {
            value: (_a = userData.email) !== null && _a !== void 0 ? _a : '',
        });
        const updateProfileModal = new modalControl_1.Modal((0, hs_1.h)('div', [
            (0, hs_1.h)('h1', messages_1.USER_UPDATE_PROFILE_TITLE),
            ...messages_1.USER_UPDATE_PROFILE_DESC.split('\n').map(p => (0, hs_1.h)('p', p)),
            (0, hs_1.h)('ul', [
                (0, hs_1.h)('li', messages_1.USER_UPDATE_PROFILE_HINT_USER_NAME),
                (0, hs_1.h)('li', messages_1.USER_UPDATE_PROFILE_HINT_DISPLAY_NAME),
                (0, hs_1.h)('li', [
                    messages_1.USER_UPDATE_PROFILE_HINT_EMAIL_0,
                    (0, DOM_1.externalLink)(messages_1.USER_UPDATE_PROFILE_HINT_EMAIL_GRAVATAR_LINK, 'https://cn.gravatar.com/'),
                    messages_1.USER_UPDATE_PROFILE_HINT_EMAIL_1,
                ]),
            ]),
            (0, hs_1.h)('.input-group', [
                (0, hs_1.h)('span', messages_1.USER_UPDATE_PROFILE_USER_NAME_INPUT_LABEL + '@' + userData.userName),
            ]),
            (0, hs_1.h)('.input-group', [
                (0, hs_1.h)('span', messages_1.USER_UPDATE_PROFILE_DISPLAY_NAME_INPUT_LABEL),
                $nameInput,
            ]),
            (0, hs_1.h)('.input-group', [
                (0, hs_1.h)('span', messages_1.USER_UPDATE_PROFILE_EMAIL_INPUT_LABEL),
                $emailInput,
            ]),
            (0, hs_1.h)('.button-container', [
                (0, hs_1.h)('div', {
                    onclick: () => {
                        if ($nameInput.value === '') {
                            (0, modalControl_1.showGenericError)(messages_1.USER_UPDATE_PROFILE_DISPLAY_NAME_EMPTY);
                            return;
                        }
                        const loadingModal = (0, modalControl_1.showGenericLoading)(messages_1.USER_UPDATE_PROFILE_LOADING);
                        debugLogger.log('Updating profile...');
                        const newDisplayName = $nameInput.value;
                        const newEmail = ($emailInput.value === '') ? undefined : $emailInput.value;
                        (0, backendControl_1.fetchUpdateProfile)(exports.tokenItem.getValue(), newDisplayName, newEmail)
                            .then(result => {
                            if (result.success) {
                                (0, modalControl_1.showGenericSuccess)(messages_1.USER_UPDATE_PROFILE_SUCCESS).then(() => {
                                    updateProfileModal.close();
                                    resolve();
                                });
                                userData.displayName = newDisplayName;
                                userData.email = newEmail !== null && newEmail !== void 0 ? newEmail : null;
                                debugLogger.log('Update profile success');
                            }
                            else {
                                debugLogger.warn('Update profile failed, error code:', result.code, ', translated:', (0, backendControl_1.getErrorMessage)(result.code));
                                (0, modalControl_1.showGenericError)((0, backendControl_1.getErrorMessage)(result.code));
                            }
                        }, error => {
                            (0, modalControl_1.showGenericError)(messages_1.GENERIC_INTERNET_ERROR);
                            debugLogger.error('Update profile failed:', error);
                        })
                            .finally(() => {
                            loadingModal.close();
                        });
                    }
                }, messages_1.GENERIC_CONFIRM),
                (0, hs_1.h)('div', {
                    onclick: () => {
                        updateProfileModal.close();
                        resolve();
                    }
                }, messages_1.GENERIC_CANCEL),
            ]),
        ]));
        updateProfileModal.open();
    });
}
exports.showUpdateProfileModal = showUpdateProfileModal;

},{"../DebugLogger":9,"../Menu":11,"../constant/messages":13,"../data/hrefs":42,"../hs":45,"../util/DOM":62,"./backendControl":21,"./menuControl":28,"./modalControl":30,"./persistentItem":33}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSingleCache = exports.AutoCache = void 0;
class AutoCache {
    constructor(loader, logger) {
        this.loader = loader;
        this.logger = logger;
        this.map = new Map();
    }
    delete(key) {
        this.map.delete(key);
    }
    get(key) {
        let value = this.map.get(key);
        if (value === undefined) {
            this.logger.log(`Start loading for key=${key}.`);
            value = this.loader(key);
            this.map.set(key, value);
            value.catch(error => {
                this.map.delete(key);
                this.logger.warn(`Loader failed for key=${key}. Cache removed.`, error);
            });
        }
        else {
            this.logger.log(`Cached value used for key=${key}.`);
        }
        return value;
    }
}
exports.AutoCache = AutoCache;
class AutoSingleCache extends AutoCache {
    constructor(loader, logger) {
        super(loader, logger);
    }
    delete() {
        super.delete(null);
    }
    get() {
        return super.get(null);
    }
}
exports.AutoSingleCache = AutoSingleCache;

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagAliasMap = exports.authorInfoMap = exports.relativePathLookUpMap = exports.tagCountMap = exports.data = void 0;
const DebugLogger_1 = require("../DebugLogger");
exports.data = window.DATA;
const debugLogger = new DebugLogger_1.DebugLogger('Data');
exports.tagCountMap = new Map();
function incrementCount(tag) {
    var _a;
    exports.tagCountMap.set(tag, ((_a = exports.tagCountMap.get(tag)) !== null && _a !== void 0 ? _a : 0) + 1);
}
exports.relativePathLookUpMap = new Map();
function iterateFolder(folder) {
    folder.children.forEach((child, index) => {
        var _a;
        if (child.type === 'folder') {
            iterateFolder(child);
        }
        else {
            exports.relativePathLookUpMap.set(child.htmlRelativePath, {
                folder,
                chapter: child,
                inFolderIndex: index,
            });
            (_a = child.tags) === null || _a === void 0 ? void 0 : _a.forEach(tag => {
                incrementCount(tag);
                if (tag.includes('（')) {
                    incrementCount(tag.substr(0, tag.indexOf('（')));
                }
            });
        }
    });
}
const startTime = Date.now();
iterateFolder(exports.data.chapterTree);
debugLogger.log(`Iterating folders took ${Date.now() - startTime}ms.`);
exports.authorInfoMap = new Map();
for (const authorInfo of exports.data.authorsInfo) {
    exports.authorInfoMap.set(authorInfo.name, authorInfo);
}
exports.tagAliasMap = new Map(exports.data.tagAliases);

},{"../DebugLogger":9}],41:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.dbKVGet = exports.dbKVSet = exports.dbKVKey = exports.untilSuccess = void 0;
const DebugLogger_1 = require("../DebugLogger");
let db = null;
const debugLogger = new DebugLogger_1.DebugLogger('IndexedDB');
const migrations = new Map([
    [0, db => {
            const readingProgress = db.createObjectStore('readingProgress', { keyPath: 'relativePath' });
            readingProgress.createIndex('lastRead', 'lastRead');
        }],
    [1, db => {
            db.createObjectStore('simpleKV');
        }]
]);
/**
 * Turn an event target into a promise.
 * ! NOTE: This does not handle onerror, as errors are expected to bubble up.
 */
function untilSuccess(target) {
    return new Promise(resolve => {
        target.onsuccess = function () {
            resolve(this.result);
        };
    });
}
exports.untilSuccess = untilSuccess;
function dbKVKey(key) {
    return { key };
}
exports.dbKVKey = dbKVKey;
function dbKVSet(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield getDb();
        const store = db.transaction('simpleKV', 'readwrite').objectStore('simpleKV');
        yield untilSuccess(store.put(value, key.key));
    });
}
exports.dbKVSet = dbKVSet;
function dbKVGet(key) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield getDb();
        const store = db.transaction('simpleKV', 'readwrite').objectStore('simpleKV');
        return (_a = yield untilSuccess(store.get(key.key))) !== null && _a !== void 0 ? _a : null;
    });
}
exports.dbKVGet = dbKVGet;
function getDb() {
    if (db === null) {
        db = new Promise((resolve, reject) => {
            debugLogger.log('Open database');
            const request = window.indexedDB.open('main', 2);
            request.onsuccess = () => {
                debugLogger.log('Database successfully opened.');
                resolve(request.result);
            };
            request.onerror = () => {
                debugLogger.error('Database failed to open: ', request.error);
                reject(request.error);
            };
            request.onupgradeneeded = event => {
                debugLogger.log(`Migrating from ${event.oldVersion} to ${event.newVersion}`);
                const db = request.result;
                for (let version = event.oldVersion; version < event.newVersion; version++) {
                    const migration = migrations.get(version);
                    if (migration === undefined) {
                        throw new Error(`Missing migration for version=${version}.`);
                    }
                    debugLogger.log(`Running migration ${version} -> ${version + 1}`);
                    migration(db);
                }
                debugLogger.log('Migration completed');
            };
        });
    }
    return db;
}
exports.getDb = getDb;

},{"../DebugLogger":9}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagSearchHref = exports.mirrorLandingHref = exports.pageHref = exports.chapterHref = void 0;
function chapterHref(htmlRelativePath) {
    return `#/chapter/${htmlRelativePath}`;
}
exports.chapterHref = chapterHref;
function pageHref(pageName) {
    return `#/page/${pageName}`;
}
exports.pageHref = pageHref;
function mirrorLandingHref(origin, token, scroll) {
    let href = `${origin}/#/mirror-landing`;
    if (token !== null) {
        href += `~token=${token}`;
    }
    if (scroll !== undefined) {
        href += `~scroll=${scroll}`;
    }
    return href;
}
exports.mirrorLandingHref = mirrorLandingHref;
function tagSearchHref(tag) {
    return `#/page/tag-search/${tag}`;
}
exports.tagSearchHref = tagSearchHref;

},{}],43:[function(require,module,exports){
"use strict";
// Tracking reading progress
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.updateChapterProgress = void 0;
const db_1 = require("./db");
function getReadonlyStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        return db.transaction('readingProgress').objectStore('readingProgress');
    });
}
function getStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        return db.transaction('readingProgress', 'readwrite').objectStore('readingProgress');
    });
}
function updateChapterProgress(relativePath, progress) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const store = yield getStore();
        const result = (yield (0, db_1.untilSuccess)(store.get(relativePath)));
        yield (0, db_1.untilSuccess)(store.put({
            relativePath,
            lastRead: new Date(),
            progress: Math.max(progress, (_a = result === null || result === void 0 ? void 0 : result.progress) !== null && _a !== void 0 ? _a : 0),
        }));
    });
}
exports.updateChapterProgress = updateChapterProgress;
function getHistory(entries = 20) {
    return __awaiter(this, void 0, void 0, function* () {
        const store = yield getReadonlyStore();
        const lastReadIndex = store.index('lastRead');
        return new Promise(resolve => {
            const results = [];
            lastReadIndex.openCursor(null, 'prev').onsuccess = function () {
                const cursor = this.result;
                if (cursor !== null) {
                    results.push(cursor.value);
                    if (results.length >= entries) {
                        resolve(results);
                    }
                    else {
                        cursor.continue();
                    }
                }
                else {
                    resolve(results);
                }
            };
        });
    });
}
exports.getHistory = getHistory;

},{"./db":41}],44:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lite = exports.chapterRecommendationCount = exports.enablePushHelper = exports.showAbandonedChapters = exports.wtcdGameQuickLoadConfirm = exports.charCount = exports.developerMode = exports.fontFamily = exports.gestureSwitchChapter = exports.useComments = exports.earlyAccess = exports.warning = exports.animation = exports.EnumSetting = exports.BooleanSetting = void 0;
const Event_1 = require("../Event");
const noop = () => { };
class BooleanSetting {
    constructor(key, defaultValue) {
        this.key = key;
        this.event = new Event_1.Event();
        if (defaultValue) {
            this.value = window.localStorage.getItem(key) !== 'false';
        }
        else {
            this.value = window.localStorage.getItem(key) === 'true';
        }
        this.updateLocalStorage();
        setImmediate(() => this.event.emit(this.value));
    }
    updateLocalStorage() {
        window.localStorage.setItem(this.key, String(this.value));
    }
    getValue() {
        return this.value;
    }
    setValue(newValue) {
        if (newValue !== this.value) {
            this.event.emit(newValue);
        }
        this.value = newValue;
        this.updateLocalStorage();
    }
    toggle() {
        this.setValue(!this.value);
    }
}
exports.BooleanSetting = BooleanSetting;
class EnumSetting {
    constructor(key, options, defaultValue, onUpdate = noop) {
        this.key = key;
        this.options = options;
        this.defaultValue = defaultValue;
        this.onUpdate = onUpdate;
        if (!this.isCorrectValue(defaultValue)) {
            throw new Error(`Default value ${defaultValue} is not correct.`);
        }
        this.value = +(window.localStorage.getItem(key) || defaultValue);
        this.correctValue();
        this.onUpdate(this.value, this.options[this.value]);
    }
    isCorrectValue(value) {
        return !(Number.isNaN(value) || value % 1 !== 0 || value < 0 || value >= this.options.length);
    }
    correctValue() {
        if (!this.isCorrectValue(this.value)) {
            this.value = this.defaultValue;
        }
    }
    updateLocalStorage() {
        window.localStorage.setItem(this.key, String(this.value));
    }
    getValue() {
        return this.value;
    }
    getValueName() {
        return this.options[this.value];
    }
    setValue(newValue) {
        if (newValue !== this.value) {
            this.onUpdate(newValue, this.options[newValue]);
        }
        this.value = newValue;
        this.updateLocalStorage();
    }
}
exports.EnumSetting = EnumSetting;
exports.animation = new BooleanSetting('animation', true);
exports.animation.event.on(value => {
    setTimeout(() => {
        document.body.classList.toggle('animation-enabled', value);
    }, 1);
});
exports.warning = new BooleanSetting('warning', false);
exports.earlyAccess = new BooleanSetting('earlyAccess', false);
exports.useComments = new BooleanSetting('useComments', false);
exports.gestureSwitchChapter = new BooleanSetting('gestureSwitchChapter', true);
// https://github.com/zenozeng/fonts.css
const fontFamilyCssValues = [
    '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
    'Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, DFKai-SB, "TW\-Kai", serif',
    'Georgia, "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", STSong, "AR PL New Sung", "AR PL SungtiL GB", NSimSun, SimSun, "TW\-Sung", "WenQuanYi Bitmap Song", "AR PL UMing CN", "AR PL UMing HK", "AR PL UMing TW", "AR PL UMing TW MBE", PMingLiU, MingLiU, serif',
    'Baskerville, "Times New Roman", "Liberation Serif", STFangsong, FangSong, FangSong_GB2312, "CWTEX\-F", serif',
];
exports.fontFamily = new EnumSetting('fontFamily', ['黑体', '楷体', '宋体', '仿宋'], 0, (fontFamilyIndex) => {
    document.documentElement.style.setProperty('--font-family', fontFamilyCssValues[fontFamilyIndex]);
    document.documentElement.style.setProperty('--font-family-mono', '"Fira Code", ' + fontFamilyCssValues[fontFamilyIndex]);
});
exports.developerMode = new BooleanSetting('developerMode', false);
exports.charCount = new BooleanSetting('charCount', true);
exports.wtcdGameQuickLoadConfirm = new BooleanSetting('wtcdGameQuickLoadConfirm', true);
exports.showAbandonedChapters = new BooleanSetting('showAbandonedChapters', false);
exports.enablePushHelper = new BooleanSetting('enablePushHelper', false);
exports.chapterRecommendationCount = new EnumSetting('chapterRecommendationCount', ['禁用', '5 条', '10 条', '15 条', '20 条', '25 条', '30 条', '35 条', '40 条', '45 条', '50 条'], 2);
exports.lite = new BooleanSetting('lite', false);

}).call(this)}).call(this,require("timers").setImmediate)
},{"../Event":10,"timers":7}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h = void 0;
const hs = require("hyperscript");
exports.h = hs;

},{"hyperscript":4}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("./constant/messages");
require("./control/analyticsControl");
const followQuery_1 = require("./control/followQuery");
const modalControl_1 = require("./control/modalControl");
require("./control/navbarControl");
const userControl_1 = require("./control/userControl");
const data_1 = require("./data/data");
const settings_1 = require("./data/settings");
const DOM_1 = require("./util/DOM");
const $warning = (0, DOM_1.id)('warning');
if ($warning !== null) {
    $warning.addEventListener('click', () => {
        $warning.style.opacity = '0';
        if (settings_1.animation.getValue()) {
            $warning.addEventListener('transitionend', () => {
                $warning.remove();
            });
        }
        else {
            $warning.remove();
        }
    });
}
const $buildNumber = (0, DOM_1.id)('build-number');
$buildNumber.innerText = `Build ${data_1.data.buildNumber}`;
if (userControl_1.tokenItem.exists()) {
    (0, userControl_1.init)(userControl_1.tokenItem.getValue());
}
if (data_1.data.buildError) {
    (0, modalControl_1.notify)(messages_1.BUILD_FAILED_TITLE, messages_1.BUILD_FAILED_DESC, messages_1.BUILD_FAILED_OK);
}
(0, followQuery_1.initPathHandlers)();
window.addEventListener('popstate', () => {
    (0, followQuery_1.followQuery)();
});
(0, followQuery_1.followQuery)();

},{"./constant/messages":13,"./control/analyticsControl":20,"./control/followQuery":25,"./control/modalControl":30,"./control/navbarControl":31,"./control/userControl":38,"./data/data":40,"./data/settings":44,"./util/DOM":62}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swipeEvent = exports.SwipeDirection = void 0;
const DebugLogger_1 = require("../DebugLogger");
const Event_1 = require("../Event");
const DOM_1 = require("../util/DOM");
var SwipeDirection;
(function (SwipeDirection) {
    SwipeDirection[SwipeDirection["TO_TOP"] = 0] = "TO_TOP";
    SwipeDirection[SwipeDirection["TO_RIGHT"] = 1] = "TO_RIGHT";
    SwipeDirection[SwipeDirection["TO_BOTTOM"] = 2] = "TO_BOTTOM";
    SwipeDirection[SwipeDirection["TO_LEFT"] = 3] = "TO_LEFT";
})(SwipeDirection = exports.SwipeDirection || (exports.SwipeDirection = {}));
const gestureMinWidth = 900;
exports.swipeEvent = new Event_1.Event();
const horizontalMinXProportion = 0.17;
const horizontalMaxYProportion = 0.1;
const verticalMinYProportion = 0.1;
const verticalMaxProportion = 0.1;
const swipeTimeThreshold = 500;
let startX = 0;
let startY = 0;
let startTime = 0;
let startTarget = null;
window.addEventListener('touchstart', event => {
    // Only listen for first touch starts
    if (event.touches.length !== 1) {
        return;
    }
    startTarget = event.target;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    startTime = Date.now();
});
window.addEventListener('touchend', event => {
    // Only listen for last touch ends
    if (event.touches.length !== 0) {
        return;
    }
    // Ignore touches that lasted too long
    if (Date.now() - startTime > swipeTimeThreshold) {
        return;
    }
    if (window.innerWidth > gestureMinWidth) {
        return;
    }
    const deltaX = event.changedTouches[0].clientX - startX;
    const deltaY = event.changedTouches[0].clientY - startY;
    const xProportion = Math.abs(deltaX / window.innerWidth);
    const yProportion = Math.abs(deltaY / window.innerHeight);
    if (xProportion > horizontalMinXProportion && yProportion < horizontalMaxYProportion) {
        // Horizontal swipe detected
        // Check for scrollable element
        if ((0, DOM_1.isAnyParent)(startTarget, $element => ((window.getComputedStyle($element).getPropertyValue('overflow-x') !== 'hidden') &&
            ($element.scrollWidth > $element.clientWidth)))) {
            return;
        }
        if (deltaX > 0) {
            exports.swipeEvent.emit(SwipeDirection.TO_RIGHT);
        }
        else {
            exports.swipeEvent.emit(SwipeDirection.TO_LEFT);
        }
    }
    else if (yProportion > verticalMinYProportion && xProportion < verticalMaxProportion) {
        // Vertical swipe detected
        // Check for scrollable element
        if ((0, DOM_1.isAnyParent)(startTarget, $element => ((window.getComputedStyle($element).getPropertyValue('overflow-y') !== 'hidden') &&
            ($element.scrollHeight > $element.clientHeight)))) {
            return;
        }
        if (deltaY > 0) {
            exports.swipeEvent.emit(SwipeDirection.TO_BOTTOM);
        }
        else {
            exports.swipeEvent.emit(SwipeDirection.TO_TOP);
        }
    }
});
const swipeEventDebugLogger = new DebugLogger_1.DebugLogger('Swipe Event');
exports.swipeEvent.on(direction => {
    swipeEventDebugLogger.log(SwipeDirection[direction]);
});

},{"../DebugLogger":9,"../Event":10,"../util/DOM":62}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeKeyPressEvent = exports.arrowKeyPressEvent = exports.ArrowKey = void 0;
const DebugLogger_1 = require("../DebugLogger");
const Event_1 = require("../Event");
var ArrowKey;
(function (ArrowKey) {
    ArrowKey[ArrowKey["LEFT"] = 0] = "LEFT";
    ArrowKey[ArrowKey["UP"] = 1] = "UP";
    ArrowKey[ArrowKey["RIGHT"] = 2] = "RIGHT";
    ArrowKey[ArrowKey["DOWN"] = 3] = "DOWN";
})(ArrowKey = exports.ArrowKey || (exports.ArrowKey = {}));
exports.arrowKeyPressEvent = new Event_1.Event();
exports.escapeKeyPressEvent = new Event_1.Event();
document.addEventListener('keydown', event => {
    if (event.repeat) {
        return;
    }
    switch (event.keyCode) {
        case 27:
            exports.escapeKeyPressEvent.emit();
            break;
        case 37:
            exports.arrowKeyPressEvent.emit(ArrowKey.LEFT);
            break;
        case 38:
            exports.arrowKeyPressEvent.emit(ArrowKey.UP);
            break;
        case 39:
            exports.arrowKeyPressEvent.emit(ArrowKey.RIGHT);
            break;
        case 40:
            exports.arrowKeyPressEvent.emit(ArrowKey.DOWN);
            break;
    }
});
const arrowEventDebugLogger = new DebugLogger_1.DebugLogger('Arrow Key Event');
exports.arrowKeyPressEvent.on(arrowKey => {
    arrowEventDebugLogger.log(ArrowKey[arrowKey]);
});

},{"../DebugLogger":9,"../Event":10}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorsMenu = void 0;
const Menu_1 = require("../Menu");
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const shortNumber_1 = require("../util/shortNumber");
class AuthorsMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase);
        // Cannot use data from authors.json because we need to list every single author
        const authors = new Map();
        Array.from(data_1.relativePathLookUpMap.values()).forEach(chapterCtx => {
            var _a;
            const chars = (_a = chapterCtx.chapter.charsCount) !== null && _a !== void 0 ? _a : 1;
            chapterCtx.chapter.authors.forEach(({ name }) => {
                if (authors.has(name)) {
                    authors.set(name, authors.get(name) + chars);
                }
                else {
                    authors.set(name, chars);
                }
            });
        });
        Array.from(authors)
            .sort((a, b) => b[1] - a[1])
            .forEach(([name, chars]) => {
            const handle = this.addItem(name, {
                button: true,
                decoration: Menu_1.ItemDecoration.ICON_PERSON,
                link: (0, hrefs_1.pageHref)(`author/${name}`),
            });
            handle.append(`[${(0, shortNumber_1.shortNumber)(chars)}]`);
        });
    }
}
exports.AuthorsMenu = AuthorsMenu;

},{"../Menu":11,"../data/data":40,"../data/hrefs":42,"../util/shortNumber":69}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterListingMenu = exports.isAbandonedFolder = exports.isEmptyFolder = void 0;
const chapterControl_1 = require("../control/chapterControl");
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const settings_1 = require("../data/settings");
const Menu_1 = require("../Menu");
const shortNumber_1 = require("../util/shortNumber");
const ChaptersMenu_1 = require("./ChaptersMenu");
function isEmptyFolder(folder) {
    return folder.children.every(child => (child.type === 'folder')
        ? isEmptyFolder(child)
        : !(0, chapterControl_1.canChapterShown)(child));
}
exports.isEmptyFolder = isEmptyFolder;
function isAbandonedFolder(folder) {
    return folder.children.every(child => (child.type === 'folder')
        ? isAbandonedFolder(child)
        : child.abandoned);
}
exports.isAbandonedFolder = isAbandonedFolder;
class ChapterListingMenu extends Menu_1.Menu {
    constructor(urlBase, folder) {
        super(urlBase);
        if (folder === undefined) {
            folder = data_1.data.chapterTree;
        }
        for (const child of folder.children) {
            if (child.type === 'folder') {
                const handle = this.buildSubMenu(child.displayName, ChapterListingMenu, child)
                    .setUrlSegment(child.displayName.replace(/ /g, '-'))
                    .setDecoration(Menu_1.ItemDecoration.ICON_FOLDER)
                    .setHidden(isEmptyFolder(child))
                    .build();
                if (isAbandonedFolder(child)) {
                    handle.prepend('[已弃坑]');
                }
                if (child.charsCount !== null && settings_1.charCount.getValue()) {
                    handle.append(`[${(0, shortNumber_1.shortNumber)(child.charsCount)}]`);
                }
            }
            else {
                if (child.hidden) {
                    continue;
                }
                if (child.abandoned && !settings_1.showAbandonedChapters.getValue()) {
                    continue;
                }
                if (child.isEarlyAccess && !settings_1.earlyAccess.getValue()) {
                    continue;
                }
                const handle = this.addItem(child.displayName, {
                    button: true,
                    link: (0, hrefs_1.chapterHref)(child.htmlRelativePath),
                    decoration: (0, ChaptersMenu_1.getDecorationForChapterType)(child.type),
                });
                if (child.abandoned) {
                    handle.prepend('[已弃坑]');
                }
                if (folder.showIndex === true) {
                    handle.prepend(`${child.displayIndex.join('.')}. `);
                }
                if (child.isEarlyAccess) {
                    handle.prepend('[编写中]');
                }
                if (child.charsCount !== null && settings_1.charCount.getValue()) {
                    handle.append(`[${(0, shortNumber_1.shortNumber)(child.charsCount)}]`);
                }
            }
        }
    }
}
exports.ChapterListingMenu = ChapterListingMenu;

},{"../Menu":11,"../control/chapterControl":22,"../data/data":40,"../data/hrefs":42,"../data/settings":44,"../util/shortNumber":69,"./ChaptersMenu":51}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaptersMenu = exports.getDecorationForChapterType = void 0;
const hrefs_1 = require("../data/hrefs");
const Menu_1 = require("../Menu");
const AuthorsMenu_1 = require("./AuthorsMenu");
const ChapterListingMenu_1 = require("./ChapterListingMenu");
const HistoryChaptersMenu_1 = require("./HistoryChaptersMenu");
const LatestChapterMenu_1 = require("./LatestChapterMenu");
function getDecorationForChapterType(chapterType) {
    switch (chapterType) {
        case 'Markdown': return Menu_1.ItemDecoration.ICON_FILE;
        case 'WTCD': return Menu_1.ItemDecoration.ICON_GAME;
    }
}
exports.getDecorationForChapterType = getDecorationForChapterType;
class ChaptersMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase);
        this.buildSubMenu('所有书目', ChapterListingMenu_1.ChapterListingMenu)
            .setDecoration(Menu_1.ItemDecoration.ICON_LIST).build();
        this.buildSubMenu('最新更新', LatestChapterMenu_1.LatestChaptersMenu)
            .setDecoration(Menu_1.ItemDecoration.ICON_CALENDER).build();
        this.buildSubMenu('阅读历史', HistoryChaptersMenu_1.HistoryChaptersMenu)
            .setDecoration(Menu_1.ItemDecoration.ICON_HISTORY).build();
        this.addItem('按标签检索', {
            button: true,
            link: (0, hrefs_1.pageHref)('tag-search'),
            decoration: Menu_1.ItemDecoration.ICON_TAG,
        });
        this.buildSubMenu('按作者检索', AuthorsMenu_1.AuthorsMenu)
            .setDecoration(Menu_1.ItemDecoration.ICON_PERSON).build();
    }
}
exports.ChaptersMenu = ChaptersMenu;

},{"../Menu":11,"../data/hrefs":42,"./AuthorsMenu":49,"./ChapterListingMenu":50,"./HistoryChaptersMenu":52,"./LatestChapterMenu":53}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryChaptersMenu = void 0;
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const readingProgress_1 = require("../data/readingProgress");
const Menu_1 = require("../Menu");
const ChaptersMenu_1 = require("./ChaptersMenu");
class HistoryChaptersMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase);
        // This is very fast. There is no need to display any loading text.
        (0, readingProgress_1.getHistory)().then(entries => {
            let hasAny = false;
            entries.forEach(({ relativePath, progress }) => {
                const chapterCtx = data_1.relativePathLookUpMap.get(relativePath);
                if (chapterCtx === undefined) {
                    return;
                }
                hasAny = true;
                const handle = this.addItem(chapterCtx.folder.displayName + ' > ' + chapterCtx.chapter.displayName, {
                    button: true,
                    decoration: (0, ChaptersMenu_1.getDecorationForChapterType)(chapterCtx.chapter.type),
                    link: (0, hrefs_1.chapterHref)(chapterCtx.chapter.htmlRelativePath),
                });
                handle.prepend(`[${progress === 1 ? '完成' : `${Math.round(progress * 100)}%`}]`);
            });
            if (!hasAny) {
                this.addItem('阅读历史为空');
            }
        }, () => {
            this.addItem('记录阅读历史需要浏览器支持 IndexedDB。您的浏览器不支持 IndexedDB。请更新浏览器后再试。');
        });
    }
}
exports.HistoryChaptersMenu = HistoryChaptersMenu;

},{"../Menu":11,"../data/data":40,"../data/hrefs":42,"../data/readingProgress":43,"./ChaptersMenu":51}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestChaptersMenu = void 0;
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const Menu_1 = require("../Menu");
const formatTime_1 = require("../util/formatTime");
const ChaptersMenu_1 = require("./ChaptersMenu");
class LatestChaptersMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase);
        let chapterCtxs = Array.from(data_1.relativePathLookUpMap.values());
        chapterCtxs = chapterCtxs.filter(chapterCtx => !chapterCtx.chapter.htmlRelativePath.includes('META'));
        chapterCtxs.sort((a, b) => b.chapter.creationTime - a.chapter.creationTime);
        chapterCtxs = chapterCtxs.slice(0, 20);
        chapterCtxs.forEach(chapterCtx => {
            const handle = this.addItem(chapterCtx.folder.displayName + ' > ' + chapterCtx.chapter.displayName, {
                button: true,
                decoration: (0, ChaptersMenu_1.getDecorationForChapterType)(chapterCtx.chapter.type),
                link: (0, hrefs_1.chapterHref)(chapterCtx.chapter.htmlRelativePath),
            });
            handle.prepend(`[${(0, formatTime_1.formatTimeRelativeLong)(new Date(chapterCtx.chapter.creationTime * 1000))}]`);
        });
        this.addItem('查看所有书目', {
            button: true,
            decoration: Menu_1.ItemDecoration.ICON_LIST,
            link: '#/menu/书目选择/所有书目',
        });
    }
}
exports.LatestChaptersMenu = LatestChaptersMenu;

},{"../Menu":11,"../data/data":40,"../data/hrefs":42,"../util/formatTime":66,"./ChaptersMenu":51}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenu = void 0;
const Menu_1 = require("../Menu");
const ChaptersMenu_1 = require("./ChaptersMenu");
const SettingsMenu_1 = require("./SettingsMenu");
const StyleMenu_1 = require("./StyleMenu");
const ThanksMenu_1 = require("./ThanksMenu");
class MainMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase);
        this.container.classList.add('main');
        this.buildSubMenu('书目选择', ChaptersMenu_1.ChaptersMenu).build();
        this.buildSubMenu('鸣谢列表', ThanksMenu_1.ThanksMenu).build();
        this.buildSubMenu('阅读器样式', StyleMenu_1.StyleMenu).build();
        this.addItem('源代码', { button: true, link: 'https://github.com/CrystalTechStudio/Library' });
        this.buildSubMenu('设置', SettingsMenu_1.SettingsMenu).build();
    }
}
exports.MainMenu = MainMenu;

},{"../Menu":11,"./ChaptersMenu":51,"./SettingsMenu":55,"./StyleMenu":56,"./ThanksMenu":57}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsMenu = exports.EnumSettingMenu = void 0;
const stylePreviewArticle_1 = require("../constant/stylePreviewArticle");
const contentControl_1 = require("../control/contentControl");
const layoutControl_1 = require("../control/layoutControl");
const processElements_1 = require("../control/processElements");
const settings_1 = require("../data/settings");
const Menu_1 = require("../Menu");
class EnumSettingMenu extends Menu_1.Menu {
    constructor(urlBase, setting, usePreview, callback) {
        super(urlBase, usePreview ? layoutControl_1.Layout.SIDE : layoutControl_1.Layout.OFF);
        let currentHandle;
        if (usePreview) {
            const block = (0, contentControl_1.newContent)(contentControl_1.Side.RIGHT).addBlock();
            block.element.innerHTML = stylePreviewArticle_1.stylePreviewArticle;
            (0, processElements_1.processElements)(block.element);
        }
        setting.options.forEach((valueName, value) => {
            const handle = this.addItem(valueName, { button: true, decoration: Menu_1.ItemDecoration.SELECTABLE })
                .onClick(() => {
                currentHandle.setSelected(false);
                handle.setSelected(true);
                setting.setValue(value);
                currentHandle = handle;
                callback();
            });
            if (value === setting.getValue()) {
                currentHandle = handle;
                handle.setSelected(true);
            }
        });
    }
}
exports.EnumSettingMenu = EnumSettingMenu;
class SettingsMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase);
        this.addBooleanSetting('使用动画', settings_1.animation);
        this.addBooleanSetting('显示编写中章节', settings_1.earlyAccess);
        this.addBooleanSetting('手势切换章节（仅限手机）', settings_1.gestureSwitchChapter);
        this.addEnumSetting('字体', settings_1.fontFamily, true);
        this.addBooleanSetting('开发人员模式', settings_1.developerMode);
        this.addBooleanSetting('显示已弃坑章节', settings_1.showAbandonedChapters);
        this.addBooleanSetting('禁用精简版自动跳转到完整版', settings_1.lite);
    }
    addBooleanSetting(label, setting) {
        const getText = (value) => `${label}：${value ? '开' : '关'}`;
        const handle = this.addItem(getText(setting.getValue()), { button: true })
            .onClick(() => {
            setting.toggle();
        });
        setting.event.on(newValue => {
            handle.setInnerText(getText(newValue));
        });
    }
    addEnumSetting(label, setting, usePreview) {
        const getText = () => `${label}：${setting.getValueName()}`;
        const handle = this.buildSubMenu(label, EnumSettingMenu, setting, usePreview === true, () => {
            handle.setInnerText(getText());
        }).setDisplayName(getText()).build();
    }
}
exports.SettingsMenu = SettingsMenu;

},{"../Menu":11,"../constant/stylePreviewArticle":17,"../control/contentControl":24,"../control/layoutControl":27,"../control/processElements":35,"../data/settings":44}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleMenu = void 0;
const stylePreviewArticle_1 = require("../constant/stylePreviewArticle");
const contentControl_1 = require("../control/contentControl");
const layoutControl_1 = require("../control/layoutControl");
const processElements_1 = require("../control/processElements");
const DebugLogger_1 = require("../DebugLogger");
const hs_1 = require("../hs");
const Menu_1 = require("../Menu");
class Style {
    constructor(name, def) {
        this.name = name;
        this.def = def;
        this.styleSheet = null;
        this.debugLogger = new DebugLogger_1.DebugLogger(`Style (${name})`);
    }
    injectStyleSheet() {
        const $style = document.createElement('style');
        document.head.appendChild($style);
        const sheet = $style.sheet;
        sheet.disabled = true;
        const attemptInsertRule = (rule) => {
            try {
                sheet.insertRule(rule);
            }
            catch (error) {
                this.debugLogger.error(`Failed to inject rule "${rule}".`, error);
            }
        };
        const key = `rgb(${this.def.keyColor.join(',')})`;
        const keyAlpha = (alpha) => `rgba(${this.def.keyColor.join(',')},${alpha})`;
        // attemptInsertRule(`.container { color: ${key}; }`);
        // attemptInsertRule(`.menu { color: ${key}; }`);
        attemptInsertRule(`.menu .button:active::after { background-color: ${key}; }`);
        attemptInsertRule(`.button::after { background-color: ${key}; }`);
        attemptInsertRule(`body { background-color: ${this.def.paperBgColor}; }`);
        // attemptInsertRule(`.rect { background-color: ${this.def.rectBgColor}; }`);
        // attemptInsertRule(`.rect.reading>div { background-color: ${this.def.paperBgColor}; }`);
        // attemptInsertRule(`.rect.reading>div { color: ${key}; }`);
        // attemptInsertRule(`.rect.reading>.content a { color: ${this.def.linkColor}; }`);
        // attemptInsertRule(`.rect.reading>.content a:hover { color: ${this.def.linkHoverColor}; }`);
        // attemptInsertRule(`.rect.reading>.content a:active { color: ${this.def.linkActiveColor}; }`);
        // attemptInsertRule(`.rect.reading .early-access.content-block { background-color: ${this.def.contentBlockEarlyAccessColor}; }`);
        // attemptInsertRule(`.rect>.comments>div { background-color: ${this.def.commentColor}; }`);
        // attemptInsertRule(`@media (min-width: 901px) { ::-webkit-scrollbar-thumb { background-color: ${this.def.paperBgColor}; } }`);
        // attemptInsertRule(`.rect>.comments>.create-comment::before { background-color: ${key}; }`);
        attemptInsertRule(`:root { --comment-color:${this.def.commentColor}; }`);
        attemptInsertRule(`:root { --content-block-warning-color:${this.def.contentBlockWarningColor}; }`);
        attemptInsertRule(`:root { --rect-bg-color: ${this.def.rectBgColor}; }`);
        attemptInsertRule(`:root { --paper-bg-color: ${this.def.paperBgColor}; }`);
        attemptInsertRule(`:root { --link-color: ${this.def.linkColor}; }`);
        attemptInsertRule(`:root { --link-hover-color: ${this.def.linkHoverColor}; }`);
        attemptInsertRule(`:root { --link-active-color: ${this.def.linkActiveColor}; }`);
        attemptInsertRule(`:root { --key: ${key}; }`);
        attemptInsertRule(`:root { --key-opacity-01: ${keyAlpha(0.1)}; }`);
        attemptInsertRule(`:root { --key-opacity-014: ${keyAlpha(0.14)}; }`);
        attemptInsertRule(`:root { --key-opacity-015: ${keyAlpha(0.15)}; }`);
        attemptInsertRule(`:root { --key-opacity-023: ${keyAlpha(0.23)}; }`);
        attemptInsertRule(`:root { --key-opacity-05: ${keyAlpha(0.5)}; }`);
        attemptInsertRule(`:root { --key-opacity-07: ${keyAlpha(0.7)}; }`);
        attemptInsertRule(`:root { --key-opacity-007: ${keyAlpha(0.07)}; }`);
        attemptInsertRule(`:root { --key-opacity-004: ${keyAlpha(0.04)}; }`);
        attemptInsertRule(`:root { --button-color: ${this.def.commentColor}; }`);
        this.styleSheet = sheet;
    }
    activate() {
        if (Style.currentlyEnabled !== null) {
            const currentlyEnabled = Style.currentlyEnabled;
            if (currentlyEnabled.styleSheet !== null) {
                currentlyEnabled.styleSheet.disabled = true;
            }
        }
        if (this.styleSheet === null) {
            this.injectStyleSheet();
        }
        this.styleSheet.disabled = false;
        window.localStorage.setItem('style', this.name);
        if (Style.themeColorMetaTag === null) {
            Style.themeColorMetaTag = (0, hs_1.h)('meta', {
                name: 'theme-color',
                content: this.def.paperBgColor,
            });
            document.head.appendChild(Style.themeColorMetaTag);
        }
        else {
            Style.themeColorMetaTag.content = this.def.paperBgColor;
        }
        Style.currentlyEnabled = this;
    }
}
Style.currentlyEnabled = null;
Style.themeColorMetaTag = null;
const darkKeyLinkColors = {
    linkColor: '#00E',
    linkHoverColor: '#F00',
    linkActiveColor: '#00E',
};
const lightKeyLinkColors = {
    linkColor: '#7AB2E2',
    linkHoverColor: '#5A92C2',
    linkActiveColor: '#5A92C2',
};
const styles = [
    new Style('默认', Object.assign(Object.assign({ rectBgColor: '#444', paperBgColor: '#333', keyColor: [221, 221, 221] }, lightKeyLinkColors), { contentBlockWarningColor: '#E65100', commentColor: '#444', keyIsDark: false })),
    new Style('白纸', Object.assign(Object.assign({ rectBgColor: '#EFEFED', paperBgColor: '#FFF', keyColor: [0, 0, 0] }, darkKeyLinkColors), { contentBlockWarningColor: '#FFE082', commentColor: '#F5F5F5', keyIsDark: true })),
    new Style('夜间', Object.assign(Object.assign({ rectBgColor: '#272B36', paperBgColor: '#38404D', keyColor: [221, 221, 221] }, lightKeyLinkColors), { contentBlockWarningColor: '#E65100', commentColor: '#272B36', keyIsDark: false })),
    new Style('羊皮纸', Object.assign(Object.assign({ rectBgColor: '#D8D4C9', paperBgColor: '#F8F4E9', keyColor: [85, 40, 48] }, darkKeyLinkColors), { contentBlockWarningColor: '#FFE082', commentColor: '#F9EFD7', keyIsDark: true })),
    new Style('巧克力', Object.assign(Object.assign({ rectBgColor: '#2E1C11', paperBgColor: '#3A2519', keyColor: [221, 175, 153] }, lightKeyLinkColors), { contentBlockWarningColor: '#E65100', commentColor: '#2C1C11', keyIsDark: false })),
];
class StyleMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase, layoutControl_1.Layout.SIDE);
        const handles = styles.map(style => {
            const handle = this.addItem(style.name, { button: true, decoration: Menu_1.ItemDecoration.SELECTABLE })
                .onClick(() => {
                style.activate();
                handles.forEach(handle => handle.setSelected(false));
                handle.setSelected(true);
            });
            if (window.localStorage.getItem('style') === style.name) {
                handle.setSelected(true);
            }
            return handle;
        });
        const content = (0, contentControl_1.newContent)(contentControl_1.Side.RIGHT);
        const $div = content.addBlock().element;
        $div.innerHTML = stylePreviewArticle_1.stylePreviewArticle;
        (0, processElements_1.processElements)($div);
    }
}
exports.StyleMenu = StyleMenu;
const usedStyle = window.localStorage.getItem('style');
let flag = false;
for (const style of styles) {
    if (usedStyle === style.name) {
        style.activate();
        flag = true;
        break;
    }
}
if (!flag) {
    styles[0].activate();
}

},{"../DebugLogger":9,"../Menu":11,"../constant/stylePreviewArticle":17,"../control/contentControl":24,"../control/layoutControl":27,"../control/processElements":35,"../hs":45}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThanksMenu = void 0;
const thanks_1 = require("../constant/thanks");
const Menu_1 = require("../Menu");
class ThanksMenu extends Menu_1.Menu {
    constructor(urlBase) {
        super(urlBase);
        for (const person of thanks_1.thanks) {
            this.addItem(person.name, person.link === undefined
                ? {}
                : { button: true, link: person.link, decoration: Menu_1.ItemDecoration.ICON_LINK });
        }
    }
}
exports.ThanksMenu = ThanksMenu;

},{"../Menu":11,"../constant/thanks":18}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.author = void 0;
const messages_1 = require("../constant/messages");
const rolePriorities_1 = require("../constant/rolePriorities");
const navbarControl_1 = require("../control/navbarControl");
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const hs_1 = require("../hs");
const formatRelativePath_1 = require("../util/formatRelativePath");
const padName_1 = require("../util/padName");
exports.author = {
    name: 'author',
    handler: (content, pagePath) => {
        const authorName = pagePath.get();
        (0, navbarControl_1.setNavbarPath)([
            { display: '作者列表', hash: '#/menu/书目选择/按作者检索' },
            { display: authorName, hash: null },
        ]);
        const author = data_1.authorInfoMap.get(authorName);
        const block = content.addBlock();
        block.element.appendChild((0, hs_1.h)('h1', authorName));
        if ((author === null || author === void 0 ? void 0 : author.description) !== undefined) {
            block.element.appendChild((0, hs_1.h)('p', author.description));
        }
        const roleChaptersMap = new Map();
        for (const [relativePath, { chapter: { authors } }] of data_1.relativePathLookUpMap.entries()) {
            for (const { name, role } of authors) {
                if (name !== authorName) {
                    continue;
                }
                if (!roleChaptersMap.has(role)) {
                    roleChaptersMap.set(role, [relativePath]);
                }
                else {
                    roleChaptersMap.get(role).push(relativePath);
                }
            }
        }
        block.element.appendChild((0, hs_1.h)('h2', messages_1.AUTHOR_PAGE_WORKS));
        block.element.appendChild((0, hs_1.h)('p', messages_1.AUTHOR_PAGE_WORKS_DESC.replace('$', (0, padName_1.padName)(authorName))));
        const roleChaptersArray = Array.from(roleChaptersMap);
        roleChaptersArray.sort(([roleA, _], [roleB, __]) => (0, rolePriorities_1.getRolePriority)(roleB) - (0, rolePriorities_1.getRolePriority)(roleA));
        for (const [role, relativePaths] of roleChaptersArray) {
            block.element.appendChild((0, hs_1.h)('h4', messages_1.AUTHOR_PAGE_AS + role));
            const $list = (0, hs_1.h)('ul');
            for (const relativePath of relativePaths) {
                $list.appendChild((0, hs_1.h)('li', (0, formatRelativePath_1.formatRelativePath)(relativePath), '（', (0, hs_1.h)('a.regular', {
                    href: (0, hrefs_1.chapterHref)(relativePath),
                }, messages_1.AUTHOR_PAGE_LINK), '）'));
            }
            block.element.appendChild($list);
        }
        block.element.appendChild((0, hs_1.h)('div.page-switcher', [
            (0, hs_1.h)('a.to-menu', {
                href: window.location.pathname,
                onclick: (event) => {
                    event.preventDefault();
                    history.back();
                },
            }, messages_1.GO_TO_MENU),
        ]));
        return true;
    },
};

},{"../constant/messages":13,"../constant/rolePriorities":16,"../control/navbarControl":31,"../data/data":40,"../data/hrefs":42,"../hs":45,"../util/formatRelativePath":65,"../util/padName":68}],59:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagSearch = void 0;
const _e_1 = require("../$e");
const contentControl_1 = require("../control/contentControl");
const modalControl_1 = require("../control/modalControl");
const navbarControl_1 = require("../control/navbarControl");
const searchControl_1 = require("../control/searchControl");
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const DOM_1 = require("../util/DOM");
const formatRelativePath_1 = require("../util/formatRelativePath");
const tag_1 = require("../util/tag");
function resolveAlias(maybeAliased) {
    let modifier = '';
    if ('+-'.includes(maybeAliased[0])) {
        modifier = maybeAliased[0];
        maybeAliased = maybeAliased.substr(1);
    }
    const split = maybeAliased.split('（');
    if (data_1.tagAliasMap.has(split[0].toLowerCase())) {
        split[0] = data_1.tagAliasMap.get(split[0].toLowerCase());
    }
    return modifier + split.join('（');
}
exports.tagSearch = {
    name: 'tag-search',
    handler: (content, pagePath) => {
        (0, navbarControl_1.setNavbarPath)([{ display: '标签搜索', hash: null }]);
        content.appendLeftSideContainer();
        const $textarea = ((0, _e_1.$e)("textarea", { className: 'general small' }));
        $textarea.value = pagePath.get().split('/').join('\n');
        const updateTextAreaSize = (0, DOM_1.autoExpandTextArea)($textarea, 40);
        function openTagsList() {
            const modal = new modalControl_1.Modal((0, _e_1.$e)("div", { style: { width: '1000px' } },
                (0, _e_1.$e)("h1", null, "\u6807\u7B7E\u5217\u8868"),
                (0, _e_1.$e)("p", null, "\u4E0D\u662F\u6240\u6709\u6807\u7B7E\u90FD\u6709\u5BF9\u5E94\u7684\u6587\u7AE0\u3002"),
                (0, _e_1.$e)("p", null, data_1.data.tags.map(([tag]) => {
                    let selected = $textarea.value.trim().split(/\s+/).includes(tag);
                    const $tag = (0, tag_1.tagSpan)(tag, selected);
                    $tag.addEventListener('click', () => {
                        if (selected) {
                            $textarea.value = $textarea.value.replace(new RegExp(`(^|\\s+)${tag}(?=$|\\s)`, 'g'), '');
                        }
                        else {
                            $textarea.value += `\n${tag}`;
                        }
                        $textarea.value = $textarea.value.trim();
                        updateSearch($textarea.value);
                        updateTextAreaSize();
                        selected = !selected;
                        $tag.classList.toggle('active', selected);
                    });
                    return $tag;
                })),
                (0, _e_1.$e)("div", { className: 'button-container' },
                    (0, _e_1.$e)("div", { onclick: () => modal.close() }, "\u5173\u95ED"))));
            modal.setDismissible();
            modal.open();
        }
        let $errorList = null;
        const searchBlock = content.addBlock({
            initElement: ((0, _e_1.$e)("div", null,
                (0, _e_1.$e)("p", null, "\u8BF7\u8F93\u5165\u8981\u641C\u7D22\u7684\u6807\u7B7E\uFF1A"),
                $textarea,
                (0, _e_1.$e)("div", { className: 'button-container', style: { marginTop: '0.6em' } },
                    (0, _e_1.$e)("div", { onclick: openTagsList }, "\u9009\u62E9\u6807\u7B7E")))),
            side: contentControl_1.ContentBlockSide.LEFT,
        });
        const searchInfoBlock = content.addBlock({
            initElement: ((0, _e_1.$e)("div", null,
                (0, _e_1.$e)("h1", null, "\u6807\u7B7E\u641C\u7D22"),
                (0, _e_1.$e)("p", null, "\u8BF7\u5728\u641C\u7D22\u8F93\u5165\u6846\u4E2D\u8F93\u5165\u9700\u8981\u67E5\u627E\u7684\u6807\u7B7E\u4EE5\u5F00\u59CB\u641C\u7D22\u3002"),
                (0, _e_1.$e)("p", null, "\u591A\u4E2A\u6807\u7B7E\u4E4B\u95F4\u8BF7\u7528\u7A7A\u683C\u6216\u6362\u884C\u5206\u5F00\u3002"),
                (0, _e_1.$e)("p", null, "\u5728\u4E00\u4E2A\u6807\u7B7E\u524D\u6DFB\u52A0\u51CF\u53F7\u53EF\u4EE5\u6392\u9664\u8FD9\u4E2A\u6807\u7B7E\u3002"),
                (0, _e_1.$e)("p", null, "\u5728\u4E00\u4E2A\u6807\u7B7E\u524D\u6DFB\u52A0\u52A0\u53F7\u53EF\u4EE5\u5F3A\u5236\u9700\u8981\u8FD9\u4E2A\u6807\u7B7E\u3002"),
                (0, _e_1.$e)("p", null,
                    "\u4F60\u4E5F\u53EF\u4EE5\u70B9\u51FB\u641C\u7D22\u8F93\u5165\u6846\u4E0B\u65B9\u7684",
                    (0, _e_1.$e)("b", null, "\u9009\u62E9\u6807\u7B7E"),
                    "\u6765\u5FEB\u901F\u9009\u62E9\u3002"))),
        }).hide();
        const noResultsBlock = content.addBlock({
            initElement: ((0, _e_1.$e)("div", null,
                (0, _e_1.$e)("h1", null, "\u62B1\u6B49\uFF0C\u672A\u627E\u5230\u4EFB\u4F55\u5339\u914D\u7684\u6587\u7AE0"),
                (0, _e_1.$e)("p", null,
                    "\u672C\u6807\u7B7E\u641C\u7D22\u7CFB\u7EDF\u53EA\u80FD\u641C\u7D22\u6587\u7AE0\u6807\u7B7E\uFF0C\u4E0D\u80FD\u641C\u7D22\u6587\u7AE0\u6807\u9898\u6216\u5185\u5BB9\u3002\u8BF7\u68C0\u67E5\u4F60\u6240\u4F7F\u7528\u7684\u641C\u7D22\u6807\u7B7E\u662F\u5426\u4E3A\u6B63\u786E\u7684\u6587\u7AE0\u6807\u7B7E\u3002\u4F60\u53EF\u4EE5\u70B9\u51FB\u641C\u7D22\u8F93\u5165\u6846\u4E0B\u65B9\u7684",
                    (0, _e_1.$e)("b", null, "\u9009\u62E9\u6807\u7B7E"),
                    "\u6765\u5217\u51FA\u6240\u6709\u53EF\u7528\u7684\u6807\u7B7E\u3002"),
                (0, _e_1.$e)("p", null, "\u540C\u65F6\uFF0C\u56E0\u4E3A\u6807\u7B7E\u7CFB\u7EDF\u521A\u521A\u5B9E\u88C5\uFF0C\u7EDD\u5927\u591A\u6570\u6587\u7AE0\u8FD8\u6CA1\u6709\u6807\u7B7E\u3002\u6240\u6709\u6CA1\u6709\u6807\u7B7E\u7684\u6587\u7AE0\u5C06\u65E0\u6CD5\u88AB\u641C\u7D22\u5230\u3002\u5982\u679C\u4F60\u53D1\u73B0\u4F60\u559C\u6B22\u7684\u6587\u7AE0\u8FD8\u6CA1\u6709\u6807\u7B7E\uFF0C\u4F60\u53EF\u4EE5\u9009\u62E9\u5E2E\u52A9\u6253\u6807\u7B7E\u3002"))),
        }).hide();
        const chapterBlocks = [];
        let searchId = 0;
        function updateSearch(searchText) {
            return __awaiter(this, void 0, void 0, function* () {
                searchId++;
                const thisSearchId = searchId;
                searchText = searchText.trim();
                const searchTerms = searchText.split(/\s+/).map(resolveAlias).filter(searchTerm => searchTerm !== '');
                pagePath.set(searchTerms.join('/'));
                const searchInput = searchTerms.map(searchTerm => {
                    if (searchTerm.startsWith('+')) {
                        return { searchTag: searchTerm.substr(1), type: 'required' };
                    }
                    if (searchTerm.startsWith('-')) {
                        return { searchTag: searchTerm.substr(1), type: 'excluded' };
                    }
                    return { searchTag: searchTerm, type: 'favored' };
                });
                const searchResult = yield (0, searchControl_1.search)(searchInput);
                if (thisSearchId !== searchId) {
                    // New search launched.
                    return;
                }
                const errors = [];
                for (const { searchTag } of searchInput) {
                    const match = searchTag.match(/^[+-]?(\S+?)(?:（(\S+?)）)?$/);
                    const tagTuple = data_1.data.tags.find(([tag]) => tag === match[1]);
                    if (tagTuple === undefined) {
                        errors.push((0, _e_1.$e)("li", null,
                            "\u6807\u7B7E\u201C",
                            match[1],
                            "\u201D\u4E0D\u5B58\u5728\u3002"));
                    }
                    else if (match[2] !== undefined) {
                        if (tagTuple[1] === null) {
                            errors.push((0, _e_1.$e)("li", null,
                                "\u6807\u7B7E\u201C",
                                match[1],
                                "\u201D\u4E0D\u652F\u6301\u6027\u522B\u53D8\u79CD\u3002"));
                        }
                        else if (!tagTuple[1].includes(match[2])) {
                            errors.push((0, _e_1.$e)("li", null,
                                "\u6807\u7B7E\u201C",
                                match[1],
                                "\u201D\u6CA1\u6709\u6027\u522B\u53D8\u79CD\u201C",
                                match[2],
                                "\u201D\u3002"));
                        }
                    }
                }
                $errorList === null || $errorList === void 0 ? void 0 : $errorList.remove();
                if (errors.length !== 0) {
                    $errorList = ((0, _e_1.$e)("ul", null, ...errors));
                    searchBlock.element.append($errorList);
                }
                chapterBlocks.forEach(chapterBlock => chapterBlock.directRemove());
                chapterBlocks.length = 0;
                function showResultsFrom(startIndex) {
                    var _a;
                    const maxIndex = Math.min(searchResult.length - 1, startIndex + 9);
                    for (let i = startIndex; i <= maxIndex; i++) {
                        const { chapter, score, matchedTags } = searchResult[i];
                        const chapterBlock = content.addBlock({
                            initElement: ((0, _e_1.$e)("div", { className: 'tag-search-chapter' },
                                (searchInput.length !== 1) && ((0, _e_1.$e)("p", { className: 'match-ratio' },
                                    "\u5339\u914D\u7387\uFF1A",
                                    (0, _e_1.$e)("span", { style: {
                                            fontWeight: (score === searchInput.length) ? 'bold' : 'normal'
                                        } },
                                        (score / searchInput.length * 100).toFixed(0),
                                        "%"))),
                                (0, _e_1.$e)("h3", { className: 'chapter-title' },
                                    (0, _e_1.$e)("a", { href: (0, hrefs_1.chapterHref)(chapter.htmlRelativePath) }, (0, formatRelativePath_1.formatRelativePath)(chapter.htmlRelativePath))),
                                (0, _e_1.$e)("p", null, chapter.authors.map(authorInfo => authorInfo.role + '：' + authorInfo.name).join('，')), (_a = chapter.tags) === null || _a === void 0 ? void 0 :
                                _a.map(tag => {
                                    const selected = matchedTags.includes(tag);
                                    const $tag = (0, tag_1.tagSpan)(tag, selected);
                                    $tag.addEventListener('click', () => {
                                        if (!selected) {
                                            $textarea.value += `\n${tag}`;
                                        }
                                        else {
                                            let value = $textarea.value.replace(new RegExp(`(^|\\s+)\\+?${tag}(?=$|\\s)`, 'g'), '');
                                            if (tag.includes('（')) {
                                                value = value.replace(new RegExp(`(^|\\s+)\\+?${tag.split('（')[0]}(?=$|\\s)`, 'g'), '');
                                            }
                                            value = value.trim();
                                            $textarea.value = value;
                                        }
                                        updateSearch($textarea.value);
                                        updateTextAreaSize();
                                    });
                                    return $tag;
                                })))
                        });
                        if (i === maxIndex && maxIndex < searchResult.length - 1) {
                            chapterBlock.onEnteringView(() => showResultsFrom(i + 1));
                        }
                        chapterBlocks.push(chapterBlock);
                    }
                }
                noResultsBlock.hide();
                searchInfoBlock.hide();
                if (searchResult.length === 0) {
                    if (searchText === '') {
                        searchInfoBlock.show();
                    }
                    else {
                        noResultsBlock.show();
                    }
                }
                else {
                    showResultsFrom(0);
                }
            });
        }
        updateSearch($textarea.value);
        $textarea.addEventListener('input', () => updateSearch($textarea.value));
        return true;
    },
};

},{"../$e":8,"../control/contentControl":24,"../control/modalControl":30,"../control/navbarControl":31,"../control/searchControl":37,"../data/data":40,"../data/hrefs":42,"../util/DOM":62,"../util/formatRelativePath":65,"../util/tag":72}],60:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taggingTool = void 0;
const _e_1 = require("../$e");
const modalControl_1 = require("../control/modalControl");
const navbarControl_1 = require("../control/navbarControl");
const db_1 = require("../data/db");
const DebugLogger_1 = require("../DebugLogger");
const hs_1 = require("../hs");
const DOM_1 = require("../util/DOM");
const debugLogger = new DebugLogger_1.DebugLogger('Tagging Tool');
const selectedKey = (0, db_1.dbKVKey)('taggingToolSelected');
const showingVariantsKey = (0, db_1.dbKVKey)('taggingToolShowingVariants');
function createTagVariant(tag, variant) {
    return `${tag}（${variant}）`;
}
exports.taggingTool = {
    name: 'tagging-tool',
    handler: (content) => {
        (0, navbarControl_1.setNavbarPath)([{ display: '标签工具', hash: null }]);
        const loadingBlock = content.addBlock({
            initElement: (0, hs_1.h)('div', '正在加载标签规格...')
        });
        (() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const tagsSpec = JSON.parse(yield fetch('./tagsSpec.json')
                .then(response => response.text()));
            const showingVariants = new Set((_a = yield (0, db_1.dbKVGet)(showingVariantsKey)) !== null && _a !== void 0 ? _a : ['女']);
            loadingBlock.directRemove();
            /** Mapping from tag to tag spec */
            const tagSpecMap = new Map();
            const tagIndexMap = new Map();
            let index = 0;
            for (const tagSpec of tagsSpec) {
                tagSpecMap.set(tagSpec.tag, tagSpec);
                tagIndexMap.set(tagSpec.tag, index);
                index++;
            }
            const selectedTagVariants = new Set();
            const mainBlock = content.addBlock({ initElement: (0, hs_1.h)('.tagging-tool') });
            const tagVariantElementsMap = new Map();
            const variantsSet = new Set();
            tagsSpec.forEach(tagSpec => { var _a; return (_a = tagSpec.variants) === null || _a === void 0 ? void 0 : _a.forEach(variant => variantsSet.add(variant)); });
            const variantMap = new Map(Array.from(variantsSet).map(variant => [variant, []]));
            const prerequisiteLIs = new Array();
            const prerequisites = [];
            const $selectedOutputCode = (0, hs_1.h)('code');
            function setSelected(tagVariant, value) {
                const tagVariantElements = tagVariantElementsMap.get(tagVariant);
                if (tagVariantElements === undefined) {
                    debugLogger.warn('Unknown tag variant:', tagVariant);
                    return false;
                }
                for (const { checkbox, span } of tagVariantElements) {
                    checkbox.checked = value;
                    span.classList.toggle('selected', value);
                }
                if (value) {
                    selectedTagVariants.add(tagVariant);
                }
                else {
                    selectedTagVariants.delete(tagVariant);
                }
                for (const prerequisiteLI of prerequisiteLIs) {
                    prerequisiteLI.classList.remove('errored');
                }
                for (const tagVariantElements of tagVariantElementsMap.values()) {
                    for (const { span } of tagVariantElements) {
                        span.classList.remove('errored');
                    }
                }
                let errored = false;
                for (const { sourceTagVariant, requiresTagVariants, span, li } of prerequisites) {
                    if (selectedTagVariants.has(sourceTagVariant) && !requiresTagVariants.some(requiresTagVariant => selectedTagVariants.has(requiresTagVariant))) {
                        errored = true;
                        li.classList.add('errored');
                        span.classList.add('errored');
                    }
                }
                if (errored) {
                    $selectedOutputCode.innerText = '有未满足的前置标签，输出已终止。缺失的前置标签已用红色标出。';
                }
                else if (selectedTagVariants.size === 0) {
                    $selectedOutputCode.innerText = '请至少选择一个标签。';
                }
                else {
                    $selectedOutputCode.innerText = Array
                        .from(selectedTagVariants)
                        .sort((a, b) => {
                        const aTag = a.split('（')[0];
                        const bTag = b.split('（')[0];
                        const comparePriority = tagSpecMap.get(bTag).priority - tagSpecMap.get(aTag).priority;
                        if (comparePriority !== 0) {
                            return comparePriority;
                        }
                        return tagIndexMap.get(aTag) - tagIndexMap.get(bTag);
                    })
                        .join('，');
                }
                (0, db_1.dbKVSet)(selectedKey, Array.from(selectedTagVariants)).catch(error => debugLogger.error(error));
                return true;
            }
            function setHovered(tagVariant, hovered) {
                const tagVariantElements = tagVariantElementsMap.get(tagVariant);
                for (const { span } of tagVariantElements) {
                    span.classList.toggle('hovered', hovered);
                }
            }
            function createTagVariantElements(display, tag, variant) {
                const tagVariant = (variant === undefined) ? tag : createTagVariant(tag, variant);
                const $checkbox = (0, hs_1.h)('input', { type: 'checkbox' });
                let tagVariantElements = tagVariantElementsMap.get(tagVariant);
                if (tagVariantElements === undefined) {
                    tagVariantElements = [];
                    tagVariantElementsMap.set(tagVariant, tagVariantElements);
                }
                const $tagVariantSpan = (0, hs_1.h)('span.tagging-tool-tag-variant', [
                    $checkbox,
                    display,
                ]);
                if (variant !== undefined) {
                    variantMap.get(variant).push({
                        tag,
                        tagVariantSpan: $tagVariantSpan,
                    });
                }
                tagVariantElements.push({
                    checkbox: $checkbox,
                    span: $tagVariantSpan,
                });
                $tagVariantSpan.addEventListener('click', () => {
                    if (selectedTagVariants.has(tagVariant)) {
                        setSelected(tagVariant, false);
                    }
                    else {
                        setSelected(tagVariant, true);
                    }
                });
                $tagVariantSpan.addEventListener('mouseenter', () => {
                    setHovered(tagVariant, true);
                });
                $tagVariantSpan.addEventListener('mouseleave', () => {
                    setHovered(tagVariant, false);
                });
                return $tagVariantSpan;
            }
            function createTagElement(tagSpec, prerequisiteInfo) {
                if (tagSpec.variants === null) {
                    const $span = createTagVariantElements(tagSpec.tag, tagSpec.tag);
                    if (prerequisiteInfo !== undefined) {
                        const sourceTagSpec = prerequisiteInfo.sourceTagSpec;
                        if (sourceTagSpec.variants === null) {
                            prerequisites.push({
                                sourceTagVariant: sourceTagSpec.tag,
                                requiresTagVariants: [tagSpec.tag],
                                li: prerequisiteInfo.li,
                                span: $span,
                            });
                        }
                        else {
                            for (const sourceVariant of sourceTagSpec.variants) {
                                prerequisites.push({
                                    sourceTagVariant: createTagVariant(sourceTagSpec.tag, sourceVariant),
                                    requiresTagVariants: [tagSpec.tag],
                                    li: prerequisiteInfo.li,
                                    span: $span,
                                });
                            }
                        }
                    }
                    return $span;
                }
                else {
                    const spans = [];
                    for (const variant of tagSpec.variants) {
                        const $span = createTagVariantElements(variant, tagSpec.tag, variant);
                        if (prerequisiteInfo !== undefined) {
                            const sourceTagSpec = prerequisiteInfo.sourceTagSpec;
                            if (sourceTagSpec.variants !== null) {
                                prerequisites.push({
                                    sourceTagVariant: createTagVariant(sourceTagSpec.tag, variant),
                                    requiresTagVariants: [createTagVariant(tagSpec.tag, variant)],
                                    li: prerequisiteInfo.li,
                                    span: $span,
                                });
                            }
                            else {
                                prerequisites.push({
                                    sourceTagVariant: sourceTagSpec.tag,
                                    requiresTagVariants: tagSpec.variants.map(variant => createTagVariant(tagSpec.tag, variant)),
                                    li: prerequisiteInfo.li,
                                    span: $span,
                                });
                            }
                        }
                        spans.push($span);
                    }
                    return (0, hs_1.h)('span.tagging-tool-tag', [
                        tagSpec.tag,
                        (0, hs_1.h)('span.no-available-variants', '无可用变种'),
                        ...spans,
                    ]);
                }
            }
            mainBlock.element.append((0, _e_1.$e)("h1", null, "\u6807\u7B7E\u5DE5\u5177"));
            const updateVariantFilter = [];
            for (const variant of variantsSet) {
                let selected = showingVariants.has(variant);
                const $checkbox = (0, hs_1.h)('input', { type: 'checkbox' });
                const $span = (0, hs_1.h)('span.tagging-tool-variant', [
                    $checkbox,
                    variant,
                ]);
                const update = () => {
                    if (selected) {
                        showingVariants.add(variant);
                    }
                    else {
                        showingVariants.delete(variant);
                    }
                    (0, db_1.dbKVSet)(showingVariantsKey, Array.from(showingVariants));
                    $checkbox.checked = selected;
                    $span.classList.toggle('selected', selected);
                    variantMap.get(variant).forEach(({ tagVariantSpan }) => {
                        tagVariantSpan.classList.toggle('display-none', !selected);
                        tagVariantSpan.parentElement.classList.toggle('has-available-variant', Array.from(tagVariantSpan.parentElement.getElementsByClassName('tagging-tool-tag-variant'))
                            .some($element => !$element.classList.contains('display-none')));
                    });
                };
                updateVariantFilter.push(update);
                $span.addEventListener('click', () => {
                    selected = !selected;
                    update();
                });
                mainBlock.element.append($span);
            }
            mainBlock.element.append((0, hs_1.h)('h2', '选择标签'));
            function requestResettingTags() {
                (0, modalControl_1.confirm)('真的要重置所有选择的标签吗？', '这个操作不可撤销。', '确定重置', '不重置').then(result => {
                    if (result) {
                        for (const selectedTagVariant of selectedTagVariants) {
                            setSelected(selectedTagVariant, false);
                        }
                    }
                });
            }
            function requestImportTags() {
                const $textarea = (0, _e_1.$e)("textarea", { className: 'general large' });
                function execute(replace) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const value = $textarea.value.trim();
                        if (value === '') {
                            (0, modalControl_1.showGenericError)('请输入要导入的标签。');
                            return;
                        }
                        if (replace) {
                            if (!(yield (0, modalControl_1.confirm)('确定导入', '这将重置目前已经选择的所有标签。你真的要继续吗？', '确定导入', '取消导入'))) {
                                return;
                            }
                            for (const selectedTagVariant of selectedTagVariants) {
                                setSelected(selectedTagVariant, false);
                            }
                        }
                        const failed = [];
                        for (const tagVariant of value.split(/[\s，,]+/)) {
                            if (!setSelected(tagVariant, true)) {
                                failed.push(tagVariant);
                            }
                        }
                        if (failed.length === 0) {
                            yield (0, modalControl_1.showGenericSuccess)('导入成功');
                            modal.close();
                        }
                        else {
                            const warnModal = new modalControl_1.Modal((0, _e_1.$e)("div", null,
                                (0, _e_1.$e)("h1", null, "\u90E8\u5206\u6807\u7B7E\u672A\u80FD\u5BFC\u5165"),
                                (0, _e_1.$e)("p", null, "\u4EE5\u4E0B\u4E3A\u5BFC\u5165\u5931\u8D25\u7684\u6807\u7B7E\uFF1A"),
                                (0, _e_1.$e)("ul", null, failed.map(tagVariant => (0, _e_1.$e)("li", null, tagVariant))),
                                (0, _e_1.$e)("p", null, "\u5176\u4F59\u6807\u7B7E\u5DF2\u5BFC\u5165\u5B8C\u6210\u3002"),
                                (0, _e_1.$e)("div", { className: 'button-container' },
                                    (0, _e_1.$e)("div", { onclick: () => warnModal.close() }, "\u5173\u95ED"))));
                            warnModal.setDismissible();
                            warnModal.open();
                        }
                    });
                }
                const modal = new modalControl_1.Modal((0, _e_1.$e)("div", null,
                    (0, _e_1.$e)("h1", null, "\u5BFC\u5165\u6807\u7B7E"),
                    (0, _e_1.$e)("p", null, "\u8BF7\u8F93\u5165\u8981\u5BFC\u5165\u7684\u6807\u7B7E\uFF0C\u4E0D\u540C\u6807\u7B7E\u4E4B\u95F4\u8BF7\u7528\u7A7A\u683C\u6216\u9017\u53F7\u5206\u5F00\uFF1A"),
                    $textarea,
                    (0, _e_1.$e)("div", { className: 'button-container', style: { marginTop: '0.6em' } },
                        (0, _e_1.$e)("div", { onclick: () => execute(true) }, "\u66FF\u6362\u5F53\u524D\u6807\u7B7E"),
                        (0, _e_1.$e)("div", { onclick: () => execute(false) }, "\u8FFD\u52A0\u5230\u5F53\u524D\u6807\u7B7E"),
                        (0, _e_1.$e)("div", { onclick: () => modal.close() }, "\u53D6\u6D88\u5BFC\u5165"))));
                modal.setDismissible();
                modal.open();
                (0, DOM_1.autoExpandTextArea)($textarea);
            }
            mainBlock.element.append((0, _e_1.$e)("div", { className: 'button-container' },
                (0, _e_1.$e)("div", { onclick: requestResettingTags }, "\u91CD\u7F6E\u6240\u6709\u9009\u62E9\u7684\u6807\u7B7E"),
                (0, _e_1.$e)("div", { onclick: requestImportTags }, "\u5BFC\u5165\u6807\u7B7E")));
            mainBlock.element.append((0, _e_1.$e)("p", null, "\u8BF7\u9009\u62E9\u6587\u7AE0\u6240\u542B\u6709\u7684\u6807\u7B7E\uFF1A"));
            for (const tagSpec of tagsSpec) {
                mainBlock.element.append((0, hs_1.h)('p.tag-title', createTagElement(tagSpec)));
                const $descUL = (0, hs_1.h)('ul');
                for (const descLine of tagSpec.desc) {
                    const $descLineLI = (0, hs_1.h)('li.desc-line');
                    if (descLine.isPrerequisite) {
                        prerequisiteLIs.push($descLineLI);
                    }
                    for (const segment of descLine.segments) {
                        if (segment.type === 'text') {
                            $descLineLI.append(segment.content);
                        }
                        else {
                            if (descLine.isPrerequisite) {
                                $descLineLI.append(createTagElement(tagSpecMap.get(segment.tag), {
                                    li: $descLineLI,
                                    sourceTagSpec: tagSpec,
                                }));
                            }
                            else {
                                $descLineLI.append(createTagElement(tagSpecMap.get(segment.tag)));
                            }
                        }
                    }
                    $descUL.append($descLineLI);
                }
                mainBlock.element.append($descUL);
            }
            mainBlock.element.append((0, hs_1.h)('h2', '输出'));
            mainBlock.element.append((0, hs_1.h)('p', '以下为选择的标签。'));
            mainBlock.element.append((0, hs_1.h)('pre.wrapping', $selectedOutputCode));
            mainBlock.element.append((0, _e_1.$e)("p", null,
                "\u5982\u679C\u60F3\u8981\u4E3A\u5176\u4ED6\u6587\u7AE0\u6253\u6807\u7B7E\uFF0C\u8BF7",
                (0, _e_1.$e)("span", { className: 'anchor-style', onclick: requestResettingTags }, "\u70B9\u6B64\u91CD\u7F6E\u5DF2\u7ECF\u9009\u62E9\u4E86\u7684\u6807\u7B7E"),
                "\u3002"));
            updateVariantFilter.forEach(update => update());
            ((_b = yield (0, db_1.dbKVGet)(selectedKey)) !== null && _b !== void 0 ? _b : []).forEach(tagVariant => setSelected(tagVariant, true));
        }))().catch(error => debugLogger.error(error));
        return true;
    },
};

},{"../$e":8,"../DebugLogger":9,"../control/modalControl":30,"../control/navbarControl":31,"../data/db":41,"../hs":45,"../util/DOM":62}],61:[function(require,module,exports){
"use strict";
// !!! Super spaghetti code warning !!!
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitCount = void 0;
const messages_1 = require("../constant/messages");
const backendControl_1 = require("../control/backendControl");
const menuControl_1 = require("../control/menuControl");
const navbarControl_1 = require("../control/navbarControl");
const AutoCache_1 = require("../data/AutoCache");
const data_1 = require("../data/data");
const hrefs_1 = require("../data/hrefs");
const DebugLogger_1 = require("../DebugLogger");
const hs_1 = require("../hs");
const commaNumber_1 = require("../util/commaNumber");
const formatRelativePath_1 = require("../util/formatRelativePath");
const padName_1 = require("../util/padName");
const shortNumber_1 = require("../util/shortNumber");
const timeFrames = ['ALL', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'];
function getEndpoint(timeFrame, page) {
    if (timeFrame === 'ALL') {
        return `${backendControl_1.backendUrl}/stats/chapters/all?page=${page}`;
    }
    else {
        return `${backendControl_1.backendUrl}/stats/chapters/recent?page=${page}&time_frame=${timeFrame}`;
    }
}
const debugLogger = new DebugLogger_1.DebugLogger('Visit Count Logger');
function getTimeFrameText(timeFrame) {
    switch (timeFrame) {
        case 'ALL': return messages_1.VISIT_COUNT_TIME_FRAME_ALL;
        case 'HOUR': return messages_1.VISIT_COUNT_TIME_FRAME_HOUR;
        case 'DAY': return messages_1.VISIT_COUNT_TIME_FRAME_DAY;
        case 'WEEK': return messages_1.VISIT_COUNT_TIME_FRAME_WEEK;
        case 'YEAR': return messages_1.VISIT_COUNT_TIME_FRAME_YEAR;
        case 'MONTH': return messages_1.VISIT_COUNT_TIME_FRAME_MONTH;
    }
}
function formatTitle(relativePath, visitCount) {
    return (0, formatRelativePath_1.formatRelativePath)(relativePath) + ': ' + (0, shortNumber_1.shortNumber)(visitCount, 2) + messages_1.VISIT_COUNT_TIMES;
}
const visitCountCache = new AutoCache_1.AutoCache(endpoint => fetch(endpoint).then(data => data.json()), new DebugLogger_1.DebugLogger('Visit Count Cache'));
exports.visitCount = {
    name: 'visit-count',
    handler: content => {
        (0, navbarControl_1.setNavbarPath)([{ display: messages_1.VISIT_COUNT_TITLE, hash: null }]);
        const block = content.addBlock();
        block.element.appendChild((0, hs_1.h)('h1', messages_1.VISIT_COUNT_TITLE));
        block.element.appendChild((0, hs_1.h)('p', [
            messages_1.VISIT_COUNT_DESC_0,
            (0, hs_1.h)('a.regular', { href: '#META/隐私政策.html' }, messages_1.VISIT_COUNT_DESC_1),
            messages_1.VISIT_COUNT_DESC_2,
        ]));
        const $status = (0, hs_1.h)('p');
        const $results = (0, hs_1.h)('.visit-count-holder');
        const $loadMoreButton = (0, hs_1.h)('div.rich');
        const $loadMoreContainer = (0, hs_1.h)('.button-container.display-none', {
            style: { 'margin-top': '0.5em' },
        }, $loadMoreButton);
        // Used to determine whether the current request is still needed.
        let currentRequestId = 0;
        // Time frame to be used when clicking load more.
        let nextLoadingTimeFrame = 'ALL';
        // Page to be load when clicking load more.
        let nextLoadingPage = 2;
        let maxVisits = 0;
        const load = (timeFrame, page) => {
            const endpoint = getEndpoint(timeFrame, page);
            currentRequestId++;
            const requestId = currentRequestId;
            debugLogger.log(`Request ID ${requestId}: Loading visit count info from ${endpoint}.`);
            visitCountCache.get(endpoint).then(data => {
                var _a, _b;
                if (content.isDestroyed || requestId !== currentRequestId) {
                    debugLogger.log(`Request ID ${requestId}: Request completed, but the result is abandoned.`);
                    return;
                }
                if (page === 1) {
                    maxVisits = (_b = ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.visit_count)) !== null && _b !== void 0 ? _b : 0;
                    $loadMoreContainer.classList.remove('display-none');
                }
                else {
                    $loadMoreButton.classList.remove('disabled');
                }
                $status.innerText = messages_1.VISIT_COUNT_DISPLAYING.replace(/\$/g, (0, padName_1.padName)(getTimeFrameText(timeFrame)));
                $loadMoreButton.innerText = messages_1.VISIT_COUNT_LOAD_MORE;
                // If there is less than 50, stop showing load more button
                $loadMoreContainer.classList.toggle('display-none', data.length !== 50);
                for (const entry of data) {
                    if (!data_1.relativePathLookUpMap.has(entry.relative_path)) {
                        continue;
                    }
                    $results.appendChild((0, hs_1.h)('a', {
                        style: {
                            'width': `${entry.visit_count / maxVisits * 100}%`,
                        },
                        title: (0, commaNumber_1.commaNumber)(entry.visit_count) + messages_1.VISIT_COUNT_TIMES,
                        href: (0, hrefs_1.chapterHref)(entry.relative_path),
                    }, formatTitle(entry.relative_path, entry.visit_count)));
                }
                nextLoadingPage = page + 1;
            }).catch(error => {
                if (content.isDestroyed || requestId !== currentRequestId) {
                    debugLogger.warn(`Request ID ${requestId}: Request failed, but the result is abandoned.`, error);
                    return;
                }
                if (page === 1) {
                    $status.innerText = messages_1.VISIT_COUNT_FAILED;
                }
                else {
                    $loadMoreButton.classList.remove('disabled');
                    $loadMoreButton.innerText = messages_1.VISIT_COUNT_LOAD_MORE_FAILED;
                }
            });
        };
        $loadMoreButton.addEventListener('click', () => {
            // Yes, I am doing it. I am using class list as my state keeper.
            if ($loadMoreButton.classList.contains('disabled')) {
                return;
            }
            $loadMoreButton.classList.add('disabled');
            $loadMoreButton.innerText = messages_1.VISIT_COUNT_LOAD_MORE_LOADING;
            load(nextLoadingTimeFrame, nextLoadingPage);
        });
        const loadTimeFrame = (timeFrame) => {
            $results.innerHTML = '';
            $status.innerText = messages_1.VISIT_COUNT_LOADING;
            $loadMoreContainer.classList.add('display-none');
            nextLoadingTimeFrame = timeFrame;
            nextLoadingPage = 2;
            load(timeFrame, 1);
        };
        const ltfButtons = [];
        /** Load time frame button */
        const createLtfButton = (text, timeFrame) => {
            const $button = (0, hs_1.h)('div.rich', {
                onclick: () => {
                    for (const $ltfButton of ltfButtons) {
                        $ltfButton.classList.toggle('selected', $ltfButton === $button);
                    }
                    loadTimeFrame(timeFrame);
                },
            }, text);
            if (timeFrame === 'ALL') {
                $button.classList.add('selected');
            }
            ltfButtons.push($button);
            return $button;
        };
        block.element.appendChild((0, hs_1.h)('.button-container', timeFrames.map(timeFrame => createLtfButton(getTimeFrameText(timeFrame), timeFrame)))),
            block.element.appendChild($status);
        block.element.appendChild($results);
        block.element.appendChild($loadMoreContainer);
        block.element.appendChild((0, hs_1.h)('div.page-switcher', [
            (0, hs_1.h)('a', {
                href: window.location.pathname,
                onclick: (event) => {
                    event.preventDefault();
                    (0, menuControl_1.enterMenuMode)();
                },
            }, messages_1.GO_TO_MENU),
        ]));
        loadTimeFrame('ALL');
        return true;
    },
};

},{"../DebugLogger":9,"../constant/messages":13,"../control/backendControl":21,"../control/menuControl":28,"../control/navbarControl":31,"../data/AutoCache":39,"../data/data":40,"../data/hrefs":42,"../hs":45,"../util/commaNumber":64,"../util/formatRelativePath":65,"../util/padName":68,"../util/shortNumber":69}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoExpandTextArea = exports.forceReflow = exports.linkButton = exports.externalLink = exports.insertAfterH1 = exports.insertAfter = exports.isAnyParent = exports.selectNode = exports.getTextNodes = exports.id = void 0;
const DebugLogger_1 = require("../DebugLogger");
const hs_1 = require("../hs");
function id(id) {
    return document.getElementById(id);
}
exports.id = id;
function getTextNodes(parent, initArray) {
    const textNodes = initArray || [];
    let pointer = parent.firstChild;
    while (pointer !== null) {
        if (pointer instanceof HTMLElement) {
            getTextNodes(pointer, textNodes);
        }
        if (pointer instanceof Text) {
            textNodes.push(pointer);
        }
        pointer = pointer.nextSibling;
    }
    return textNodes;
}
exports.getTextNodes = getTextNodes;
const selectNodeDebugLogger = new DebugLogger_1.DebugLogger('Select Node');
function selectNode(node) {
    try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    catch (error) {
        selectNodeDebugLogger.log('Failed to select node: ', node, '; Error: ', error);
    }
}
exports.selectNode = selectNode;
function isAnyParent($element, predicate) {
    while ($element !== null) {
        if (predicate($element)) {
            return true;
        }
        $element = $element.parentElement;
    }
    return false;
}
exports.isAnyParent = isAnyParent;
function insertAfter($newElement, $referencingElement) {
    $referencingElement.parentElement.insertBefore($newElement, $referencingElement.nextSibling);
}
exports.insertAfter = insertAfter;
function insertAfterH1($newElement, $parent) {
    const $first = $parent.firstChild;
    if ($first !== null &&
        $first instanceof HTMLHeadingElement &&
        $first.tagName.toLowerCase() === 'h1') {
        insertAfter($newElement, $first);
    }
    else {
        $parent.prepend($newElement);
    }
}
exports.insertAfterH1 = insertAfterH1;
function externalLink(text, href) {
    return (0, hs_1.h)('a.regular', {
        target: '_blank',
        href,
        rel: 'noopener noreferrer',
    }, text);
}
exports.externalLink = externalLink;
function linkButton(text, callback) {
    return (0, hs_1.h)('a.regular', {
        href: '#',
        onclick: ((event) => {
            event.preventDefault();
            callback();
        }),
    }, text);
}
exports.linkButton = linkButton;
function forceReflow($element) {
    // tslint:disable-next-line:no-unused-expression
    $element.offsetHeight;
}
exports.forceReflow = forceReflow;
function autoExpandTextArea($textarea, minHeightPx = 120) {
    function update() {
        $textarea.style.height = `1px`;
        $textarea.style.height = `${Math.max(minHeightPx, $textarea.scrollHeight)}px`;
    }
    $textarea.addEventListener('input', update, false);
    setTimeout(update, 1);
    return update;
}
exports.autoExpandTextArea = autoExpandTextArea;

},{"../DebugLogger":9,"../hs":45}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produce = exports.range = exports.lastElement = void 0;
function lastElement(array) {
    return array[array.length - 1];
}
exports.lastElement = lastElement;
function range(fromInclusive, toExclusive, step = 1) {
    const result = [];
    for (let i = fromInclusive; i < toExclusive; i += step) {
        result.push(i);
    }
    return result;
}
exports.range = range;
function produce(count, producer) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(producer());
    }
    return result;
}
exports.produce = produce;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commaNumber = void 0;
function commaNumber(num) {
    const segments = [];
    while (num >= 1000) {
        segments.push(String(num % 1000).padStart(3, '0'));
        num = Math.floor(num / 1000);
    }
    segments.push(String(num));
    segments.reverse();
    return segments.join(',');
}
exports.commaNumber = commaNumber;

},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRelativePath = void 0;
function formatRelativePath(relativePath) {
    if (relativePath.endsWith('.html')) {
        relativePath = relativePath.substr(0, relativePath.length - '.html'.length);
    }
    relativePath = relativePath.replace(/\//g, ' > ');
    relativePath = relativePath.replace(/-/g, ' ');
    return relativePath;
}
exports.formatRelativePath = formatRelativePath;

},{}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimeSimple = exports.formatDurationCoarse = exports.formatTimeRelativeLong = exports.formatTimeRelative = void 0;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 365 / 12 * DAY; // Doesn't matter
const YEAR = 365 * DAY;
const MAX_RELATIVE_TIME = 7 * DAY;
function formatTimeRelative(time) {
    const relativeTime = Date.now() - time.getTime();
    if (relativeTime > MAX_RELATIVE_TIME) {
        return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;
    }
    if (relativeTime > DAY) {
        return `${Math.floor(relativeTime / DAY)} 天前`;
    }
    if (relativeTime > HOUR) {
        return `${Math.floor(relativeTime / HOUR)} 小时前`;
    }
    if (relativeTime > MINUTE) {
        return `${Math.floor(relativeTime / MINUTE)} 分钟前`;
    }
    return `${Math.floor(relativeTime / SECOND)} 秒前`;
}
exports.formatTimeRelative = formatTimeRelative;
function formatTimeRelativeLong(time) {
    const relativeTime = Date.now() - time.getTime();
    if (relativeTime <= MAX_RELATIVE_TIME) {
        return formatTimeRelative(time);
    }
    if (relativeTime > YEAR) {
        return `${Math.floor(relativeTime / YEAR)} 年前`;
    }
    if (relativeTime > MONTH) {
        return `${Math.floor(relativeTime / MONTH)} 个月前`;
    }
    return `${Math.floor(relativeTime / DAY)} 天前`;
}
exports.formatTimeRelativeLong = formatTimeRelativeLong;
function formatDurationCoarse(milliseconds) {
    if (milliseconds > 10 * DAY) {
        return ` ${Math.floor(milliseconds / DAY)} 天`;
    }
    else if (milliseconds > HOUR) {
        const day = Math.floor(milliseconds / DAY);
        const hour = Math.floor((milliseconds % DAY) / HOUR);
        if (hour === 0) {
            return ` ${day} 天`;
        }
        else {
            return ` ${day} 天 ${hour} 小时`;
        }
    }
    else {
        return '不到一小时';
    }
}
exports.formatDurationCoarse = formatDurationCoarse;
function formatTimeSimple(time) {
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ` +
        `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}
exports.formatTimeSimple = formatTimeSimple;

},{}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = exports.randomInt = void 0;
function randomInt(minInclusive, maxExclusive) {
    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}
exports.randomInt = randomInt;
function randomNumber(minInclusive, maxExclusive) {
    return Math.random() * (maxExclusive - minInclusive) + minInclusive;
}
exports.randomNumber = randomNumber;

},{}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padName = void 0;
const cjkBeginRegex = /^(?:[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])/;
const cjkEndRegex = /(?:[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])$/;
function padName(name) {
    if (!cjkBeginRegex.test(name)) {
        name = ' ' + name;
    }
    if (!cjkEndRegex.test(name)) {
        name = name + ' ';
    }
    return name;
}
exports.padName = padName;

},{}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortNumber = void 0;
function shortNumber(input, digits = 1) {
    if (input < 1000) {
        return String(input);
    }
    if (input < 1000000) {
        return (input / 1000).toFixed(digits) + 'k';
    }
    return (input / 1000000).toFixed(digits) + 'M';
}
exports.shortNumber = shortNumber;

},{}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePotentialSuffix = void 0;
/**
 * Input: 'asdasd.html', '.html'
 * Output: 'asdasd'
 *
 * Input: 'asdasd', '.html'
 * Output: 'asdasd'
 */
function removePotentialSuffix(input, potentialSuffix) {
    return input.endsWith(potentialSuffix)
        ? input.substr(0, input.length - potentialSuffix.length)
        : input;
}
exports.removePotentialSuffix = removePotentialSuffix;

},{}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringHash = void 0;
// https://stackoverflow.com/a/7616484
function stringHash(str) {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
exports.stringHash = stringHash;

},{}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagSpan = void 0;
const _e_1 = require("../$e");
const data_1 = require("../data/data");
function tagSpan(tag, active) {
    var _a;
    const count = (_a = data_1.tagCountMap.get(tag)) !== null && _a !== void 0 ? _a : 0;
    return ((0, _e_1.$e)("div", { className: 'tag-div' + (active ? ' active' : '') },
        (0, _e_1.$e)("span", { className: 'tag' + ((count === 0) ? ' empty' : '') },
            (0, _e_1.$e)("span", { className: 'text' + (tag.endsWith('）') ? ' parentheses-ending' : '') }, tag),
            (0, _e_1.$e)("span", { className: 'count' }, count))));
}
exports.tagSpan = tagSpan;

},{"../$e":8,"../data/data":40}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartThrottle = void 0;
function smartThrottle(fn, timeMs) {
    let timerRunning = false;
    let scheduled = false;
    return () => {
        if (!timerRunning) {
            fn();
            const timedOut = () => {
                if (scheduled) {
                    fn();
                    scheduled = false;
                    setTimeout(timedOut, timeMs);
                }
                else {
                    timerRunning = false;
                }
            };
            timerRunning = true;
            setTimeout(timedOut, timeMs);
        }
        else {
            scheduled = true;
        }
    };
}
exports.smartThrottle = smartThrottle;

},{}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUrlArgumentsTo = void 0;
/**
 * Completely replaces the pre-existing arguments.
 */
function resetUrlArgumentsTo(args) {
    window.history.replaceState(null, document.title, window.location.origin + '/' + window.location.hash.split('~')[0]
        + ((args.size === 0)
            ? ''
            : ('~' + Array.from(args).map(([key, value]) => (value === '') ? key : `${key}=${value}`))));
}
exports.resetUrlArgumentsTo = resetUrlArgumentsTo;

},{}]},{},[46]);
