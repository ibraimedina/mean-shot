(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}],3:[function(require,module,exports){
var Vue // late bind
var version
var map = window.__VUE_HOT_MAP__ = Object.create(null)
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) return
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
      'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Vue.extend(options),
    instances: []
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot (id, options) {
  injectHook(options, initHookName, function () {
    map[id].instances.push(this)
  })
  injectHook(options, 'beforeDestroy', function () {
    var instances = map[id].instances
    instances.splice(instances.indexOf(this), 1)
  })
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook (options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook]
}

function tryWrap (fn) {
  return function (id, arg) {
    try { fn(id, arg) } catch (e) {
      console.error(e)
      console.warn('Something went wrong during Vue component hot-reload. Full reload required.')
    }
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  record.Ctor.options.render = options.render
  record.Ctor.options.staticRenderFns = options.staticRenderFns
  record.instances.slice().forEach(function (instance) {
    instance.$options.render = options.render
    instance.$options.staticRenderFns = options.staticRenderFns
    instance._staticTrees = [] // reset static trees
    instance.$forceUpdate()
  })
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (version[1] < 2) {
      // preserve pre 2.2 behavior for global mixin handling
      record.Ctor.extendOptions = options
    }
    var newCtor = record.Ctor.super.extend(options)
    record.Ctor.options = newCtor.options
    record.Ctor.cid = newCtor.cid
    record.Ctor.prototype = newCtor.prototype
    if (newCtor.release) {
      // temporary global mixin strategy used in < 2.0.0-alpha.6
      newCtor.release()
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn('Root or manually mounted instance modified. Full reload required.')
    }
  })
})

},{}],4:[function(require,module,exports){
/*!
* Vue Material v0.7.4
* Made with love by Marcos Moura
* Released under the MIT License.
*/   
!(function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("vue")):"function"==typeof define&&define.amd?define(["vue"],e):"object"==typeof exports?exports.VueMaterial=e(require("vue")):t.VueMaterial=e(t.Vue)})(this,(function(t){return (function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=481)})([(function(t,e){t.exports=function(t,e,n,i,o){var a,r=t=t||{},s=typeof t.default;"object"!==s&&"function"!==s||(a=t,r=t.default);var d="function"==typeof r?r.options:r;e&&(d.render=e.render,d.staticRenderFns=e.staticRenderFns),i&&(d._scopeId=i);var l;if(o?(l=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},d._ssrRegister=l):n&&(l=n),l){var c=d.functional,u=c?d.render:d.beforeCreate;c?d.render=function(t,e){return l.call(e),u(t,e)}:d.beforeCreate=u?[].concat(u,l):[l]}return{esModule:a,exports:r,options:d}}}),(function(t,e,n){"use strict";function i(t){if(!t)return null;var e=t.mdTheme;return e||"md-theme"!==t.$options._componentTag||(e=t.mdName),e||i(t.$parent)}Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{mdTheme:String},computed:{mdEffectiveTheme:function(){return i(this)||this.$material.currentTheme},themeClass:function(){return this.$material.prefix+this.mdEffectiveTheme}},watch:{mdTheme:function(t){this.$material.useTheme(t)}},beforeMount:function(){var t=this.mdTheme;this.$material.useTheme(t?t:"default")}},t.exports=e.default}),(function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)}),(function(t,e,n){t.exports=!n(5)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))}),(function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)}),(function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}}),(function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}}),(function(t,e,n){var i=n(26),o=n(14);t.exports=function(t){return i(o(t))}}),(function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}}),(function(t,e,n){var i=n(13),o=n(30),a=n(27),r=Object.defineProperty;e.f=n(3)?Object.defineProperty:function(t,e,n){if(i(t),e=a(e,!0),i(n),o)try{return r(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function t(e,n){return!(!e||!e.$el)&&(0!==e._uid&&(e.$el.classList.contains(n)?e:t(e.$parent,n)))};e.default=i,t.exports=e.default}),(function(t,e,n){var i=n(9),o=n(17);t.exports=n(3)?function(t,e,n){return i.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}}),(function(t,e,n){var i=n(22)("wks"),o=n(20),a=n(2).Symbol,r="function"==typeof a,s=t.exports=function(t){return i[t]||(i[t]=r&&a[t]||(r?a:o)("Symbol."+t))};s.store=i}),(function(t,e,n){var i=n(6);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}}),(function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}}),(function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}}),(function(t,e,n){var i=n(2),o=n(4),a=n(28),r=n(11),s="prototype",d=function(t,e,n){var l,c,u,m=t&d.F,f=t&d.G,p=t&d.S,h=t&d.P,b=t&d.B,v=t&d.W,E=f?o:o[e]||(o[e]={}),g=E[s],_=f?i:p?i[e]:(i[e]||{})[s];f&&(n=e);for(l in n)c=!m&&_&&void 0!==_[l],c&&l in E||(u=c?_[l]:n[l],E[l]=f&&"function"!=typeof _[l]?n[l]:b&&c?a(u,i):v&&_[l]==u?(function(t){var e=function(e,n,i){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,i)}return t.apply(this,arguments)};return e[s]=t[s],e})(u):h&&"function"==typeof u?a(Function.call,u):u,h&&((E.virtual||(E.virtual={}))[l]=u,t&d.R&&g&&!g[l]&&r(g,l,u)))};d.F=1,d.G=2,d.S=4,d.P=8,d.B=16,d.W=32,d.U=64,d.R=128,t.exports=d}),(function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}}),(function(t,e,n){var i=n(31),o=n(21);t.exports=Object.keys||function(t){return i(t,o)}}),(function(t,e,n){var i=n(22)("keys"),o=n(20);t.exports=function(t){return i[t]||(i[t]=o(t))}}),(function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}}),(function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")}),(function(t,e,n){var i=n(2),o="__core-js_shared__",a=i[o]||(i[o]={});t.exports=function(t){return a[t]||(a[t]={})}}),(function(t,e,n){var i=n(14);t.exports=function(t){return Object(i(t))}}),(function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}}),(function(t,e,n){var i=n(6),o=n(2).document,a=i(o)&&i(o.createElement);t.exports=function(t){return a?o.createElement(t):{}}}),(function(t,e,n){var i=n(24);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}}),(function(t,e,n){var i=n(6);t.exports=function(t,e){if(!i(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!i(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!i(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!i(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}}),(function(t,e,n){var i=n(33);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,o){return t.call(e,n,i,o)}}return function(){return t.apply(e,arguments)}}}),(function(t,e,n){var i=n(15),o=Math.min;t.exports=function(t){return t>0?o(i(t),9007199254740991):0}}),(function(t,e,n){t.exports=!n(3)&&!n(5)((function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a}))}),(function(t,e,n){var i=n(8),o=n(7),a=n(34)(!1),r=n(19)("IE_PROTO");t.exports=function(t,e){var n,s=o(t),d=0,l=[];for(n in s)n!=r&&i(s,n)&&l.push(n);for(;e.length>d;)i(s,n=e[d++])&&(~a(l,n)||l.push(n));return l}}),(function(t,e){t.exports={}}),(function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}}),(function(t,e,n){var i=n(7),o=n(29),a=n(35);t.exports=function(t){return function(e,n,r){var s,d=i(e),l=o(d.length),c=a(r,l);if(t&&n!=n){for(;l>c;)if(s=d[c++],s!=s)return!0}else for(;l>c;c++)if((t||c in d)&&d[c]===n)return t||c||0;return!t&&-1}}}),(function(t,e,n){var i=n(15),o=Math.max,a=Math.min;t.exports=function(t,e){return t=i(t),t<0?o(t+e,0):a(t,e)}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){return Math.random().toString(36).slice(4)};e.default=i,t.exports=e.default}),(function(t,e,n){var i=n(9).f,o=n(8),a=n(12)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,a)&&i(t,a,{configurable:!0,value:e})}}),(function(t,e,n){t.exports={default:n(43),__esModule:!0}}),(function(t,e){t.exports=!0}),(function(t,e){e.f={}.propertyIsEnumerable}),(function(t,e,n){"use strict";function i(){var t=document.createElement("span"),e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var n in e)if(void 0!==t.style[n])return e[n]}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i(),t.exports=e.default}),(function(t,e,n){"use strict";var i=n(39),o=n(16),a=n(47),r=n(11),s=n(8),d=n(32),l=n(53),c=n(37),u=n(55),m=n(12)("iterator"),f=!([].keys&&"next"in[].keys()),p="@@iterator",h="keys",b="values",v=function(){return this};t.exports=function(t,e,n,E,g,_,C){l(n,e,E);var M,T,A,x=function(t){if(!f&&t in S)return S[t];switch(t){case h:return function(){return new n(this,t)};case b:return function(){return new n(this,t)}}return function(){return new n(this,t)}},N=e+" Iterator",y=g==b,O=!1,S=t.prototype,R=S[m]||S[p]||g&&S[g],w=R||x(g),k=g?y?x("entries"):w:void 0,P="Array"==e?S.entries||R:R;if(P&&(A=u(P.call(new t)),A!==Object.prototype&&(c(A,N,!0),i||s(A,m)||r(A,m,v))),y&&R&&R.name!==b&&(O=!0,w=function(){return R.call(this)}),i&&!C||!f&&!O&&S[m]||r(S,m,w),d[e]=w,d[N]=v,g)if(M={values:y?w:x(b),keys:_?w:x(h),entries:k},C)for(T in M)T in S||a(S,T,M[T]);else o(o.P+o.F*(f||O),e,M);return M}}),(function(t,e,n){n(48),t.exports=n(4).Object.keys}),(function(t,e,n){var i=n(13),o=n(54),a=n(21),r=n(19)("IE_PROTO"),s=function(){},d="prototype",l=function(){var t,e=n(25)("iframe"),i=a.length,o="<",r=">";for(e.style.display="none",n(52).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write(o+"script"+r+"document.F=Object"+o+"/script"+r),t.close(),l=t.F;i--;)delete l[d][a[i]];return l()};t.exports=Object.create||function(t,e){var n;return null!==t?(s[d]=i(t),n=new s,s[d]=null,n[r]=t):n=l(),void 0===e?n:o(n,e)}}),(function(t,e){e.f=Object.getOwnPropertySymbols}),(function(t,e,n){var i=n(16),o=n(4),a=n(5);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],r={};r[t]=e(n),i(i.S+i.F*a((function(){n(1)})),"Object",r)}}),(function(t,e,n){t.exports=n(11)}),(function(t,e,n){var i=n(23),o=n(18);n(46)("keys",(function(){return function(t){return o(i(t))}}))}),(function(t,e,n){"use strict";var i=n(56)(!0);n(42)(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=i(e,n),this._i+=t.length,{value:t,done:!1})}))}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e){var n=!1;return function(){n||(t.call(),n=!0,window.setTimeout((function(){n=!1}),e))}};e.default=i,t.exports=e.default}),(function(t,e,n){t.exports={default:n(59),__esModule:!0}}),(function(t,e,n){t.exports=n(2).document&&document.documentElement}),(function(t,e,n){"use strict";var i=n(44),o=n(17),a=n(37),r={};n(11)(r,n(12)("iterator"),(function(){return this})),t.exports=function(t,e,n){t.prototype=i(r,{next:o(1,n)}),a(t,e+" Iterator")}}),(function(t,e,n){var i=n(9),o=n(13),a=n(18);t.exports=n(3)?Object.defineProperties:function(t,e){o(t);for(var n,r=a(e),s=r.length,d=0;s>d;)i.f(t,n=r[d++],e[n]);return t}}),(function(t,e,n){var i=n(8),o=n(23),a=n(19)("IE_PROTO"),r=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),i(t,a)?t[a]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?r:null}}),(function(t,e,n){var i=n(15),o=n(14);t.exports=function(t){return function(e,n){var a,r,s=String(o(e)),d=i(n),l=s.length;return d<0||d>=l?t?"":void 0:(a=s.charCodeAt(d),a<55296||a>56319||d+1===l||(r=s.charCodeAt(d+1))<56320||r>57343?t?s.charAt(d):a:t?s.slice(d,d+2):(a-55296<<10)+(r-56320)+65536)}}}),(function(t,e,n){var i=n(60),o=n(12)("iterator"),a=n(32);t.exports=n(4).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||a[i(t)]}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{value:[String,Number],debounce:{type:Number,default:100},disabled:Boolean,required:Boolean,maxlength:[Number,String],name:String,placeholder:String,readonly:Boolean},data:function(){return{timeout:0}},watch:{value:function(){this.updateValues()},disabled:function(){this.setParentDisabled()},required:function(){this.setParentRequired()},placeholder:function(){this.setParentPlaceholder()},maxlength:function(){this.handleMaxLength()}},methods:{handleMaxLength:function(){this.parentContainer.enableCounter=this.maxlength>0,this.parentContainer.counterLength=this.maxlength},lazyEventEmitter:function(){var t=this;this.timeout&&window.clearTimeout(this.timeout),this.timeout=window.setTimeout((function(){t.$emit("change",t.$el.value),t.$emit("input",t.$el.value)}),this.debounce)},setParentValue:function(t){this.parentContainer.setValue(t||this.$el.value)},setParentDisabled:function(){this.parentContainer.isDisabled=this.disabled},setParentRequired:function(){this.parentContainer.isRequired=this.required},setParentPlaceholder:function(){this.parentContainer.hasPlaceholder=!!this.placeholder},updateValues:function(){var t=this;this.$nextTick((function(){var e=t.$el.value||t.value;t.setParentValue(e),t.parentContainer.inputLength=e?e.length:0}))},onFocus:function(){this.parentContainer&&(this.parentContainer.isFocused=!0)},onBlur:function(){this.parentContainer.isFocused=!1,this.setParentValue()},onInput:function(){this.updateValues(),this.lazyEventEmitter()}}},t.exports=e.default}),(function(t,e,n){n(64),t.exports=n(4).Object.assign}),(function(t,e,n){var i=n(24),o=n(12)("toStringTag"),a="Arguments"==i(function(){return arguments}()),r=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,s;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=r(e=Object(t),o))?n:a?i(e):"Object"==(s=i(e))&&"function"==typeof e.callee?"Arguments":s}}),(function(t,e,n){"use strict";var i=n(18),o=n(45),a=n(40),r=n(23),s=n(26),d=Object.assign;t.exports=!d||n(5)((function(){var t={},e={},n=Symbol(),i="abcdefghijklmnopqrst";return t[n]=7,i.split("").forEach((function(t){e[t]=t})),7!=d({},t)[n]||Object.keys(d({},e)).join("")!=i}))?function(t,e){for(var n=r(t),d=arguments.length,l=1,c=o.f,u=a.f;d>l;)for(var m,f=s(arguments[l++]),p=c?i(f).concat(c(f)):i(f),h=p.length,b=0;h>b;)u.call(f,m=p[b++])&&(n[m]=f[m]);return n}:d}),(function(t,e,n){var i=n(2),o=n(4),a=n(39),r=n(63),s=n(9).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=a?{}:i.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:r.f(t)})}}),(function(t,e,n){e.f=n(12)}),(function(t,e,n){var i=n(16);i(i.S+i.F,"Object",{assign:n(61)})}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e,n){var i=document.createElement("canvas");t.crossOrigin="Anonymous",t.onload=function(){var t=0,n=void 0,o=void 0,a=void 0,r=void 0,s=void 0,d=void 0,l=void 0;i.width=this.width,i.height=this.height,n=i.getContext("2d"),n.drawImage(this,0,0),o=n.getImageData(0,0,i.width,i.height),a=o.data;for(var c=0,u=a.length;c<u;c+=4)r=a[c],s=a[c+1],d=a[c+2],l=Math.floor((r+s+d)/3),t+=l;e(Math.floor(t/(this.width*this.height)))},t.onerror=n};e.default=i,t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){return t&&t.constructor===Array};e.default=i,t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=n(69),a=i(o);e.default=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}}),(function(t,e,n){n(79);for(var i=n(2),o=n(11),a=n(32),r=n(12)("toStringTag"),s=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],d=0;d<5;d++){var l=s[d],c=i[l],u=c&&c.prototype;u&&!u[r]&&o(u,r,l),a[l]=a.Array}}),(function(t,e,n){t.exports={default:n(70),__esModule:!0}}),(function(t,e,n){n(49),n(78),t.exports=n(4).Array.from}),(function(t,e){t.exports=function(){}}),(function(t,e,n){"use strict";var i=n(9),o=n(17);t.exports=function(t,e,n){e in t?i.f(t,e,o(0,n)):t[e]=n}}),(function(t,e,n){var i=n(32),o=n(12)("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||a[o]===t)}}),(function(t,e,n){var i=n(13);t.exports=function(t,e,n,o){try{return o?e(i(n)[0],n[1]):e(n)}catch(e){var a=t.return;throw void 0!==a&&i(a.call(t)),e}}}),(function(t,e,n){var i=n(12)("iterator"),o=!1;try{var a=[7][i]();a.return=function(){o=!0},Array.from(a,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var a=[7],r=a[i]();r.next=function(){return{done:n=!0}},a[i]=function(){return r},t(a)}catch(t){}return n}}),(function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}}),(function(t,e,n){var i=n(31),o=n(21).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,o)}}),(function(t,e,n){"use strict";var i=n(28),o=n(16),a=n(23),r=n(74),s=n(73),d=n(29),l=n(72),c=n(57);o(o.S+o.F*!n(75)((function(t){Array.from(t)})),"Array",{from:function(t){var e,n,o,u,m=a(t),f="function"==typeof this?this:Array,p=arguments.length,h=p>1?arguments[1]:void 0,b=void 0!==h,v=0,E=c(m);if(b&&(h=i(h,p>2?arguments[2]:void 0,2)),void 0==E||f==Array&&s(E))for(e=d(m.length),n=new f(e);e>v;v++)l(n,v,b?h(m[v],v):m[v]);else for(u=E.call(m),n=new f;!(o=u.next()).done;v++)l(n,v,b?r(u,h,[o.value,v],!0):o.value);return n.length=v,n}})}),(function(t,e,n){"use strict";var i=n(71),o=n(76),a=n(32),r=n(7);t.exports=n(42)(Array,"Array",(function(t,e){this._t=r(t),this._i=0,this._k=e}),(function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])}),"values"),a.Arguments=a.Array,i("keys"),i("values"),i("entries")}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-avatar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(295),r=i(a),s=n(265),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-backdrop",r.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(296),r=i(a);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-bottom-bar",r.default),t.component("md-bottom-bar-item",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(297),r=i(a),s=n(298),d=i(s),l=n(266),c=i(l);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-button",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(299),r=i(a),s=n(267),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-button-toggle",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(300),r=i(a),s=n(268),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-card",r.default),t.component("md-card-media",d.default),t.component("md-card-media-cover",c.default),t.component("md-card-media-actions",m.default),t.component("md-card-header",p.default),t.component("md-card-header-text",b.default),t.component("md-card-content",E.default),t.component("md-card-actions",_.default),t.component("md-card-area",M.default),t.component("md-card-expand",A.default),t.material.styles.push(N.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(301),r=i(a),s=n(308),d=i(s),l=n(310),c=i(l),u=n(309),m=i(u),f=n(306),p=i(f),h=n(307),b=i(h),v=n(304),E=i(v),g=n(302),_=i(g),C=n(303),M=i(C),T=n(305),A=i(T),x=n(269),N=i(x);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-checkbox",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(311),r=i(a),s=n(270),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-chips",r.default),t.component("md-chip",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(313),r=i(a),s=n(312),d=i(s),l=n(271),c=i(l);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-dialog",r.default),t.component("md-dialog-title",d.default),t.component("md-dialog-content",c.default),t.component("md-dialog-actions",m.default),t.component("md-dialog-alert",p.default),t.component("md-dialog-confirm",b.default),t.component("md-dialog-prompt",E.default),t.material.styles.push(_.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(314),r=i(a),s=n(317),d=i(s),l=n(316),c=i(l),u=n(315),m=i(u),f=n(318),p=i(f),h=n(319),b=i(h),v=n(320),E=i(v),g=n(272),_=i(g);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-divider",r.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(321),r=i(a);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-file",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(322),r=i(a),s=n(273),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-icon",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(323),r=i(a),s=n(274),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-image",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(324),r=i(a),s=n(275),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-input-container",r.default),t.component("md-input",d.default),t.component("md-autocomplete",c.default),t.component("md-textarea",m.default),t.material.styles.push(p.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(327),r=i(a),s=n(326),d=i(s),l=n(325),c=i(l),u=n(328),m=i(u),f=n(276),p=i(f);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-layout",r.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(329),r=i(a);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-list",r.default),t.component("md-list-item",d.default),t.component("md-list-expand",c.default),t.material.styles.push(m.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(330),r=i(a),s=n(116),d=i(s),l=n(331),c=i(l),u=n(277),m=i(u);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-menu",r.default),t.component("md-menu-item",d.default),t.component("md-menu-content",c.default),t.material.styles.push(m.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(337),r=i(a),s=n(339),d=i(s),l=n(338),c=i(l),u=n(278),m=i(u);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-boards",r.default),t.component("md-board",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(341),r=i(a),s=n(340),d=i(s),l=n(279),c=i(l);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-progress",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(342),r=i(a),s=n(280),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-radio",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(343),r=i(a),s=n(281),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-rating-bar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(344),r=i(a),s=n(282),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-select",r.default),t.component("md-option",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(346),r=i(a),s=n(345),d=i(s),l=n(283),c=i(l);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-sidenav",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(347),r=i(a),s=n(284),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-snackbar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(348),r=i(a),s=n(285),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-speed-dial",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(349),r=i(a),s=n(286),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-spinner",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(350),r=i(a),s=n(287),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-stepper",r.default),t.component("md-step",d.default),t.component("md-step-header-container",c.default),t.component("md-step-header",m.default),t.material.styles.push(p.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(353),r=i(a),s=n(351),d=i(s),l=n(118),c=i(l),u=n(352),m=i(u),f=n(288),p=i(f);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-subheader",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(354),r=i(a),s=n(289),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-switch",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(355),r=i(a),s=n(290),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-table",r.default),t.component("md-table-header",{functional:!0,render:function(t,e){return t("thead",{staticClass:"md-table-header"},e.children)}}),t.component("md-table-body",{functional:!0,render:function(t,e){return t("tbody",{staticClass:"md-table-body"},e.children)}}),t.component("md-table-row",d.default),t.component("md-table-head",c.default),t.component("md-table-cell",m.default),t.component("md-table-edit",p.default),t.component("md-table-card",b.default),t.component("md-table-pagination",_.default),t.component("md-table-alternate-header",E.default),t.material.styles.push(M.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(356),r=i(a),s=n(363),d=i(s),l=n(361),c=i(l),u=n(359),m=i(u),f=n(360),p=i(f),h=n(358),b=i(h),v=n(357),E=i(v),g=n(362),_=i(g),C=n(291),M=i(C);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-tabs",r.default),t.component("md-tab",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(365),r=i(a),s=n(364),d=i(s),l=n(292),c=i(l);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-toolbar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(366),r=i(a),s=n(293),d=i(s);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-tooltip",r.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(367),r=i(a);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-whiteframe",r.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(368),r=i(a);t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){return o.installed?void console.warn("Vue Material is already installed."):(o.installed=!0,t.use(r.default),t.use(d.default),void t.material.styles.push(c.default))}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(121),r=i(a),s=n(119),d=i(s),l=n(294),c=i(l);n(229),t.exports=e.default}),(function(t,e,n){var i,o,a;!(function(n,r){o=[e,t],i=r,a="function"==typeof i?i.apply(e,o):i,!(void 0!==a&&(t.exports=a))})(this,(function(t,e){"use strict";function n(t){function e(){var e=window.getComputedStyle(t,null);"vertical"===e.resize?t.style.resize="none":"both"===e.resize&&(t.style.resize="horizontal"),d="content-box"===e.boxSizing?-(parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)):parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),isNaN(d)&&(d=0),s()}function n(e){var n=t.style.width;t.style.width="0px",t.offsetWidth,t.style.width=n,t.style.overflowY=e}function i(t){for(var e=[];t&&t.parentNode&&t.parentNode instanceof Element;)t.parentNode.scrollTop&&e.push({node:t.parentNode,scrollTop:t.parentNode.scrollTop}),t=t.parentNode;return e}function o(){var e=t.style.height,n=i(t),o=document.documentElement&&document.documentElement.scrollTop;t.style.height="auto";var a=t.scrollHeight+d;return 0===t.scrollHeight?void(t.style.height=e):(t.style.height=a+"px",l=t.clientWidth,n.forEach((function(t){t.node.scrollTop=t.scrollTop})),void(o&&(document.documentElement.scrollTop=o)))}function s(){o();var e=Math.round(parseFloat(t.style.height)),i=window.getComputedStyle(t,null),a=Math.round(parseFloat(i.height));if(a!==e?"visible"!==i.overflowY&&(n("visible"),o(),a=Math.round(parseFloat(window.getComputedStyle(t,null).height))):"hidden"!==i.overflowY&&(n("hidden"),o(),a=Math.round(parseFloat(window.getComputedStyle(t,null).height))),c!==a){c=a;var s=r("autosize:resized");try{t.dispatchEvent(s)}catch(t){}}}if(t&&t.nodeName&&"TEXTAREA"===t.nodeName&&!a.has(t)){var d=null,l=t.clientWidth,c=null,u=function(){t.clientWidth!==l&&s()},m=function(e){window.removeEventListener("resize",u,!1),t.removeEventListener("input",s,!1),t.removeEventListener("keyup",s,!1),t.removeEventListener("autosize:destroy",m,!1),t.removeEventListener("autosize:update",s,!1),Object.keys(e).forEach((function(n){t.style[n]=e[n]})),a.delete(t)}.bind(t,{height:t.style.height,resize:t.style.resize,overflowY:t.style.overflowY,overflowX:t.style.overflowX,wordWrap:t.style.wordWrap});t.addEventListener("autosize:destroy",m,!1),"onpropertychange"in t&&"oninput"in t&&t.addEventListener("keyup",s,!1),window.addEventListener("resize",u,!1),t.addEventListener("input",s,!1),t.addEventListener("autosize:update",s,!1),t.style.overflowX="hidden",t.style.wordWrap="break-word",a.set(t,{destroy:m,update:s}),e()}}function i(t){var e=a.get(t);e&&e.destroy()}function o(t){var e=a.get(t);e&&e.update()}var a="function"==typeof Map?new Map:(function(){var t=[],e=[];return{has:function(e){return t.indexOf(e)>-1},get:function(n){return e[t.indexOf(n)]},set:function(n,i){t.indexOf(n)===-1&&(t.push(n),
e.push(i))},delete:function(n){var i=t.indexOf(n);i>-1&&(t.splice(i,1),e.splice(i,1))}}})(),r=function(t){return new Event(t,{bubbles:!0})};try{new Event("test")}catch(t){r=function(t){var e=document.createEvent("Event");return e.initEvent(t,!0,!1),e}}var s=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?(s=function(t){return t},s.destroy=function(t){return t},s.update=function(t){return t}):(s=function(t,e){return t&&Array.prototype.forEach.call(t.length?t:[t],(function(t){return n(t,e)})),t},s.destroy=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],i),t},s.update=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],o),t}),e.exports=s}))}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(208),a=i(o),r=n(209),s=i(r),d=n(332),l=i(d),c=n(335),u=i(c),m=n(336),f=i(m),p=n(334),h=i(p),b=n(333),v=i(b);e.default={functional:!0,props:{href:String,disabled:Boolean},render:function(t,e){var n=e.children,i=e.data,o=e.props,r=function(){var t=i.on,e=["contextmenu","dblclick","dragend","mousedown","touchstart","click"],a=n.length;if(o.href)return u.default;for(;a--;){var r=n[a].componentOptions;if(r)if("md-list-expand"===r.tag){var d=(function(){var t=n[a];return i.scopedSlots={expand:function(){return t}},n.splice(a,1),{v:h.default}})();if("object"===("undefined"==typeof d?"undefined":(0,s.default)(d)))return d.v}else if("router-link"===r.tag)return n[a].data.staticClass="md-list-item-container md-button",f.default}if(t)for(var c=e.length;c--;)if(t[e[c]])return l.default;return v.default};return t(r(),(0,a.default)({props:o},i),n)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(444),a=i(o),r=new a.default({data:function(){return{current:null}}});e.default=r,t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o);e.default={functional:!0,props:{mdVertical:{type:Boolean,default:!1}},render:function(t,e){var n=e.children,i=e.props,o=function(e){return e.reduce((function(e,n,i,o){if(e.push(n),i<o.length-1){var r=t("md-divider",{key:"divider-"+(0,a.default)()});e.push(r)}return e}),[])};return i.mdVertical||(n=o(n)),t("div",{class:"md-steps-navigation-container"},n)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-ink-ripple",r.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(369),r=i(a);t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=e.changeHtmlMetaColor=void 0,o=e.createNewStyleElement=void 0;"server"!==n.i({NODE_ENV:"development"}).VUE_ENV&&(e.changeHtmlMetaColor=i=function(t,e,n){var i=document.querySelector('meta[name="theme-color"]');i?i.setAttribute("content",t):(i=document.createElement("meta"),i.setAttribute("name","theme-color"),i.setAttribute("content",t),document.head.appendChild(i)),document.body.classList.remove(n),document.body.classList.add(e)},e.createNewStyleElement=o=function(t,e){var n=document.head,i=n.querySelector("#"+e);if(i)i.textContent=t;else{var o=document.createElement("style");o.type="text/css",o.id=e,o.textContent=t,n.appendChild(o)}})}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){console.warn("The theme '"+t+"' doesn't exists. You need to register it first in order to use.")}function a(t,e,n,i){h.createNewStyleElement&&(t=C(t,e,n),t=t.replace(/THEME_NAME/g,i),(0,h.createNewStyleElement)(t,i))}function r(t){t.material=new t({data:{currentTheme:"default",inkRipple:!0,prefix:"md-theme-",styles:[],themes:{default:E}},watch:{styles:function(){this.refreshInjectedStyles()}},methods:{registerPalette:function(t,e){c.default[t]=e},useTheme:function(t){if(!(t in _)){var e=this.themes[t];return e?(a(this.styles.join("\n"),e,t,this.prefix+t),_[t]=!0):o(t)}},refreshInjectedStyles:function(){var t=this,e=this.styles.join("\n"),n=this.prefix;(0,d.default)(_).forEach((function(i){var o=t.themes[i];a(e,o,i,n+i)}))},registerTheme:function(t,e){var n=this;"string"==typeof t?this.themes[t]=e:(0,d.default)(t).forEach((function(e){return n.themes[e]=t[e]}))},setCurrentTheme:function(t){if(t!==this.currentTheme){var e=this.prefix;this.useTheme(t),h.changeHtmlMetaColor&&(0,h.changeHtmlMetaColor)(g[t],e+this.currentTheme,e+t),this.currentTheme=t}}}}),t.component("md-theme",p.default),t.prototype.$material=t.material}Object.defineProperty(e,"__esModule",{value:!0});var s=n(38),d=i(s);e.default=r;var l=n(122),c=i(l),u=n(123),m=i(u),f=n(370),p=i(f),h=n(120),b=["primary","accent","background","warn","hue-1","hue-2","hue-3"],v=new RegExp("("+b.join("|").toUpperCase()+")-(COLOR|CONTRAST)-?(A?\\d*)-?(\\d*\\.?\\d+)?","g"),E={primary:"indigo",accent:"pink",background:"white",warn:"deep-orange"},g={},_={},C=function(t,e,n){return t.replace(v,(function(t,i,o,a,r){var s=void 0,d=0===+a?500:a;if(i=i.toLowerCase(),e[i]?"string"==typeof e[i]?s=c.default[e[i]]:(s=c.default[e[i].color]||c.default[E[i]],d=0===+a?e[i].hue:a):s=c.default[E[i]],"COLOR"===o){var l=c.default[e[i]];return d||l||("accent"===i?d="A200":"background"===i&&(d=50)),"primary"===i&&(g[n]=s[d]),r?(0,m.default)(s[d],r):s[d]}var u=s.darkText.indexOf(d)>=0;return e[i]&&"string"!=typeof e[i]&&e[i].textColor&&("black"===e[i].textColor?u=!0:"white"===e[i].textColor&&(u=!1)),u?r?(0,m.default)("#000",r):"rgba(0, 0, 0, .87)":r?(0,m.default)("#fff",r):"rgba(255, 255, 255, .87)"}))};t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={red:{50:"#ffebee",100:"#ffcdd2",200:"#ef9a9a",300:"#e57373",400:"#ef5350",500:"#f44336",600:"#e53935",700:"#d32f2f",800:"#c62828",900:"#b71c1c",A100:"#ff8a80",A200:"#ff5252",A400:"#ff1744",A700:"#d50000",darkText:[50,100,200,300,"A100"]},pink:{50:"#fce4ec",100:"#f8bbd0",200:"#f48fb1",300:"#f06292",400:"#ec407a",500:"#e91e63",600:"#d81b60",700:"#c2185b",800:"#ad1457",900:"#880e4f",A100:"#ff80ab",A200:"#ff4081",A400:"#f50057",A700:"#c51162",darkText:[50,100,200,"A100"]},purple:{50:"#f3e5f5",100:"#e1bee7",200:"#ce93d8",300:"#ba68c8",400:"#ab47bc",500:"#9c27b0",600:"#8e24aa",700:"#7b1fa2",800:"#6a1b9a",900:"#4a148c",A100:"#ea80fc",A200:"#e040fb",A400:"#d500f9",A700:"#aa00ff",darkText:[50,100,200,"A100"]},"deep-purple":{50:"#ede7f6",100:"#d1c4e9",200:"#b39ddb",300:"#9575cd",400:"#7e57c2",500:"#673ab7",600:"#5e35b1",700:"#512da8",800:"#4527a0",900:"#311b92",A100:"#b388ff",A200:"#7c4dff",A400:"#651fff",A700:"#6200ea",darkText:[50,100,200,"A100"]},indigo:{50:"#e8eaf6",100:"#c5cae9",200:"#9fa8da",300:"#7986cb",400:"#5c6bc0",500:"#3f51b5",600:"#3949ab",700:"#303f9f",800:"#283593",900:"#1a237e",A100:"#8c9eff",A200:"#536dfe",A400:"#3d5afe",A700:"#304ffe",darkText:[50,100,200,"A100"]},blue:{50:"#e3f2fd",100:"#bbdefb",200:"#90caf9",300:"#64b5f6",400:"#42a5f5",500:"#2196f3",600:"#1e88e5",700:"#1976d2",800:"#1565c0",900:"#0d47a1",A100:"#82b1ff",A200:"#448aff",A400:"#2979ff",A700:"#2962ff",darkText:[50,100,200,300,400,"A100"]},"light-blue":{50:"#e1f5fe",100:"#b3e5fc",200:"#81d4fa",300:"#4fc3f7",400:"#29b6f6",500:"#03a9f4",600:"#039be5",700:"#0288d1",800:"#0277bd",900:"#01579b",A100:"#80d8ff",A200:"#40c4ff",A400:"#00b0ff",A700:"#0091ea",darkText:[50,100,200,300,400,500,"A100","A200","A300"]},cyan:{50:"#e0f7fa",100:"#b2ebf2",200:"#80deea",300:"#4dd0e1",400:"#26c6da",500:"#00bcd4",600:"#00acc1",700:"#0097a7",800:"#00838f",900:"#006064",A100:"#84ffff",A200:"#18ffff",A400:"#00e5ff",A700:"#00b8d4",darkText:[50,100,200,300,400,500,600,"A100","A200","A300","A400"]},teal:{50:"#e0f2f1",100:"#b2dfdb",200:"#80cbc4",300:"#4db6ac",400:"#26a69a",500:"#009688",600:"#00897b",700:"#00796b",800:"#00695c",900:"#004d40",A100:"#a7ffeb",A200:"#64ffda",A400:"#1de9b6",A700:"#00bfa5",darkText:[50,100,200,300,400,"A100","A200","A300","A400"]},green:{50:"#e8f5e9",100:"#c8e6c9",200:"#a5d6a7",300:"#81c784",400:"#66bb6a",500:"#4caf50",600:"#43a047",700:"#388e3c",800:"#2e7d32",900:"#1b5e20",A100:"#b9f6ca",A200:"#69f0ae",A400:"#00e676",A700:"#00c853",darkText:[50,100,200,300,400,500,"A100","A200","A300","A400"]},"light-green":{50:"#f1f8e9",100:"#dcedc8",200:"#c5e1a5",300:"#aed581",400:"#9ccc65",500:"#8bc34a",600:"#7cb342",700:"#689f38",800:"#558b2f",900:"#33691e",A100:"#ccff90",A200:"#b2ff59",A400:"#76ff03",A700:"#64dd17",darkText:[50,100,200,300,400,500,600,"A100","A200","A300","A400"]},lime:{50:"#f9fbe7",100:"#f0f4c3",200:"#e6ee9c",300:"#dce775",400:"#d4e157",500:"#cddc39",600:"#c0ca33",700:"#afb42b",800:"#9e9d24",900:"#827717",A100:"#f4ff81",A200:"#eeff41",A400:"#c6ff00",A700:"#aeea00",darkText:[50,100,200,300,400,500,600,700,800,"A100","A200","A300","A400"]},yellow:{50:"#fffde7",100:"#fff9c4",200:"#fff59d",300:"#fff176",400:"#ffee58",500:"#ffeb3b",600:"#fdd835",700:"#fbc02d",800:"#f9a825",900:"#f57f17",A100:"#ffff8d",A200:"#ffff00",A400:"#ffea00",A700:"#ffd600",darkText:[50,100,200,300,400,500,600,700,800,900,"A100","A200","A300","A400"]},amber:{50:"#fff8e1",100:"#ffecb3",200:"#ffe082",300:"#ffd54f",400:"#ffca28",500:"#ffc107",600:"#ffb300",700:"#ffa000",800:"#ff8f00",900:"#ff6f00",A100:"#ffe57f",A200:"#ffd740",A400:"#ffc400",A700:"#ffab00",darkText:[50,100,200,300,400,500,600,700,800,900,"A100","A200","A300","A400"]},orange:{50:"#fff3e0",100:"#ffe0b2",200:"#ffcc80",300:"#ffb74d",400:"#ffa726",500:"#ff9800",600:"#fb8c00",700:"#f57c00",800:"#ef6c00",900:"#e65100",A100:"#ffd180",A200:"#ffab40",A400:"#ff9100",A700:"#ff6d00",darkText:[50,100,200,300,400,500,600,700,"A100","A200","A300","A400"]},"deep-orange":{50:"#fbe9e7",100:"#ffccbc",200:"#ffab91",300:"#ff8a65",400:"#ff7043",500:"#ff5722",600:"#f4511e",700:"#e64a19",800:"#d84315",900:"#bf360c",A100:"#ff9e80",A200:"#ff6e40",A400:"#ff3d00",A700:"#dd2c00",darkText:[50,100,200,300,400,"A100","A200"]},brown:{50:"#efebe9",100:"#d7ccc8",200:"#bcaaa4",300:"#a1887f",400:"#8d6e63",500:"#795548",600:"#6d4c41",700:"#5d4037",800:"#4e342e",900:"#3e2723",A100:"#d7ccc8",A200:"#bcaaa4",A400:"#8d6e63",A700:"#5d4037",darkText:[50,100,200,"A100","A200","A300","A400"]},grey:{50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121",A100:"#fff",A200:"#000000",A400:"#303030",A700:"#616161",darkText:[50,100,200,300,400,500,"A100"]},"blue-grey":{50:"#eceff1",100:"#cfd8dc",200:"#b0bec5",300:"#90a4ae",400:"#78909c",500:"#607d8b",600:"#546e7a",700:"#455a64",800:"#37474f",900:"#263238",A100:"#cfd8dc",A200:"#b0bec5",A400:"#78909c",A700:"#455a64",darkText:[50,100,200,300,"A100","A200","A300","A400"]},white:{50:"#fff",100:"#fff",200:"#fff",300:"#fff",400:"#fff",500:"#fff",600:"#fff",700:"#fff",800:"#fff",900:"#fff",A100:"#fff",A200:"#fff",A400:"#fff",A700:"#fff",darkText:[50,100,200,300,400,500,600,700,800,900,"A100","A200","A300","A400"]},black:{50:"#000",100:"#000",200:"#000",300:"#000",400:"#000",500:"#000",600:"#000",700:"#000",800:"#000",900:"#000",A100:"#000",A200:"#000",A400:"#000",A700:"#000",darkText:[]}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){var n="",i="",o="",a=t.toString().match(/^#?(([0-9a-zA-Z]{3}){1,3})$/);if(!a)throw new Error("Invalid color"+t);if(t=a[1],6===t.length)n=parseInt(t.substring(0,2),16),i=parseInt(t.substring(2,4),16),o=parseInt(t.substring(4,6),16);else if(3===t.length){var r=t.substring(0,1),s=t.substring(1,2),d=t.substring(2,3);n=parseInt(r+r,16),i=parseInt(s+s,16),o=parseInt(d+d,16)}return e?(e>1&&(e/=100),"rgba("+n+", "+i+", "+o+", "+e+")"):"rgb("+n+", "+i+", "+o+")"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{debounce:{type:Number,default:1e3},disabled:Boolean,fetch:{type:Function},filterList:Function,list:{type:Array,default:function(){return[]}},minChars:{type:Number,default:1},name:String,prepareResponseData:Function,printAttribute:{type:String,default:"name"},queryParam:{type:String,default:"q"},required:Boolean},methods:{onFocus:function(){this.parentContainer&&(this.parentContainer.isFocused=!0)},onBlur:function(){this.parentContainer.isFocused=!1,this.setParentValue()},verifyProps:function(){return this.parentContainer?this.listIsEmpty&&this.filterList?this.throwErrorDestroy("You should use a `filterList` function prop with the `list` prop"):!this.fetch&&this.listIsEmpty?this.throwErrorDestroy("You should use a `fetch` function prop"):void 0:this.throwErrorDestroy("You should wrap the md-input in a md-input-container")},throwErrorDestroy:function(t){throw this.$destroy(),new Error(t)}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=8,o=function(t,e){return e.top<=i-parseInt(getComputedStyle(t).marginTop,10)},a=function(t,e){return e.top+t.offsetHeight+i>=window.innerHeight-parseInt(getComputedStyle(t).marginTop,10)},r=function(t,e){return e.left<=i-parseInt(getComputedStyle(t).marginLeft,10)},s=function(t,e){return e.left+t.offsetWidth+i>=window.innerWidth-parseInt(getComputedStyle(t).marginLeft,10)},d=function(t,e){var n=getComputedStyle(t);return o(t,e)&&(e.top=i-parseInt(n.marginTop,10)),r(t,e)&&(e.left=i-parseInt(n.marginLeft,10)),s(t,e)&&(e.left=window.innerWidth-i-t.offsetWidth-parseInt(n.marginLeft,10)),a(t,e)&&(e.top=window.innerHeight-i-t.offsetHeight-parseInt(n.marginTop,10)),e};e.default=d,t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-avatar",mixins:[a.default]},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-backdrop",methods:{close:function(){this.$emit("close")}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-bottom-bar",props:{mdShift:Boolean},mixins:[a.default],computed:{classes:function(){return this.mdShift?"md-shift":"md-fixed"}},methods:{setActive:function(t){this.$children.forEach((function(e){e.active=e===t})),this.$emit("change",this.$children.findIndex((function(e){return e===t})))}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-bottom-bar-item",props:{mdIcon:String,mdIconSrc:String,mdIconset:String,mdActive:Boolean,disabled:Boolean,href:String},data:function(){return{active:!1}},computed:{classes:function(){return{"md-active":this.active}}},watch:{mdActive:function(t){this.setActive(t)}},methods:{setActive:function(t,e){t&&this.$parent.setActive(this),e&&this.$emit("click",e)}},mounted:function(){if(!this.$parent.$el.classList.contains("md-bottom-bar"))throw this.$destroy(),new Error("You should wrap the md-bottom-bar-item in a md-bottom-bar");this.mdActive&&(this.active=!0)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-button",props:{href:String,target:String,rel:String,type:{type:String,default:"button"},disabled:Boolean},mixins:[a.default],computed:{newRel:function(){return"_blank"===this.target?this.rel||"noopener":this.rel}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=void 0;e.default={name:"md-button-toggle",props:{mdSingle:Boolean},mixins:[a.default],mounted:function(){var t=this;this.$children.forEach((function(e){var n=e.$el,i="md-toggle";r=function(){t.mdSingle?(t.$children.forEach((function(t){t.$el.classList.remove(i)})),n.classList.add(i)):n.classList.toggle(i)},n&&n.classList.contains("md-button")&&n.addEventListener("click",r)}))},beforeDestroy:function(){this.$children.forEach((function(t){var e=t.$el;e&&e.classList.contains("md-button")&&e.removeEventListener("click",r)}))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-card",props:{mdWithHover:Boolean},mixins:[a.default],computed:{classes:function(){return{"md-with-hover":this.mdWithHover}}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-actions"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-area",props:{mdInset:Boolean},computed:{classes:function(){return{"md-inset":this.mdInset}}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-content"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-expand",data:function(){return{trigger:null,content:null}},methods:{toggle:function(){this.$refs.expand.classList.toggle("md-active")}},mounted:function(){var t=this;window.setTimeout((function(){t.trigger=t.$el.querySelector("[md-expand-trigger]"),t.content=t.$el.querySelector(".md-card-content"),t.content&&t.trigger.addEventListener("click",t.toggle)}),200)},destroyed:function(){this.content&&this.trigger.removeEventListener("click",this.toggle)}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-header"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-header-text",mounted:function(){this.parentClasses=this.$parent.$el.classList,this.parentClasses.contains("md-card-header")&&(this.insideParent=!0,this.parentClasses.add("md-card-header-flex"))},destroyed:function(){this.parentClasses.remove("md-card-header-flex")}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-media",props:{mdRatio:String,mdMedium:Boolean,mdBig:Boolean},computed:{classes:function t(){var t={};if(this.mdRatio){var e=[];this.mdRatio.indexOf(":")!==-1?e=this.mdRatio.split(":"):this.mdRatio.indexOf("/")!==-1&&(e=this.mdRatio.split("/")),2===e.length&&(t["md-"+e[0]+"-"+e[1]]=!0)}return(this.mdMedium||this.mdBig)&&(t={"md-medium":this.mdMedium,"md-big":this.mdBig}),t}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-media-actions"},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(65),a=i(o);e.default={name:"md-card-media-cover",props:{mdTextScrim:Boolean,mdSolid:Boolean},data:function(){return{backdropBg:{}}},computed:{classes:function(){return{"md-text-scrim":this.mdTextScrim,"md-solid":this.mdSolid}},styles:function(){return{background:this.backdropBg}}},methods:{applyScrimColor:function(t){this.$refs.backdrop&&(this.backdropBg="linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, "+t/2+") 66%, rgba(0, 0, 0, "+t+") 100%)")},applySolidColor:function(t){var e=this.$el.querySelector(".md-card-area");e&&(e.style.background="rgba(0, 0, 0, "+t+")")}},mounted:function(){var t=this,e=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.6;t.mdTextScrim?t.applyScrimColor(e):t.mdSolid&&t.applySolidColor(e)},n=this.$el.querySelector("img");n&&(this.mdTextScrim||this.mdSolid)&&(0,a.default)(n,(function(t){var n=256,i=(100*Math.abs(n-t)/n+15)/100;i>=.7&&(i=.7),e(i)}),e)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-checkbox",props:{name:String,value:[String,Boolean],id:String,disabled:Boolean},mixins:[a.default],data:function(){return{checked:this.value||!1}},computed:{classes:function(){return{"md-checked":this.checked,"md-disabled":this.disabled}}},watch:{value:function(){this.checked=!!this.value}},methods:{toggleCheck:function(t){this.disabled||(this.checked=!this.checked,this.$emit("change",this.checked,t),this.$emit("input",this.checked,t))}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-chip",props:{disabled:Boolean,mdDeletable:Boolean,mdEditable:Boolean},mixins:[a.default],computed:{classes:function(){return{"md-deletable":this.mdDeletable,"md-disabled":this.disabled,"md-editable":this.mdEditable}}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(36),s=i(r);e.default={name:"md-chips",props:{value:Array,disabled:Boolean,debounce:{type:Number,default:100},mdInputId:String,mdInputName:String,mdInputPlaceholder:String,mdInputType:{type:String,default:"text"},mdStatic:Boolean,mdMax:{type:Number,default:1/0}},mixins:[a.default],data:function(){return{currentChip:null,selectedChips:this.value,inputId:this.mdInputId||"chips-"+(0,s.default)()}},watch:{value:function(t){this.selectedChips=t}},computed:{classes:function(){return{"md-static":this.mdStatic,"md-disabled":this.disabled,"md-chips":!0}}},methods:{applyInputFocus:function(){var t=this;this.$nextTick((function(){t.$refs.input.$el.focus()}))},addChip:function(){if(this.currentChip&&this.selectedChips.length<this.mdMax){var t=this.currentChip.trim();this.selectedChips.indexOf(t)<0&&(this.selectedChips.push(t),this.currentChip=null,this.$emit("input",this.selectedChips),this.$emit("change",this.selectedChips),this.applyInputFocus())}},deleteChip:function(t){var e=this.selectedChips.indexOf(t);e>=0&&this.selectedChips.splice(e,1),this.$emit("change",this.selectedChips),this.applyInputFocus()},editChip:function(t){var e=this.selectedChips.indexOf(t);e>=0&&this.selectedChips.splice(e,1),this.currentChip=t,this.$emit("change",this.selectedChips),this.applyInputFocus()},deleteLastChip:function(){this.currentChip||(this.selectedChips.pop(),this.$emit("change",this.selectedChips),this.applyInputFocus())}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(41),s=i(r);e.default={name:"md-dialog",props:{mdClickOutsideToClose:{type:Boolean,default:!0},mdEscToClose:{type:Boolean,default:!0},mdBackdrop:{type:Boolean,default:!0},mdOpenFrom:String,mdCloseTo:String,mdFullscreen:{type:Boolean,default:!1}},mixins:[a.default],data:function(){return{active:!1,transitionOff:!1,dialogTransform:""}},computed:{classes:function(){return{"md-active":this.active}},dialogClasses:function(){return{"md-fullscreen":this.mdFullscreen,"md-transition-off":this.transitionOff,"md-reference":this.mdOpenFrom||this.mdCloseTo}},styles:function(){return{transform:this.dialogTransform}}},methods:{removeDialog:function(){document.body.contains(this.dialogElement)&&this.$el.parentNode.removeChild(this.$el)},calculateDialogPos:function(t){var e=document.querySelector(t);if(e){var n=e.getBoundingClientRect(),i=this.dialogInnerElement.getBoundingClientRect(),o=n.width/i.width,a=n.height/i.height,r={top:-(i.top-n.top),left:-(i.left-n.left+n.width)};n.top>i.top+i.height&&(r.top=n.top-i.top),n.left>i.left+i.width&&(r.left=n.left-i.left-n.width),this.dialogTransform="translate3D("+r.left+"px, "+r.top+"px, 0) scale("+o+", "+a+")"}},open:function(){var t=this;document.body.appendChild(this.dialogElement),this.transitionOff=!0,this.calculateDialogPos(this.mdOpenFrom),window.setTimeout((function(){t.dialogElement.focus(),t.transitionOff=!1,t.active=!0})),this.$emit("open")},closeOnEsc:function(){this.mdEscToClose&&this.close()},close:function(){var t=this;document.body.contains(this.dialogElement)&&this.$nextTick((function(){var e=function e(){var n=t.dialogElement.querySelector(".md-ripple.md-active");n&&n.classList.remove("md-active"),t.dialogInnerElement.removeEventListener(s.default,e),document.body.removeChild(t.dialogElement),t.dialogTransform=""};t.transitionOff=!0,t.dialogTransform="",t.calculateDialogPos(t.mdCloseTo),window.setTimeout((function(){t.transitionOff=!1,t.active=!1,t.dialogInnerElement.addEventListener(s.default,e)})),t.$emit("close")}))}},mounted:function(){var t=this;this.$nextTick((function(){t.dialogElement=t.$el,t.dialogInnerElement=t.$refs.dialog,t.removeDialog()}))},beforeDestroy:function(){this.removeDialog()}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-actions"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-content"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-title"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-alert",props:{mdTitle:String,mdContent:String,mdContentHtml:String,mdOkText:{type:String,default:"Ok"}},data:function(){return{debounce:!1}},methods:{fireCloseEvent:function(){this.debounce||this.$emit("close")},open:function(){this.$emit("open"),this.debounce=!1,this.$refs.dialog.open()},close:function(){this.fireCloseEvent(),this.debounce=!0,this.$refs.dialog.close()}},mounted:function(){if(!this.mdContent&&!this.mdContentHtml)throw new Error("Missing md-content or md-content-html attributes")}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-confirm",props:{mdTitle:String,mdContent:String,mdContentHtml:String,mdOkText:{type:String,default:"Ok"},mdCancelText:{type:String,default:"Cancel"}},data:function(){return{debounce:!1}},methods:{fireCloseEvent:function(t){this.debounce||this.$emit("close",t)},open:function(){this.$emit("open"),this.debounce=!1,this.$refs.dialog.open()},close:function(t){this.fireCloseEvent(t),this.debounce=!0,this.$refs.dialog.close()}},mounted:function(){if(!this.mdContent&&!this.mdContentHtml)throw new Error("Missing md-content or md-content-html attributes")}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-prompt",props:{value:{type:[String,Number],required:!0},mdTitle:String,mdContent:String,mdContentHtml:String,mdOkText:{type:String,default:"Ok"},mdCancelText:{type:String,default:"Cancel"},mdInputId:String,mdInputName:String,mdInputMaxlength:[String,Number],mdInputPlaceholder:String},data:function(){return{debounce:!1}},methods:{fireCloseEvent:function(t){this.debounce||this.$emit("close",t)},open:function(){var t=this;this.$emit("open"),this.debounce=!1,this.$refs.dialog.open(),window.setTimeout((function(){t.$refs.input.$el.focus()}))},close:function(t){this.fireCloseEvent(t),this.debounce=!0,this.$refs.dialog.close()},confirmValue:function(){this.$emit("input",this.$refs.input.$el.value),this.close("ok")}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-divider"},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(67),a=i(o),r=n(10),s=i(r);e.default={name:"md-file",props:{value:String,id:String,name:String,disabled:Boolean,required:Boolean,placeholder:String,accept:String,multiple:Boolean},data:function(){return{filename:this.value}},watch:{value:function(){this.filename=this.value}},methods:{getMultipleName:function(t){var e=[];return[].concat((0,a.default)(t)).forEach((function(t){e.push(t.name)})),e.join(", ")},openPicker:function(){this.disabled||(this.resetFile(),this.$refs.fileInput.click(),this.$refs.textInput.$el.focus())},resetFile:function(){this.parentContainer.value="",this.$refs.fileInput.value=""},onFileSelected:function(t){var e=t.target.files||t.dataTransfer.files;e?e.length>1?this.filename=this.getMultipleName(e):1===e.length?this.filename=e[0].name:this.filename=null:this.filename=t.target.value.split("\\").pop(),this.$emit("selected",e||t.target.value),this.$emit("input",this.filename)}},mounted:function(){if(this.parentContainer=(0,s.default)(this.$parent,"md-input-container"),!this.parentContainer)throw this.$destroy(),new Error("You should wrap the md-file in a md-input-container");this.parentContainer.hasFile=!0},beforeDestroy:function(){this.parentContainer.hasFile=!1}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r={};e.default={name:"md-icon",props:{mdSrc:String,mdIconset:{type:String,default:"material-icons"}},data:function(){return{svgContent:null,imageSrc:null}},mixins:[a.default],watch:{mdSrc:function(){this.svgContent=null,this.imageSrc=null,this.checkSrc()}},methods:{isImage:function(t){return t.indexOf("image")>=0},isSVG:function(t){return t.indexOf("svg")>=0},setSVGContent:function(t){var e=this;this.svgContent=t,this.$nextTick((function(){e.$el.children[0].removeAttribute("fill")}))},loadSVG:function(){if(r[this.mdSrc])this.setSVGContent(r[this.mdSrc]);else{var t=new XMLHttpRequest,e=this;t.open("GET",this.mdSrc,!0),t.onload=function(){var t=this.getResponseHeader("content-type");this.status>=200&&this.status<400&&e.isImage(t)?e.isSVG(t)?(r[e.mdSrc]=this.response,e.setSVGContent(this.response)):e.loadImage():console.warn("The file "+e.mdSrc+" is not a valid image.")},t.send()}},loadImage:function(){this.imageSrc=this.mdSrc},checkSrc:function(){this.mdSrc&&(this.mdSrc.indexOf(".svg")>=0?this.loadSVG():this.loadImage())}},mounted:function(){this.checkSrc()}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(65),a=i(o);e.default={name:"md-image",props:{mdSrc:String},data:function(){return{loaded:!1,applyBlack:!0,imageElement:null}},watch:{mdSrc:function(){this.createImage()}},computed:{classes:function(){return{"md-loaded":this.loaded,"md-black-output":this.applyBlack}}},methods:{analyzeLightness:function(t){var e=this,n=function(){e.loaded=!0};(0,a.default)(t,(function(t){var i=256,o=(100*Math.abs(i-t)/i+15)/100;o>=.7&&(e.applyBlack=!0),e.$nextTick(n)}),n)},createImage:function(){this.loaded=!1,this.applyBlack=!1,this.imageElement=null,this.mdSrc&&(this.imageElement=document.createElement("img"),this.imageElement.crossOrigin="",this.imageElement.src=this.mdSrc,this.analyzeLightness(this.imageElement))}},created:function(){this.createImage()}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(207),a=i(o),r=n(51),s=i(r),d=n(124),l=i(d),c=n(58),u=i(c),m=n(10),f=i(m);e.default={mixins:[u.default,l.default],data:function(){return{items:[],loading:!1,query:"",selected:null,timeout:0,parentContainer:null,searchButton:null}},computed:{listIsEmpty:function(){return 0===this.list.length}},watch:{list:function(t){this.items=(0,s.default)([],t)},query:function(t){this.$refs.input.value=t,this.setParentUpdateValue(t)},value:function(t){this.query=t,this.setParentUpdateValue(t)}},methods:{debounceUpdate:function(){var t=this;this.onInput(),this.timeout&&window.clearTimeout(this.timeout),this.timeout=window.setTimeout((function(){return t.listIsEmpty?void t.update():void t.renderFilteredList()}),this.debounce)},hit:function(t){this.query=t[this.printAttribute],this.$refs.input.value=t[this.printAttribute],this.selected=t,this.onInput(),this.$emit("selected",this.selected,this.$refs.input.value);
},makeFetchRequest:function(t){var e=this;return this.fetch(t).then((function(t){var n=t||t.data||t.body;n=e.prepareResponseData?e.prepareResponseData(n):n,e.items=e.limit?n.slice(0,e.limit):n,e.loading=!1,e.toggleMenu()}))},onFocus:function(){this.parentContainer&&(this.parentContainer.isFocused=!0),this.$refs.input.focus()},onInput:function(){this.updateValues(),this.$emit("change",this.$refs.input.value),this.$emit("input",this.$refs.input.value)},renderFilteredList:function(){this.filterList&&(this.items=this.filterList((0,s.default)([],this.list),this.query)),this.toggleMenu()},reset:function(){this.items=[],this.query="",this.loading=!1},setParentValue:function(t){this.parentContainer.setValue(t||this.$refs.input.value)},setParentDisabled:function(){this.parentContainer.isDisabled=this.disabled},setParentRequired:function(){this.parentContainer.isRequired=this.required},setParentPlaceholder:function(){this.parentContainer.hasPlaceholder=!!this.placeholder},setParentUpdateValue:function(t){this.setParentValue(t),this.updateValues(t)},setSearchButton:function(){this.searchButton=this.parentContainer.$el.querySelector("[md-autocomplete-search]"),this.searchButton&&this.searchButton.addEventListener("click",this.makeFetchRequest)},update:function(){if(!this.query&&!this.list.length)return this.reset();if(!(this.minChars&&this.query.length<this.minChars)){this.loading=!0;var t=(0,a.default)({},this.queryParam,this.query);return this.makeFetchRequest(t)}},toggleMenu:function(){this.items.length&&this.$refs.menu.toggle()},updateValues:function(t){var e=t||this.$refs.input.value||this.value;this.setParentValue(e),this.parentContainer.inputLength=e?e.length:0}},beforeDestroy:function(){this.searchButton&&this.searchButton.removeEventListener("click",this.makeFetchRequest)},mounted:function(){var t=this;this.$nextTick((function(){t.parentContainer=(0,f.default)(t.$parent,"md-input-container"),t.listIsEmpty||(t.items=(0,s.default)([],t.list)),t.query=t.value,t.verifyProps(),t.setSearchButton(),t.setParentDisabled(),t.setParentRequired(),t.setParentPlaceholder(),t.handleMaxLength(),t.updateValues()}))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(58),a=i(o),r=n(10),s=i(r);e.default={name:"md-input",props:{type:{type:String,default:"text"}},mixins:[a.default],mounted:function(){var t=this;this.$nextTick((function(){if(t.parentContainer=(0,s.default)(t.$parent,"md-input-container"),!t.parentContainer)throw t.$destroy(),new Error("You should wrap the md-input in a md-input-container");t.parentContainer.inputInstance=t,t.setParentDisabled(),t.setParentRequired(),t.setParentPlaceholder(),t.handleMaxLength(),t.updateValues()}))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(66),s=i(r);e.default={name:"md-input-container",props:{mdInline:Boolean,mdHasPassword:Boolean,mdClearable:Boolean},mixins:[a.default],data:function(){return{value:"",input:!1,inputInstance:null,showPassword:!1,enableCounter:!1,hasSelect:!1,hasPlaceholder:!1,hasFile:!1,isDisabled:!1,isRequired:!1,isFocused:!1,counterLength:0,inputLength:0}},computed:{hasValue:function(){return(0,s.default)(this.value)?this.value.length>0:Boolean(this.value)},classes:function(){return{"md-input-inline":this.mdInline,"md-has-password":this.mdHasPassword,"md-clearable":this.mdClearable,"md-has-select":this.hasSelect,"md-has-file":this.hasFile,"md-has-value":this.hasValue,"md-input-placeholder":this.hasPlaceholder,"md-input-disabled":this.isDisabled,"md-input-required":this.isRequired,"md-input-focused":this.isFocused}}},methods:{isInput:function(){return this.input&&"input"===this.input.tagName.toLowerCase()},togglePasswordType:function(){this.isInput()&&("password"===this.input.type?(this.input.type="text",this.showPassword=!0):(this.input.type="password",this.showPassword=!1),this.input.focus())},clearInput:function(){this.inputInstance.$el.value="",this.inputInstance.$emit("input",""),this.setValue("")},setValue:function(t){this.value=t}},mounted:function(){if(this.input=this.$el.querySelectorAll("input, textarea, select, .md-file")[0],!this.input)throw this.$destroy(),new Error("Missing input/select/textarea inside md-input-container")}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(115),a=i(o),r=n(58),s=i(r),d=n(10),l=i(d);e.default={name:"md-textarea",mixins:[s.default],watch:{value:function(){var t=this;this.$nextTick((function(){return a.default.update(t.$el)}))}},mounted:function(){var t=this;this.$nextTick((function(){if(t.parentContainer=(0,l.default)(t.$parent,"md-input-container"),!t.parentContainer)throw t.$destroy(),new Error("You should wrap the md-textarea in a md-input-container");t.parentContainer.inputInstance=t,t.setParentDisabled(),t.setParentRequired(),t.setParentPlaceholder(),t.handleMaxLength(),t.updateValues(),t.$el.getAttribute("rows")||t.$el.setAttribute("rows","1"),(0,a.default)(t.$el),setTimeout((function(){return a.default.update(t.$el)}),200)}))},beforeDestroy:function(){a.default.destroy(this.$el)}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-layout",props:{mdTag:{type:String,default:"div"},mdRow:Boolean,mdRowXsmall:Boolean,mdRowSmall:Boolean,mdRowMedium:Boolean,mdRowLarge:Boolean,mdRowXlarge:Boolean,mdColumn:Boolean,mdColumnXsmall:Boolean,mdColumnSmall:Boolean,mdColumnMedium:Boolean,mdColumnLarge:Boolean,mdColumnXlarge:Boolean,mdHideXsmall:Boolean,mdHideSmall:Boolean,mdHideMedium:Boolean,mdHideLarge:Boolean,mdHideXlarge:Boolean,mdHideXsmallAndUp:Boolean,mdHideSmallAndUp:Boolean,mdHideMediumAndUp:Boolean,mdHideLargeAndUp:Boolean,mdHideXlargeAndUp:Boolean,mdGutter:[String,Number,Boolean],mdAlign:String,mdAlignXsmall:String,mdAlignSmall:String,mdAlignMedium:String,mdAlignLarge:String,mdAlignXlarge:String,mdVerticalAlign:String,mdVerticalAlignXsmall:String,mdVerticalAlignSmall:String,mdVerticalAlignMedium:String,mdVerticalAlignLarge:String,mdVerticalAlignXlarge:String,mdFlex:[String,Number,Boolean],mdFlexXsmall:[String,Number,Boolean],mdFlexSmall:[String,Number,Boolean],mdFlexMedium:[String,Number,Boolean],mdFlexLarge:[String,Number,Boolean],mdFlexXlarge:[String,Number,Boolean],mdFlexOffset:[String,Number,Boolean],mdFlexOffsetXsmall:[String,Number,Boolean],mdFlexOffsetSmall:[String,Number,Boolean],mdFlexOffsetMedium:[String,Number,Boolean],mdFlexOffsetLarge:[String,Number,Boolean],mdFlexOffsetXlarge:[String,Number,Boolean]},computed:{classes:function t(){var t={"md-row":this.mdRow,"md-row-xsmall":this.mdRowXsmall,"md-row-small":this.mdRowSmall,"md-row-medium":this.mdRowMedium,"md-row-large":this.mdRowLarge,"md-row-xlarge":this.mdRowXlarge,"md-column":this.mdColumn,"md-column-xsmall":this.mdColumnXsmall,"md-column-small":this.mdColumnSmall,"md-column-medium":this.mdColumnMedium,"md-column-large":this.mdColumnLarge,"md-column-xlarge":this.mdColumnXlarge,"md-hide-xsmall":this.mdHideXsmall,"md-hide-small":this.mdHideSmall,"md-hide-medium":this.mdHideMedium,"md-hide-large":this.mdHideLarge,"md-hide-xlarge":this.mdHideXlarge,"md-hide-xsmall-and-up":this.mdHideXsmallAndUp,"md-hide-small-and-up":this.mdHideSmallAndUp,"md-hide-medium-and-up":this.mdHideMediumAndUp,"md-hide-large-and-up":this.mdHideLargeAndUp,"md-hide-xlarge-and-up":this.mdHideXlargeAndUp};return this.mdGutter&&("boolean"==typeof this.mdGutter?t["md-gutter"]=!0:this.mdGutter&&(t["md-gutter-"+this.mdGutter]=!0)),this.generatePropClasses("md-flex","","mdFlex",t),this.generatePropClasses("md-flex","xsmall","mdFlexXsmall",t),this.generatePropClasses("md-flex","small","mdFlexSmall",t),this.generatePropClasses("md-flex","medium","mdFlexMedium",t),this.generatePropClasses("md-flex","large","mdFlexLarge",t),this.generatePropClasses("md-flex","xlarge","mdFlexXlarge",t),this.generatePropClasses("md-flex-offset","","mdFlexOffset",t),this.generatePropClasses("md-flex-offset","xsmall","mdFlexOffsetXsmall",t),this.generatePropClasses("md-flex-offset","small","mdFlexOffsetSmall",t),this.generatePropClasses("md-flex-offset","medium","mdFlexOffsetMedium",t),this.generatePropClasses("md-flex-offset","large","mdFlexOffsetLarge",t),this.generatePropClasses("md-flex-offset","xlarge","mdFlexOffsetXlarge",t),this.generatePropClasses("md-align","","mdAlign",t),this.generatePropClasses("md-align","xsmall","mdAlignXsmall",t),this.generatePropClasses("md-align","small","mdAlignSmall",t),this.generatePropClasses("md-align","medium","mdAlignMedium",t),this.generatePropClasses("md-align","large","mdAlignLarge",t),this.generatePropClasses("md-align","xlarge","mdAlignXlarge",t),this.generatePropClasses("md-vertical-align","","mdVerticalAlign",t),this.generatePropClasses("md-vertical-align","xsmall","mdVerticalAlignXsmall",t),this.generatePropClasses("md-vertical-align","small","mdVerticalAlignSmall",t),this.generatePropClasses("md-vertical-align","medium","mdVerticalAlignMedium",t),this.generatePropClasses("md-vertical-align","large","mdVerticalAlignLarge",t),this.generatePropClasses("md-vertical-align","xlarge","mdVerticalAlignXlarge",t),t}},methods:{generatePropClasses:function(t,e,n,i){e&&(e="-"+e),this[n]&&("boolean"==typeof this[n]?this[n]?i[t+e]=!0:i[t+e+"-none"]=!0:i[t+e+"-"+this[n]]=!0)}},render:function(t){return t(this.mdTag,{staticClass:"md-layout",class:this.classes},this.$slots.default)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-list",mixins:[a.default]},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-expand"},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item",props:{disabled:Boolean},computed:{classes:function(){return{"md-disabled":this.disabled}}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item"},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(10),a=i(o);e.default={name:"md-list-item",props:{disabled:Boolean,mdExpandMultiple:Boolean},data:function(){return{parentList:!1,active:!1,height:0,contentObserver:null,transitionOff:!0}},computed:{classes:function(){return{"md-disabled":this.disabled,"md-active":this.active}},expandClasses:function(){return{"md-transition-off":this.transitionOff}},expandStyles:function(){return{"margin-bottom":this.height}}},methods:{resetSiblings:function(){var t=this;this.parentList.$children.forEach((function(e){e.$el!==t.$el&&e.$el.classList.contains("md-list-item-expand")&&(e.active=!1)}))},calculatePadding:function(){var t=this;window.requestAnimationFrame((function(){t.height=-t.$el.scrollHeight+"px",window.setTimeout((function(){t.transitionOff=!1}))}))},toggleExpandList:function(t){this.mdExpandMultiple||this.resetSiblings(),this.calculatePadding(),this.active=!this.active,this.$emit("click",t)},recalculateAfterChange:function(){this.transitionOff=!0,this.calculatePadding()},observeChildChanges:function(){this.contentObserver=new MutationObserver(this.recalculateAfterChange),this.contentObserver.observe(this.$refs.expand,{childList:!0,characterData:!0,subtree:!0})}},mounted:function(){var t=this;this.$nextTick((function(){t.parentList=(0,a.default)(t.$parent,"md-list"),t.calculatePadding(),t.observeChildChanges(),window.addEventListener("resize",t.recalculateAfterChange)}))},beforeDestroy:function(){this.contentObserver&&this.contentObserver.disconnect(),window.removeEventListener("resize",this.recalculateAfterChange)}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item",props:{href:String,target:String,disabled:Boolean},computed:{classes:function(){return{"md-disabled":this.disabled}}}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item",props:{disabled:Boolean},computed:{classes:function(){return{"md-disabled":this.disabled}}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(41),a=i(o),r=n(125),s=i(r);e.default={name:"md-menu",props:{mdSize:{type:[Number,String],default:0},mdDirection:{type:String,default:"bottom right"},mdAlignTrigger:{type:Boolean,default:!1},mdOffsetX:{type:[Number,String],default:0},mdOffsetY:{type:[Number,String],default:0},mdCloseOnSelect:{type:Boolean,default:!0}},data:function(){return{active:!1}},watch:{mdSize:function(t,e){t>=1&&t<=7&&(this.removeLastSizeMenuContentClass(e),this.addNewSizeMenuContentClass(t))},mdDirection:function(t,e){this.removeLastDirectionMenuContentClass(e),this.addNewDirectionMenuContentClass(t)},mdAlignTrigger:function(t){this.handleAlignTriggerClass(t)}},methods:{validateMenu:function(){if(!this.menuContent)throw this.$destroy(),new Error("You must have a md-menu-content inside your menu.");if(!this.menuTrigger)throw this.$destroy(),new Error("You must have an element with a md-menu-trigger attribute inside your menu.")},removeLastSizeMenuContentClass:function(t){this.menuContent.classList.remove("md-size-"+t)},removeLastDirectionMenuContentClass:function(t){this.menuContent.classList.remove("md-direction-"+t.replace(/ /g,"-"))},addNewSizeMenuContentClass:function(t){this.menuContent.classList.add("md-size-"+t)},addNewDirectionMenuContentClass:function(t){this.menuContent.classList.add("md-direction-"+t.replace(/ /g,"-"))},handleAlignTriggerClass:function(t){t&&this.menuContent.classList.add("md-align-trigger")},getPosition:function(t,e){var n=this.menuTrigger.getBoundingClientRect(),i="top"===t?n.top+n.height-this.menuContent.offsetHeight:n.top,o="left"===e?n.left-this.menuContent.offsetWidth+n.width:n.left;return i+=parseInt(this.mdOffsetY,10),o+=parseInt(this.mdOffsetX,10),this.mdAlignTrigger&&("top"===t?i-=n.height+11:i+=n.height+11),{top:i,left:o}},calculateMenuContentPos:function(){var t=void 0;t=this.mdDirection?this.getPosition.apply(this,this.mdDirection.trim().split(" ")):this.getPosition("bottom","right"),t=(0,s.default)(this.menuContent,t),this.menuContent.style.top=t.top+window.pageYOffset+"px",this.menuContent.style.left=t.left+window.pageXOffset+"px"},recalculateOnResize:function(){window.requestAnimationFrame(this.calculateMenuContentPos)},open:function(){document.body.contains(this.menuContent)&&document.body.removeChild(this.menuContent),document.body.appendChild(this.menuContent),document.body.appendChild(this.backdropElement),window.addEventListener("resize",this.recalculateOnResize),this.calculateMenuContentPos(),getComputedStyle(this.menuContent).top,this.menuContent.classList.add("md-active"),this.menuContent.focus(),this.active=!0,this.$emit("open")},close:function t(){var e=this,t=function t(n){if(e.menuContent&&n.target===e.menuContent){var i=e.menuContent.querySelector(".md-ripple.md-active");e.menuContent.removeEventListener(a.default,t),e.menuTrigger.focus(),e.active=!1,i&&i.classList.remove("md-active"),document.body.removeChild(e.menuContent),document.body.removeChild(e.backdropElement),window.removeEventListener("resize",e.recalculateOnResize)}};this.menuContent.addEventListener(a.default,t),this.menuContent.classList.remove("md-active"),this.$emit("close")},toggle:function(){this.active?this.close():this.open()}},mounted:function(){var t=this;this.$nextTick((function(){t.menuTrigger=t.$el.querySelector("[md-menu-trigger]"),t.menuContent=t.$el.querySelector(".md-menu-content"),t.backdropElement=t.$refs.backdrop.$el,t.validateMenu(),t.handleAlignTriggerClass(t.mdAlignTrigger),t.addNewSizeMenuContentClass(t.mdSize),t.addNewDirectionMenuContentClass(t.mdDirection),t.$el.removeChild(t.$refs.backdrop.$el),t.menuContent.parentNode.removeChild(t.menuContent),t.menuTrigger.addEventListener("click",t.toggle)}))},beforeDestroy:function(){document.body.contains(this.menuContent)&&(document.body.removeChild(this.menuContent),document.body.removeChild(this.backdropElement)),this.menuTrigger.removeEventListener("click",this.toggle),window.removeEventListener("resize",this.recalculateOnResize)}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-menu-content",data:function(){return{oldHighlight:!1,highlighted:!1,itemsAmount:0}},methods:{close:function(){this.highlighted=!1,this.$parent.close()},highlightItem:function(t){this.oldHighlight=this.highlighted,"up"===t&&(1===this.highlighted?this.highlighted=this.itemsAmount:this.highlighted--),"down"===t&&(this.highlighted===this.itemsAmount?this.highlighted=1:this.highlighted++)},fireClick:function(){this.highlighted>0&&this.getOptions()[this.highlighted-1].$el.click()},getOptions:function(){return this.$children[0].$children.filter((function(t){return t.$el.classList.contains("md-option")}))}},mounted:function(){if(!this.$parent.$el.classList.contains("md-menu"))throw this.$destroy(),new Error("You must wrap the md-menu-content in a md-menu")}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(10),a=i(o);n(228),e.default={name:"md-menu-item",props:{href:String,target:String,disabled:Boolean},data:function(){return{parentContent:{},index:0}},computed:{classes:function(){return{"md-highlighted":this.highlighted}},highlighted:function(){return this.index===this.parentContent.highlighted&&(this.disabled&&(this.parentContent.oldHighlight>this.parentContent.highlighted?this.parentContent.highlighted--:this.parentContent.highlighted++),1===this.index?this.parentContent.$el.scrollTop=0:this.index===this.parentContent.itemsAmount?this.parentContent.$el.scrollTop=this.parentContent.$el.scrollHeight:this.$el.scrollIntoViewIfNeeded(!1),!0)}},methods:{close:function(t){this.disabled||(this.parentMenu.mdCloseOnSelect&&this.parentContent.close(),this.$emit("click",t),this.$emit("selected",t))}},mounted:function(){if(this.parentContent=(0,a.default)(this.$parent,"md-menu-content"),this.parentMenu=(0,a.default)(this.$parent,"md-menu"),!this.parentContent)throw this.$destroy(),new Error("You must wrap the md-menu-item in a md-menu-content");this.parentContent.itemsAmount++,this.index=this.parentContent.itemsAmount}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(10),s=i(r);e.default={props:{id:[String,Number],mdLabel:[String,Number],mdIcon:String,mdActive:Boolean,mdDisabled:Boolean,mdTooltip:String,mdTooltipDelay:{type:String,default:"0"},mdTooltipDirection:{type:String,default:"bottom"}},data:function(){return{mounted:!1,boardId:this.id||"board-"+(0,a.default)(),width:"0px",left:"0px"}},watch:{mdActive:function(){this.updateBoardData()},mdDisabled:function(){this.updateBoardData()},mdIcon:function(){this.updateBoardData()},mdLabel:function(){this.updateBoardData()},mdTooltip:function(){this.updateBoardData()},mdTooltipDelay:function(){this.updateBoardData()},mdTooltipDirection:function(){this.updateBoardData()}},computed:{styles:function(){return{width:this.width,left:this.left}}},methods:{getBoardData:function(){return{id:this.boardId,label:this.mdLabel,icon:this.mdIcon,active:this.mdActive,disabled:this.mdDisabled,tooltip:this.mdTooltip,tooltipDelay:this.mdTooltipDelay,tooltipDirection:this.mdTooltipDirection,ref:this}},updateBoardData:function(){this.parentBoards.updateBoard(this.getBoardData())}},mounted:function(){var t=this.getBoardData();if(this.parentBoards=(0,s.default)(this.$parent,"md-boards"),!this.parentBoards)throw new Error("You must wrap the md-board in a md-boards");this.mounted=!0,this.parentBoards.updateBoard(t),this.mdActive&&this.parentBoards.setActiveBoard(t)},beforeDestroy:function(){this.parentBoards.unregisterBoard(this.getBoardData())}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(38),a=i(o),r=n(1),s=i(r),d=n(50),l=i(d);e.default={props:{mdFixed:Boolean,mdCentered:Boolean,mdRight:Boolean,mdDynamicHeight:{type:Boolean,default:!0},mdElevation:{type:[String,Number],default:0},mdAuto:{type:Boolean,default:!1},mdDuration:{type:Number,default:5e3},mdControls:{type:Boolean,default:!1},mdInfinite:{type:Boolean,default:!1},mdSwipeable:Boolean,mdSwipeDistance:{type:Number,default:100}},mixins:[s.default],data:function(){return{boardList:{},activeBoard:null,activeBoardNumber:0,hasIcons:!1,hasLabel:!1,transitionControl:null,transitionOff:!1,contentHeight:"0px",contentWidth:"0px",autoTransition:null}},computed:{boardClasses:function(){return{"md-dynamic-height":this.mdDynamicHeight,"md-transition-off":this.transitionOff}},navigationClasses:function(){return{"md-has-icon":this.hasIcons,"md-has-label":this.hasLabel,"md-fixed":this.mdFixed,"md-right":!this.mdCentered&&this.mdRight,"md-centered":this.mdCentered||this.mdFixed}},indicatorClasses:function(){var t=this.lastIndicatorNumber>this.activeBoardNumber;return this.lastIndicatorNumber=this.activeBoardNumber,{"md-transition-off":this.transitionOff,"md-to-right":!t,"md-to-left":t}}},methods:{getHeaderClass:function(t){return{"md-active":this.activeBoard===t.id,"md-disabled":t.disabled}},registerBoard:function(t){this.boardList[t.id]=t},unregisterBoard:function(t){delete this.boardList[t.id]},updateBoard:function(t){if(this.registerBoard(t),t.active)if(t.disabled){if((0,a.default)(this.boardList).length){var e=(0,a.default)(this.boardList),n=e.indexOf(t.id)+1,i=e[n];i?this.setActiveBoard(this.boardList[i]):this.setActiveBoard(this.boardList[0])}}else this.setActiveBoard(t)},observeElementChanges:function(){this.parentObserver=new MutationObserver((0,l.default)(this.calculateOnWatch,50)),this.parentObserver.observe(this.$refs.boardsContent,{childList:!0,attributes:!0,subtree:!0})},getBoardIndex:function(t){var e=(0,a.default)(this.boardList);return e.indexOf(t)},calculateIndicatorPos:function(){if(this.$refs.boardHeader&&this.$refs.boardHeader[this.activeBoardNumber]){var t=this.$el.offsetWidth,e=this.$refs.boardHeader[this.activeBoardNumber],n=e.offsetLeft,i=t-n-e.offsetWidth;this.$refs.indicator.style.left=n+"px",this.$refs.indicator.style.right=i+"px"}},calculateBoardsWidthAndPosition:function(){var t=this.$el.offsetWidth,e=0;this.contentWidth=t*this.activeBoardNumber+"px";for(var n in this.boardList){var i=this.boardList[n];i.ref.width=t+"px",i.ref.left=t*e+"px",e++}},calculateContentHeight:function(){var t=this;this.$nextTick((function(){if((0,a.default)(t.boardList).length){var e=t.boardList[t.activeBoard].ref.$el.offsetHeight;t.contentHeight=e+"px"}}))},calculatePosition:function(){var t=this;window.requestAnimationFrame((function(){t.calculateIndicatorPos(),t.calculateBoardsWidthAndPosition(),t.calculateContentHeight()}))},debounceTransition:function(){var t=this;window.clearTimeout(this.transitionControl),this.transitionControl=window.setTimeout((function(){t.calculatePosition(),t.transitionOff=!1}),200)},calculateOnWatch:function(){this.calculatePosition(),this.debounceTransition()},calculateOnResize:function(){this.transitionOff=!0,this.calculateOnWatch()},start:function(){var t=this;this.autoTransition&&window.clearInterval(this.autoTransition),this.autoTransition=window.setInterval((function(){t.moveNextBoard()}),this.mdDuration)},setActiveBoard:function(t,e){this.mdAuto&&e&&this.start(),this.hasIcons=!!t.icon,this.hasLabel=!!t.label,this.activeBoard=t.id,this.activeBoardNumber=this.getBoardIndex(this.activeBoard),this.calculatePosition(),this.$emit("change",this.activeBoardNumber)},movePrevBoard:function(){var t=(0,a.default)(this.boardList),e=t.indexOf(this.activeBoard)-1,n=t[e];if(n)this.setActiveBoard(this.boardList[n],!0);else if(this.mdInfinite){var i=(0,a.default)(this.boardList)[(0,a.default)(this.boardList).length-1];this.setActiveBoard(this.boardList[i],!0)}},moveNextBoard:function(){var t=(0,a.default)(this.boardList),e=t.indexOf(this.activeBoard)+1,n=t[e];if(n)this.setActiveBoard(this.boardList[n],!0);else if(this.mdInfinite){var i=(0,a.default)(this.boardList)[0];this.setActiveBoard(this.boardList[i],!0)}},isHorizontallyInside:function(t){return t>this.mountedRect.left&&t<this.mountedRect.left+this.mountedRect.width},isVerticallyInside:function(t){return t>this.mountedRect.top&&t<this.mountedRect.top+this.mountedRect.height},handleTouchStart:function(t){this.mountedRect=this.$refs.boardsContent.getBoundingClientRect();var e=t.changedTouches[0].clientX,n=t.changedTouches[0].clientY;this.isHorizontallyInside(e)&&this.isVerticallyInside(n)&&(this.initialTouchPosition=e,this.canMove=!0)},handleTouchEnd:function(t){if(this.canMove){var e=t.changedTouches[0].clientX,n=this.initialTouchPosition-e,i=n>0?"moveNextBoard":"movePrevBoard";Math.abs(n)>this.mdSwipeDistance&&this[i](),this.canMove=!1,this.initialTouchPosition=null}}},mounted:function(){var t=this;this.$nextTick((function(){if(t.observeElementChanges(),window.addEventListener("resize",t.calculateOnResize),(0,a.default)(t.boardList).length&&!t.activeBoard){var e=(0,a.default)(t.boardList)[0];t.setActiveBoard(t.boardList[e])}t.mdSwipeable&&(t.mountedRect=t.$refs.boardsContent.getBoundingClientRect(),t.initialTouchPosition=null,t.canMove=!1,document.addEventListener("touchstart",t.handleTouchStart),document.addEventListener("touchend",t.handleTouchEnd)),t.mdAuto&&t.start()}))},beforeDestroy:function(){this.parentObserver&&this.parentObserver.disconnect(),this.autoTransition&&window.clearTimeout(this.autoTransition),window.removeEventListener("resize",this.calculateOnResize),this.mdSwipeable&&(document.removeEventListener("touchstart",this.handleTouchStart),document.removeEventListener("touchend",this.handleTouchEnd))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-progress",props:{mdIndeterminate:Boolean,mdProgress:{type:Number,default:0}},mixins:[a.default],computed:{classes:function(){return{"md-indeterminate":this.mdIndeterminate}},styles:function(){if(!this.mdIndeterminate)return{width:this.mdProgress+"%"}}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-radio",props:{name:String,id:String,value:[String,Boolean,Number],mdValue:{type:[String,Boolean,Number],required:!0},disabled:Boolean},mixins:[a.default],computed:{classes:function(){return{"md-checked":"undefined"!=typeof this.value&&null!==this.value&&this.mdValue.toString()===this.value.toString(),"md-disabled":this.disabled}}},methods:{toggleCheck:function(t){this.disabled||(this.$emit("change",this.mdValue,t),this.$emit("input",this.mdValue,t))}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=24;e.default={props:{mdMaxRating:{type:Number,default:5},disabled:Boolean,value:{type:Number,default:0},mdIconSize:{type:Number,default:1},mdFullIconset:String,mdEmptyIconset:String,mdFullIcon:{type:String,default:"star"},mdEmptyIcon:{type:String,default:"star"}},mixins:[a.default],data:function(){return{srcFullIcon:null,srcEmptyIcon:null,rating:this.value}},mounted:function(){this.srcFullIcon=this.checkSrc(this.mdFullIcon),this.srcEmptyIcon=this.checkSrc(this.mdEmptyIcon)},computed:{emptyIcon:function(){return this.mdEmptyIconset?"":this.mdEmptyIcon},fullIcon:function(){return this.mdFullIconset?"":this.mdFullIcon},iconClasses:function(){var t={};return this.mdIconSize&&(t["md-size-"+this.mdIconSize+"x"]=!0),t},fullIconStyle:function(){return{width:100/this.mdMaxRating*this.rating+"%","margin-left":-r*this.mdIconSize*this.mdMaxRating+"px"}}},watch:{mdFullIcon:function(){this.srcFullIcon=this.checkSrc(this.mdFullIcon)},mdEmptyIcon:function(){this.srcEmptyIcon=this.checkSrc(this.mdEmptyIcon)},value:function(){this.rating=this.value}},methods:{hoverStars:function(t){this.disabled||(this.rating=this.getIconIndex(t.currentTarget),this.$emit("hover",this.rating))},clickStars:function(t){if(!this.disabled){var e=this.getIconIndex(t.currentTarget);this.$emit("input",e),this.$emit("change",e)}},getIconIndex:function(t){var e=this,n=this.$el.querySelectorAll(".md-empty-icon > .md-icon, .md-full-icon > .md-icon"),i=-1;return n=Array.prototype.slice.call(n),n.some((function(n,o){if(n===t)return i=(o+1)%e.mdMaxRating,i=i?i:e.mdMaxRating,!0})),i},checkSrc:function(t){return t&&/.+\.(svg|png)/.test(t)?t:null},onMouseOut:function(){this.rating=this.value}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(10),a=i(o);e.default={name:"md-option",props:{value:[String,Boolean,Number,Object]},data:function(){return{parentSelect:{},check:!1,index:0}},computed:{isSelected:function(){if(this.value&&this.parentSelect.value){var t=this.value.toString();return this.parentSelect.multiple?this.parentSelect.value.indexOf(t)>=0:this.value&&this.parentSelect.value&&t===this.parentSelect.value.toString()}return!1},classes:function(){return{"md-selected":this.isSelected,"md-checked":this.check}}},methods:{isMultiple:function(){return this.parentSelect.multiple},setParentOption:function(){this.isMultiple()?this.check=!this.check:this.parentSelect.selectOption(this.value,this.$refs.item.textContent,this.$el)},selectOption:function(t){this.disabled||(this.setParentOption(),this.$emit("selected",t))}},watch:{isSelected:function(t){this.isMultiple()&&(this.check=t)},check:function(t){t?this.parentSelect.selectMultiple(this.index,this.value,this.$refs.item.textContent):this.parentSelect.selectMultiple(this.index)}},mounted:function(){if(this.parentSelect=(0,a.default)(this.$parent,"md-select"),this.parentContent=(0,a.default)(this.$parent,"md-menu-content"),!this.parentSelect)throw new Error("You must wrap the md-option in a md-select");this.parentSelect.optionsAmount++,this.index=this.parentSelect.optionsAmount,this.parentSelect.multipleOptions[this.index]={},this.parentSelect.options[this.index]=this,(this.isMultiple()&&this.parentSelect.value.indexOf(this.value)>=0||this.parentSelect.value===this.value)&&this.setParentOption()},beforeDestroy:function(){this.parentSelect&&(delete this.parentSelect.options[this.index],delete this.parentSelect.multipleOptions[this.index])}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(38),a=i(o),r=n(1),s=i(r),d=n(10),l=i(d),c=n(66),u=i(c);e.default={name:"md-select",props:{name:String,id:String,required:Boolean,multiple:Boolean,value:[String,Number,Array],disabled:Boolean,placeholder:String,mdMenuClass:String,mdMenuOptions:Object},mixins:[s.default],data:function(){return{lastSelected:null,selectedValue:null,selectedText:null,multipleOptions:{},options:{},optionsAmount:0}},computed:{classes:function(){return{"md-disabled":this.disabled,"md-select-icon":this.hasIcon}},contentClasses:function(){return this.multiple?"md-multiple "+this.mdMenuClass:this.mdMenuClass},hasIcon:function(){return this.$slots.icon},valueStyle:function(){return this.hasIcon?{display:"none"}:{}}},watch:{value:function(t){this.setTextAndValue(t),this.multiple&&this.selectOptions(t)},disabled:function(){this.setParentDisabled()},required:function(){
this.setParentRequired()},placeholder:function(){this.setParentPlaceholder()}},methods:{onOpen:function(){this.lastSelected&&this.lastSelected.scrollIntoViewIfNeeded(!0),this.$emit("opened")},setParentDisabled:function(){this.parentContainer.isDisabled=this.disabled},setParentRequired:function(){this.parentContainer.isRequired=this.required},setParentPlaceholder:function(){this.parentContainer.hasPlaceholder=!!this.placeholder},selectOptions:function(t){var e=this,n=(0,a.default)(this.options).map((function(t){return e.options[t]}));n&&n.length&&n.filter((function(e){return t.indexOf(e.value)!==-1})).forEach((function(t){t.check=!0}))},getSingleValue:function(t){var e=this,n={};return(0,a.default)(this.options).forEach((function(i){var o=e.options[i];o.value===t&&(n.value=t,n.text=o.$refs.item.textContent,n.el=o.$refs.item)})),n},getMultipleValue:function(t){var e=this;if((0,u.default)(this.value)){var n=[];return t.forEach((function(t){(0,a.default)(e.options).forEach((function(i){var o=e.options[i];if(o.value===t){var a=o.$refs.item.textContent;e.multipleOptions[i]={value:t,text:a},n.push(a)}}))})),{value:t,text:n.join(", ")}}return{}},setTextAndValue:function(t){var e=this.multiple?this.getMultipleValue(t):this.getSingleValue(t);this.selectedValue=e.value,this.selectedText=e.text,this.lastSelected=e.el,this.parentContainer&&this.parentContainer.setValue(this.selectedText)},changeValue:function(t){this.$emit("input",t),this.$emit("change",t),this.$emit("selected",t)},selectMultiple:function(t,e,n){var i=[];this.multipleOptions[t]={value:e,text:n};for(var o in this.multipleOptions)this.multipleOptions.hasOwnProperty(o)&&this.multipleOptions[o].value&&i.push(this.multipleOptions[o].value);this.changeValue(i)},selectOption:function(t,e,n){this.lastSelected=n,this.selectedText=e,this.setTextAndValue(t),this.changeValue(t)}},mounted:function(){this.parentContainer=(0,l.default)(this.$parent,"md-input-container"),this.parentContainer&&(this.setParentDisabled(),this.setParentRequired(),this.setParentPlaceholder(),this.parentContainer.hasSelect=!0),this.setTextAndValue(this.value)},beforeDestroy:function(){this.parentContainer&&(this.parentContainer.setValue(""),this.parentContainer.hasSelect=!1)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-sidenav",data:function(){return{mdVisible:!1}},mixins:[a.default],props:{mdSwipeable:Boolean,mdSwipeThreshold:{type:Number,default:15},mdSwipeDistance:{type:Number,default:100}},computed:{classes:function(){return this.mdVisible&&"md-active"}},methods:{show:function(){this.open()},open:function(){this.mdVisible=!0,this.$el.focus(),this.$emit("open")},close:function(){this.mdVisible=!1,this.$el.blur(),this.$emit("close")},toggle:function(){this.mdVisible?this.close():this.open()},isHorizontallyInside:function(t){return t>0&&t<this.mountedRect.left+this.mountedRect.width},isVerticallyInside:function(t){return t>0&&t<this.mountedRect.top+this.mountedRect.height},isFromStartWhenClosed:function(t){return!!this.mdVisible||t<this.mdSwipeThreshold},handleTouchStart:function(t){var e=t.touches[0].clientX-this.mountedRect.left,n=t.touches[0].clientY-this.mountedRect.top;this.isHorizontallyInside(e)&&this.isVerticallyInside(n)&&this.isFromStartWhenClosed(e)&&(this.initialTouchPosition=e,this.canMove=!0)},handleTouchEnd:function(){this.canMove=!1,this.initialTouchPosition=null},handleTouchMove:function(t){if(this.canMove){var e=t.touches[0].clientX,n=this.mdVisible?this.initialTouchPosition-e:e-this.initialTouchPosition,i=this.mdVisible?"close":"open";n>this.mdSwipeDistance&&this[i]()}}},mounted:function(){this.mdSwipeable&&(this.mountedRect=this.$refs.backdrop.$el.getBoundingClientRect(),this.initialTouchPosition=null,this.canMove=!1,document.addEventListener("touchstart",this.handleTouchStart),document.addEventListener("touchend",this.handleTouchEnd),document.addEventListener("touchmove",this.handleTouchMove))},beforeDestroy:function(){this.mdSwipeable&&(document.removeEventListener("touchstart",this.handleTouchStart),document.removeEventListener("touchend",this.handleTouchEnd),document.removeEventListener("touchmove",this.handleTouchMove))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(41),s=i(r),d=n(1),l=i(d),c=n(117),u=i(c);e.default={name:"md-snackbar",props:{id:[String,Number],mdPosition:{type:String,default:"bottom center"},mdDuration:{type:[String,Number],default:4e3}},mixins:[l.default],data:function(){return{snackbarId:this.id||"snackbar-"+(0,a.default)(),active:!1,rootElement:{},snackbarElement:{},directionClass:null,closeTimeout:null}},computed:{classes:function(){var t={"md-active":this.active};return this.directionClass=this.mdPosition.replace(/ /g,"-"),t["md-position-"+this.directionClass]=!0,t}},watch:{active:function(t){var e="md-has-toast-"+this.directionClass,n="md-has-toast";t?(document.body.classList.add(e),document.body.classList.add(n)):(document.body.classList.remove(e),document.body.classList.remove(n))}},methods:{removeElement:function(){if(document.body.contains(this.snackbarElement)){var t=this.snackbarElement.querySelector(".md-ripple.md-active");t&&t.classList.remove("md-active"),document.body.removeChild(this.snackbarElement)}},open:function(){u.default.current&&u.default.current.close(),u.default.current=this,document.body.appendChild(this.snackbarElement),window.getComputedStyle(this.$refs.container).backgroundColor,this.active=!0,this.$emit("open"),this.closeTimeout=window.setTimeout(this.close,this.mdDuration),this.timeoutStartedAt=Date.now()},close:function(){var t=this;if(this.$refs.container){var e=function e(){t.$refs.container.removeEventListener(s.default,e),t.removeElement()};u.default.current=null,this.active=!1,this.$emit("close"),this.$refs.container.removeEventListener(s.default,e),this.$refs.container.addEventListener(s.default,e),window.clearTimeout(this.closeTimeout),this.pendingDuration=this.mdDuration}},pauseTimeout:function(){this.pendingDuration=this.pendingDuration-(Date.now()-this.timeoutStartedAt),this.timeoutStartedAt=0,window.clearTimeout(this.closeTimeout)},resumeTimeout:function(){this.timeoutStartedAt=Date.now(),this.closeTimeout=window.setTimeout(this.close,this.pendingDuration)}},mounted:function(){var t=this;this.$nextTick((function(){t.snackbarElement=t.$el,t.snackbarElement.parentNode.removeChild(t.snackbarElement),t.timeoutStartedAt=0,t.pendingDuration=t.mdDuration}))},beforeDestroy:function(){window.clearTimeout(this.closeTimeout),this.removeElement()}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-speed-dial",props:{mdOpen:{type:String,default:"click"},mdMode:{type:String,default:"fling"},mdDirection:{type:String,default:"top"}},mixins:[a.default],data:function(){return{fabTrigger:null,active:!1}},computed:{classes:function t(){var t={"md-active":this.active};return t["md-mode-"+this.mdMode]=!0,t["md-direction-"+this.mdDirection]=!0,t}},methods:{closeSpeedDial:function(t){!t.target!==this.fabTrigger&&this.fabTrigger.contains(t.target)||(this.active=!1,document.body.removeEventListener("click",this.closeSpeedDial))},toggleSpeedDial:function(){var t=this;this.active=!this.active,window.setTimeout((function(){document.body.addEventListener("click",t.closeSpeedDial)}),50)}},mounted:function(){var t=this;this.$nextTick((function(){t.fabTrigger=t.$el.querySelector("[md-fab-trigger]"),"click"===t.mdOpen?t.fabTrigger.addEventListener("click",t.toggleSpeedDial):(t.$el.addEventListener("mouseenter",t.toggleSpeedDial),t.$el.addEventListener("mouseleave",t.closeSpeedDial))}))},beforeDestroy:function(){this.fabTrigger.removeEventListener("click",this.toggleSpeedDial),document.body.removeEventListener("click",this.closeSpeedDial)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-spinner",props:{mdSize:{type:Number,default:50},mdStroke:{type:Number,default:3.5},mdIndeterminate:Boolean,mdProgress:{type:Number,default:0}},mixins:[a.default],computed:{classes:function(){return{"md-indeterminate":this.mdIndeterminate}},styles:function(){var t=this.mdSize+"px";return{width:t,height:t}},dashProgress:function(){var t=125*this.mdProgress/100;return!this.mdIndeterminate&&(t>=125&&(t=130),t+", 200")}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(10),s=i(r);e.default={name:"md-step",props:{id:[String,Number],mdActive:Boolean,mdButtonBack:{type:String,default:"BACK"},mdButtonContinue:{type:String,default:"CONTINUE"},mdContinue:{type:Boolean,default:!0},mdDisabled:Boolean,mdEditable:{type:Boolean,default:!0},mdIcon:String,mdLabel:[String,Number],mdMessage:[String],mdToolTip:String,mdTooltipDelay:{type:String,default:"0"},mdTooltipDirection:{type:String,default:"bottom"}},data:function(){return{index:0,left:"0px",mounted:!1,parentStepper:void 0,stepId:this.id||"step-"+(0,a.default)(),vertical:!1,width:"0px"}},watch:{mdActive:function(){this.updateStepData()},mdContinue:function(){this.updateStepData()},mdEditable:function(){this.updateStepData()},mdDisabled:function(){this.updateStepData()},mdIcon:function(){this.updateStepData()},mdLabel:function(){this.updateStepData()},mdMessage:function(){this.updateStepData()},mdToolTip:function(){this.updateStepData()},mdTooltipDelay:function(){this.updateStepData()},mdTooltipDirection:function(){this.updateStepData()}},computed:{canGoBack:function(){if(0===this.index)return!1;if(!this.parentStepper)return!1;var t=this.parentStepper.getPreviousStep(this.stepId);return!(void 0!==t&&!t.editable)},continueText:function(){return this.parentStepper&&this.index+1===this.parentStepper.getStepsCount()&&"CONTINUE"===this.mdButtonContinue?"FINISH":this.mdButtonContinue},isCurrentStep:function(){return this.index===this.parentStepper.activeStepNumber},styles:function(){return this.vertical?{}:{width:this.width,left:this.left}}},methods:{getStepData:function(){return{id:this.stepId,label:this.mdLabel,message:this.mdMessage,icon:this.mdIcon,active:this.mdActive,continue:this.mdContinue,editable:this.mdEditable,disabled:this.mdDisabled,toolTip:this.mdToolTip,tooltipDelay:this.mdTooltipDelay,tooltipDirection:this.mdTooltipDirection,ref:this}},moveNextStep:function(){this.parentStepper.moveNextStep()},movePreviousStep:function(){this.parentStepper.movePreviousStep()},setActiveStep:function(){this.parentStepper.setActiveStep(this.getStepData())},updateStepData:function(){this.parentStepper.updateStep(this.getStepData())}},mounted:function(){var t=this.getStepData();if(this.parentStepper=(0,s.default)(this.$parent,"md-stepper"),!this.parentStepper)throw new Error("You must wrap the md-step in a md-stepper");this.mounted=!0,this.parentStepper.updateStep(t),this.mdActive&&this.parentStepper.setActiveStep(t),this.vertical=this.parentStepper.mdVertical,this.index=this.parentStepper.getStepIndex(this.stepId)},beforeDestroy:function(){this.parentStepper.unregisterStep(this.getStepData())}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(10),a=i(o);e.default={props:{step:Object,mdAlternateLabels:Boolean},data:function(){return{index:Number,parentStepper:{}}},computed:{isCompleted:function(){return this.index<this.parentStepper.activeStepNumber},getHeaderClasses:function(){return{"md-active":this.parentStepper.activeStep===this.step.id,"md-alternate-labels":this.mdAlternateLabels,"md-disabled":this.step.disabled,"md-has-sub-message":this.step.message,"md-primary":this.isCompleted}},icon:function(){return!this.step.disabled&&this.step.editable&&this.isCompleted?"mode_edit":!this.step.disabled&&this.isCompleted?"check":this.step.icon},stepNumber:function(){return this.index+1}},mounted:function(){var t=this;this.$nextTick((function(){if(t.parentStepper=(0,a.default)(t.$parent,"md-stepper"),!t.parentStepper)throw t.$destroy(),new Error("You should wrap the md-step-header in a md-stepper");t.index=t.parentStepper.getStepIndex(t.step.id)}))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(38),a=i(o),r=n(1),s=i(r),d=n(50),l=i(d);e.default={name:"md-stepper",props:{mdAlternateLabels:{type:Boolean,default:!1},mdElevation:{type:[String,Number],default:1},mdVertical:{type:Boolean,default:!1}},mixins:[s.default],data:function(){return{stepList:{},activeStep:null,activeStepNumber:0,contentHeight:"0px",contentWidth:"0px"}},computed:{navigationClasses:function(){return{"md-alternate-labels":this.mdAlternateLabels}},stepsClasses:function(){return{"md-steps-vertical":this.mdVertical}}},methods:{getNextStep:function(t){var e=this.getStepIndex(t);if(e!==this.stepList.length){var n=(0,a.default)(this.stepList)[e+1],i=this.stepList[n];return i}},getPreviousStep:function(t){var e=this.getStepIndex(t);if(0!==e){var n=(0,a.default)(this.stepList)[e-1],i=this.stepList[n];return i}},getStepsCount:function(){var t=(0,a.default)(this.stepList);return t.length},getStepIndex:function(t){var e=(0,a.default)(this.stepList);return e.indexOf(t)},registerStep:function(t){this.$set(this.stepList,t.id,t)},moveNextStep:function(){if(this.activeStepNumber<this.getStepsCount()-1){var t=this.getNextStep(this.activeStep);this.setActiveStep(t)}else this.$emit("completed")},movePreviousStep:function(){if(this.activeStepNumber>0&&this.activeStepNumber<this.getStepsCount()){var t=this.getPreviousStep(this.activeStep);this.setActiveStep(t)}},setActiveStep:function(t){this.activeStepNumber>this.getStepIndex(t.id)&&!t.editable||(this.activeStep=t.id,this.activeStepNumber=this.getStepIndex(this.activeStep),this.calculatePosition(),this.$emit("change",this.activeStepNumber))},unregisterStep:function(t){this.$delete(this.stepList,t.id)},updateStep:function(t){if(this.registerStep(t),t.active)if(t.disabled){if((0,a.default)(this.stepList).length){var e=(0,a.default)(this.stepList),n=e.indexOf(t.id)+1,i=e[n];i?this.setActiveStep(this.stepList[i]):this.setActiveStep(this.stepList[0])}}else this.setActiveStep(t)},observeElementChanges:function(){this.parentObserver=new MutationObserver((0,l.default)(this.calculateOnWatch,50)),this.parentObserver.observe(this.$refs.stepContent,{childList:!0,attributes:!0,subtree:!0})},calculateStepsWidthAndPosition:function(){if(this.mdVertical)this.contentWidth="initial";else{var t=this.$el.offsetWidth,e=0;this.contentWidth=t*this.activeStepNumber+"px";for(var n in this.stepList){var i=this.stepList[n];i.ref.width=t+"px",i.ref.left=t*e+"px",e++}}},calculateContentHeight:function(){var t=this;this.$nextTick((function(){if(!t.mdVertical&&(0,a.default)(t.stepList).length){var e=t.stepList[t.activeStep].ref.$el.offsetHeight;t.contentHeight=e+"px"}else t.contentHeight="initial"}))},calculatePosition:function(){var t=this;window.requestAnimationFrame((function(){t.calculateStepsWidthAndPosition(),t.calculateContentHeight()}))},debounceTransition:function(){var t=this;window.clearTimeout(this.transitionControl),this.transitionControl=window.setTimeout((function(){t.calculatePosition(),t.transitionOff=!1}),200)},calculateOnWatch:function(){this.calculatePosition(),this.debounceTransition()},calculateOnResize:function(){this.transitionOff=!0,this.calculateOnWatch()}},mounted:function(){var t=this;this.$nextTick((function(){if(t.observeElementChanges(),window.addEventListener("resize",t.calculateOnResize),(0,a.default)(t.stepList).length&&!t.activeStep){var e=(0,a.default)(t.stepList)[0];t.setActiveStep(t.stepList[e])}}))},beforeDestroy:function(){this.parentObserver&&this.parentObserver.disconnect(),window.removeEventListener("resize",this.calculateOnResize)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-subheader",mixins:[a.default]},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=75,s="-1px";e.default={name:"md-switch",props:{name:String,value:Boolean,id:String,disabled:Boolean,type:{type:String,default:"button"}},mixins:[a.default],data:function(){return{leftPos:s,checked:Boolean(this.value)}},computed:{classes:function(){return{"md-checked":this.checked,"md-disabled":this.disabled}},styles:function(){return{transform:"translate3D("+this.leftPos+", -50%, 0)"}}},watch:{checked:function(){this.setPosition()},value:function(t){this.changeState(t)}},methods:{setPosition:function(){this.leftPos=this.checked?r+"%":s},changeState:function(t,e){"undefined"!=typeof e?(this.$emit("change",t,e),e.defaultPrevented||(this.checked=t),this.$emit("input",this.checked,e)):this.checked=t},toggle:function(t){this.disabled||this.changeState(!this.checked,t)}},mounted:function(){this.$nextTick(this.setPosition)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(51),a=i(o),r=n(1),s=i(r),d=n(10),l=i(d);e.default={name:"md-table",props:{mdSortType:String,mdSort:String},mixins:[s.default],data:function(){return{sortType:this.mdSortType,sortBy:this.mdSort,hasRowSelection:!1,data:[],selectedRows:[]}},computed:{numberOfRows:function(){return this.data?this.data.length:0},numberOfSelected:function(){return this.selectedRows?this.selectedRows.length:0}},methods:{emitSort:function(t){this.sortBy=t,this.$emit("sort",{name:t,type:this.sortType})},emitSelection:function(){this.$emit("select",this.selectedRows)},removeRow:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=e||this.data,i=n.indexOf(t);i!==-1&&n.splice(i,1)},setRowSelection:function(t,e){return t?void this.selectedRows.push(e):void this.removeRow(e,this.selectedRows)},setMultipleRowSelection:function(t){this.selectedRows=t?(0,a.default)([],this.data):[]}},watch:{mdSort:function(){this.sortBy=this.mdSort,this.$emit("sortInput")},mdSortType:function(){this.sortType=this.mdSortType,this.$emit("sortInput")}},mounted:function(){this.parentCard=(0,l.default)(this.$parent,"md-table-card"),this.parentCard&&(this.parentCard.tableInstance=this)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(10),s=i(r);e.default={name:"md-table-alternate-header",mixins:[a.default],props:{mdSelectedLabel:{type:String,default:"selected"}},data:function(){return{classes:{},tableInstance:{}}},computed:{numberOfSelected:function(){return this.tableInstance.numberOfSelected||0}},mounted:function(){var t=this;this.parentCard=(0,s.default)(this.$parent,"md-table-card"),this.$nextTick((function(){t.tableInstance=t.parentCard.tableInstance,t.$watch("tableInstance.numberOfSelected",(function(){t.$refs.counter.textContent=t.tableInstance.numberOfSelected,t.classes={"md-active":t.tableInstance.numberOfSelected>0}}))}))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-table-card",mixins:[a.default]},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-table-cell",props:{mdNumeric:Boolean},data:function(){return{hasAction:!1}},computed:{classes:function(){return{"md-numeric":this.mdNumeric,"md-has-action":this.hasAction}}},mounted:function(){this.$children.length>0&&(this.hasAction=!0)}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-table-edit",props:{value:[String,Number],mdLarge:Boolean,mdId:String,mdName:String,mdPlaceholder:String,mdMaxlength:[Number,String]},data:function(){return{active:!1}},computed:{triggerClasses:function(){return{"md-edited":this.value}},dialogClasses:function(){return{"md-active":this.active,"md-large":this.mdLarge}},realValue:function(){console.log(this.value)}},methods:{openDialog:function(){this.active=!0,this.$refs.input.$el.focus(),document.addEventListener("click",this.closeDialogOnOffClick)},closeDialog:function(){this.active&&(this.active=!1,this.$refs.input.$el.blur(),document.removeEventListener("click",this.closeDialogOnOffClick))},closeDialogOnOffClick:function(t){this.$refs.dialog.contains(t.target)||this.closeDialog()},confirmDialog:function(){var t=this.$refs.input.$el.value;this.closeDialog(),this.$emit("input",t),this.$emit("edited",t)}}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(10),a=i(o);e.default={name:"md-table-head",props:{mdNumeric:Boolean,mdSortBy:String,mdTooltip:String},data:function(){return{sortType:null,sorted:!1,parentTable:{}}},computed:{classes:function(){var t=this.hasMatchSort();return t||(this.sorted=!1),{"md-numeric":this.mdNumeric,"md-sortable":this.mdSortBy,"md-sorted":t&&this.sorted,"md-sorted-descending":t&&"desc"===this.sortType}}},methods:{hasMatchSort:function(){return this.parentTable.sortBy===this.mdSortBy},changeSort:function(){this.mdSortBy&&("asc"===this.sortType&&this.sorted?this.sortType="desc":this.sortType="asc",this.sorted=!0,this.parentTable.sortType=this.sortType,this.parentTable.emitSort(this.mdSortBy))},initSort:function(){this.hasMatchSort()&&(this.sorted=!0,this.sortType=this.parentTable.sortType||"asc")}},mounted:function(){var t=this;this.parentTable=(0,a.default)(this.$parent,"md-table"),this.initSort(),this.parentTable.$on("sortInput",(function(){t.initSort()}))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(203),a=i(o);e.default={name:"md-table-pagination",props:{mdSize:{type:[Number,String],default:10},mdPageOptions:{type:[Array,Boolean],default:function(){return[10,25,50,100]}},mdPage:{type:[Number,String],default:1},mdTotal:{type:[Number,String],default:"Many"},mdLabel:{type:String,default:"Rows per page"},mdSeparator:{type:String,default:"of"}},data:function(){return{totalItems:0,currentPage:1,currentSize:parseInt(this.mdSize,10)}},watch:{mdTotal:function(t){var e=this.currentPage*this.currentSize;this.subTotal=e>t?t:e,this.totalItems=isNaN(t)?a.default:parseInt(t,10)},mdSize:function(t){this.currentSize=parseInt(t,10)},mdPage:function(t){this.currentPage=parseInt(t,10)}},computed:{lastPage:function(){return!1},shouldDisable:function(){return this.currentSize*this.currentPage>=this.totalItems},subTotal:function(){var t=this.currentPage*this.currentSize;return t>this.mdTotal?this.mdTotal:t}},methods:{emitPaginationEvent:function(){this.canFireEvents&&this.$emit("pagination",{size:this.currentSize,page:this.currentPage})},changeSize:function(){this.canFireEvents&&(this.$emit("size",this.currentSize),this.emitPaginationEvent())},previousPage:function(){this.canFireEvents&&(this.currentPage--,this.$emit("page",this.currentPage),this.emitPaginationEvent())},nextPage:function(){this.canFireEvents&&(this.currentPage++,this.$emit("page",this.currentPage),this.emitPaginationEvent())}},mounted:function(){var t=this;this.$nextTick((function(){t.mdPageOptions?t.currentSize=t.mdPageOptions.includes(t.currentSize)?t.currentSize:t.mdPageOptions[0]:t.currentSize=0,t.canFireEvents=!0}))}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(10),a=i(o),r=n(36),s=i(r),d="md-transition-off";e.default={name:"md-table-row",props:{mdAutoSelect:Boolean,mdSelection:Boolean,mdItem:Object},data:function(){return{parentTable:{},headRow:!1,checkbox:!1,index:0,uuid:"mdrow_uuid_"+(0,s.default)()}},computed:{isDisabled:function(){return!this.mdSelection&&!this.headRow},hasSelection:function(){return this.mdSelection||this.headRow&&this.parentTable.hasRowSelection},classes:function(){return{"md-selected":this.checkbox}}},watch:{mdItem:function(t,e){this.parentTable.data[this.index]=this.mdItem,this.handleMultipleSelection(t===e)}},methods:{setRowSelection:function(t,e){this.parentTable.setRowSelection(t,e)},handleSingleSelection:function(t){this.parentTable.setRowSelection(t,this.mdItem),this.parentTable.$children[0].checkbox=this.parentTable.numberOfSelected===this.parentTable.numberOfRows},handleMultipleSelection:function(t){var e=this;this.parentTable.numberOfRows>25&&this.parentTable.$el.classList.add(d),this.parentTable.$children.forEach((function(e){e.checkbox=t})),this.parentTable.setMultipleRowSelection(t),window.setTimeout((function(){return e.parentTable.$el.classList.remove(d)}),100)},select:function(t){this.hasSelection&&(this.headRow?this.handleMultipleSelection(t):this.handleSingleSelection(t),this.parentTable.emitSelection(),this.$emit(t?"selected":"deselected",t))},autoSelect:function(){this.mdAutoSelect&&this.hasSelection&&(this.checkbox=!this.checkbox,this.handleSingleSelection(this.checkbox),this.parentTable.emitSelection())},startTableRow:function(){if(this.parentTable=(0,a.default)(this.$parent,"md-table"),"thead"===this.$el.parentNode.tagName.toLowerCase())this.headRow=!0;else{if(!this.mdItem&&this.mdSelection)throw new Error('You should set the md-item property when using mdSelection. Example: <md-table-row md-selection :md-item="ITEM" ...>');this.mdSelection&&(this.parentTable.hasRowSelection=!0),this.parentTable.data.push(this.mdItem)}}},destroyed:function(){this.parentTable.removeRow(this.mdItem)},mounted:function(){this.startTableRow()}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(10),s=i(r);e.default={name:"md-tab",props:{id:[String,Number],mdLabel:[String,Number],mdIcon:String,mdIconset:String,mdActive:Boolean,mdDisabled:Boolean,mdOptions:{default:void 0},mdTooltip:String,mdTooltipDelay:{type:String,default:"0"},mdTooltipDirection:{type:String,default:"bottom"}},data:function(){return{mounted:!1,tabId:this.id||"tab-"+(0,a.default)(),width:"0px",left:"0px"}},watch:{mdActive:function(){this.updateTabData()},mdDisabled:function(){this.updateTabData()},mdIcon:function(){this.updateTabData()},mdIconset:function(){this.updateTabData()},mdOptions:{deep:!0,handler:function(){this.updateTabData()}},mdLabel:function(){this.updateTabData()},mdTooltip:function(){this.updateTabData()},mdTooltipDelay:function(){this.updateTabData()},mdTooltipDirection:function(){this.updateTabData()}},computed:{styles:function(){return{width:this.width,left:this.left}}},methods:{getTabData:function(){return{id:this.tabId,label:this.mdLabel,icon:this.mdIcon,iconset:this.mdIconset,options:this.mdOptions,active:this.mdActive,disabled:this.mdDisabled,tooltip:this.mdTooltip,tooltipDelay:this.mdTooltipDelay,tooltipDirection:this.mdTooltipDirection,ref:this}},updateTabData:function(){this.parentTabs.updateTab(this.getTabData())}},mounted:function(){var t=this.getTabData();if(this.parentTabs=(0,s.default)(this.$parent,"md-tabs"),!this.parentTabs)throw new Error("You must wrap the md-tab in a md-tabs");this.mounted=!0,this.parentTabs.updateTab(t),this.mdActive&&this.parentTabs.setActiveTab(t)},beforeDestroy:function(){this.parentTabs.unregisterTab(this.getTabData())}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(38),a=i(o),r=n(202),s=i(r),d=n(1),l=i(d),c=n(50),u=i(c);e.default={name:"md-tabs",props:{mdFixed:Boolean,mdCentered:Boolean,mdRight:Boolean,mdNavigation:{type:Boolean,default:!0},mdDynamicHeight:{type:Boolean,default:!0},mdElevation:{type:[String,Number],default:0}},mixins:[l.default],data:function(){return{tabList:{},activeTab:null,activeTabNumber:0,hasIcons:!1,hasLabel:!1,hasNavigationScroll:!1,isNavigationOnStart:!0,isNavigationOnEnd:!1,transitionControl:null,transitionOff:!1,contentHeight:"0px",contentWidth:"0px"}},computed:{tabClasses:function(){return{"md-dynamic-height":this.mdDynamicHeight,"md-transition-off":this.transitionOff}},navigationClasses:function(){return{"md-has-icon":this.hasIcons,"md-has-label":this.hasLabel,"md-fixed":this.mdFixed,"md-right":!this.mdCentered&&this.mdRight,"md-centered":this.mdCentered||this.mdFixed,"md-has-navigation-scroll":this.hasNavigationScroll}},indicatorClasses:function(){var t=this.lastIndicatorNumber>this.activeTabNumber;return this.lastIndicatorNumber=this.activeTabNumber,{"md-transition-off":this.transitionOff,"md-to-right":!t,"md-to-left":t}},navigationLeftButtonClasses:function(){return{"md-disabled":this.isNavigationOnStart}},navigationRightButtonClasses:function(){return{"md-disabled":this.isNavigationOnEnd}}},methods:{getHeaderClass:function(t){return{"md-active":this.activeTab===t.id,"md-disabled":t.disabled}},registerTab:function(t){var e=!1,n=!0,i=!1,o=void 0;try{for(var r,d=(0,s.default)((0,a.default)(this.tabList));!(n=(r=d.next()).done);n=!0){var l=r.value;if(this.tabList[l].active){e=!0;break}}}catch(t){i=!0,o=t}finally{try{!n&&d.return&&d.return()}finally{if(i)throw o}}this.$set(this.tabList,t.id,t),e||(this.tabList[t.id].active=!0)},unregisterTab:function(t){this.$delete(this.tabList,t.id)},updateTab:function(t){if(this.registerTab(t),t.active)if(t.disabled){if((0,a.default)(this.tabList).length){var e=(0,a.default)(this.tabList),n=e.indexOf(t.id)+1,i=e[n];i?this.setActiveTab(this.tabList[i]):this.setActiveTab(this.tabList[0])}}else this.setActiveTab(t)},observeElementChanges:function(){this.parentObserver=new MutationObserver((0,u.default)(this.calculateOnWatch,50)),this.parentObserver.observe(this.$refs.tabContent,{childList:!0,attributes:!0,subtree:!0})},getTabIndex:function(t){var e=(0,a.default)(this.tabList);return e.indexOf(t)},calculateIndicatorPos:function(){if(this.$refs.tabHeader&&this.$refs.tabHeader[this.activeTabNumber]){var t=this.$el.offsetWidth,e=this.$refs.tabHeader[this.activeTabNumber],n=e.offsetLeft-this.$refs.tabsContainer.scrollLeft,i=t-n-e.offsetWidth;this.$refs.indicator.style.left=n+"px",this.$refs.indicator.style.right=i+"px"}},calculateTabsWidthAndPosition:function(){var t=this.$el.offsetWidth,e=0;this.contentWidth=t*this.activeTabNumber+"px";for(var n in this.tabList){var i=this.tabList[n];i.ref.width=t+"px",i.ref.left=t*e+"px",e++}},calculateContentHeight:function(){var t=this;this.$nextTick((function(){if((0,a.default)(t.tabList).length){var e=t.tabList[t.activeTab].ref.$el.offsetHeight;t.contentHeight=e+"px"}}))},calculatePosition:function(){var t=this;window.requestAnimationFrame((function(){t.calculateIndicatorPos(),t.calculateTabsWidthAndPosition(),t.calculateContentHeight(),t.checkNavigationScroll()}))},debounceTransition:function(){var t=this;window.clearTimeout(this.transitionControl),this.transitionControl=window.setTimeout((function(){t.calculatePosition(),t.transitionOff=!1}),200)},calculateOnWatch:function(){this.calculatePosition(),this.debounceTransition()},calculateOnResize:function(){this.transitionOff=!0,this.calculateOnWatch()},calculateScrollPos:function(){var t=this.$refs.tabsContainer,e=t.scrollLeft,n=t.scrollWidth,i=t.clientWidth;this.isNavigationOnStart=e<32,this.isNavigationOnEnd=n-e-32<i},handleNavigationScroll:function(){var t=this;window.requestAnimationFrame((function(){t.calculateIndicatorPos(),t.calculateScrollPos()}))},checkNavigationScroll:function(){var t=this.$refs.tabsContainer,e=t.scrollWidth,n=t.clientWidth;
this.hasNavigationScroll=e>n},setActiveTab:function(t){this.hasIcons=!!t.icon||!!t.iconset,this.hasLabel=!!t.label,this.activeTab=t.id,this.activeTabNumber=this.getTabIndex(this.activeTab),this.calculatePosition(),this.$emit("change",this.activeTabNumber)},navigationScrollLeft:function(){var t=this.$refs.tabsContainer,e=t.scrollLeft,n=t.clientWidth;this.$refs.tabsContainer.scrollLeft=Math.max(0,e-n)},navigationScrollRight:function(){var t=this.$refs.tabsContainer,e=t.scrollLeft,n=t.clientWidth,i=t.scrollWidth;this.$refs.tabsContainer.scrollLeft=Math.min(i,e+n)}},mounted:function(){var t=this;this.$nextTick((function(){if(t.observeElementChanges(),window.addEventListener("resize",t.calculateOnResize),(0,a.default)(t.tabList).length&&!t.activeTab){var e=(0,a.default)(t.tabList)[0];t.setActiveTab(t.tabList[e])}}))},beforeDestroy:function(){this.parentObserver&&this.parentObserver.disconnect(),window.removeEventListener("resize",this.calculateOnResize)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o);e.default={name:"md-toolbar",mixins:[a.default]},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(67),a=i(o),r=n(41),s=i(r);e.default={name:"md-tooltip",props:{mdDirection:{type:String,default:"bottom"},mdDelay:{type:String,default:"0"}},data:function(){return{active:!1,parentClass:null,transitionOff:!1,topPosition:!1,leftPosition:!1}},computed:{classes:function(){var t={"md-active":this.active,"md-transition-off":this.transitionOff,"md-tooltip-top":"top"===this.mdDirection,"md-tooltip-right":"right"===this.mdDirection,"md-tooltip-bottom":"bottom"===this.mdDirection,"md-tooltip-left":"left"===this.mdDirection};return this.parentClass&&(t[this.parentClass]=!0),t},style:function(){return{"transition-delay":this.mdDelay+"ms",top:this.topPosition+"px",left:this.leftPosition+"px"}}},watch:{mdDirection:function(){this.calculateTooltipPosition()}},methods:{removeTooltips:function(){this.tooltipElement.parentNode&&(this.tooltipElement.removeEventListener(s.default,this.removeTooltips),this.tooltipElement.parentNode.removeChild(this.tooltipElement))},calculateTooltipPosition:function(){var t=this.parentElement.getBoundingClientRect(),e={};switch(this.mdDirection){case"top":e.top=t.top-this.$el.offsetHeight,e.left=t.left+t.width/2;break;case"right":e.top=t.top,e.left=t.left+t.width;break;case"bottom":e.top=t.bottom,e.left=t.left+t.width/2;break;case"left":e.top=t.top,e.left=t.left-this.$el.offsetWidth;break;default:console.warn("Invalid "+this.mdDirection+" option to md-direction option")}this.topPosition=e.top,this.leftPosition=e.left},generateTooltipClasses:function(){var t=[];[].concat((0,a.default)(this.parentElement.classList)).forEach((function(e){e.indexOf("md-")>=0&&"md-active"!==e&&t.push(e+"-tooltip")})),this.parentClass=t.join(" ")},open:function(){var t=this;this.removeTooltips(),this.$nextTick((function(){document.body.appendChild(t.tooltipElement),getComputedStyle(t.tooltipElement).top,t.transitionOff=!0,t.generateTooltipClasses(),t.calculateTooltipPosition(),window.setTimeout((function(){t.transitionOff=!1,t.active=!0}),10)}))},close:function(){this.active=!1,this.tooltipElement.removeEventListener(s.default,this.removeTooltips),this.tooltipElement.addEventListener(s.default,this.removeTooltips)}},mounted:function(){var t=this;this.$nextTick((function(){t.tooltipElement=t.$el,t.parentElement=t.tooltipElement.parentNode,t.$el.parentNode.removeChild(t.$el),t.parentElement.addEventListener("mouseenter",t.open),t.parentElement.addEventListener("focus",t.open),t.parentElement.addEventListener("mouseleave",t.close),t.parentElement.addEventListener("blur",t.close)}))},beforeDestroy:function(){this.active=!1,this.removeTooltips(),this.parentElement&&(this.parentElement.removeEventListener("mouseenter",this.open),this.parentElement.removeEventListener("focus",this.open),this.parentElement.removeEventListener("mouseleave",this.close),this.parentElement.removeEventListener("blur",this.close))}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-whiteframe",props:{mdElevation:{type:[String,Number],default:1},mdTag:{type:String,default:"div"}},computed:{classes:function(){var t=parseInt(this.mdElevation,10),e="md-whiteframe-";return isNaN(t)||"number"!=typeof t?this.mdElevation.indexOf("dp")>-1&&(e+=this.mdElevation):(e+=t,e+="dp"),e}},render:function(t){return t(this.mdTag,{staticClass:"md-whiteframe",class:this.classes},this.$slots.default)}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e,n){"start"===e?(t.addEventListener("mousedown",n),t.addEventListener("touchstart",n)):(t.addEventListener("mouseup",n),t.addEventListener("touchend",n))},o=function(t,e,n){"start"===e?(t.removeEventListener("mousedown",n),t.removeEventListener("touchstart",n)):(t.removeEventListener("mouseup",n),t.removeEventListener("touchend",n))};e.default={name:"md-ink-ripple",props:{mdDisabled:Boolean},data:function(){return{mounted:!1,rippleElement:null,parentElement:null,parentDimensions:{width:null,height:null,top:null,left:null},awaitingComplete:!1,hasCompleted:!1,fadeOut:!1,active:!1}},computed:{classes:function(){return{"md-fadeout":this.fadeOut,"md-active":this.active}},styles:function(){return{width:this.parentDimensions.width,height:this.parentDimensions.height,top:this.parentDimensions.top,left:this.parentDimensions.left}},disabled:function(){return this.mdDisabled||!this.$material.inkRipple}},watch:{disabled:function(t){t?this.destroy():this.init()}},methods:{checkAvailablePositions:function(t){var e=["relative","absolute","fixed"];return e.indexOf(getComputedStyle(t).position)>-1},getClosestPositionedParent:function(t){var e=t&&t.parentNode;return!(!e||"body"===e.tagName.toLowerCase())&&(this.checkAvailablePositions(t)?t:this.getClosestPositionedParent(e))},getParentSize:function(){var t=this.parentElement;return Math.round(Math.max(t.offsetWidth,t.offsetHeight))+"px"},getClickPosition:function(t){if(this.$refs.ripple){var e=this.parentElement.getBoundingClientRect(),n=t.pageY,i=t.pageX;return"touchstart"===t.type&&(n=t.changedTouches[0].pageY,i=t.changedTouches[0].pageX),{top:n-e.top-this.$refs.ripple.offsetHeight/2-document.body.scrollTop+"px",left:i-e.left-this.$refs.ripple.offsetWidth/2-document.body.scrollLeft+"px"}}return!1},setDimensions:function(){var t=this.getParentSize();this.parentDimensions.width=t,this.parentDimensions.height=t},setPositions:function(t){var e=this.getClickPosition(t);e&&(this.parentDimensions.top=e.top,this.parentDimensions.left=e.left)},clearState:function(){this.active=!1,this.fadeOut=!1,this.hasCompleted=!1,this.setDimensions(),window.clearTimeout(this.awaitingComplete),o(document.body,"end",this.endRipple)},startRipple:function(t){var e=this;"touchstart"===t.type?this.previous.push("touch"):this.previous.push("mouse"),this.previous=this.previous.splice(this.previous.length-2,this.previous.length),this.previous.length>=2&&"touch"===this.previous[1]&&"mouse"===this.previous[0]||(this.clearState(),this.awaitingComplete=window.setTimeout((function(){e.hasCompleted=!0}),400),i(document.body,"end",this.endRipple),this.$nextTick((function(){e.setPositions(t),e.active=!0})))},endRipple:function(){var t=this;this.hasCompleted?this.fadeOut=!0:this.awaitingComplete=window.setTimeout((function(){t.fadeOut=!0}),200),o(document.body,"end",this.endRipple)},registerTriggerEvent:function(){i(this.parentElement,"start",this.startRipple)},unregisterTriggerEvent:function(){this.parentElement&&o(this.parentElement,"start",this.startRipple)},init:function(){this.rippleElement=this.$el,this.parentElement=this.getClosestPositionedParent(this.$el.parentNode),this.previous=["mouse"],this.parentElement?(this.rippleElement.parentNode.removeChild(this.rippleElement),this.parentElement.querySelectorAll(".md-ink-ripple").length>0?this.$destroy():(this.parentElement.appendChild(this.rippleElement),this.registerTriggerEvent(),this.setDimensions())):this.$destroy()},destroy:function(){this.rippleElement&&this.rippleElement.parentNode&&(this.unregisterTriggerEvent(),this.rippleElement.parentNode.removeChild(this.rippleElement))}},mounted:function(){var t=this;window.setTimeout((function(){t.disabled?t.destroy():t.init(),t.$nextTick((function(){t.mounted=!0}))}),100)},beforeDestroy:function(){this.destroy()}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-theme",props:{mdTag:String,mdName:{type:String,default:"default"}},render:function(t){return this.mdTag||this.$slots.default.length>1?t(this.mdTag||"div",{staticClass:this.$material.prefix+this.mdName},this.$slots.default):this.$slots.default[0]},watch:{mdName:function(t){this.$material.useTheme(t)}},beforeMount:function(){var t=this.mdName;t&&this.$material.useTheme(t)}},t.exports=e.default}),(function(t,e,n){t.exports={default:n(210),__esModule:!0}}),(function(t,e,n){t.exports={default:n(211),__esModule:!0}}),(function(t,e,n){t.exports={default:n(212),__esModule:!0}}),(function(t,e,n){t.exports={default:n(213),__esModule:!0}}),(function(t,e,n){t.exports={default:n(214),__esModule:!0}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=n(204),a=i(o);e.default=function(t,e,n){return e in t?(0,a.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=n(51),a=i(o);e.default=a.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=n(206),a=i(o),r=n(205),s=i(r),d="function"==typeof s.default&&"symbol"==typeof a.default?function(t){return typeof t}:function(t){return t&&"function"==typeof s.default&&t.constructor===s.default&&t!==s.default.prototype?"symbol":typeof t};e.default="function"==typeof s.default&&"symbol"===d(a.default)?function(t){return"undefined"==typeof t?"undefined":d(t)}:function(t){return t&&"function"==typeof s.default&&t.constructor===s.default&&t!==s.default.prototype?"symbol":"undefined"==typeof t?"undefined":d(t)}}),(function(t,e,n){n(68),n(49),t.exports=n(221)}),(function(t,e,n){n(222),t.exports=9007199254740991}),(function(t,e,n){n(223);var i=n(4).Object;t.exports=function(t,e,n){return i.defineProperty(t,e,n)}}),(function(t,e,n){n(225),n(224),n(226),n(227),t.exports=n(4).Symbol}),(function(t,e,n){n(49),n(68),t.exports=n(63).f("iterator")}),(function(t,e,n){var i=n(18),o=n(45),a=n(40);t.exports=function(t){var e=i(t),n=o.f;if(n)for(var r,s=n(t),d=a.f,l=0;s.length>l;)d.call(t,r=s[l++])&&e.push(r);return e}}),(function(t,e,n){var i=n(24);t.exports=Array.isArray||function(t){return"Array"==i(t)}}),(function(t,e,n){var i=n(18),o=n(7);t.exports=function(t,e){for(var n,a=o(t),r=i(a),s=r.length,d=0;s>d;)if(a[n=r[d++]]===e)return n}}),(function(t,e,n){var i=n(20)("meta"),o=n(6),a=n(8),r=n(9).f,s=0,d=Object.isExtensible||function(){return!0},l=!n(5)((function(){return d(Object.preventExtensions({}))})),c=function(t){r(t,i,{value:{i:"O"+ ++s,w:{}}})},u=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!a(t,i)){if(!d(t))return"F";if(!e)return"E";c(t)}return t[i].i},m=function(t,e){if(!a(t,i)){if(!d(t))return!0;if(!e)return!1;c(t)}return t[i].w},f=function(t){return l&&p.NEED&&d(t)&&!a(t,i)&&c(t),t},p=t.exports={KEY:i,NEED:!1,fastKey:u,getWeak:m,onFreeze:f}}),(function(t,e,n){var i=n(40),o=n(17),a=n(7),r=n(27),s=n(8),d=n(30),l=Object.getOwnPropertyDescriptor;e.f=n(3)?l:function(t,e){if(t=a(t),e=r(e,!0),d)try{return l(t,e)}catch(t){}if(s(t,e))return o(!i.f.call(t,e),t[e])}}),(function(t,e,n){var i=n(7),o=n(77).f,a={}.toString,r="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return o(t)}catch(t){return r.slice()}};t.exports.f=function(t){return r&&"[object Window]"==a.call(t)?s(t):o(i(t))}}),(function(t,e,n){var i=n(13),o=n(57);t.exports=n(4).getIterator=function(t){var e=o(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return i(e.call(t))}}),(function(t,e,n){var i=n(16);i(i.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})}),(function(t,e,n){var i=n(16);i(i.S+i.F*!n(3),"Object",{defineProperty:n(9).f})}),(function(t,e){}),(function(t,e,n){"use strict";var i=n(2),o=n(8),a=n(3),r=n(16),s=n(47),d=n(218).KEY,l=n(5),c=n(22),u=n(37),m=n(20),f=n(12),p=n(63),h=n(62),b=n(217),v=n(215),E=n(216),g=n(13),_=n(7),C=n(27),M=n(17),T=n(44),A=n(220),x=n(219),N=n(9),y=n(18),O=x.f,S=N.f,R=A.f,w=i.Symbol,k=i.JSON,P=k&&k.stringify,H="prototype",L=f("_hidden"),$=f("toPrimitive"),I={}.propertyIsEnumerable,B=c("symbol-registry"),D=c("symbols"),F=c("op-symbols"),j=Object[H],W="function"==typeof w,Y=i.QObject,V=!Y||!Y[H]||!Y[H].findChild,U=a&&l((function(){return 7!=T(S({},"a",{get:function(){return S(this,"a",{value:7}).a}})).a}))?function(t,e,n){var i=O(j,e);i&&delete j[e],S(t,e,n),i&&t!==j&&S(j,e,i)}:S,z=function(t){var e=D[t]=T(w[H]);return e._k=t,e},G=W&&"symbol"==typeof w.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof w},q=function(t,e,n){return t===j&&q(F,e,n),g(t),e=C(e,!0),g(n),o(D,e)?(n.enumerable?(o(t,L)&&t[L][e]&&(t[L][e]=!1),n=T(n,{enumerable:M(0,!1)})):(o(t,L)||S(t,L,M(1,{})),t[L][e]=!0),U(t,e,n)):S(t,e,n)},K=function(t,e){g(t);for(var n,i=v(e=_(e)),o=0,a=i.length;a>o;)q(t,n=i[o++],e[n]);return t},X=function(t,e){return void 0===e?T(t):K(T(t),e)},J=function(t){var e=I.call(this,t=C(t,!0));return!(this===j&&o(D,t)&&!o(F,t))&&(!(e||!o(this,t)||!o(D,t)||o(this,L)&&this[L][t])||e)},Q=function(t,e){if(t=_(t),e=C(e,!0),t!==j||!o(D,e)||o(F,e)){var n=O(t,e);return!n||!o(D,e)||o(t,L)&&t[L][e]||(n.enumerable=!0),n}},Z=function(t){for(var e,n=R(_(t)),i=[],a=0;n.length>a;)o(D,e=n[a++])||e==L||e==d||i.push(e);return i},tt=function(t){for(var e,n=t===j,i=R(n?F:_(t)),a=[],r=0;i.length>r;)!o(D,e=i[r++])||n&&!o(j,e)||a.push(D[e]);return a};W||(w=function(){if(this instanceof w)throw TypeError("Symbol is not a constructor!");var t=m(arguments.length>0?arguments[0]:void 0),e=function(n){this===j&&e.call(F,n),o(this,L)&&o(this[L],t)&&(this[L][t]=!1),U(this,t,M(1,n))};return a&&V&&U(j,t,{configurable:!0,set:e}),z(t)},s(w[H],"toString",(function(){return this._k})),x.f=Q,N.f=q,n(77).f=A.f=Z,n(40).f=J,n(45).f=tt,a&&!n(39)&&s(j,"propertyIsEnumerable",J,!0),p.f=function(t){return z(f(t))}),r(r.G+r.W+r.F*!W,{Symbol:w});for(var et="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;et.length>nt;)f(et[nt++]);for(var et=y(f.store),nt=0;et.length>nt;)h(et[nt++]);r(r.S+r.F*!W,"Symbol",{for:function(t){return o(B,t+="")?B[t]:B[t]=w(t)},keyFor:function(t){if(G(t))return b(B,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){V=!0},useSimple:function(){V=!1}}),r(r.S+r.F*!W,"Object",{create:X,defineProperty:q,defineProperties:K,getOwnPropertyDescriptor:Q,getOwnPropertyNames:Z,getOwnPropertySymbols:tt}),k&&r(r.S+r.F*(!W||l((function(){var t=w();return"[null]"!=P([t])||"{}"!=P({a:t})||"{}"!=P(Object(t))}))),"JSON",{stringify:function(t){if(void 0!==t&&!G(t)){for(var e,n,i=[t],o=1;arguments.length>o;)i.push(arguments[o++]);return e=i[1],"function"==typeof e&&(n=e),!n&&E(e)||(e=function(t,e){if(n&&(e=n.call(this,t,e)),!G(e))return e}),i[1]=e,P.apply(k,i)}}}),w[H][$]||n(11)(w[H],$,w[H].valueOf),u(w,"Symbol"),u(Math,"Math",!0),u(i.JSON,"JSON",!0)}),(function(t,e,n){n(62)("asyncIterator")}),(function(t,e,n){n(62)("observable")}),(function(t,e){Element.prototype.scrollIntoViewIfNeeded||(Element.prototype.scrollIntoViewIfNeeded=function(t){t=0===arguments.length||!!t;var e=this.parentNode,n=window.getComputedStyle(e,null),i=parseInt(n.getPropertyValue("border-top-width")),o=parseInt(n.getPropertyValue("border-left-width")),a=this.offsetTop-e.offsetTop<e.scrollTop,r=this.offsetTop-e.offsetTop+this.clientHeight-i>e.scrollTop+e.clientHeight,s=this.offsetLeft-e.offsetLeft<e.scrollLeft,d=this.offsetLeft-e.offsetLeft+this.clientWidth-o>e.scrollLeft+e.clientWidth,l=a&&!r;(a||r)&&t&&(e.scrollTop=this.offsetTop-e.offsetTop-e.clientHeight/2-i+this.clientHeight/2),(s||d)&&t&&(e.scrollLeft=this.offsetLeft-e.offsetLeft-e.clientWidth/2-o+this.clientWidth/2),(a||r||s||d)&&!t&&this.scrollIntoView(l)})}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){}),(function(t,e){t.exports=".THEME_NAME.md-avatar.md-primary.md-avatar-icon{background-color:PRIMARY-COLOR}.THEME_NAME.md-avatar.md-primary.md-avatar-icon .md-icon{color:PRIMARY-CONTRAST-0.99999}.THEME_NAME.md-avatar.md-accent.md-avatar-icon{background-color:ACCENT-COLOR}.THEME_NAME.md-avatar.md-accent.md-avatar-icon .md-icon{color:ACCENT-CONTRAST-0.99999}.THEME_NAME.md-avatar.md-warn.md-avatar-icon{background-color:WARN-COLOR}.THEME_NAME.md-avatar.md-warn.md-avatar-icon .md-icon{color:WARN-CONTRAST-0.99999}\n"}),(function(t,e){t.exports=".THEME_NAME.md-bottom-bar.md-fixed{background-color:BACKGROUND-COLOR}.THEME_NAME.md-bottom-bar.md-fixed .md-bottom-bar-item{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-fixed .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:BACKGROUND-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-fixed .md-bottom-bar-item.md-active{color:PRIMARY-COLOR}.THEME_NAME.md-bottom-bar.md-fixed.md-accent .md-bottom-bar-item.md-active{color:ACCENT-COLOR}.THEME_NAME.md-bottom-bar.md-fixed.md-warn .md-bottom-bar-item.md-active{color:WARN-COLOR}.THEME_NAME.md-bottom-bar.md-fixed.md-transparent .md-bottom-bar-item.md-active{color:BACKGROUND-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift .md-bottom-bar-item{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:PRIMARY-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift .md-bottom-bar-item.md-active{color:PRIMARY-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift.md-accent{background-color:ACCENT-COLOR}.THEME_NAME.md-bottom-bar.md-shift.md-accent .md-bottom-bar-item{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift.md-accent .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:ACCENT-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift.md-accent .md-bottom-bar-item.md-active{color:ACCENT-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift.md-warn{background-color:WARN-COLOR}.THEME_NAME.md-bottom-bar.md-shift.md-warn .md-bottom-bar-item{color:WARN-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift.md-warn .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:WARN-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift.md-warn .md-bottom-bar-item.md-active{color:WARN-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift.md-transparent{background-color:transparent}.THEME_NAME.md-bottom-bar.md-shift.md-transparent .md-bottom-bar-item{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift.md-transparent .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:BACKGROUND-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift.md-transparent .md-bottom-bar-item.md-active{color:BACKGROUND-CONTRAST}\n"}),(function(t,e){t.exports=".THEME_NAME.md-button:not([disabled]).md-raised:not(.md-icon-button){color:BACKGROUND-CONTRAST;background-color:BACKGROUND-COLOR}.THEME_NAME.md-button:not([disabled]).md-raised:not(.md-icon-button):hover{background-color:BACKGROUND-COLOR-200}.THEME_NAME.md-button:not([disabled]).md-raised.md-icon-button:not(.md-raised){color:BACKGROUND-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-fab{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-button:not([disabled]).md-fab:hover{background-color:ACCENT-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-fab.md-clean{color:BACKGROUND-CONTRAST;background-color:BACKGROUND-COLOR}.THEME_NAME.md-button:not([disabled]).md-fab.md-clean:hover{background-color:BACKGROUND-COLOR-200}.THEME_NAME.md-button:not([disabled]).md-primary:not(.md-icon-button){color:PRIMARY-COLOR}.THEME_NAME.md-button:not([disabled]).md-primary.md-raised,.THEME_NAME.md-button:not([disabled]).md-primary.md-fab{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-primary.md-raised:hover,.THEME_NAME.md-button:not([disabled]).md-primary.md-fab:hover{background-color:PRIMARY-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-primary.md-icon-button:not(.md-raised){color:PRIMARY-COLOR}.THEME_NAME.md-button:not([disabled]).md-accent:not(.md-icon-button){color:ACCENT-COLOR}.THEME_NAME.md-button:not([disabled]).md-accent.md-raised{background-color:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-accent.md-raised:hover{background-color:ACCENT-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-accent.md-icon-button:not(.md-raised){color:ACCENT-COLOR}.THEME_NAME.md-button:not([disabled]).md-warn:not(.md-icon-button){color:WARN-COLOR}.THEME_NAME.md-button:not([disabled]).md-warn.md-raised,.THEME_NAME.md-button:not([disabled]).md-warn.md-fab{background-color:WARN-COLOR;color:WARN-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-warn.md-raised:hover,.THEME_NAME.md-button:not([disabled]).md-warn.md-fab:hover{background-color:WARN-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-warn.md-icon-button:not(.md-raised){color:WARN-COLOR}\n"}),(function(t,e){t.exports='.THEME_NAME.md-button-toggle .md-button:after{width:1px;position:absolute;top:0;bottom:0;left:0;content:" "}.THEME_NAME.md-button-toggle .md-toggle{color:BACKGROUND-CONTRAST-0.54;background-color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-button-toggle .md-toggle:hover:not([disabled]){background-color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-button-toggle .md-toggle+.md-toggle:after{background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-button-toggle.md-primary .md-toggle{color:PRIMARY-CONTRAST;background-color:PRIMARY-COLOR}.THEME_NAME.md-button-toggle.md-primary .md-toggle:hover:not([disabled]){background-color:PRIMARY-COLOR}.THEME_NAME.md-button-toggle.md-primary .md-toggle+.md-toggle:after{background-color:PRIMARY-COLOR-600}.THEME_NAME.md-button-toggle.md-accent .md-toggle{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-button-toggle.md-accent .md-toggle:hover:not([disabled]){background-color:ACCENT-COLOR}.THEME_NAME.md-button-toggle.md-accent .md-toggle+.md-toggle:after{background-color:ACCENT-COLOR-600}.THEME_NAME.md-button-toggle.md-warn .md-toggle{color:WARN-CONTRAST;background-color:WARN-COLOR}.THEME_NAME.md-button-toggle.md-warn .md-toggle:hover:not([disabled]){background-color:WARN-COLOR}.THEME_NAME.md-button-toggle.md-warn .md-toggle+.md-toggle:after{background-color:WARN-COLOR-600}.THEME_NAME.md-button-toggle [disabled]{color:rgba(0,0,0,0.26)}.THEME_NAME.md-button-toggle [disabled].md-toggle{color:BACKGROUND-CONTRAST-0.2;background-color:rgba(0,0,0,0.26)}\n'}),(function(t,e){t.exports=".THEME_NAME.md-card{background-color:BACKGROUND-COLOR}.THEME_NAME.md-card.md-primary{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card.md-primary .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:PRIMARY-CONTRAST-0.87}.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused input,.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused label,.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container:after{background-color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container input,.THEME_NAME.md-card.md-primary .md-input-container textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-card.md-primary .md-input-container textarea::-webkit-input-placeholder{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-card.md-primary .md-input-container label,.THEME_NAME.md-card.md-primary .md-input-container .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-accent{background-color:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card.md-accent .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:ACCENT-CONTRAST-0.87}.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused input,.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused label,.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container:after{background-color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container input,.THEME_NAME.md-card.md-accent .md-input-container textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-card.md-accent .md-input-container textarea::-webkit-input-placeholder{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-card.md-accent .md-input-container label,.THEME_NAME.md-card.md-accent .md-input-container .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-warn{background-color:WARN-COLOR;color:WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card.md-warn .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:WARN-CONTRAST-0.87}.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused input,.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused label,.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container:after{background-color:WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container input,.THEME_NAME.md-card.md-warn .md-input-container textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-card.md-warn .md-input-container textarea::-webkit-input-placeholder{color:WARN-CONTRAST-0.54}.THEME_NAME.md-card.md-warn .md-input-container label,.THEME_NAME.md-card.md-warn .md-input-container .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-card .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-card>.md-card-area:after{background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-card .md-card-media-cover.md-text-scrim .md-backdrop{background:linear-gradient(to bottom, BACKGROUND-CONTRAST-0.0 20%, BACKGROUND-CONTRAST-0.275 66%, BACKGROUND-CONTRAST-0.55 100%)}.THEME_NAME.md-card .md-card-media-cover.md-solid .md-card-area{background-color:BACKGROUND-CONTRAST-0.4}.THEME_NAME.md-card .md-card-media-cover .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card .md-card-media-cover .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:#fff}.THEME_NAME.md-card .md-card-expand .md-card-actions{background-color:BACKGROUND-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-checkbox.md-checked .md-checkbox-container{background-color:ACCENT-COLOR;border-color:ACCENT-COLOR}.THEME_NAME.md-checkbox.md-checked .md-checkbox-container:after{border-color:ACCENT-CONTRAST}.THEME_NAME.md-checkbox .md-ink-ripple{color:ACCENT-COLOR}.THEME_NAME.md-checkbox .md-ripple{opacity:.26}.THEME_NAME.md-checkbox.md-primary.md-checked .md-checkbox-container{background-color:PRIMARY-COLOR;border-color:PRIMARY-COLOR}.THEME_NAME.md-checkbox.md-primary.md-checked .md-checkbox-container:after{border-color:PRIMARY-CONTRAST}.THEME_NAME.md-checkbox.md-primary .md-ink-ripple{color:PRIMARY-COLOR}.THEME_NAME.md-checkbox.md-warn.md-checked .md-checkbox-container{background-color:WARN-COLOR;border-color:WARN-COLOR}.THEME_NAME.md-checkbox.md-warn.md-checked .md-checkbox-container:after{border-color:WARN-CONTRAST}.THEME_NAME.md-checkbox.md-warn .md-ink-ripple{color:WARN-COLOR}.THEME_NAME.md-checkbox.md-disabled.md-checked .md-checkbox-container{background-color:rgba(0,0,0,0.26);border-color:transparent}.THEME_NAME.md-checkbox.md-disabled:not(.md-checked) .md-checkbox-container{border-color:rgba(0,0,0,0.26)}\n"}),(function(t,e){t.exports=".THEME_NAME.md-chip{background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-chip.md-deletable:hover,.THEME_NAME.md-chip.md-deletable:focus,.THEME_NAME.md-chip.md-editable:hover,.THEME_NAME.md-chip.md-editable:focus{background-color:BACKGROUND-CONTRAST-0.54;color:BACKGROUND-COLOR}.THEME_NAME.md-chip.md-deletable:hover .md-delete,.THEME_NAME.md-chip.md-deletable:focus .md-delete,.THEME_NAME.md-chip.md-editable:hover .md-delete,.THEME_NAME.md-chip.md-editable:focus .md-delete{color:BACKGROUND-COLOR}.THEME_NAME.md-chip .md-delete{color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-chip .md-delete .md-ripple{color:BACKGROUND-COLOR}.THEME_NAME.md-chip.md-primary{color:PRIMARY-CONTRAST;background-color:PRIMARY-COLOR}.THEME_NAME.md-chip.md-accent{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-chip.md-warn{color:WARN-CONTRAST;background-color:WARN-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-dialog-container .md-dialog{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}\n"}),(function(t,e){t.exports=""}),(function(t,e){t.exports=".THEME_NAME.md-icon.md-primary{color:PRIMARY-COLOR}.THEME_NAME.md-icon.md-accent{color:ACCENT-COLOR}.THEME_NAME.md-icon.md-warn{color:WARN-COLOR}\n"}),(function(t,e){t.exports=""}),(function(t,e){t.exports=".THEME_NAME.md-input-container.md-input-invalid:after{background-color:WARN-COLOR}.THEME_NAME.md-input-container.md-input-invalid label,.THEME_NAME.md-input-container.md-input-invalid input,.THEME_NAME.md-input-container.md-input-invalid textarea,.THEME_NAME.md-input-container.md-input-invalid .md-error,.THEME_NAME.md-input-container.md-input-invalid .md-count,.THEME_NAME.md-input-container.md-input-invalid .md-icon:not(.md-icon-delete){color:WARN-COLOR}.THEME_NAME.md-input-container.md-input-focused.md-input-inline label{color:rgba(0,0,0,0.54)}.THEME_NAME.md-input-container.md-input-focused.md-input-required label:after{color:WARN-COLOR}.THEME_NAME.md-input-container.md-input-focused:after{height:2px;background-color:PRIMARY-COLOR}.THEME_NAME.md-input-container.md-input-focused input,.THEME_NAME.md-input-container.md-input-focused textarea{color:PRIMARY-COLOR;text-shadow:0 0 0 BACKGROUND-CONTRAST;-webkit-text-fill-color:transparent}.THEME_NAME.md-input-container.md-input-focused label,.THEME_NAME.md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:PRIMARY-COLOR}.THEME_NAME.md-input-container.md-input-disabled label,.THEME_NAME.md-input-container.md-input-disabled input,.THEME_NAME.md-input-container.md-input-disabled textarea,.THEME_NAME.md-input-container.md-input-disabled .md-error,.THEME_NAME.md-input-container.md-input-disabled .md-count,.THEME_NAME.md-input-container.md-input-disabled .md-icon:not(.md-icon-delete),.THEME_NAME.md-input-container.md-input-disabled ::-webkit-input-placeholder{color:BACKGROUND-CONTRAST-0.38}\n";
}),(function(t,e){t.exports=".THEME_NAME.md-list{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}.THEME_NAME.md-list.md-transparent{background-color:transparent;color:inherit}.THEME_NAME.md-list .md-list-item .router-link-active.md-list-item-container{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item .router-link-active.md-list-item-container>.md-icon{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item.md-primary .md-list-item-container{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item.md-primary .md-list-item-container>.md-icon{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item.md-accent .md-list-item-container{color:ACCENT-COLOR}.THEME_NAME.md-list .md-list-item.md-accent .md-list-item-container>.md-icon{color:ACCENT-COLOR}.THEME_NAME.md-list .md-list-item.md-warn .md-list-item-container{color:WARN-COLOR}.THEME_NAME.md-list .md-list-item.md-warn .md-list-item-container>.md-icon{color:WARN-COLOR}.THEME_NAME.md-list .md-list-item-expand .md-list-item-container{background-color:BACKGROUND-COLOR}.THEME_NAME.md-list .md-list-item-expand .md-list-item-container:hover,.THEME_NAME.md-list .md-list-item-expand .md-list-item-container:focus{background-color:rgba(153,153,153,0.2)}\n"}),(function(t,e){t.exports=".THEME_NAME.md-menu-content .md-list{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}.THEME_NAME.md-menu-content .md-list .md-menu-item:hover .md-button:not([disabled]),.THEME_NAME.md-menu-content .md-list .md-menu-item:focus .md-button:not([disabled]),.THEME_NAME.md-menu-content .md-list .md-menu-item.md-highlighted .md-button:not([disabled]){background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-menu-content .md-list .md-menu-item[disabled]{color:BACKGROUND-CONTRAST-0.38}\n"}),(function(t,e){t.exports=".THEME_NAME.md-boards>.md-boards-navigation{background-color:transparent}.THEME_NAME.md-boards>.md-boards-navigation .md-board-header{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-boards>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards>.md-boards-navigation .md-board-header:focus{color:PRIMARY-COLOR}.THEME_NAME.md-boards>.md-boards-navigation .md-board-header.md-disabled{color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-boards>.md-boards-navigation .md-button{color:PRIMARY-COLOR}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation{background-color:transparent}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header:focus{color:PRIMARY-CONTRAST}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header.md-disabled{color:PRIMARY-CONTRAST-0.26}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-button{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-primary>.md-boards-navigation{background-color:PRIMARY-COLOR}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header:focus{color:PRIMARY-CONTRAST}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header.md-disabled{color:PRIMARY-CONTRAST-0.26}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-button{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-accent>.md-boards-navigation{background-color:ACCENT-COLOR}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header:focus{color:ACCENT-CONTRAST}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header.md-disabled{color:ACCENT-CONTRAST-0.26}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-button{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-boards.md-warn>.md-boards-navigation{background-color:WARN-COLOR}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header{color:WARN-CONTRAST-0.54}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header:focus{color:WARN-CONTRAST}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header.md-disabled{color:WARN-CONTRAST-0.26}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-button{color:WARN-CONTRAST-0.54}\n"}),(function(t,e){t.exports=".THEME_NAME.md-progress{background-color:PRIMARY-COLOR-0.38}.THEME_NAME.md-progress:not(.md-indeterminate) .md-progress-track{background-color:PRIMARY-COLOR}.THEME_NAME.md-progress .md-progress-track:after,.THEME_NAME.md-progress .md-progress-track:before{background-color:PRIMARY-COLOR}.THEME_NAME.md-progress.md-accent{background-color:ACCENT-COLOR-0.38}.THEME_NAME.md-progress.md-accent:not(.md-indeterminate) .md-progress-track{background-color:ACCENT-COLOR}.THEME_NAME.md-progress.md-accent .md-progress-track:after,.THEME_NAME.md-progress.md-accent .md-progress-track:before{background-color:ACCENT-COLOR}.THEME_NAME.md-progress.md-warn{background-color:WARN-COLOR-0.38}.THEME_NAME.md-progress.md-warn:not(.md-indeterminate) .md-progress-track{background-color:WARN-COLOR}.THEME_NAME.md-progress.md-warn .md-progress-track:after,.THEME_NAME.md-progress.md-warn .md-progress-track:before{background-color:WARN-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-radio .md-radio-container:after{background-color:ACCENT-COLOR}.THEME_NAME.md-radio.md-checked .md-radio-container{border-color:ACCENT-COLOR}.THEME_NAME.md-radio.md-checked .md-ink-ripple{color:ACCENT-COLOR}.THEME_NAME.md-radio.md-checked .md-ripple{opacity:.38}.THEME_NAME.md-radio.md-primary .md-radio-container:after{background-color:PRIMARY-COLOR}.THEME_NAME.md-radio.md-primary.md-checked .md-radio-container{border-color:PRIMARY-COLOR}.THEME_NAME.md-radio.md-primary.md-checked .md-ink-ripple{color:PRIMARY-COLOR}.THEME_NAME.md-radio.md-warn .md-radio-container:after{background-color:WARN-COLOR}.THEME_NAME.md-radio.md-warn.md-checked .md-radio-container{border-color:WARN-COLOR}.THEME_NAME.md-radio.md-warn.md-checked .md-ink-ripple{color:WARN-COLOR}.THEME_NAME.md-radio.md-disabled .md-radio-container{border-color:rgba(0,0,0,0.26)}.THEME_NAME.md-radio.md-disabled .md-radio-container:after{background-color:rgba(0,0,0,0.26)}.THEME_NAME.md-radio.md-disabled.md-checked .md-radio-container{border-color:rgba(0,0,0,0.26)}\n"}),(function(t,e){t.exports=".THEME_NAME.md-rating-bar>.md-empty-icon .md-icon{color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-rating-bar>.md-full-icon .md-icon{color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-rating-bar.md-primary>.md-full-icon .md-icon{color:PRIMARY-COLOR}.THEME_NAME.md-rating-bar.md-accent>.md-full-icon .md-icon{color:ACCENT-COLOR}.THEME_NAME.md-rating-bar.md-warn>.md-full-icon .md-icon{color:WARN-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-select:after{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-select:after{color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-select-content .md-menu-item.md-selected,.THEME_NAME.md-select-content .md-menu-item.md-checked{color:PRIMARY-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-sidenav .md-sidenav-content{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}\n"}),(function(t,e){t.exports=".THEME_NAME .md-snackbar .md-ink-ripple,.THEME_NAME.md-snackbar .md-ink-ripple{color:#fff}\n"}),(function(t,e){t.exports=""}),(function(t,e){t.exports=".THEME_NAME.md-spinner .md-spinner-path{stroke:PRIMARY-COLOR}.THEME_NAME.md-spinner.md-accent .md-spinner-path{stroke:ACCENT-COLOR}.THEME_NAME.md-spinner.md-warn .md-spinner-path{stroke:WARN-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-stepper .md-step-header .md-step-icon,.THEME_NAME.md-stepper .md-step-header .md-step-number{color:BACKGROUND-CONTRAST;background-color:#bdbdbd}.THEME_NAME.md-stepper .md-step-header.md-primary .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-primary .md-step-number,.THEME_NAME.md-stepper .md-step-header.md-active .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-active .md-step-number{color:PRIMARY-CONTRAST;background-color:PRIMARY-COLOR}.THEME_NAME.md-stepper .md-step-header.md-accent .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-accent .md-step-number{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-stepper .md-step-header.md-warn .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-warn .md-step-number{color:WARN-CONTRAST;background-color:WARN-COLOR}.THEME_NAME.md-stepper .md-step-header.md-disabled{color:#bdbdbd}.THEME_NAME.md-stepper .md-step-header.md-disabled .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-disabled .md-step-number{color:white;background-color:#bdbdbd}\n"}),(function(t,e){t.exports=".THEME_NAME.md-subheader.md-primary{color:PRIMARY-COLOR}.THEME_NAME.md-subheader.md-accent{color:ACCENT-COLOR}.THEME_NAME.md-subheader.md-warn{color:WARN-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-switch.md-checked .md-switch-container{background-color:ACCENT-COLOR-500-0.5}.THEME_NAME.md-switch.md-checked .md-switch-thumb{background-color:ACCENT-COLOR}.THEME_NAME.md-switch.md-checked .md-ink-ripple{color:ACCENT-COLOR}.THEME_NAME.md-switch.md-checked .md-ripple{opacity:.38}.THEME_NAME.md-switch.md-checked.md-primary .md-switch-container{background-color:PRIMARY-COLOR-500-0.5}.THEME_NAME.md-switch.md-checked.md-primary .md-switch-thumb{background-color:PRIMARY-COLOR}.THEME_NAME.md-switch.md-checked.md-primary .md-ink-ripple{color:PRIMARY-COLOR}.THEME_NAME.md-switch.md-checked.md-warn .md-switch-container{background-color:WARN-COLOR-500-0.5}.THEME_NAME.md-switch.md-checked.md-warn .md-switch-thumb{background-color:WARN-COLOR}.THEME_NAME.md-switch.md-checked.md-warn .md-ink-ripple{color:WARN-COLOR}.THEME_NAME.md-switch.md-disabled .md-switch-container,.THEME_NAME.md-switch.md-disabled.md-checked .md-switch-container{background-color:rgba(0,0,0,0.12)}.THEME_NAME.md-switch.md-disabled .md-switch-thumb,.THEME_NAME.md-switch.md-disabled.md-checked .md-switch-thumb{background-color:#bdbdbd}\n"}),(function(t,e){t.exports=".THEME_NAME.md-table-card .md-toolbar{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}.THEME_NAME.md-table-alternate-header{background-color:BACKGROUND-COLOR}.THEME_NAME.md-table-alternate-header .md-toolbar{background-color:ACCENT-COLOR-A100-0.2;color:ACCENT-CONTRAST-A100}.THEME_NAME.md-table-alternate-header .md-counter{color:ACCENT-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-tabs>.md-tabs-navigation{background-color:PRIMARY-COLOR}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header:focus{color:PRIMARY-CONTRAST}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header.md-disabled{color:PRIMARY-CONTRAST-0.26}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-indicator{background-color:ACCENT-COLOR}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header-navigation-button{color:PRIMARY-CONTRAST-0.54;background-color:PRIMARY-COLOR}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation{background-color:transparent;border-bottom:1px solid BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header:focus{color:PRIMARY-COLOR}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header.md-disabled{color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-indicator{background-color:PRIMARY-COLOR}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation{background-color:ACCENT-COLOR}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header:focus{color:ACCENT-CONTRAST}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header.md-disabled{color:ACCENT-CONTRAST-0.26}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-indicator{background-color:BACKGROUND-COLOR}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation{background-color:WARN-COLOR}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header{color:WARN-CONTRAST-0.54}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header:focus{color:WARN-CONTRAST}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header.md-disabled{color:WARN-CONTRAST-0.26}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-indicator{background-color:BACKGROUND-COLOR}\n"}),(function(t,e){t.exports=".THEME_NAME.md-toolbar{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar .md-input-container.md-input-focused textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container:after{background-color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container input,.THEME_NAME.md-toolbar .md-input-container textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar .md-input-container textarea::-webkit-input-placeholder{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-toolbar .md-input-container label,.THEME_NAME.md-toolbar .md-input-container .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar.md-accent{background-color:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container:after{background-color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container input,.THEME_NAME.md-toolbar.md-accent .md-input-container textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar.md-accent .md-input-container textarea::-webkit-input-placeholder{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-toolbar.md-accent .md-input-container label,.THEME_NAME.md-toolbar.md-accent .md-input-container .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-warn{background-color:WARN-COLOR;color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container:after{background-color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container input,.THEME_NAME.md-toolbar.md-warn .md-input-container textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar.md-warn .md-input-container textarea::-webkit-input-placeholder{color:WARN-CONTRAST-0.54}.THEME_NAME.md-toolbar.md-warn .md-input-container label,.THEME_NAME.md-toolbar.md-warn .md-input-container .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-transparent{background-color:transparent;color:BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused textarea{color:BACKGROUND-CONTRAST;text-shadow:0 0 0 BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container:after{background-color:BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container input,.THEME_NAME.md-toolbar.md-transparent .md-input-container textarea{color:BACKGROUND-CONTRAST;text-shadow:0 0 0 BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar.md-transparent .md-input-container textarea::-webkit-input-placeholder{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-toolbar.md-transparent .md-input-container label,.THEME_NAME.md-toolbar.md-transparent .md-input-container .md-icon:not(.md-icon-delete){color:BACKGROUND-CONTRAST}\n"}),(function(t,e){t.exports=".THEME_NAME :not(input):not(textarea)::selection{background:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME a:not(.md-button){color:ACCENT-COLOR}.THEME_NAME a:not(.md-button):hover{color:ACCENT-COLOR-800}body.THEME_NAME{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST-0.87}.THEME_NAME .md-caption,.THEME_NAME .md-display-1,.THEME_NAME .md-display-2,.THEME_NAME .md-display-3,.THEME_NAME .md-display-4{color:BACKGROUND-CONTRAST-0.57}.THEME_NAME code:not(.hljs){background-color:ACCENT-COLOR-A100-0.2;color:ACCENT-COLOR-800}\n"}),(function(t,e,n){function i(t){n(246)}var o=n(0)(n(126),n(411),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(264)}var o=n(0)(n(127),n(442),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(234)}var o=n(0)(n(128),n(385),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(129),n(387),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(254)}var o=n(0)(n(130),n(429),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(231)}var o=n(0)(n(131),n(377),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(235)}var o=n(0)(n(132),n(388),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(133),n(399),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(134),n(383),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(135),n(428),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(136),n(376),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(137),n(421),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(138),n(415),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(139),n(381),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(140),n(372),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(141),n(379),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(257)}var o=n(0)(n(142),n(435),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(143),n(395),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(250)}var o=n(0)(n(144),n(417),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(239)}var o=n(0)(n(145),n(398),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(146),n(433),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(147),n(403),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(148),n(396),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(149),n(418),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(150),n(441),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(151),n(394),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(251)}var o=n(0)(n(152),n(419),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(248)}var o=n(0)(n(153),n(413),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(236)}var o=n(0)(n(154),n(390),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(261)}var o=n(0)(n(155),n(438),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(156),n(391),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(157),n(389),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(237)}var o=n(0)(n(158),n(392),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(159),n(424),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(259)}var o=n(0)(n(160),null,i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(240)}var o=n(0)(n(161),n(400),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(162),n(443),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(163),n(380),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(164),n(410),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(165),n(386),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(166),n(405),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(167),n(397),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(263)}var o=n(0)(n(168),n(440),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(169),n(432),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(170),n(384),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(171),n(407),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(256)}var o=n(0)(n(172),n(434),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(238)}var o=n(0)(n(173),n(393),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(230)}var o=n(0)(n(174),n(374),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(245)}var o=n(0)(n(175),n(409),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(176),n(422),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(258)}var o=n(0)(n(177),n(436),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(249)}var o=n(0)(n(178),n(414),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(262)}var o=n(0)(n(179),n(439),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(247)}var o=n(0)(n(180),n(412),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(233)}var o=n(0)(n(181),n(382),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(182),n(416),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(183),n(406),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(242)}var o=n(0)(n(184),n(402),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(253)}var o=n(0)(n(185),n(427),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(255)}var o=n(0)(n(186),n(431),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(232)}var o=n(0)(n(187),n(378),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(188),n(423),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(189),n(373),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(190),n(420),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(191),n(426),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(192),n(430),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(193),n(375),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(194),n(408),null,null,null);t.exports=i.exports}),(function(t,e,n){var i=n(0)(n(195),n(371),null,null,null);t.exports=i.exports}),(function(t,e,n){function i(t){n(241)}var o=n(0)(n(196),n(401),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(243)}var o=n(0)(n(197),n(404),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(260)}var o=n(0)(n(198),n(437),i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(244)}var o=n(0)(n(199),null,i,null,null);t.exports=o.exports}),(function(t,e,n){function i(t){n(252)}var o=n(0)(n(200),n(425),i,null,null);t.exports=o.exports}),(function(t,e,n){var i=n(0)(n(201),null,null,null,null);t.exports=i.exports}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-tab",style:t.styles,attrs:{id:t.tabId}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-media-actions"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-card",{staticClass:"md-table-card",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-radio",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-radio-container",on:{click:function(e){e.stopPropagation(),t.toggleCheck(e)}}},[n("input",{attrs:{type:"radio",name:t.name,id:t.id,disabled:t.disabled},domProps:{value:t.value}}),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}})],1),t._v(" "),t.$slots.default?n("label",{staticClass:"md-radio-label",attrs:{for:t.id||t.name},on:{click:t.toggleCheck}},[t._t("default")],2):t._e()])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table-pagination"},[n("span",{staticClass:"md-table-pagination-label"},[t._v(t._s(t.mdLabel)+":")]),t._v(" "),t.mdPageOptions!==!1?n("md-select",{attrs:{"md-menu-class":"md-pagination-select"},on:{change:t.changeSize},model:{value:t.currentSize,callback:function(e){t.currentSize=e},expression:"currentSize"}},t._l(t.mdPageOptions,(function(e){return n("md-option",{key:e,attrs:{value:e}},[t._v(t._s(e))])}))):t._e(),t._v(" "),n("span",[t._v(t._s((t.currentPage-1)*t.currentSize+1)+"-"+t._s(t.subTotal)+" "+t._s(t.mdSeparator)+" "+t._s(t.mdTotal))]),t._v(" "),n("md-button",{staticClass:"md-icon-button md-table-pagination-previous",attrs:{disabled:1===t.currentPage},on:{click:t.previousPage}},[n("md-icon",[t._v("keyboard_arrow_left")])],1),t._v(" "),n("md-button",{staticClass:"md-icon-button md-table-pagination-next",attrs:{disabled:t.shouldDisable},on:{click:t.nextPage}},[n("md-icon",[t._v("keyboard_arrow_right")])],1)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"expand",staticClass:"md-card-expand"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-button-toggle",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table",class:[t.themeClass]},[n("table",[t._t("default")],2)])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-media-cover",class:t.classes},[t._t("default"),t._v(" "),t.mdTextScrim?n("div",{ref:"backdrop",staticClass:"md-card-backdrop",style:t.styles}):t._e()],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item",class:t.classes},[n("div",{staticClass:"md-list-item-container md-button"},[t._t("default")],2),t._v(" "),n("md-button",{staticClass:"md-button-ghost",attrs:{type:"button",disabled:t.disabled},on:{click:function(e){t.$emit("click",e)}}})],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-media",class:t.classes},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"md-spinner",appear:""}},[n("div",{staticClass:"md-spinner",class:[t.themeClass,t.classes],style:t.styles},[n("svg",{staticClass:"md-spinner-draw",attrs:{viewBox:"25 25 50 50"}},[n("circle",{staticClass:"md-spinner-path",attrs:{cx:"50",cy:"50",r:"20","stroke-width":t.mdStroke,"stroke-dasharray":t.dashProgress}})])])])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-area",class:t.classes},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-list-item",{staticClass:"md-menu-item",class:t.classes,attrs:{href:t.href,target:t.target,disabled:t.disabled},on:{click:t.close}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-bottom-bar",class:[t.themeClass,t.classes]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item md-list-item-expand",class:t.classes},[n("div",{staticClass:"md-list-item-container md-button"},[t._t("default"),t._v(" "),n("md-icon",{staticClass:"md-list-expand-indicator"},[t._v("keyboard_arrow_down")])],2),t._v(" "),n("md-button",{staticClass:"md-button-ghost",attrs:{type:"button",disabled:t.disabled},on:{click:t.toggleExpandList}}),t._v(" "),n("div",{ref:"expand",staticClass:"md-list-expand",class:t.expandClasses,style:t.expandStyles},[t._t("expand")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.href?n("a",{staticClass:"md-bottom-bar-item",class:t.classes,attrs:{href:t.href,disabled:t.disabled},on:{click:function(e){t.setActive(!0,e)}}},[t.mdIcon||t.mdIconSrc||t.mdIconset?n("md-icon",{attrs:{"md-src":t.mdIconSrc,"md-iconset":t.mdIconset}},[t._v(t._s(t.mdIcon))]):t._e(),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),n("span",{staticClass:"md-text"},[t._t("default")],2)],1):n("button",{staticClass:"md-bottom-bar-item",class:t.classes,attrs:{type:"button",disabled:t.disabled},on:{click:function(e){t.setActive(!0,e)}}},[t.mdIcon||t.mdIconSrc||t.mdIconset?n("md-icon",{attrs:{"md-src":t.mdIconSrc,"md-iconset":t.mdIconset}},[t._v(t._s(t.mdIcon))]):t._e(),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),n("span",{staticClass:"md-text"},[t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card",class:[t.themeClass,t.classes]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("input",{staticClass:"md-input",attrs:{type:t.type,name:t.name,disabled:t.disabled,required:t.required,placeholder:t.placeholder,maxlength:t.maxlength,readonly:t.readonly},domProps:{value:t.value},on:{focus:t.onFocus,blur:t.onBlur,input:t.onInput,keydown:[function(e){return"button"in e||!t._k(e.keyCode,"up",38)?void t.onInput(e):null},function(e){return"button"in e||!t._k(e.keyCode,"down",40)?void t.onInput(e):null}]}})},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.svgContent?n("i",{staticClass:"md-icon",class:[t.themeClass],domProps:{innerHTML:t._s(t.svgContent)}}):t.imageSrc?n("md-image",{staticClass:"md-icon",class:[t.themeClass],
attrs:{"md-src":t.imageSrc}}):n("i",{staticClass:"md-icon",class:[t.themeClass,t.mdIconset],attrs:{"aria-hidden":!!t.mdIconset}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-autocomplete",on:{focus:t.onFocus,blur:t.onBlur}},[n("md-menu",{ref:"menu",staticClass:"md-autocomplete-menu",attrs:{"md-offset-x":8,"md-offset-y":"45"}},[n("span",{attrs:{"md-menu-trigger":""}}),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.query,expression:"query"}],ref:"input",staticClass:"md-input",attrs:{type:"text",disabled:t.disabled,required:t.required,placeholder:t.placeholder,maxlength:t.maxlength,name:t.name},domProps:{value:t.query},on:{focus:t.onFocus,blur:t.onBlur,input:[function(e){e.target.composing||(t.query=e.target.value)},t.debounceUpdate]}}),t._v(" "),n("md-menu-content",t._l(t.items,(function(e){return t.items.length?n("md-menu-item",{key:e,on:{keyup:function(n){return"button"in n||!t._k(n.keyCode,"enter",13)?void t.hit(e):null},click:function(n){t.hit(e)}}},[t._v("\n        "+t._s(e[t.printAttribute])+"\n      ")]):t._e()})))],1)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-input-container",class:[t.themeClass,t.classes]},[t._t("default"),t._v(" "),t.enableCounter?n("span",{staticClass:"md-count"},[t._v(t._s(t.inputLength)+" / "+t._s(t.counterLength))]):t._e(),t._v(" "),t.mdHasPassword?n("md-button",{staticClass:"md-icon-button md-toggle-password",attrs:{tabindex:"-1"},on:{click:function(e){e.preventDefault(),t.togglePasswordType(e)}}},[n("md-icon",[t._v(t._s(t.showPassword?"visibility_off":"visibility"))])],1):t._e(),t._v(" "),t.mdClearable&&t.hasValue?n("md-button",{staticClass:"md-icon-button md-clear-input",attrs:{tabindex:"-1"},on:{click:t.clearInput}},[n("md-icon",[t._v("clear")])],1):t._e()],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"md-progress",appear:""}},[n("div",{staticClass:"md-progress",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-progress-track",style:t.styles})])])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-dialog",{ref:"dialog",staticClass:"md-dialog-prompt",on:{close:function(e){t.fireCloseEvent("cancel")}}},[t.mdTitle?n("md-dialog-title",[t._v(t._s(t.mdTitle))]):t._e(),t._v(" "),t.mdContentHtml?n("md-dialog-content",{domProps:{innerHTML:t._s(t.mdContentHtml)}}):t._e(),t._v(" "),t.mdContent?n("md-dialog-content",[t._v(t._s(t.mdContent))]):t._e(),t._v(" "),n("md-dialog-content",[n("md-input-container",[n("md-input",{ref:"input",attrs:{id:t.mdInputId,name:t.mdInputName,maxlength:t.mdInputMaxlength,placeholder:t.mdInputPlaceholder,value:t.value},nativeOn:{keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13)?void t.confirmValue(e):null}}})],1)],1),t._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close("cancel")}}},[t._v(t._s(t.mdCancelText))]),t._v(" "),n("md-button",{staticClass:"md-primary",on:{click:t.confirmValue}},[t._v(t._s(t.mdOkText))])],1)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-chip",class:[t.themeClass,t.classes],attrs:{tabindex:"0"}},[n("div",{staticClass:"md-chip-container",on:{click:function(e){!t.disabled&&t.mdEditable&&t.$emit("edit")}}},[t._t("default")],2),t._v(" "),t.mdDeletable?n("md-button",{staticClass:"md-icon-button md-dense md-delete",attrs:{tabindex:"-1"},on:{click:function(e){!t.disabled&&t.$emit("delete")}},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"delete",[8,46])?void(!t.disabled&&t.$emit("delete")):null}}},[n("md-icon",{staticClass:"md-icon-delete"},[t._v("cancel")])],1):t._e()],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-dialog-title md-title"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item",class:t.classes,attrs:{disabled:t.disabled}},[t._t("default"),t._v(" "),n("md-ink-ripple",{attrs:{disabled:t.disabled}})],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-dialog-container",class:[t.themeClass,t.classes],attrs:{tabindex:"0"},on:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"esc",27)?(e.stopPropagation(),void t.closeOnEsc(e)):null}}},[n("div",{ref:"dialog",staticClass:"md-dialog",class:t.dialogClasses,style:t.styles},[t._t("default")],2),t._v(" "),t.mdBackdrop?n("md-backdrop",{ref:"backdrop",staticClass:"md-dialog-backdrop",class:t.classes,on:{close:function(e){t.mdClickOutsideToClose&&t.close()}}}):t._e()],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-actions"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",{staticClass:"md-list",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-tabs",class:[t.themeClass,t.tabClasses]},[n("md-whiteframe",{ref:"tabNavigation",staticClass:"md-tabs-navigation",class:t.navigationClasses,attrs:{"md-tag":"nav","md-elevation":t.mdElevation}},[n("div",{ref:"tabsContainer",staticClass:"md-tabs-navigation-container",on:{scroll:t.handleNavigationScroll}},[n("div",{staticClass:"md-tabs-navigation-scroll-container"},[t._l(t.tabList,(function(e){return n("button",{key:e.id,ref:"tabHeader",refInFor:!0,staticClass:"md-tab-header",class:t.getHeaderClass(e),attrs:{type:"button",disabled:e.disabled},on:{click:function(n){t.setActiveTab(e)}}},[n("md-ink-ripple",{attrs:{"md-disabled":e.disabled}}),t._v(" "),n("div",{staticClass:"md-tab-header-container"},[e.icon?n("md-icon",[t._v(t._s(e.icon))]):e.iconset?n("md-icon",{attrs:{"md-iconset":e.iconset}},[t._v(t._s(e.icon))]):t._e(),t._v(" "),e.label?n("span",[t._v(t._s(e.label))]):t._e(),t._v(" "),e.tooltip?n("md-tooltip",{attrs:{"md-direction":e.tooltipDirection,"md-delay":e.tooltipDelay}},[t._v(t._s(e.tooltip))]):t._e()],1)],1)})),t._v(" "),n("span",{ref:"indicator",staticClass:"md-tab-indicator",class:t.indicatorClasses})],2)]),t._v(" "),t.mdNavigation&&t.hasNavigationScroll?n("button",{staticClass:"md-tab-header-navigation-button md-left",class:t.navigationLeftButtonClasses,on:{click:t.navigationScrollLeft}},[n("md-icon",[t._v("keyboard_arrow_left")])],1):t._e(),t._v(" "),t.mdNavigation&&t.hasNavigationScroll?n("button",{staticClass:"md-tab-header-navigation-button md-right",class:t.navigationRightButtonClasses,on:{click:t.navigationScrollRight}},[n("md-icon",[t._v("keyboard_arrow_right")])],1):t._e()]),t._v(" "),n("div",{ref:"tabContent",staticClass:"md-tabs-content",style:{height:t.contentHeight}},[n("div",{staticClass:"md-tabs-wrapper",style:{transform:"translate3D(-"+t.contentWidth+", 0, 0)"}},[t._t("default")],2)])],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-stepper",class:[t.themeClass,t.stepsClasses]},[t.mdVertical?t._e():n("md-whiteframe",{ref:"stepNavigation",staticClass:"md-steps-navigation",class:t.navigationClasses,attrs:{"md-tag":"nav","md-elevation":t.mdElevation}},[n("md-step-header-container",{ref:"stepHeader",attrs:{"md-vertical":t.mdVertical}},t._l(t.stepList,(function(e,i){return n("md-step-header",{key:e.id,attrs:{step:e,"md-alternate-labels":t.mdAlternateLabels},on:{click:function(n){t.setActiveStep(e)}}})})))],1),t._v(" "),n("md-whiteframe",{attrs:{"md-elevation":t.mdElevation}},[t.mdVertical?t._e():n("div",{ref:"stepContent",staticClass:"md-steps-container",style:{height:t.contentHeight}},[n("div",{staticClass:"md-steps-wrapper",style:{transform:"translate3D(-"+t.contentWidth+", 0, 0)"}},[t._t("default")],2)]),t._v(" "),t.mdVertical?n("div",{ref:"stepContent",staticClass:"md-steps-vertical-container"},[t._t("default")],2):t._e()])],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-dialog-content"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-toolbar",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item",class:t.classes},[n("a",{staticClass:"md-list-item-container md-button",attrs:{href:t.href,target:t.target,disabled:t.disabled},on:{click:function(e){t.$emit("click",e)}}},[t._t("default")],2),t._v(" "),n("md-ink-ripple",{attrs:{disabled:t.disabled}})],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-step-header",class:t.getHeaderClasses},[n("div",{staticClass:"md-step-icons"},[t.icon?n("md-icon",{staticClass:"md-step-icon"},[t._v(t._s(t.icon))]):t._e(),t._v(" "),t.icon?t._e():n("div",{staticClass:"md-step-number"},[n("span",[t._v(t._s(t.stepNumber))])])],1),t._v(" "),n("div",{staticClass:"md-step-titles"},[n("div",{staticClass:"md-step-title"},[t._v(t._s(t.step.label))]),t._v(" "),t.step.message?n("small",[t._v(t._s(t.step.message))]):t._e()]),t._v(" "),t.step.toolTip?n("md-tooltip",{attrs:{"md-direction":t.step.tooltipDirection,"md-delay":t.step.tooltipDelay}},[t._v(t._s(t.step.toolTip))]):t._e()],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-board",style:t.styles,attrs:{id:t.boardId}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",{staticClass:"md-table-row",class:t.classes,on:{click:t.autoSelect},nativeOn:{click:function(e){t.autoSelect(e)}}},[t.hasSelection?n("md-table-cell",{staticClass:"md-table-selection"},[n("md-checkbox",{attrs:{disabled:t.isDisabled},on:{change:t.select},nativeOn:{change:function(e){t.select(e)}},model:{value:t.checkbox,callback:function(e){t.checkbox=e},expression:"checkbox"}})],1):t._e(),t._v(" "),t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-rating-bar",class:[t.themeClass],attrs:{disabled:t.disabled}},[t.srcEmptyIcon?n("div",{staticClass:"md-empty-icon"},t._l(t.mdMaxRating,(function(e){return t.srcEmptyIcon?n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-src":t.srcEmptyIcon},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}}):t._e()}))):n("div",{staticClass:"md-empty-icon"},t._l(t.mdMaxRating,(function(e){return n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-iconset":t.mdEmptyIconset},domProps:{innerHTML:t._s(t.emptyIcon)},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}})}))),t._v(" "),t.srcFullIcon?n("div",{staticClass:"md-full-icon",style:t.fullIconStyle},t._l(t.mdMaxRating,(function(e){return t.srcFullIcon?n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-src":t.srcFullIcon},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}}):t._e()}))):n("div",{staticClass:"md-full-icon",style:t.fullIconStyle},t._l(t.mdMaxRating,(function(e){return n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-iconset":t.mdFullIconset},domProps:{innerHTML:t._s(t.fullIcon)},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}})})))])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item"},[n("div",{staticClass:"md-list-item-container"},[t._t("default")],2)])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-avatar",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-speed-dial",class:[t.themeClass,t.classes]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-file",on:{click:t.openPicker}},[n("md-input",{ref:"textInput",attrs:{readonly:"",required:t.required,placeholder:t.placeholder,disabled:t.disabled},model:{value:t.filename,callback:function(e){t.filename=e},expression:"filename"}}),t._v(" "),n("md-icon",[t._v("attach_file")]),t._v(" "),n("input",{ref:"fileInput",attrs:{type:"file",id:t.id,name:t.name,disabled:t.disabled,multiple:t.multiple,accept:t.accept},on:{change:t.onFileSelected}})],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-sidenav",class:[t.themeClass,t.classes],attrs:{tabindex:"0"},on:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"esc",27)?void t.close(e):null}}},[n("div",{staticClass:"md-sidenav-content"},[t._t("default")],2),t._v(" "),n("md-backdrop",{ref:"backdrop",staticClass:"md-sidenav-backdrop",on:{close:t.close}})],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-header-text"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-step",style:t.styles,attrs:{id:t.stepId}},[t.vertical?n("md-step-header",{attrs:{step:t.getStepData()},on:{click:function(e){t.setActiveStep()}}}):t._e(),t._v(" "),!t.vertical||t.vertical&&t.isCurrentStep?n("div",{staticClass:"md-step-content"},[t._t("default"),t._v(" "),!t.vertical||t.vertical&&t.isCurrentStep?n("div",{staticClass:"md-step-actions"},[n("md-button",{staticClass:"md-raised md-primary",attrs:{disabled:!t.mdContinue},on:{click:t.moveNextStep}},[t._v(t._s(t.continueText))]),t._v(" "),n("md-button",{attrs:{disabled:!t.canGoBack},on:{click:t.movePreviousStep}},[t._v(t._s(t.mdButtonBack))])],1):t._e()],2):t._e()],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-input-container",{staticClass:"md-chips",class:[t.themeClass,t.classes],on:{click:t.applyInputFocus}},[t._l(t.selectedChips,(function(e){return n("md-chip",{key:e,attrs:{"md-editable":!t.mdStatic,"md-deletable":!t.mdStatic,disabled:t.disabled},on:{edit:function(n){t.editChip(e)},delete:function(n){t.deleteChip(e)}}},[t._t("chip",[t._v(t._s(e))],{value:e})],2)})),t._v(" "),n("md-input",{directives:[{name:"show",rawName:"v-show",value:!t.mdStatic,expression:"!mdStatic"}],ref:"input",attrs:{type:t.mdInputType,placeholder:t.mdInputPlaceholder,id:t.inputId,name:t.mdInputName,disabled:t.disabled,tabindex:"0",debounce:0},nativeOn:{keydown:[function(e){return"button"in e||!t._k(e.keyCode,"delete",[8,46])?void t.deleteLastChip(e):null},function(e){return"button"in e||!t._k(e.keyCode,"enter",13)?(e.preventDefault(),void t.addChip(e)):null},function(e){return"button"in e||186===e.keyCode?(e.preventDefault(),void t.addChip(e)):null}]},model:{value:t.currentChip,callback:function(e){t.currentChip=e},expression:"currentChip"}}),t._v(" "),t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-dialog",{ref:"dialog",staticClass:"md-dialog-alert",on:{close:function(e){t.fireCloseEvent()}}},[t.mdTitle?n("md-dialog-title",[t._v(t._s(t.mdTitle))]):t._e(),t._v(" "),t.mdContentHtml?n("md-dialog-content",{domProps:{innerHTML:t._s(t.mdContentHtml)}}):n("md-dialog-content",[t._v(t._s(t.mdContent))]),t._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close()}}},[t._v(t._s(t.mdOkText))])],1)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("hr",{staticClass:"md-divider"})},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",{staticClass:"md-table-cell",class:t.classes},[n("div",{staticClass:"md-table-cell-container"},[t._t("default")],2)])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-header"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-menu-item",{staticClass:"md-option",class:t.classes,attrs:{tabindex:"-1"},on:{click:t.selectOption}},[t.parentSelect.multiple?n("md-checkbox",{staticClass:"md-primary",model:{value:t.check,callback:function(e){t.check=e},expression:"check"}},[n("span",{ref:"item"},[t._t("default")],2)]):n("span",{ref:"item"},[t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table-alternate-header",class:[t.themeClass,t.classes]},[n("md-toolbar",[n("div",{staticClass:"md-counter"},[n("span",{ref:"counter"},[t._v(t._s(t.numberOfSelected))]),t._v(" "),n("span",[t._v(t._s(t.mdSelectedLabel))])]),t._v(" "),t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("textarea",{staticClass:"md-input",attrs:{disabled:t.disabled,required:t.required,placeholder:t.placeholder,maxlength:t.maxlength,readonly:t.readonly},domProps:{value:t.value},on:{focus:t.onFocus,blur:t.onBlur,input:t.onInput}})},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.mounted||!t.disabled?n("div",{staticClass:"md-ink-ripple"},[n("div",{ref:"ripple",staticClass:"md-ripple",class:t.classes,style:t.styles})]):t._e()},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table-edit",on:{keydown:function(e){return"button"in e||!t._k(e.keyCode,"esc",27)?void t.closeDialog(e):null}}},[n("div",{staticClass:"md-table-edit-trigger",class:t.triggerClasses,on:{click:function(e){e.stopPropagation(),t.openDialog(e)}}},[t._v("\n    "+t._s(t.value||t.mdPlaceholder)+"\n  ")]),t._v(" "),n("div",{ref:"dialog",staticClass:"md-table-dialog",class:t.dialogClasses},[n("md-input-container",[n("md-input",{ref:"input",attrs:{id:t.mdId,name:t.mdName,maxlength:t.mdMaxlength,value:t.value,placeholder:t.mdPlaceholder},nativeOn:{keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13)?void t.confirmDialog(e):null}}})],1)],1)])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return"md-list"===t.$parent.$options._componentTag?n("li",{staticClass:"md-subheader",class:[t.themeClass]},[t._t("default")],2):n("div",{staticClass:"md-subheader",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-content"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.href?n("a",{staticClass:"md-button",class:[t.themeClass],attrs:{href:t.href,disabled:t.disabled,target:t.target,rel:t.newRel},on:{click:function(e){t.$emit("click",e)}}},[n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),t._t("default")],2):n("button",{staticClass:"md-button",class:[t.themeClass],attrs:{type:t.type,disabled:t.disabled},on:{click:function(e){t.$emit("click",e)}}},[n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("th",{staticClass:"md-table-head",class:t.classes,on:{click:t.changeSort}},[n("div",{staticClass:"md-table-head-container"},[n("div",{staticClass:"md-table-head-text md-test"},[t.mdSortBy?n("md-icon",{staticClass:"md-sortable-icon"},[t._v("arrow_upward")]):t._e(),t._v(" "),t._t("default"),t._v(" "),t.mdTooltip?n("md-tooltip",[t._v(t._s(t.mdTooltip))]):t._e()],2),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":!t.mdSortBy}})],1)])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-switch",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-switch-container",on:{click:function(e){t.toggle(e)}}},[n("div",{staticClass:"md-switch-thumb",style:t.styles},[n("input",{attrs:{type:"checkbox",name:t.name,id:t.id,disabled:t.disabled,tabindex:"-1"},domProps:{value:t.value}}),t._v(" "),n("button",{staticClass:"md-switch-holder",attrs:{type:t.type}}),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}})],1)]),t._v(" "),t.$slots.default?n("label",{staticClass:"md-switch-label",attrs:{for:t.id||t.name}},[t._t("default")],2):t._e()])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-menu-content",attrs:{tabindex:"-1"},on:{keydown:[function(e){return"button"in e||!t._k(e.keyCode,"esc",27)?(e.preventDefault(),void t.close(e)):null},function(e){return"button"in e||!t._k(e.keyCode,"tab",9)?(e.preventDefault(),void t.close(e)):null},function(e){return"button"in e||!t._k(e.keyCode,"up",38)?(e.preventDefault(),void t.highlightItem("up")):null},function(e){return"button"in e||!t._k(e.keyCode,"down",40)?(e.preventDefault(),void t.highlightItem("down")):null},function(e){return"button"in e||!t._k(e.keyCode,"enter",13)?void t.fireClick(e):null},function(e){return"button"in e||!t._k(e.keyCode,"space",32)?void t.fireClick(e):null}]}},[n("md-list",[t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-dialog-actions"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-boards",class:[t.themeClass,t.boardClasses]},[n("div",{ref:"boardsContent",staticClass:"md-boards-content",style:{height:t.contentHeight}},[n("div",{staticClass:"md-boards-wrapper",style:{transform:"translate3D(-"+t.contentWidth+", 0, 0)"}},[t._t("default")],2)]),t._v(" "),n("nav",{ref:"boardNavigation",staticClass:"md-boards-navigation",class:t.navigationClasses},[t.mdControls?t._e():n("span",{staticStyle:{flex:"1"}}),t._v(" "),t.mdControls?n("md-button",{on:{click:function(e){t.movePrevBoard()}}},[n("div",{staticClass:"md-board-header-container"},[n("md-icon",{staticClass:"md-control"},[t._v("chevron_left")])],1)]):t._e(),t._v(" "),n("span",{staticStyle:{flex:"1"}}),t._v(" "),t._l(t.boardList,(function(e){return n("button",{key:e.id,ref:"boardHeader",refInFor:!0,staticClass:"md-board-header",class:t.getHeaderClass(e),attrs:{type:"button",disabled:e.disabled},on:{click:function(n){t.setActiveBoard(e,!0)}}},[n("div",{staticClass:"md-board-header-container"},[n("md-icon",[t._v("fiber_manual_record")])],1)])})),t._v(" "),n("span",{staticStyle:{flex:"1"}}),t._v(" "),t.mdControls?n("md-button",{on:{click:function(e){t.moveNextBoard()}}},[n("div",{staticClass:"md-board-header-container"},[n("md-icon",{staticClass:"md-control"},[t._v("chevron_right")])],1)]):t._e(),t._v(" "),t.mdControls?t._e():n("span",{staticStyle:{flex:"1"}}),t._v(" "),n("span",{ref:"indicator"})],2)])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-checkbox",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-checkbox-container",attrs:{tabindex:"0"},on:{click:function(e){e.stopPropagation(),t.toggleCheck(e)}}},[n("input",{attrs:{type:"checkbox",name:t.name,id:t.id,disabled:t.disabled,tabindex:"-1"},domProps:{value:t.value,checked:t.checked}}),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}})],1),t._v(" "),t.$slots.default?n("label",{staticClass:"md-checkbox-label",attrs:{for:t.id||t.name},on:{click:function(e){e.preventDefault(),t.toggleCheck(e)}}},[t._t("default")],2):t._e()])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-select",class:[t.themeClass,t.classes]},[n("md-menu",t._b({attrs:{"md-close-on-select":!t.multiple},on:{opened:function(e){t.$emit("open")},closed:function(e){t.$emit("close")}}},"md-menu",t.mdMenuOptions),[t._t("icon"),t._v(" "),n("span",{ref:"value",staticClass:"md-select-value",style:t.valueStyle,attrs:{"md-menu-trigger":""}},[t._v(t._s(t.selectedText||t.placeholder))]),t._v(" "),n("md-menu-content",{staticClass:"md-select-content",class:[t.themeClass,t.contentClasses]},[t._t("default")],2)],2),t._v(" "),n("select",{attrs:{name:t.name,id:t.id,required:t.required,disabled:t.disabled,tabindex:"-1"}},[t.multiple?t._e():n("option",{attrs:{selected:"true"},domProps:{value:t.selectedValue}},[t._v(t._s(t.selectedText))]),t._v(" "),t._l(t.multipleOptions,(function(e){return e.value?n("option",{attrs:{selected:"true"},domProps:{value:e.value}},[t._v(t._s(e.text))]):t._e()}))],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",{staticClass:"md-tooltip",class:t.classes,style:t.style},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("img",{staticClass:"md-image",class:t.classes,attrs:{src:t.mdSrc}})},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-snackbar",class:[t.themeClass,t.classes],attrs:{id:t.snackbarId},on:{mouseenter:t.pauseTimeout,mouseleave:t.resumeTimeout}},[n("div",{ref:"container",staticClass:"md-snackbar-container"},[n("div",{staticClass:"md-snackbar-content"},[t._t("default")],2)])])},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-menu"},[t._t("default"),t._v(" "),n("md-backdrop",{ref:"backdrop",staticClass:"md-menu-backdrop md-transparent md-active",on:{close:t.close}})],2)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-dialog",{ref:"dialog",staticClass:"md-dialog-confirm",on:{close:function(e){t.fireCloseEvent("cancel")}}},[t.mdTitle?n("md-dialog-title",[t._v(t._s(t.mdTitle))]):t._e(),t._v(" "),t.mdContentHtml?n("md-dialog-content",{domProps:{innerHTML:t._s(t.mdContentHtml)}}):n("md-dialog-content",[t._v(t._s(t.mdContent))]),t._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close("cancel")}}},[t._v(t._s(t.mdCancelText))]),t._v(" "),n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close("ok")}}},[t._v(t._s(t.mdOkText))])],1)],1)},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-backdrop",on:{click:t.close,keyup:function(e){return"button"in e||!t._k(e.keyCode,"esc",27)?void t.close(e):null}}})},staticRenderFns:[]}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-list-expand-container"},[t._t("default")],2)},staticRenderFns:[]}}),(function(e,n){e.exports=t}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(114),a=i(o),r=n(80),s=i(r),d=n(81),l=i(d),c=n(82),u=i(c),m=n(83),f=i(m),p=n(84),h=i(p),b=n(85),v=i(b),E=n(86),g=i(E),_=n(87),C=i(_),M=n(88),T=i(M),A=n(89),x=i(A),N=n(90),y=i(N),O=n(91),S=i(O),R=n(92),w=i(R),k=n(93),P=i(k),H=n(94),L=i(H),$=n(95),I=i($),B=n(96),D=i(B),F=n(97),j=i(F),W=n(98),Y=i(W),V=n(99),U=i(V),z=n(100),G=i(z),q=n(101),K=i(q),X=n(102),J=i(X),Q=n(103),Z=i(Q),tt=n(104),et=i(tt),nt=n(105),it=i(nt),ot=n(106),at=i(ot),rt=n(107),st=i(rt),dt=n(108),lt=i(dt),ct=n(109),ut=i(ct),mt=n(110),ft=i(mt),pt=n(111),ht=i(pt),bt=n(112),vt=i(bt),Et=n(113),gt=i(Et),_t={MdCore:a.default,MdAvatar:s.default,MdBackdrop:l.default,MdBottomBar:u.default,MdButton:f.default,MdButtonToggle:h.default,MdCard:v.default,MdCheckbox:g.default,MdChips:C.default,MdDialog:T.default,MdDivider:x.default,MdFile:y.default,MdIcon:S.default,MdImage:w.default,MdInputContainer:P.default,MdLayout:L.default,MdList:I.default,MdMenu:D.default,MdOnboarding:j.default,MdProgress:Y.default,MdRadio:U.default,MdRatingBar:G.default,MdSelect:K.default,MdSidenav:J.default,MdSnackbar:Z.default,MdSpeedDial:et.default,MdSpinner:it.default,MdStepper:at.default,MdSubheader:st.default,MdSwitch:lt.default,MdTable:ut.default,MdTabs:ft.default,MdToolbar:ht.default,MdTooltip:vt.default,MdWhiteframe:gt.default};_t.install=function(t){for(var e in _t){var n=_t[e];n&&"install"!==e&&t.use(n)}},e.default=_t,t.exports=e.default}),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,(function(t,e,n){t.exports=n(445)})])}));
},{"vue":5}],5:[function(require,module,exports){
(function (process,global){
/*!
 * Vue.js v2.4.2
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
'use strict';

/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefix has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (parentVal, childVal) {
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options) {
  var inject = options.inject;
  if (Array.isArray(inject)) {
    var normalized = options.inject = {};
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = inject[i];
    }
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeInject(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (comp.__esModule && comp.default) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      child.data && child.data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listensers hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data && parentVnode.data.attrs;
  vm.$listeners = listeners;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function checkOptionType (vm, name) {
  var option = vm.$options[name];
  if (!isPlainObject(option)) {
    warn(
      ("component option \"" + name + "\" should be an object."),
      vm
    );
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      if (isReservedAttribute(key) || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'computed');
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'methods');
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'watch');
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (process.env.NODE_ENV !== 'production' && !source) {
        warn(("Injection \"" + key + "\" not found"), vm);
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(ours, existing) : ours;
      }
    }
  }
  return data
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, null, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners, null, true);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
  Vue.prototype._g = bindObjectListeners;
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp, Array];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.4.2';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if (process.env.NODE_ENV !== 'production' &&
              typeof console !== 'undefined' &&
              !bailed
            ) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;



function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */


/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var str;
var index$1;

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (process.env.NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

module.exports = Vue$3;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],6:[function(require,module,exports){
;(function(){
module.exports = {
	props: ['title'],
}
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('md-toolbar',[_c('h1',{staticClass:"md-title"},[_vm._v(_vm._s(_vm.title))])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-56700c46", __vue__options__)
  } else {
    hotAPI.reload("data-v-56700c46", __vue__options__)
  }
})()}
},{"vue":5,"vue-hot-reload-api":3}],7:[function(require,module,exports){
;(function(){
module.exports = {
  data: function() {
  	return {
  		text: "Under construction..."
  	}
  }
}
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('ms-header',{attrs:{"title":"Mean Shot"}}),_vm._v(" "),_c('div',{staticClass:"main-content"},[_c('p',[_vm._v(_vm._s(_vm.text))])])],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2e5e1ec6", __vue__options__)
  } else {
    hotAPI.reload("data-v-2e5e1ec6", __vue__options__)
  }
})()}
},{"vue":5,"vue-hot-reload-api":3}],8:[function(require,module,exports){
var css = "/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-ink-ripple {\n  pointer-events: none;\n  overflow: hidden;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  -webkit-mask-image: radial-gradient(circle, white 100%, black 100%);\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n}\n.md-ripple {\n  position: absolute;\n  background-color: currentColor;\n  border-radius: 50%;\n  opacity: .2;\n  transform: scale(0) translateZ(0);\n  transition: none;\n  will-change: background-color, opacity, transform, width, height, top, left;\n}\n.md-ripple.md-active {\n  animation: ripple 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;\n}\n.md-ripple.md-active.md-fadeout {\n  opacity: 0 !important;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-duration: .6s;\n}\n@keyframes ripple {\n  to {\n    transform: scale(2.2) translateZ(0);\n  }\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n/*  Text and Titles\n   ========================================================================== */\n.md-caption {\n  font-size: 12px;\n  font-weight: 400;\n  letter-spacing: .02em;\n  line-height: 17px;\n}\n.md-body-1,\nbody {\n  font-size: 14px;\n  font-weight: 400;\n  letter-spacing: .01em;\n  line-height: 20px;\n}\n.md-body-2 {\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: .01em;\n  line-height: 24px;\n}\n.md-subheading {\n  font-size: 16px;\n  font-weight: 400;\n  letter-spacing: .01em;\n  line-height: 24px;\n}\n.md-title {\n  font-size: 20px;\n  font-weight: 500;\n  letter-spacing: .005em;\n  line-height: 26px;\n}\n.md-headline {\n  font-size: 24px;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 32px;\n}\n.md-display-1 {\n  font-size: 34px;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 40px;\n}\n.md-display-2 {\n  font-size: 45px;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 48px;\n}\n.md-display-3 {\n  font-size: 56px;\n  font-weight: 400;\n  letter-spacing: -.005em;\n  line-height: 58px;\n}\n.md-display-4 {\n  font-size: 112px;\n  font-weight: 300;\n  letter-spacing: -.01em;\n  line-height: 112px;\n}\n/*  Links & Buttons\n   ========================================================================== */\na:not(.md-button):not(.md-bottom-bar-item) {\n  text-decoration: none;\n}\na:not(.md-button):not(.md-bottom-bar-item):hover {\n  text-decoration: underline;\n}\nbutton:focus {\n  outline: none;\n}\n/*  Structure\n   ========================================================================== */\nhtml {\n  height: 100%;\n  box-sizing: border-box;\n}\nhtml *,\nhtml *:before,\nhtml *:after {\n  box-sizing: inherit;\n}\nbody {\n  min-height: 100%;\n  margin: 0;\n  position: relative;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: rgba(0, 0, 0, 0.87);\n  font-family: Roboto, \"Noto Sans\", Noto, sans-serif;\n}\n/*  Fluid Media\n   ========================================================================== */\nul:not(.md-list) > li + li {\n  margin-top: 8px;\n}\n/*  Fluid Media\n   ========================================================================== */\naudio,\nimg,\nsvg,\nobject,\nembed,\ncanvas,\nvideo,\niframe {\n  max-width: 100%;\n  font-style: italic;\n  vertical-align: middle;\n}\naudio:not(.md-image),\nimg:not(.md-image),\nsvg:not(.md-image),\nobject:not(.md-image),\nembed:not(.md-image),\ncanvas:not(.md-image),\nvideo:not(.md-image),\niframe:not(.md-image) {\n  height: auto;\n}\n/*  Suppress the focus outline on links that cannot be accessed via keyboard.\n    This prevents an unwanted focus outline from appearing around elements\n    that might still respond to pointer events.\n   ========================================================================== */\n[tabindex=\"-1\"]:focus {\n  outline: none !important;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-scrollbar::-webkit-scrollbar,\n.md-scrollbar ::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n  box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.12);\n  transition: all 0.5s cubic-bezier(0.35, 0, 0.25, 1);\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.md-scrollbar::-webkit-scrollbar:hover,\n.md-scrollbar ::-webkit-scrollbar:hover {\n  box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.054), inset 0 -1px 0 rgba(0, 0, 0, 0.038);\n  background-color: rgba(0, 0, 0, 0.087);\n}\n.md-scrollbar::-webkit-scrollbar-button,\n.md-scrollbar ::-webkit-scrollbar-button {\n  display: none;\n}\n.md-scrollbar::-webkit-scrollbar-corner,\n.md-scrollbar ::-webkit-scrollbar-corner {\n  background-color: transparent;\n}\n.md-scrollbar::-webkit-scrollbar-thumb,\n.md-scrollbar ::-webkit-scrollbar-thumb {\n  background-color: rgba(0, 0, 0, 0.26);\n  box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.054), inset 0 -1px 0 rgba(0, 0, 0, 0.087);\n  transition: all 0.5s cubic-bezier(0.35, 0, 0.25, 1);\n}\n/*  Text and Titles\n   ========================================================================== */\n.md-caption {\n  font-size: 12px;\n  font-weight: 400;\n  letter-spacing: .02em;\n  line-height: 17px;\n}\n.md-body-1,\nbody {\n  font-size: 14px;\n  font-weight: 400;\n  letter-spacing: .01em;\n  line-height: 20px;\n}\n.md-body-2 {\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: .01em;\n  line-height: 24px;\n}\n.md-subheading {\n  font-size: 16px;\n  font-weight: 400;\n  letter-spacing: .01em;\n  line-height: 24px;\n}\n.md-title {\n  font-size: 20px;\n  font-weight: 500;\n  letter-spacing: .005em;\n  line-height: 26px;\n}\n.md-headline {\n  font-size: 24px;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 32px;\n}\n.md-display-1 {\n  font-size: 34px;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 40px;\n}\n.md-display-2 {\n  font-size: 45px;\n  font-weight: 400;\n  letter-spacing: 0;\n  line-height: 48px;\n}\n.md-display-3 {\n  font-size: 56px;\n  font-weight: 400;\n  letter-spacing: -.005em;\n  line-height: 58px;\n}\n.md-display-4 {\n  font-size: 112px;\n  font-weight: 300;\n  letter-spacing: -.01em;\n  line-height: 112px;\n}\n/*  Links & Buttons\n   ========================================================================== */\na:not(.md-button):not(.md-bottom-bar-item) {\n  text-decoration: none;\n}\na:not(.md-button):not(.md-bottom-bar-item):hover {\n  text-decoration: underline;\n}\nbutton:focus {\n  outline: none;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-avatar {\n  width: 40px;\n  min-width: 40px;\n  height: 40px;\n  min-height: 40px;\n  margin: auto;\n  display: inline-block;\n  overflow: hidden;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  position: relative;\n  border-radius: 40px;\n  vertical-align: middle;\n}\n.md-avatar.md-large {\n  width: 64px;\n  min-width: 64px;\n  height: 64px;\n  min-height: 64px;\n  border-radius: 64px;\n}\n.md-avatar.md-large .md-icon {\n  width: 40px;\n  min-width: 40px;\n  height: 40px;\n  min-height: 40px;\n  font-size: 40px;\n  line-height: 40px;\n}\n.md-avatar.md-avatar-icon {\n  background-color: rgba(0, 0, 0, 0.38);\n}\n.md-avatar.md-avatar-icon .md-icon {\n  color: #fff;\n}\n.md-avatar .md-icon {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.md-avatar img {\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n.md-avatar .md-ink-ripple {\n  border-radius: 50%;\n}\n.md-avatar .md-ink-ripple .md-ripple.md-active {\n  animation-duration: .9s;\n}\n.md-avatar-tooltip.md-tooltip-top {\n  margin-top: -8px;\n}\n.md-avatar-tooltip.md-tooltip-right {\n  margin-left: 8px;\n}\n.md-avatar-tooltip.md-tooltip-bottom {\n  margin-top: 8px;\n}\n.md-avatar-tooltip.md-tooltip-left {\n  margin-left: -8px;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-backdrop {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 99;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.54);\n  transform: translate3d(0, 0, 0);\n  opacity: 0;\n  transition: all 0.5s cubic-bezier(0.35, 0, 0.25, 1);\n}\n.md-backdrop.md-active {\n  opacity: 1;\n  pointer-events: auto;\n}\n.md-backdrop.md-transparent {\n  background: rgba(0, 0, 0, 0.005);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-bottom-bar {\n  width: 100%;\n  min-width: 100%;\n  height: 56px;\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n  justify-content: center;\n  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-bottom-bar-item {\n  max-width: 168px;\n  min-width: 80px;\n  height: 100%;\n  padding: 8px 12px 10px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column nowrap;\n  flex-flow: column nowrap;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  -ms-flex: 1;\n  flex: 1;\n  position: relative;\n  cursor: pointer;\n  border: none;\n  background: transparent;\n  transform: translate3d(0, 0, 0);\n  color: currentColor;\n  font-family: inherit;\n  font-size: 14px;\n  line-height: 1em;\n  text-decoration: none;\n}\n.md-bottom-bar-item.md-active {\n  padding-top: 6px;\n}\n.md-bottom-bar-item.md-active .md-text {\n  transform: scale(1) translate3d(0, 0, 0);\n}\n.md-bottom-bar-item.md-active .md-text,\n.md-bottom-bar-item.md-active .md-icon {\n  color: currentColor;\n}\n.md-bottom-bar-item[disabled] {\n  opacity: .38;\n}\n.md-bottom-bar.md-shift .md-bottom-bar-item {\n  min-width: 56px;\n  max-width: 96px;\n  position: static;\n  -ms-flex: 1 1 32px;\n  flex: 1 1 32px;\n  transition: 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-property: flex, min-width, max-width;\n  transition-property: flex, min-width, max-width, -ms-flex;\n}\n.md-bottom-bar.md-shift .md-bottom-bar-item .md-icon {\n  transform: translate3d(0, 8px, 0);\n}\n.md-bottom-bar.md-shift .md-bottom-bar-item .md-text {\n  opacity: 0;\n  transform: scale(1) translate3d(0, 6px, 0);\n}\n.md-bottom-bar.md-shift .md-bottom-bar-item.md-active {\n  min-width: 96px;\n  max-width: 168px;\n  -ms-flex: 1 1 72px;\n  flex: 1 1 72px;\n}\n.md-bottom-bar.md-shift .md-bottom-bar-item.md-active .md-icon,\n.md-bottom-bar.md-shift .md-bottom-bar-item.md-active .md-text {\n  opacity: 1;\n}\n.md-bottom-bar.md-shift .md-bottom-bar-item.md-active .md-icon {\n  transform: scale(1) translate3d(0, 0, 0);\n}\n.md-bottom-bar.md-shift .md-bottom-bar-item.md-active .md-text {\n  transform: scale(1) translate3d(0, 2px, 0);\n}\n.md-bottom-bar-item .md-text {\n  transform: scale(0.8571) translateY(2px);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.15s linear, opacity 0.15s linear;\n}\n.md-bottom-bar-item .md-icon {\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.15s linear;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-button {\n  min-width: 88px;\n  min-height: 36px;\n  margin: 6px 8px;\n  padding: 0 16px;\n  display: inline-block;\n  position: relative;\n  overflow: hidden;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor: pointer;\n  outline: none;\n  background: none;\n  border: 0;\n  border-radius: 2px;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  color: currentColor;\n  font-family: inherit;\n  font-size: 14px;\n  font-style: inherit;\n  font-variant: inherit;\n  font-weight: 500;\n  letter-spacing: inherit;\n  line-height: 36px;\n  text-align: center;\n  text-transform: uppercase;\n  text-decoration: none;\n  vertical-align: top;\n  white-space: nowrap;\n}\n.md-button:focus {\n  outline: none;\n}\n.md-button::-moz-focus-inner {\n  border: 0;\n}\n.md-button:hover:not([disabled]):not(.md-raised) {\n  background-color: rgba(153, 153, 153, 0.2);\n  text-decoration: none;\n}\n.md-button:hover:not([disabled]).md-raised {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n.md-button:active:not([disabled]) {\n  background-color: rgba(153, 153, 153, 0.4);\n}\n.md-button.md-raised:not([disabled]) {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.md-button.md-dense {\n  min-height: 32px;\n  line-height: 32px;\n  font-size: 13px;\n}\n.md-button.md-icon-button .md-icon,\n.md-button.md-fab .md-icon {\n  position: absolute;\n  top: 1px;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.md-button.md-icon-button {\n  width: 40px;\n  min-width: 40px;\n  height: 40px;\n  margin: 0 6px;\n  padding: 8px;\n  border-radius: 50%;\n  line-height: 24px;\n}\n.md-button.md-icon-button:not([disabled]):hover {\n  background: none;\n}\n.md-button.md-icon-button.md-dense {\n  width: 32px;\n  min-width: 32px;\n  height: 32px;\n  min-height: 32px;\n  padding: 4px;\n  line-height: 32px;\n}\n.md-button.md-icon-button .md-ink-ripple {\n  border-radius: 50%;\n}\n.md-button.md-icon-button .md-ink-ripple .md-ripple {\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n}\n.md-button.md-icon-button .md-ripple.md-active {\n  animation-duration: .9s;\n}\n.md-button.md-fab {\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  min-width: 0;\n  overflow: hidden;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  border-radius: 56px;\n  line-height: 56px;\n  background-clip: padding-box;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-property: background-color, box-shadow, transform;\n}\n.md-button.md-fab:hover,\n.md-button.md-fab:focus {\n  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px rgba(0, 0, 0, 0.14), 0 1px 14px rgba(0, 0, 0, 0.12);\n}\n.md-button.md-fab.md-mini {\n  width: 40px;\n  height: 40px;\n  line-height: 40px;\n}\n.md-button.md-fab .md-ink-ripple {\n  border-radius: 56px;\n}\n.md-button[disabled] {\n  color: rgba(0, 0, 0, 0.26);\n  cursor: default;\n  pointer-events: none;\n}\n.md-button[disabled].md-raised,\n.md-button[disabled].md-fab {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n.md-button[disabled].md-fab {\n  box-shadow: none;\n}\n.md-button:after {\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-button .md-ink-ripple {\n  border-radius: 2px;\n  background-clip: padding-box;\n  overflow: hidden;\n}\n.md-button.md-icon-button .md-icon,\n.md-button.md-fab .md-icon {\n  display: block;\n}\n.md-fab.md-fab-top-left,\n.md-fab.md-fab-top-center,\n.md-fab.md-fab-top-right,\n.md-fab.md-fab-bottom-left,\n.md-fab.md-fab-bottom-center,\n.md-fab.md-fab-bottom-right,\n.md-speed-dial.md-fab-top-left,\n.md-speed-dial.md-fab-top-center,\n.md-speed-dial.md-fab-top-right,\n.md-speed-dial.md-fab-bottom-left,\n.md-speed-dial.md-fab-bottom-center,\n.md-speed-dial.md-fab-bottom-right {\n  margin: 0;\n  position: absolute;\n  z-index: 10;\n}\n.md-fab.md-fab-top-left,\n.md-speed-dial.md-fab-top-left {\n  top: 24px;\n  left: 24px;\n}\n.md-fab.md-fab-top-center,\n.md-speed-dial.md-fab-top-center {\n  top: 24px;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.md-fab.md-fab-top-right,\n.md-speed-dial.md-fab-top-right {\n  top: 24px;\n  right: 24px;\n}\n.md-fab.md-fab-bottom-left,\n.md-speed-dial.md-fab-bottom-left {\n  bottom: 24px;\n  left: 24px;\n}\n.md-fab.md-fab-bottom-center,\n.md-speed-dial.md-fab-bottom-center {\n  bottom: 24px;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.md-fab.md-fab-bottom-right,\n.md-speed-dial.md-fab-bottom-right {\n  right: 24px;\n  bottom: 24px;\n}\n.md-button-tooltip.md-tooltip-top {\n  margin-top: -8px;\n}\n.md-button-tooltip.md-tooltip-right {\n  margin-left: 8px;\n}\n.md-button-tooltip.md-tooltip-bottom {\n  margin-top: 8px;\n}\n.md-button-tooltip.md-tooltip-left {\n  margin-left: -8px;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-button-toggle {\n  width: auto;\n  display: -ms-flexbox;\n  display: flex;\n}\n.md-button-toggle > .md-button {\n  margin: 0;\n  overflow: hidden;\n  border-width: 1px 0 1px 1px;\n  border-radius: 0;\n  text-align: center;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.md-button-toggle > .md-button:first-child {\n  border-radius: 2px 0 0 2px;\n}\n.md-button-toggle > .md-button:last-child {\n  border-right-width: 1px;\n  border-radius: 0 2px 2px 0;\n}\n.md-button-toggle > .md-button:not([disabled]) {\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-button-toggle > .md-button:not([disabled]):hover:not(.md-toggle):not(.md-raised) {\n  background-color: rgba(153, 153, 153, 0.2);\n  text-decoration: none;\n}\n.md-button-toggle > .md-button .md-ink-ripple {\n  border-radius: 2px;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n/* Image aspect ratio calculator */\n/* Responsive breakpoints */\n.md-card {\n  overflow: auto;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  position: relative;\n  z-index: 1;\n  border-radius: 2px;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.md-card.md-with-hover {\n  cursor: pointer;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-property: box-shadow;\n}\n.md-card.md-with-hover:hover {\n  z-index: 2;\n  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.md-card .md-card-media {\n  position: relative;\n}\n.md-card .md-card-media.md-16-9 {\n  overflow: hidden;\n}\n.md-card .md-card-media.md-16-9:before {\n  width: 100%;\n  padding-top: 56.25%;\n  display: block;\n  content: \" \";\n}\n.md-card .md-card-media.md-16-9 img {\n  position: absolute;\n  top: 50%;\n  right: 0;\n  left: 0;\n  transform: translateY(-50%);\n}\n.md-card .md-card-media.md-4-3 {\n  overflow: hidden;\n}\n.md-card .md-card-media.md-4-3:before {\n  width: 100%;\n  padding-top: 75%;\n  display: block;\n  content: \" \";\n}\n.md-card .md-card-media.md-4-3 img {\n  position: absolute;\n  top: 50%;\n  right: 0;\n  left: 0;\n  transform: translateY(-50%);\n}\n.md-card .md-card-media.md-1-1 {\n  overflow: hidden;\n}\n.md-card .md-card-media.md-1-1:before {\n  width: 100%;\n  padding-top: 100%;\n  display: block;\n  content: \" \";\n}\n.md-card .md-card-media.md-1-1 img {\n  position: absolute;\n  top: 50%;\n  right: 0;\n  left: 0;\n  transform: translateY(-50%);\n}\n.md-card .md-card-media + .md-card-header {\n  padding-top: 24px;\n}\n.md-card .md-card-media + .md-card-content:last-child {\n  padding-bottom: 16px;\n}\n.md-card .md-card-media img {\n  width: 100%;\n}\n.md-card .md-card-header {\n  padding: 16px;\n}\n.md-card .md-card-header:first-child > .md-title:first-child,\n.md-card .md-card-header:first-child > .md-card-header-text > .md-title:first-child {\n  margin-top: 8px;\n}\n.md-card .md-card-header:last-child {\n  margin-bottom: 8px;\n}\n.md-card .md-card-header.md-card-header-flex {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n.md-card .md-card-header + .md-card-content {\n  padding-top: 0;\n}\n.md-card .md-card-header + .md-card-actions:not(:last-child) {\n  padding: 0 8px;\n}\n.md-card .md-card-header .md-avatar {\n  margin-right: 16px;\n  float: left;\n}\n.md-card .md-card-header .md-avatar ~ .md-title {\n  font-size: 14px;\n}\n.md-card .md-card-header .md-avatar ~ .md-title,\n.md-card .md-card-header .md-avatar ~ .md-subhead {\n  font-weight: 500;\n  line-height: 20px;\n}\n.md-card .md-card-header .md-button {\n  margin: 0;\n}\n.md-card .md-card-header .md-button:last-child {\n  margin-right: -4px;\n}\n.md-card .md-card-header .md-button + .md-button {\n  margin-left: 8px;\n}\n.md-card .md-card-header .md-card-header-text {\n  -ms-flex: 1;\n  flex: 1;\n}\n.md-card .md-card-header .md-card-media {\n  width: 80px;\n  -ms-flex: 0 0 80px;\n  flex: 0 0 80px;\n  height: 80px;\n  margin-left: 16px;\n}\n.md-card .md-card-header .md-card-media.md-medium {\n  width: 120px;\n  -ms-flex: 0 0 120px;\n  flex: 0 0 120px;\n  height: 120px;\n}\n.md-card .md-card-header .md-card-media.md-big {\n  width: 160px;\n  -ms-flex: 0 0 160px;\n  flex: 0 0 160px;\n  height: 160px;\n}\n.md-card .md-subhead,\n.md-card .md-title,\n.md-card .md-subheading {\n  margin: 0;\n  font-weight: 400;\n}\n.md-card .md-subhead {\n  opacity: .54;\n  font-size: 14px;\n  letter-spacing: .01em;\n  line-height: 20px;\n}\n.md-card .md-subhead + .md-title {\n  margin-top: 4px;\n}\n.md-card .md-title {\n  font-size: 24px;\n  letter-spacing: 0;\n  line-height: 32px;\n}\n.md-card .md-card-media-actions {\n  padding: 16px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n.md-card .md-card-media-actions .md-card-media {\n  max-width: 240px;\n  max-height: 240px;\n  -ms-flex: 1;\n  flex: 1;\n}\n.md-card .md-card-media-actions .md-card-actions {\n  margin-left: 16px;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  -ms-flex-align: center;\n  align-items: center;\n}\n.md-card .md-card-media-actions .md-card-actions .md-button + .md-button {\n  margin: 8px 0 0;\n}\n.md-card .md-card-content {\n  padding: 16px;\n  font-size: 14px;\n  line-height: 22px;\n}\n.md-card .md-card-content:last-child {\n  padding-bottom: 24px;\n}\n.md-card .md-card-actions {\n  padding: 8px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  -ms-flex-align: center;\n  align-items: center;\n}\n.md-card .md-card-actions .md-button {\n  margin: 0;\n}\n.md-card .md-card-actions .md-button:first-child {\n  margin-left: 0;\n}\n.md-card .md-card-actions .md-button:last-child {\n  margin-right: 0;\n}\n.md-card .md-card-actions .md-button + .md-button {\n  margin-left: 4px;\n}\n.md-card .md-card-area {\n  position: relative;\n}\n.md-card > .md-card-area:not(:last-child) {\n  position: relative;\n}\n.md-card > .md-card-area:not(:last-child):after {\n  height: 1px;\n  position: absolute;\n  bottom: 0;\n  content: \" \";\n}\n.md-card > .md-card-area:not(:last-child):not(.md-inset):after {\n  right: 0;\n  left: 0;\n}\n.md-card > .md-card-area:not(:last-child).md-inset:after {\n  right: 16px;\n  left: 16px;\n}\n.md-card .md-card-media-cover {\n  position: relative;\n  color: #fff;\n}\n.md-card .md-card-media-cover.md-text-scrim .md-card-backdrop {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n}\n.md-card .md-card-media-cover .md-card-area {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 2;\n}\n.md-card .md-card-media-cover .md-card-header + .md-card-actions {\n  padding-top: 0;\n}\n.md-card .md-card-media-cover .md-subhead {\n  opacity: 1;\n}\n.md-card .md-card-expand {\n  overflow: hidden;\n}\n.md-card .md-card-expand.md-active [md-expand-trigger] {\n  transform: rotateZ(180deg) translate3D(0, 0, 0);\n}\n.md-card .md-card-expand.md-active .md-card-content {\n  margin-top: 0 !important;\n  opacity: 1;\n  padding: 4px 16px 24px 16px;\n  height: auto;\n}\n.md-card .md-card-expand .md-card-actions {\n  padding-top: 0;\n  position: relative;\n  z-index: 2;\n}\n.md-card .md-card-expand [md-expand-trigger] {\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  will-change: transform;\n}\n.md-card .md-card-expand .md-card-content {\n  height: 0;\n  padding: 0 16px;\n  position: relative;\n  z-index: 1;\n  opacity: 0;\n  transform: translate3D(0, 0, 0);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  will-change: margin, height;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-checkbox {\n  width: auto;\n  margin: 16px 8px 16px 0;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n}\n.md-checkbox:not(.md-disabled) {\n  cursor: pointer;\n}\n.md-checkbox:not(.md-disabled) .md-checkbox-label {\n  cursor: pointer;\n}\n.md-checkbox .md-checkbox-container {\n  width: 20px;\n  min-width: 20px;\n  height: 20px;\n  position: relative;\n  border-radius: 2px;\n  border: 2px solid rgba(0, 0, 0, 0.54);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-checkbox .md-checkbox-container:focus {\n  outline: none;\n}\n.md-checkbox .md-checkbox-container:before {\n  width: 48px;\n  height: 48px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  border-radius: 50%;\n  transform: translate(-50%, -50%);\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n  content: \" \";\n}\n.md-checkbox .md-checkbox-container:after {\n  width: 6px;\n  height: 13px;\n  position: absolute;\n  top: 0;\n  left: 5px;\n  border: 2px solid #fff;\n  border-top: 0;\n  border-left: 0;\n  opacity: 0;\n  transform: rotate(45deg) scale3D(0.15, 0.15, 1);\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n  content: \" \";\n}\n.md-checkbox .md-checkbox-container input {\n  position: absolute;\n  left: -999em;\n}\n.md-checkbox .md-checkbox-container .md-ink-ripple {\n  top: -16px;\n  right: -16px;\n  bottom: -16px;\n  left: -16px;\n  border-radius: 50%;\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-checkbox .md-checkbox-container .md-ink-ripple .md-ripple {\n  width: 48px !important;\n  height: 48px !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n}\n.md-checkbox .md-checkbox-label {\n  height: 20px;\n  padding-left: 8px;\n  line-height: 20px;\n}\n.md-checkbox.md-checked .md-checkbox-container:after {\n  opacity: 1;\n  transform: rotate(45deg) scale3D(1, 1, 1);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-chip {\n  height: 32px;\n  padding: 8px 12px;\n  display: inline-block;\n  border-radius: 32px;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  font-size: 13px;\n  line-height: 16px;\n  white-space: nowrap;\n}\n.md-chip.md-deletable {\n  position: relative;\n  padding-right: 32px;\n}\n.md-chip.md-editable .md-chip-container {\n  cursor: pointer;\n}\n.md-chip:focus,\n.md-chip:active {\n  outline: none;\n}\n.md-chip:focus:not(.md-disabled),\n.md-chip:active:not(.md-disabled) {\n  cursor: pointer;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.md-chip.md-disabled .md-button {\n  pointer-events: none;\n  cursor: default;\n}\n.md-chip .md-button.md-delete {\n  width: 24px;\n  min-width: 24px;\n  height: 24px;\n  min-height: 24px;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  top: 4px;\n  right: 4px;\n  border-radius: 24px;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-chip .md-button.md-delete .md-icon {\n  width: 20px;\n  min-width: 20px;\n  height: 20px;\n  min-height: 20px;\n  margin: 0;\n  font-size: 20px;\n}\n.md-chip .md-button.md-delete .md-ink-ripple {\n  border-radius: 32px;\n}\n.md-chip .md-button.md-delete .md-ripple {\n  opacity: .54;\n}\n.md-chips {\n  min-height: 54px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n}\n.md-chips .md-chip {\n  margin-right: 8px;\n  margin-bottom: 4px;\n}\n.md-chips .md-input {\n  width: 128px;\n  -ms-flex: 1;\n  flex: 1;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-dialog-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex-align: center;\n  align-items: center;\n  pointer-events: none;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 108;\n}\n.md-dialog-container.md-active {\n  pointer-events: auto;\n}\n.md-dialog-container.md-active .md-dialog {\n  opacity: 1 !important;\n  transform: scale(1) !important;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-property: opacity, transform;\n}\n.md-dialog-backdrop {\n  position: fixed;\n  z-index: 109;\n}\n.md-dialog {\n  min-width: 280px;\n  max-width: 80%;\n  max-height: 80%;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n  overflow: hidden;\n  position: relative;\n  z-index: 110;\n  outline: none;\n  border-radius: 2px;\n  opacity: 0;\n  box-shadow: 0 7px 9px -4px rgba(0, 0, 0, 0.2), 0 14px 21px 2px rgba(0, 0, 0, 0.14), 0 5px 26px 4px rgba(0, 0, 0, 0.12);\n  transform: scale(0.9, 0.85);\n  transform-origin: center center;\n  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s 0.05s cubic-bezier(0.25, 0.8, 0.25, 1);\n  will-change: opacity, transform;\n}\n.md-dialog.md-reference {\n  transform-origin: top center;\n}\n.md-dialog.md-transition-off {\n  transition: none !important;\n}\n.md-dialog p {\n  margin: 0;\n}\n.md-dialog-title {\n  margin-bottom: 20px;\n  padding: 24px 24px 0;\n}\n.md-dialog-content {\n  padding: 0 24px 24px;\n  -ms-flex: 1;\n  flex: 1;\n  -ms-flex-preferred-size: auto;\n  flex-basis: auto;\n  overflow: auto;\n  position: relative;\n}\n.md-dialog-content:first-child {\n  padding-top: 24px;\n}\n.md-dialog-content p:first-child:not(:only-child) {\n  margin-top: 0;\n}\n.md-dialog-content p:last-child:not(:only-child) {\n  margin-bottom: 0;\n}\n.md-dialog-body {\n  margin: 0 -24px;\n  padding: 0 24px;\n  overflow: auto;\n}\n.md-dialog-actions {\n  min-height: 52px;\n  padding: 8px 8px 8px 24px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  position: relative;\n}\n.md-dialog-actions:before {\n  height: 1px;\n  position: absolute;\n  top: -1px;\n  right: 0;\n  left: 0;\n  content: \" \";\n}\n.md-dialog-actions .md-button {\n  min-width: 64px;\n  margin: 0;\n  padding: 0 8px;\n}\n.md-dialog-actions .md-button + .md-button {\n  margin-left: 8px;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-divider {\n  height: 1px;\n  margin: 0;\n  padding: 0;\n  display: block;\n  border: 0;\n  background-color: rgba(0, 0, 0, 0.12);\n}\n.md-divider.md-inset {\n  margin-left: 72px;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-file {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex: 1;\n  flex: 1;\n}\n.md-file input[type=\"file\"] {\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  position: absolute;\n  clip: rect(0 0 0 0);\n  border: 0;\n}\n.md-file .md-icon {\n  cursor: pointer;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-icon {\n  width: 24px;\n  min-width: 24px;\n  height: 24px;\n  min-height: 24px;\n  font-size: 24px;\n  margin: auto;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n  align-items: center;\n  fill: currentColor;\n  text-rendering: optimizeLegibility;\n  vertical-align: middle;\n}\n.md-icon.md-size-2x {\n  width: 48px;\n  min-width: 48px;\n  height: 48px;\n  min-height: 48px;\n  font-size: 48px;\n}\n.md-icon.md-size-3x {\n  width: 72px;\n  min-width: 72px;\n  height: 72px;\n  min-height: 72px;\n  font-size: 72px;\n}\n.md-icon.md-size-4x {\n  width: 96px;\n  min-width: 96px;\n  height: 96px;\n  min-height: 96px;\n  font-size: 96px;\n}\n.md-icon.md-size-5x {\n  width: 120px;\n  min-width: 120px;\n  height: 120px;\n  min-height: 120px;\n  font-size: 120px;\n}\n.md-icon svg {\n  width: 100%;\n  height: 100%;\n}\nimg.md-icon {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-user-drag: none;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-image {\n  opacity: 0;\n  -webkit-filter: saturate(20%);\n  filter: saturate(20%);\n}\n.md-image.md-black-output {\n  -webkit-filter: brightness(0.4) saturate(20%);\n  filter: brightness(0.4) saturate(20%);\n}\n.md-image.md-loaded {\n  opacity: 1;\n  -webkit-filter: saturate(100%);\n  filter: saturate(100%);\n  transition: opacity 1.1s cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-filter 2.2s 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition: opacity 1.1s cubic-bezier(0.25, 0.8, 0.25, 1), filter 2.2s 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition: opacity 1.1s cubic-bezier(0.25, 0.8, 0.25, 1), filter 2.2s 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), -webkit-filter 2.2s 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-input-container {\n  width: 100%;\n  min-height: 48px;\n  margin: 4px 0 24px;\n  padding-top: 16px;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n}\n.md-input-container:after {\n  height: 1px;\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: rgba(0, 0, 0, 0.12);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  content: \" \";\n}\n.md-input-container label {\n  position: absolute;\n  top: 23px;\n  left: 0;\n  pointer-events: none;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-duration: .3s;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 16px;\n  line-height: 20px;\n}\n.md-input-container input,\n.md-input-container textarea {\n  width: 100%;\n  height: 32px;\n  padding: 0;\n  display: block;\n  -ms-flex: 1;\n  flex: 1;\n  border: none;\n  background: none;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-property: font-size;\n  color: rgba(0, 0, 0, 0.54);\n  font-family: inherit;\n  font-size: 1px;\n  line-height: 32px;\n}\n.md-input-container input:focus,\n.md-input-container textarea:focus {\n  outline: none;\n}\n.md-input-container input::-webkit-input-placeholder,\n.md-input-container textarea::-webkit-input-placeholder {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 16px;\n  text-shadow: none;\n  -webkit-text-fill-color: initial;\n}\n.md-input-container input ~ .md-icon:not(.md-icon-delete),\n.md-input-container textarea ~ .md-icon:not(.md-icon-delete) {\n  margin-left: 12px;\n}\n.md-input-container input ~ .md-icon:not(.md-icon-delete):after,\n.md-input-container textarea ~ .md-icon:not(.md-icon-delete):after {\n  right: 0;\n  left: auto;\n}\n.md-input-container textarea {\n  min-height: 32px;\n  max-height: 230px;\n  padding: 5px 0;\n  resize: none;\n  line-height: 1.3em;\n}\n.md-input-container .md-error,\n.md-input-container .md-count {\n  height: 20px;\n  position: absolute;\n  bottom: -22px;\n  font-size: 12px;\n}\n.md-input-container .md-error {\n  display: block !important;\n  left: 0;\n  opacity: 0;\n  transform: translate3d(0, -8px, 0);\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n}\n.md-input-container .md-count {\n  right: 0;\n}\n.md-input-container .md-icon:not(.md-icon-delete) {\n  margin: 4px auto;\n  color: rgba(0, 0, 0, 0.54);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-input-container .md-icon:not(.md-icon-delete):after {\n  width: 36px;\n  height: 2px;\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  z-index: 2;\n  content: \"\";\n}\n.md-input-container .md-icon:not(.md-icon-delete) ~ label {\n  left: 36px;\n}\n.md-input-container .md-icon:not(.md-icon-delete) ~ .md-input,\n.md-input-container .md-icon:not(.md-icon-delete) ~ .md-textarea,\n.md-input-container .md-icon:not(.md-icon-delete) ~ .md-file {\n  margin-left: 12px;\n}\n.md-input-container .md-autocomplete,\n.md-input-container .md-autocomplete .md-menu,\n.md-input-container .md-autocomplete .md-menu .md-input {\n  width: 100%;\n}\n.md-theme-default.md-input-container .md-autocomplete .md-icon:not(.md-icon-search):after {\n  height: 0;\n}\n.md-input-container.md-input-placeholder label {\n  pointer-events: auto;\n  top: 10px;\n  opacity: 0;\n  font-size: 12px;\n}\n.md-input-container.md-input-placeholder input,\n.md-input-container.md-input-placeholder textarea {\n  font-size: 16px;\n}\n.md-input-container.md-input-focused label,\n.md-input-container.md-has-value label {\n  pointer-events: auto;\n  top: 0;\n  opacity: 1;\n  font-size: 12px;\n}\n.md-input-container.md-input-focused input,\n.md-input-container.md-input-focused textarea,\n.md-input-container.md-has-value input,\n.md-input-container.md-has-value textarea {\n  font-size: 16px;\n}\n.md-input-container.md-has-value input,\n.md-input-container.md-has-value textarea {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-input-container.md-input-inline label {\n  pointer-events: none;\n}\n.md-input-container.md-input-inline.md-input-focused label {\n  top: 23px;\n  font-size: 16px;\n}\n.md-input-container.md-input-inline.md-has-value label {\n  opacity: 0;\n}\n.md-input-container.md-input-disabled:after {\n  background: bottom left repeat-x;\n  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0.38) 33%, transparent 0%);\n  background-size: 4px 1px;\n}\n.md-input-container.md-input-disabled label,\n.md-input-container.md-input-disabled input,\n.md-input-container.md-input-disabled textarea {\n  color: rgba(0, 0, 0, 0.38);\n}\n.md-input-container.md-has-password.md-input-focused .md-toggle-password {\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-input-container.md-has-password .md-toggle-password {\n  margin: 0;\n  position: absolute;\n  right: 0;\n  bottom: -2px;\n  color: rgba(0, 0, 0, 0.38);\n}\n.md-input-container.md-has-password .md-toggle-password .md-ink-ripple {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-input-container.md-clearable.md-input-focused .md-clear-input {\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-input-container.md-clearable .md-clear-input {\n  margin: 0;\n  position: absolute;\n  right: 0;\n  bottom: -2px;\n  color: rgba(0, 0, 0, 0.38);\n}\n.md-input-container.md-clearable .md-clear-input .md-ink-ripple {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-input-container.md-input-invalid .md-error {\n  opacity: 1;\n  transform: translate3d(0, 0, 0);\n}\n.md-input-container.md-input-required label:after {\n  position: absolute;\n  top: 2px;\n  right: 0;\n  transform: translateX(calc(100% + 2px));\n  content: \"*\";\n  font-size: 12px;\n  line-height: 1em;\n  vertical-align: top;\n}\n.md-input-container.md-has-select:hover .md-select:not(.md-disabled):after {\n  color: rgba(0, 0, 0, 0.87);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n/* Image aspect ratio calculator */\n/* Responsive breakpoints */\n/* Rows and Columns */\n.md-layout {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  -ms-flex: 1;\n  flex: 1;\n}\n.md-row {\n  -ms-flex-direction: row;\n  flex-direction: row;\n}\n.md-column {\n  -ms-flex-direction: column;\n  flex-direction: column;\n}\n/* Container */\n.md-layout.md-container {\n  width: 100%;\n  max-width: 1200px;\n}\n.md-layout.md-container.md-centered {\n  margin: 0 auto;\n}\n/* Alignments */\n.md-align-start {\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n}\n.md-align-center {\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n.md-align-end {\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n}\n/* Vertical Alignments */\n.md-vertical-align-start {\n  -ms-flex-align: start;\n  align-items: flex-start;\n  -ms-flex-line-pack: start;\n  align-content: flex-start;\n}\n.md-vertical-align-center {\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-line-pack: center;\n  align-content: center;\n}\n.md-vertical-align-end {\n  -ms-flex-align: end;\n  align-items: flex-end;\n  -ms-flex-line-pack: end;\n  align-content: flex-end;\n}\n.md-vertical-align-stretch {\n  -ms-flex-align: stretch;\n  align-items: stretch;\n  -ms-flex-line-pack: stretch;\n  align-content: stretch;\n}\n/* Gutter Size */\n.md-gutter:not(.md-column) {\n  margin-right: -12px;\n  margin-left: -12px;\n}\n.md-gutter:not(.md-column) > .md-layout {\n  padding-right: 12px;\n  padding-left: 12px;\n}\n.md-gutter .md-column {\n  margin-top: -12px;\n  margin-bottom: -12px;\n}\n.md-gutter .md-column > .md-layout {\n  padding-top: 12px;\n  padding-bottom: 12px;\n}\n.md-gutter-8:not(.md-column) {\n  margin-right: -4px;\n  margin-left: -4px;\n}\n.md-gutter-8:not(.md-column) > .md-layout {\n  padding-right: 4px;\n  padding-left: 4px;\n}\n.md-gutter-8 .md-column {\n  margin-top: -4px;\n  margin-bottom: -4px;\n}\n.md-gutter-8 .md-column > .md-layout {\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\n.md-gutter-16:not(.md-column) {\n  margin-right: -8px;\n  margin-left: -8px;\n}\n.md-gutter-16:not(.md-column) > .md-layout {\n  padding-right: 8px;\n  padding-left: 8px;\n}\n.md-gutter-16 .md-column {\n  margin-top: -8px;\n  margin-bottom: -8px;\n}\n.md-gutter-16 .md-column > .md-layout {\n  padding-top: 8px;\n  padding-bottom: 8px;\n}\n.md-gutter-24:not(.md-column) {\n  margin-right: -12px;\n  margin-left: -12px;\n}\n.md-gutter-24:not(.md-column) > .md-layout {\n  padding-right: 12px;\n  padding-left: 12px;\n}\n.md-gutter-24 .md-column {\n  margin-top: -12px;\n  margin-bottom: -12px;\n}\n.md-gutter-24 .md-column > .md-layout {\n  padding-top: 12px;\n  padding-bottom: 12px;\n}\n.md-gutter-40:not(.md-column) {\n  margin-right: -20px;\n  margin-left: -20px;\n}\n.md-gutter-40:not(.md-column) > .md-layout {\n  padding-right: 20px;\n  padding-left: 20px;\n}\n.md-gutter-40 .md-column {\n  margin-top: -20px;\n  margin-bottom: -20px;\n}\n.md-gutter-40 .md-column > .md-layout {\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n/* Flex Size */\n.md-flex {\n  -ms-flex: 1 1;\n  flex: 1 1;\n}\n.md-flex-33 {\n  min-width: 33.33333%;\n  -ms-flex: 0 1 33.33333%;\n  flex: 0 1 33.33333%;\n}\n.md-flex-66 {\n  min-width: 33.33333%;\n  -ms-flex: 0 1 66.66666%;\n  flex: 0 1 66.66666%;\n}\n.md-flex-offset-33 {\n  margin-left: 33.33333%;\n}\n.md-flex-offset-66 {\n  margin-left: 66.66666%;\n}\n.md-flex-5 {\n  min-width: 5%;\n  -ms-flex: 0 1 5%;\n  flex: 0 1 5%;\n}\n.md-flex-offset-5 {\n  margin-left: 5%;\n}\n.md-flex-10 {\n  min-width: 10%;\n  -ms-flex: 0 1 10%;\n  flex: 0 1 10%;\n}\n.md-flex-offset-10 {\n  margin-left: 10%;\n}\n.md-flex-15 {\n  min-width: 15%;\n  -ms-flex: 0 1 15%;\n  flex: 0 1 15%;\n}\n.md-flex-offset-15 {\n  margin-left: 15%;\n}\n.md-flex-20 {\n  min-width: 20%;\n  -ms-flex: 0 1 20%;\n  flex: 0 1 20%;\n}\n.md-flex-offset-20 {\n  margin-left: 20%;\n}\n.md-flex-25 {\n  min-width: 25%;\n  -ms-flex: 0 1 25%;\n  flex: 0 1 25%;\n}\n.md-flex-offset-25 {\n  margin-left: 25%;\n}\n.md-flex-30 {\n  min-width: 30%;\n  -ms-flex: 0 1 30%;\n  flex: 0 1 30%;\n}\n.md-flex-offset-30 {\n  margin-left: 30%;\n}\n.md-flex-35 {\n  min-width: 35%;\n  -ms-flex: 0 1 35%;\n  flex: 0 1 35%;\n}\n.md-flex-offset-35 {\n  margin-left: 35%;\n}\n.md-flex-40 {\n  min-width: 40%;\n  -ms-flex: 0 1 40%;\n  flex: 0 1 40%;\n}\n.md-flex-offset-40 {\n  margin-left: 40%;\n}\n.md-flex-45 {\n  min-width: 45%;\n  -ms-flex: 0 1 45%;\n  flex: 0 1 45%;\n}\n.md-flex-offset-45 {\n  margin-left: 45%;\n}\n.md-flex-50 {\n  min-width: 50%;\n  -ms-flex: 0 1 50%;\n  flex: 0 1 50%;\n}\n.md-flex-offset-50 {\n  margin-left: 50%;\n}\n.md-flex-55 {\n  min-width: 55%;\n  -ms-flex: 0 1 55%;\n  flex: 0 1 55%;\n}\n.md-flex-offset-55 {\n  margin-left: 55%;\n}\n.md-flex-60 {\n  min-width: 60%;\n  -ms-flex: 0 1 60%;\n  flex: 0 1 60%;\n}\n.md-flex-offset-60 {\n  margin-left: 60%;\n}\n.md-flex-65 {\n  min-width: 65%;\n  -ms-flex: 0 1 65%;\n  flex: 0 1 65%;\n}\n.md-flex-offset-65 {\n  margin-left: 65%;\n}\n.md-flex-70 {\n  min-width: 70%;\n  -ms-flex: 0 1 70%;\n  flex: 0 1 70%;\n}\n.md-flex-offset-70 {\n  margin-left: 70%;\n}\n.md-flex-75 {\n  min-width: 75%;\n  -ms-flex: 0 1 75%;\n  flex: 0 1 75%;\n}\n.md-flex-offset-75 {\n  margin-left: 75%;\n}\n.md-flex-80 {\n  min-width: 80%;\n  -ms-flex: 0 1 80%;\n  flex: 0 1 80%;\n}\n.md-flex-offset-80 {\n  margin-left: 80%;\n}\n.md-flex-85 {\n  min-width: 85%;\n  -ms-flex: 0 1 85%;\n  flex: 0 1 85%;\n}\n.md-flex-offset-85 {\n  margin-left: 85%;\n}\n.md-flex-90 {\n  min-width: 90%;\n  -ms-flex: 0 1 90%;\n  flex: 0 1 90%;\n}\n.md-flex-offset-90 {\n  margin-left: 90%;\n}\n.md-flex-95 {\n  min-width: 95%;\n  -ms-flex: 0 1 95%;\n  flex: 0 1 95%;\n}\n.md-flex-offset-95 {\n  margin-left: 95%;\n}\n.md-flex-100 {\n  min-width: 100%;\n  -ms-flex: 0 1 100%;\n  flex: 0 1 100%;\n}\n.md-flex-offset-100 {\n  margin-left: 100%;\n}\n/* Responsive Breakpoints */\n@media (max-width: 944px) {\n  .md-gutter:not(.md-column) {\n    margin-right: -8px;\n    margin-left: -8px;\n  }\n\n  .md-gutter:not(.md-column) > .md-layout {\n    padding-right: 8px;\n    padding-left: 8px;\n  }\n\n  .md-gutter .md-column {\n    margin-top: -8px;\n    margin-bottom: -8px;\n  }\n\n  .md-gutter .md-column > .md-layout {\n    padding-top: 8px;\n    padding-bottom: 8px;\n  }\n\n  .md-row-small {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-small {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-small {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-small-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-small-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-small-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-small-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-small-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-small-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-small-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-small-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-small-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-small-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-small-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-small-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-small-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-small-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-small-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-small-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-small-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-small-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-small-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-small-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-small-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-small-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-small-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-small-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-small-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-small-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-small-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-small-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-small-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-small-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-small-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-small-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-small-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-small-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-small-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-small-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-small-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-small-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-small-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-small-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-small-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-small-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-small-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-small-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-small-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-small-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-small-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-small {\n    display: none;\n  }\n}\n@media (min-width: 1904px) {\n  .md-row-xlarge {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-xlarge {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-xlarge {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-xlarge-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-xlarge-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-xlarge-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-xlarge-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-xlarge-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-xlarge-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-xlarge-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-xlarge-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-xlarge-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-xlarge-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-xlarge-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-xlarge-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-xlarge-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-xlarge-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-xlarge-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-xlarge-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-xlarge-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-xlarge-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-xlarge-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-xlarge-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-xlarge-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-xlarge-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-xlarge-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-xlarge-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-xlarge-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-xlarge-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-xlarge-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-xlarge-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-xlarge-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-xlarge-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-xlarge-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-xlarge-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-xlarge-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-xlarge-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-xlarge-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-xlarge-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-xlarge-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-xlarge-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-xlarge-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-xlarge-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-xlarge-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-xlarge-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-xlarge-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-xlarge-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-xlarge-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-xlarge-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-xlarge-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-xlarge {\n    display: none;\n  }\n}\n@media (max-width: 1903px) {\n  .md-row-large {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-large {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-large {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-large-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-large-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-large-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-large-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-large-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-large-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-large-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-large-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-large-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-large-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-large-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-large-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-large-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-large-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-large-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-large-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-large-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-large-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-large-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-large-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-large-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-large-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-large-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-large-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-large-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-large-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-large-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-large-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-large-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-large-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-large-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-large-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-large-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-large-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-large-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-large-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-large-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-large-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-large-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-large-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-large-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-large-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-large-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-large-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-large-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-large-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-large-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-large {\n    display: none;\n  }\n}\n@media (max-width: 1264px) {\n  .md-row-medium {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-medium {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-medium {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-medium-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-medium-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-medium-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-medium-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-medium-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-medium-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-medium-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-medium-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-medium-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-medium-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-medium-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-medium-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-medium-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-medium-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-medium-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-medium-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-medium-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-medium-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-medium-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-medium-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-medium-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-medium-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-medium-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-medium-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-medium-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-medium-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-medium-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-medium-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-medium-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-medium-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-medium-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-medium-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-medium-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-medium-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-medium-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-medium-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-medium-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-medium-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-medium-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-medium-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-medium-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-medium-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-medium-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-medium-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-medium-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-medium-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-medium-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-medium {\n    display: none;\n  }\n}\n@media (max-width: 600px) {\n  .md-row-xsmall {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-xsmall {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-xsmall {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-xsmall-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-xsmall-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-xsmall-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-xsmall-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-xsmall-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-xsmall-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-xsmall-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-xsmall-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-xsmall-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-xsmall-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-xsmall-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-xsmall-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-xsmall-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-xsmall-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-xsmall-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-xsmall-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-xsmall-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-xsmall-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-xsmall-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-xsmall-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-xsmall-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-xsmall-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-xsmall-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-xsmall-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-xsmall-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-xsmall-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-xsmall-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-xsmall-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-xsmall-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-xsmall-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-xsmall-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-xsmall-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-xsmall-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-xsmall-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-xsmall-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-xsmall-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-xsmall-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-xsmall-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-xsmall-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-xsmall-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-xsmall-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-xsmall-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-xsmall-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-xsmall-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-xsmall-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-xsmall-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-xsmall-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-xsmall {\n    display: none;\n  }\n}\n@media (min-width: 1264px) {\n  .md-row-large-and-up {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-large-and-up {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-large-and-up {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-large-and-up-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-large-and-up-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-large-and-up-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-large-and-up-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-large-and-up-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-large-and-up-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-large-and-up-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-large-and-up-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-large-and-up-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-large-and-up-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-large-and-up-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-large-and-up-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-large-and-up-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-large-and-up-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-large-and-up-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-large-and-up-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-large-and-up-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-large-and-up-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-large-and-up-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-large-and-up-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-large-and-up-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-large-and-up-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-large-and-up-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-large-and-up-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-large-and-up-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-large-and-up-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-large-and-up-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-large-and-up-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-large-and-up-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-large-and-up-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-large-and-up-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-large-and-up-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-large-and-up-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-large-and-up-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-large-and-up-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-large-and-up-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-large-and-up-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-large-and-up-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-large-and-up-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-large-and-up-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-large-and-up-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-large-and-up-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-large-and-up-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-large-and-up-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-large-and-up-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-large-and-up-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-large-and-up-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-large-and-up {\n    display: none;\n  }\n}\n@media (min-width: 944px) {\n  .md-row-medium-and-up {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-medium-and-up {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-medium-and-up {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-medium-and-up-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-medium-and-up-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-medium-and-up-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-medium-and-up-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-medium-and-up-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-medium-and-up-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-medium-and-up-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-medium-and-up-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-medium-and-up-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-medium-and-up-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-medium-and-up-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-medium-and-up-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-medium-and-up-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-medium-and-up-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-medium-and-up-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-medium-and-up-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-medium-and-up-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-medium-and-up-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-medium-and-up-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-medium-and-up-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-medium-and-up-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-medium-and-up-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-medium-and-up-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-medium-and-up-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-medium-and-up-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-medium-and-up-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-medium-and-up-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-medium-and-up-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-medium-and-up-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-medium-and-up-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-medium-and-up-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-medium-and-up-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-medium-and-up-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-medium-and-up-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-medium-and-up-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-medium-and-up-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-medium-and-up-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-medium-and-up-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-medium-and-up-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-medium-and-up-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-medium-and-up-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-medium-and-up-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-medium-and-up-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-medium-and-up-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-medium-and-up-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-medium-and-up-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-medium-and-up-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-medium-and-up {\n    display: none;\n  }\n}\n@media (min-width: 660px) {\n  .md-row-small-and-up {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-small-and-up {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-small-and-up {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-small-and-up-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-small-and-up-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-small-and-up-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-small-and-up-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-small-and-up-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-small-and-up-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-small-and-up-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-small-and-up-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-small-and-up-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-small-and-up-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-small-and-up-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-small-and-up-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-small-and-up-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-small-and-up-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-small-and-up-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-small-and-up-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-small-and-up-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-small-and-up-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-small-and-up-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-small-and-up-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-small-and-up-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-small-and-up-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-small-and-up-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-small-and-up-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-small-and-up-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-small-and-up-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-small-and-up-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-small-and-up-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-small-and-up-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-small-and-up-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-small-and-up-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-small-and-up-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-small-and-up-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-small-and-up-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-small-and-up-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-small-and-up-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-small-and-up-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-small-and-up-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-small-and-up-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-small-and-up-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-small-and-up-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-small-and-up-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-small-and-up-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-small-and-up-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-small-and-up-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-small-and-up-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-small-and-up-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-small-and-up {\n    display: none;\n  }\n}\n@media (min-width: 300px) {\n  .md-row-xsmall-and-up {\n    -ms-flex-direction: row;\n    flex-direction: row;\n  }\n\n  .md-column-xsmall-and-up {\n    -ms-flex-direction: column;\n    flex-direction: column;\n  }\n\n  .md-flex-xsmall-and-up {\n    -ms-flex: 1 1;\n    flex: 1 1;\n  }\n\n  .md-flex-xsmall-and-up-33 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 33.33333%;\n    flex: 0 1 33.33333%;\n  }\n\n  .md-flex-xsmall-and-up-66 {\n    min-width: 33.33333%;\n    -ms-flex: 0 1 66.66666%;\n    flex: 0 1 66.66666%;\n  }\n\n  .md-flex-offset-xsmall-and-up-33 {\n    margin-left: 33.33333%;\n  }\n\n  .md-flex-offset-xsmall-and-up-66 {\n    margin-left: 66.66666%;\n  }\n\n  .md-flex-xsmall-and-up-5 {\n    min-width: 5%;\n    -ms-flex: 0 1 5%;\n    flex: 0 1 5%;\n  }\n\n  .md-flex-offset-xsmall-and-up-5 {\n    margin-left: 5%;\n  }\n\n  .md-flex-xsmall-and-up-10 {\n    min-width: 10%;\n    -ms-flex: 0 1 10%;\n    flex: 0 1 10%;\n  }\n\n  .md-flex-offset-xsmall-and-up-10 {\n    margin-left: 10%;\n  }\n\n  .md-flex-xsmall-and-up-15 {\n    min-width: 15%;\n    -ms-flex: 0 1 15%;\n    flex: 0 1 15%;\n  }\n\n  .md-flex-offset-xsmall-and-up-15 {\n    margin-left: 15%;\n  }\n\n  .md-flex-xsmall-and-up-20 {\n    min-width: 20%;\n    -ms-flex: 0 1 20%;\n    flex: 0 1 20%;\n  }\n\n  .md-flex-offset-xsmall-and-up-20 {\n    margin-left: 20%;\n  }\n\n  .md-flex-xsmall-and-up-25 {\n    min-width: 25%;\n    -ms-flex: 0 1 25%;\n    flex: 0 1 25%;\n  }\n\n  .md-flex-offset-xsmall-and-up-25 {\n    margin-left: 25%;\n  }\n\n  .md-flex-xsmall-and-up-30 {\n    min-width: 30%;\n    -ms-flex: 0 1 30%;\n    flex: 0 1 30%;\n  }\n\n  .md-flex-offset-xsmall-and-up-30 {\n    margin-left: 30%;\n  }\n\n  .md-flex-xsmall-and-up-35 {\n    min-width: 35%;\n    -ms-flex: 0 1 35%;\n    flex: 0 1 35%;\n  }\n\n  .md-flex-offset-xsmall-and-up-35 {\n    margin-left: 35%;\n  }\n\n  .md-flex-xsmall-and-up-40 {\n    min-width: 40%;\n    -ms-flex: 0 1 40%;\n    flex: 0 1 40%;\n  }\n\n  .md-flex-offset-xsmall-and-up-40 {\n    margin-left: 40%;\n  }\n\n  .md-flex-xsmall-and-up-45 {\n    min-width: 45%;\n    -ms-flex: 0 1 45%;\n    flex: 0 1 45%;\n  }\n\n  .md-flex-offset-xsmall-and-up-45 {\n    margin-left: 45%;\n  }\n\n  .md-flex-xsmall-and-up-50 {\n    min-width: 50%;\n    -ms-flex: 0 1 50%;\n    flex: 0 1 50%;\n  }\n\n  .md-flex-offset-xsmall-and-up-50 {\n    margin-left: 50%;\n  }\n\n  .md-flex-xsmall-and-up-55 {\n    min-width: 55%;\n    -ms-flex: 0 1 55%;\n    flex: 0 1 55%;\n  }\n\n  .md-flex-offset-xsmall-and-up-55 {\n    margin-left: 55%;\n  }\n\n  .md-flex-xsmall-and-up-60 {\n    min-width: 60%;\n    -ms-flex: 0 1 60%;\n    flex: 0 1 60%;\n  }\n\n  .md-flex-offset-xsmall-and-up-60 {\n    margin-left: 60%;\n  }\n\n  .md-flex-xsmall-and-up-65 {\n    min-width: 65%;\n    -ms-flex: 0 1 65%;\n    flex: 0 1 65%;\n  }\n\n  .md-flex-offset-xsmall-and-up-65 {\n    margin-left: 65%;\n  }\n\n  .md-flex-xsmall-and-up-70 {\n    min-width: 70%;\n    -ms-flex: 0 1 70%;\n    flex: 0 1 70%;\n  }\n\n  .md-flex-offset-xsmall-and-up-70 {\n    margin-left: 70%;\n  }\n\n  .md-flex-xsmall-and-up-75 {\n    min-width: 75%;\n    -ms-flex: 0 1 75%;\n    flex: 0 1 75%;\n  }\n\n  .md-flex-offset-xsmall-and-up-75 {\n    margin-left: 75%;\n  }\n\n  .md-flex-xsmall-and-up-80 {\n    min-width: 80%;\n    -ms-flex: 0 1 80%;\n    flex: 0 1 80%;\n  }\n\n  .md-flex-offset-xsmall-and-up-80 {\n    margin-left: 80%;\n  }\n\n  .md-flex-xsmall-and-up-85 {\n    min-width: 85%;\n    -ms-flex: 0 1 85%;\n    flex: 0 1 85%;\n  }\n\n  .md-flex-offset-xsmall-and-up-85 {\n    margin-left: 85%;\n  }\n\n  .md-flex-xsmall-and-up-90 {\n    min-width: 90%;\n    -ms-flex: 0 1 90%;\n    flex: 0 1 90%;\n  }\n\n  .md-flex-offset-xsmall-and-up-90 {\n    margin-left: 90%;\n  }\n\n  .md-flex-xsmall-and-up-95 {\n    min-width: 95%;\n    -ms-flex: 0 1 95%;\n    flex: 0 1 95%;\n  }\n\n  .md-flex-offset-xsmall-and-up-95 {\n    margin-left: 95%;\n  }\n\n  .md-flex-xsmall-and-up-100 {\n    min-width: 100%;\n    -ms-flex: 0 1 100%;\n    flex: 0 1 100%;\n  }\n\n  .md-flex-offset-xsmall-and-up-100 {\n    margin-left: 100%;\n  }\n\n  .md-align-xsmall-and-up-start {\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n  }\n\n  .md-align-xsmall-and-up-center {\n    -ms-flex-pack: center;\n    justify-content: center;\n  }\n\n  .md-align-xsmall-and-up-end {\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n  }\n\n  .md-hide-xsmall-and-up {\n    display: none;\n  }\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-list {\n  margin: 0;\n  padding: 8px 0;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column nowrap;\n  flex-flow: column nowrap;\n  position: relative;\n  list-style: none;\n}\n.md-list.md-dense {\n  padding: 4px 0;\n}\n.md-list.md-dense .md-list-item.md-inset .md-list-item-container {\n  padding-left: 72px;\n}\n.md-list.md-dense .md-list-item .md-list-item-container {\n  min-height: 40px;\n  font-size: 13px;\n}\n.md-list.md-dense .md-list-item .md-list-item-container .md-avatar:first-child,\n.md-list.md-dense .md-list-item .md-list-item-container .md-list-action:first-child {\n  margin-right: 24px;\n}\n.md-list.md-dense .md-avatar {\n  width: 32px;\n  min-width: 32px;\n  height: 32px;\n  min-height: 32px;\n}\n.md-list.md-dense .md-list-item-expand {\n  min-height: 40px;\n}\n.md-list.md-double-line.md-dense .md-list-item .md-list-item-container {\n  min-height: 60px;\n}\n.md-list.md-double-line.md-dense .md-list-item .md-avatar {\n  width: 36px;\n  min-width: 36px;\n  height: 36px;\n  min-height: 36px;\n}\n.md-list.md-double-line.md-dense .md-list-item .md-avatar .md-avatar:first-child,\n.md-list.md-double-line.md-dense .md-list-item .md-avatar .md-list-action:first-child {\n  margin-right: 20px;\n}\n.md-list.md-double-line.md-dense .md-list-text-container > :nth-child(1) {\n  font-size: 13px;\n}\n.md-list.md-double-line.md-dense .md-list-text-container > :nth-child(2) {\n  font-size: 13px;\n}\n.md-list.md-double-line .md-list-item .md-list-item-container {\n  min-height: 72px;\n}\n.md-list.md-triple-line.md-dense .md-list-item .md-list-item-container {\n  min-height: 76px;\n}\n.md-list.md-triple-line.md-dense .md-list-item .md-avatar {\n  width: 36px;\n  min-width: 36px;\n  height: 36px;\n  min-height: 36px;\n}\n.md-list.md-triple-line.md-dense .md-list-item .md-avatar .md-avatar:first-child,\n.md-list.md-triple-line.md-dense .md-list-item .md-avatar .md-list-action:first-child {\n  margin-right: 20px;\n}\n.md-list.md-triple-line.md-dense .md-list-text-container > :nth-child(1) {\n  font-size: 13px;\n}\n.md-list.md-triple-line.md-dense .md-list-text-container > :nth-child(2) {\n  font-size: 13px;\n}\n.md-list.md-triple-line .md-list-item .md-list-item-container {\n  min-height: 88px;\n}\n.md-list.md-triple-line .md-avatar {\n  margin: 0;\n}\n.md-list .md-subheader.md-inset {\n  padding-left: 72px;\n}\n.md-list > .md-subheader:first-of-type {\n  margin-top: -8px;\n}\n.md-list-item {\n  height: auto;\n  position: relative;\n  z-index: 2;\n}\n.md-list-item.md-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.md-list-item.md-inset .md-list-item-container {\n  padding-left: 72px;\n}\n.md-list-item .md-button-ghost {\n  width: 100%;\n  margin: 0;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n  border-radius: 0;\n}\n.md-list-item .md-button:not(.md-button-ghost):not(.md-list-item-container) {\n  position: relative;\n  z-index: 2;\n}\n.md-list-item .md-button:not(.md-button-ghost):not(.md-list-item-container) .md-icon {\n  position: relative;\n}\n.md-list-item .md-list-item-container {\n  min-height: 48px;\n  margin: 0;\n  padding: 0 16px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: row nowrap;\n  flex-flow: row nowrap;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  -ms-flex: 1;\n  flex: 1;\n  position: relative;\n  font-size: 16px;\n  font-weight: 400;\n  text-align: left;\n  text-transform: none;\n}\n.md-list-item .md-list-item-container:hover {\n  text-decoration: none;\n}\n.md-list-item .md-list-item-container > .md-icon:first-child {\n  margin-right: 32px;\n}\n.md-list-item .md-list-item-container .md-avatar:first-child,\n.md-list-item .md-list-item-container .md-list-action:first-child {\n  margin-right: 16px;\n}\n.md-list-item .md-list-item-container .md-list-action {\n  margin: 0 -10px 0 0;\n}\n.md-list-item .md-list-item-container .md-list-action:nth-child(3) {\n  margin: 0 -10px 0 16px;\n}\n.md-list-item .md-divider {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  left: 0;\n}\n.md-list-item .md-icon,\n.md-list-item .md-avatar,\n.md-list-item .md-list-action:first-child {\n  margin: 0;\n}\n.md-list-item .md-icon:first-of-type + *,\n.md-list-item .md-avatar:first-of-type + *,\n.md-list-item .md-list-action:first-child:first-of-type + * {\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n}\n.md-list-item .md-avatar {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n.md-list-item .md-icon {\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-list-item .md-ink-ripple {\n  border-radius: 0;\n}\n.md-list-item-expand {\n  min-height: 48px;\n  -ms-flex-flow: column wrap;\n  flex-flow: column wrap;\n  overflow: hidden;\n  transform: translate3D(0, 0, 0);\n}\n.md-list-item-expand:before,\n.md-list-item-expand:after {\n  height: 1px;\n  position: absolute;\n  right: 0;\n  left: 0;\n  z-index: 3;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  content: \" \";\n}\n.md-list-item-expand:before {\n  top: 0;\n}\n.md-list-item-expand:after {\n  bottom: 0;\n}\n.md-list-item-expand.md-active {\n  position: relative;\n}\n.md-list-item-expand.md-active:before,\n.md-list-item-expand.md-active:after {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n.md-list-item-expand.md-active:first-of-type:before {\n  background: none;\n}\n.md-list-item-expand.md-active:last-of-type:after {\n  background: none;\n}\n.md-list-item-expand.md-active.md-active + .md-active:before {\n  background: none;\n}\n.md-list-item-expand.md-active > .md-list-item-container .md-list-expand-indicator {\n  transform: rotateZ(180deg) translate3D(0, 0, 0);\n}\n.md-list-item-expand.md-active > .md-list-expand {\n  margin-bottom: 0 !important;\n}\n.md-list-item-expand .md-expansion-indicator,\n.md-list-item-expand .md-list-item-container,\n.md-list-item-expand .md-icon {\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-list-item-expand .md-list-expand {\n  position: relative;\n  z-index: 1;\n  transform: translate3D(0, 0, 0);\n  will-change: margin-bottom;\n  transition: all 0.5s cubic-bezier(0.35, 0, 0.25, 1);\n}\n.md-list-item-expand .md-list-expand.md-transition-off {\n  transition: none !important;\n}\n.md-list-item-expand .md-list-expand .md-list {\n  padding: 0;\n}\n.md-list-text-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column nowrap;\n  flex-flow: column nowrap;\n  -ms-flex: 1;\n  flex: 1;\n  overflow: hidden;\n  line-height: 1.25em;\n  white-space: normal;\n}\n.md-list-text-container > * {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.md-list-text-container > :nth-child(1) {\n  font-size: 16px;\n}\n.md-list-text-container > :nth-child(2),\n.md-list-text-container > :nth-child(3) {\n  margin: 0;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 14px;\n}\n.md-list-text-container > :nth-child(2):not(:last-child) {\n  color: rgba(0, 0, 0, 0.87);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-menu {\n  display: inline-block;\n}\n.md-menu-content {\n  width: 168px;\n  min-width: 84px;\n  max-width: 392px;\n  min-height: 64px;\n  max-height: calc(100vh - 32px);\n  overflow-x: hidden;\n  overflow-y: auto;\n  position: absolute;\n  z-index: 131;\n  transform: scale(0.9, 0.85) translateZ(0);\n  border-radius: 2px;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  opacity: 0;\n  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s cubic-bezier(0.55, 0, 0.55, 0.2), margin 0.3s cubic-bezier(0.55, 0, 0.55, 0.2), transform 0s 0.4s cubic-bezier(0.55, 0, 0.55, 0.2);\n  will-change: transform, opacity, width;\n}\n.md-menu-content.md-direction-bottom-right {\n  margin-top: -20px;\n  margin-left: -8px;\n  transform-origin: top left;\n}\n.md-menu-content.md-direction-bottom-right.md-active {\n  margin-top: -11px;\n}\n.md-menu-content.md-direction-bottom-left {\n  margin-top: -20px;\n  margin-left: 8px;\n  transform-origin: top right;\n}\n.md-menu-content.md-direction-bottom-left.md-active {\n  margin-top: -11px;\n}\n.md-menu-content.md-direction-top-right {\n  margin-top: 20px;\n  margin-left: -8px;\n  transform-origin: bottom left;\n}\n.md-menu-content.md-direction-top-right.md-active {\n  margin-top: 11px;\n}\n.md-menu-content.md-direction-top-left {\n  margin-top: 20px;\n  margin-left: 8px;\n  transform-origin: bottom right;\n}\n.md-menu-content.md-direction-top-left.md-active {\n  margin-top: 11px;\n}\n.md-menu-content.md-align-trigger {\n  margin: 0;\n}\n.md-menu-content.md-size-1 {\n  width: 84px;\n}\n.md-menu-content.md-size-2 {\n  width: 112px;\n}\n.md-menu-content.md-size-3 {\n  width: 168px;\n}\n.md-menu-content.md-size-4 {\n  width: 224px;\n}\n.md-menu-content.md-size-5 {\n  width: 280px;\n}\n.md-menu-content.md-size-6 {\n  width: 336px;\n}\n.md-menu-content.md-size-7 {\n  width: 392px;\n}\n.md-menu-content.md-active {\n  pointer-events: auto;\n  opacity: 1;\n  transform: scale(1) translateZ(0);\n  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-menu-content.md-active .md-list {\n  opacity: 1;\n  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-menu-content .md-list {\n  opacity: 0;\n  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-menu-item {\n  cursor: pointer;\n  font-size: 16px;\n  line-height: 1.2em;\n}\n.md-menu-item[disabled] {\n  cursor: default;\n}\n.md-menu-item .md-list-item-holder {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.md-menu-backdrop {\n  z-index: 130;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-boards {\n  width: 100%;\n  height: 100% !important;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n  position: relative;\n}\n.md-boards.md-transition-off * {\n  transition: none !important;\n}\n.md-boards.md-dynamic-height .md-boards-content {\n  transition: height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-boards .md-boards-navigation {\n  bottom: 0;\n  width: 100%;\n  height: 48px;\n  min-height: 48px;\n  position: relative;\n  z-index: 1;\n  display: -ms-flexbox;\n  display: flex;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n.md-boards .md-board-header {\n  min-width: 24px;\n  max-width: 24px;\n  margin: 0;\n  padding: 0 12px;\n  display: inline-block;\n  position: relative;\n  cursor: pointer;\n  border: 0;\n  background: none;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  font-family: inherit;\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n}\n.md-boards .md-board-header.md-disabled {\n  cursor: default;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-user-drag: none;\n}\n.md-boards .md-board-header-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n.md-boards .md-board-header-container .md-icon {\n  margin: 0;\n}\n.md-boards .md-board-header-container .md-icon:not(.md-control) {\n  width: 16px;\n  min-width: 16px;\n  height: 16px;\n  min-height: 16px;\n  font-size: 16px;\n}\n.md-boards .md-boards-content {\n  width: 100%;\n  position: relative;\n  overflow: hidden;\n}\n.md-boards .md-boards-wrapper {\n  width: 9999em;\n  height: 100% !important;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: translate3d(0, 0, 0);\n  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-boards .md-board {\n  padding: 16px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-progress {\n  width: 100%;\n  height: 4px;\n  position: relative;\n  overflow: hidden;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-progress.md-indeterminate .md-progress-track {\n  right: 0;\n}\n.md-progress.md-indeterminate .md-progress-track:before,\n.md-progress.md-indeterminate .md-progress-track:after {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  will-change: left, right;\n  content: '';\n}\n.md-progress.md-indeterminate .md-progress-track:before {\n  animation: progress-indeterminate 2.3s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n.md-progress.md-indeterminate .md-progress-track:after {\n  animation: progress-indeterminate-short 2.3s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  animation-delay: 1.15s;\n}\n.md-progress.md-progress-enter,\n.md-progress.md-progress-leave-active {\n  opacity: 0;\n  transform: scaleY(0) translateZ(0);\n}\n.md-progress.md-progress-enter-active {\n  transform: scaleY(1) translateZ(0);\n}\n.md-progress-track {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n@keyframes progress-indeterminate {\n  0% {\n    right: 100%;\n    left: -35%;\n  }\n\n  60% {\n    right: -100%;\n    left: 100%;\n  }\n\n  100% {\n    right: -100%;\n    left: 100%;\n  }\n}\n@keyframes progress-indeterminate-short {\n  0% {\n    right: 100%;\n    left: -200%;\n  }\n\n  60% {\n    right: -8%;\n    left: 107%;\n  }\n\n  100% {\n    right: -8%;\n    left: 107%;\n  }\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-radio {\n  width: auto;\n  margin: 16px 8px 16px 0;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n}\n.md-radio:not(.md-disabled) {\n  cursor: pointer;\n}\n.md-radio:not(.md-disabled) .md-radio-label {\n  cursor: pointer;\n}\n.md-radio .md-radio-container {\n  width: 20px;\n  height: 20px;\n  position: relative;\n  border-radius: 50%;\n  border: 2px solid rgba(0, 0, 0, 0.54);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-radio .md-radio-container:before {\n  width: 48px;\n  height: 48px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  border-radius: 50%;\n  transform: translate(-50%, -50%);\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n  content: \" \";\n}\n.md-radio .md-radio-container:after {\n  position: absolute;\n  top: 3px;\n  right: 3px;\n  bottom: 3px;\n  left: 3px;\n  border-radius: 50%;\n  opacity: 0;\n  transform: scale3D(0.38, 0.38, 1);\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n  content: \" \";\n}\n.md-radio .md-radio-container input {\n  position: absolute;\n  left: -999em;\n}\n.md-radio .md-radio-container .md-ink-ripple {\n  top: -16px;\n  right: -16px;\n  bottom: -16px;\n  left: -16px;\n  border-radius: 50%;\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-radio .md-radio-container .md-ink-ripple .md-ripple {\n  width: 48px !important;\n  height: 48px !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n}\n.md-radio .md-radio-label {\n  height: 20px;\n  padding-left: 8px;\n  line-height: 20px;\n}\n.md-radio.md-checked .md-radio-container:after {\n  opacity: 1;\n  transform: scale3D(1, 1, 1);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-rating-bar {\n  width: auto;\n  display: -ms-flexbox;\n  display: flex;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  padding: 3px;\n  border-radius: 2px;\n}\n.md-rating-bar > .md-full-icon {\n  overflow-x: hidden;\n  display: inherit;\n}\n.md-rating-bar > .md-empty-icon > .md-icon,\n.md-rating-bar > .md-full-icon > .md-icon {\n  margin: 0;\n  white-space: nowrap;\n  cursor: pointer;\n}\n.md-rating-bar:not([disabled]):hover {\n  background-color: rgba(153, 153, 153, 0.2);\n}\n.md-rating-bar[disabled] > .md-empty-icon > .md-icon,\n.md-rating-bar[disabled] > .md-full-icon > .md-icon {\n  cursor: default;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-select {\n  width: 100%;\n  min-width: 128px;\n  height: 32px;\n  position: relative;\n}\n.md-select:focus {\n  outline: none;\n}\n.md-select:not(.md-select-icon):after {\n  margin-top: 2px;\n  position: absolute;\n  top: 50%;\n  right: 0;\n  transform: translateY(-50%) scaleY(0.45) scaleX(0.85);\n  transition: all 0.15s linear;\n  content: \"\\25BC\";\n}\n.md-select.md-active .md-select-menu {\n  top: -8px;\n  pointer-events: auto;\n  opacity: 1;\n  transform: translateY(-8px) scale3D(1, 1, 1);\n  transform-origin: center top;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-duration: .25s;\n  transition-property: opacity, transform, top;\n}\n.md-select.md-active .md-select-menu > * {\n  opacity: 1;\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n  transition-duration: .15s;\n  transition-delay: .1s;\n}\n.md-select.md-disabled {\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  user-drag: none;\n}\n.md-select select {\n  position: absolute;\n  left: -999em;\n}\n.md-select .md-menu {\n  width: 100%;\n  height: 32px;\n  display: block;\n  position: relative;\n}\n.md-select .md-select-value {\n  width: 100%;\n  height: 32px;\n  padding-right: 24px;\n  display: block;\n  cursor: pointer;\n  overflow: hidden;\n  position: relative;\n  z-index: 2;\n  font-size: 16px;\n  line-height: 33px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.md-select .md-subheader {\n  color: rgba(117, 117, 117, 0.87);\n  text-transform: uppercase;\n}\n.md-select .md-subheader:first-child {\n  margin-top: -8px;\n}\n.md-select-content {\n  width: auto;\n  max-height: 256px;\n}\n.md-select-content.md-direction-bottom-right {\n  margin-top: -15px;\n  margin-left: -16px;\n}\n.md-select-content .md-option[disabled] {\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  user-drag: none;\n}\n.md-select-content .md-menu-item .md-list-item-holder {\n  overflow: visible;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n}\n.md-select-content.md-multiple .md-checkbox {\n  margin: 0;\n}\n.md-select-content.md-multiple .md-checkbox-label {\n  padding-left: 16px;\n  cursor: pointer;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-sidenav.md-left .md-sidenav-content {\n  left: 0;\n  transform: translate3D(-100%, 0, 0);\n}\n.md-sidenav.md-right .md-sidenav-content {\n  right: 0;\n  transform: translate3D(100%, 0, 0);\n}\n.md-sidenav.md-fixed .md-sidenav-content,\n.md-sidenav.md-fixed .md-sidenav-backdrop {\n  position: fixed;\n}\n.md-sidenav .md-sidenav-content {\n  width: 304px;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 100;\n  pointer-events: none;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-property: transform;\n  will-change: transform;\n}\n.md-sidenav .md-backdrop {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 99;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.54);\n  opacity: 0;\n  transition: all 0.5s cubic-bezier(0.35, 0, 0.25, 1);\n  transition-property: opacity;\n  will-change: opacity;\n}\n.md-sidenav.md-active .md-sidenav-content {\n  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12);\n  pointer-events: auto;\n  transform: translate3D(0, 0, 0);\n}\n.md-sidenav.md-active .md-sidenav-backdrop {\n  opacity: 1;\n  pointer-events: auto;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n/* Image aspect ratio calculator */\n/* Responsive breakpoints */\n.md-snackbar {\n  display: -ms-flexbox;\n  display: flex;\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 120;\n  pointer-events: none;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-property: margin-top, margin-bottom;\n}\n.md-snackbar.md-position-top-center,\n.md-snackbar.md-position-bottom-center {\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n.md-snackbar.md-position-top-right,\n.md-snackbar.md-position-bottom-right {\n  margin-right: 24px;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n}\n.md-snackbar.md-position-top-left,\n.md-snackbar.md-position-bottom-left {\n  margin-left: 24px;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n}\n.md-snackbar.md-position-top-right,\n.md-snackbar.md-position-top-left,\n.md-snackbar.md-position-top-center {\n  margin-top: 24px;\n}\n.md-snackbar.md-position-bottom-right,\n.md-snackbar.md-position-bottom-left {\n  margin-bottom: 24px;\n}\n.md-snackbar.md-position-top-center,\n.md-snackbar.md-position-top-right,\n.md-snackbar.md-position-top-left {\n  top: 0;\n}\n.md-snackbar.md-position-top-center .md-snackbar-container,\n.md-snackbar.md-position-top-right .md-snackbar-container,\n.md-snackbar.md-position-top-left .md-snackbar-container {\n  transform: translate3D(0, calc(-100% - 24px), 0);\n}\n.md-snackbar.md-position-bottom-center,\n.md-snackbar.md-position-bottom-right,\n.md-snackbar.md-position-bottom-left {\n  bottom: 0;\n}\n.md-snackbar.md-position-bottom-center .md-snackbar-container,\n.md-snackbar.md-position-bottom-right .md-snackbar-container,\n.md-snackbar.md-position-bottom-left .md-snackbar-container {\n  transform: translate3D(0, calc(100% + 24px), 0);\n}\n.md-snackbar.md-active .md-snackbar-container {\n  transform: translate3D(0, 0, 0);\n}\n.md-snackbar.md-active .md-snackbar-content {\n  opacity: 1;\n  transition: opacity 0.4s 0.1s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-snackbar .md-snackbar-content {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  opacity: 0;\n  transition: opacity 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);\n  will-change: opacity;\n}\n.md-snackbar .md-button {\n  min-width: 64px;\n  margin: -8px -16px;\n}\n.md-snackbar .md-button:last-child {\n  margin-left: 48px;\n}\n.md-snackbar-container {\n  width: auto;\n  min-width: 288px;\n  max-width: 568px;\n  min-height: 48px;\n  padding: 14px 24px;\n  overflow: hidden;\n  pointer-events: auto;\n  border-radius: 2px;\n  background-color: #323232;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  color: #fff;\n  font-size: 14px;\n}\n.md-has-toast-top-right .md-fab.md-fab-top-right {\n  transform: translate3D(0, 68px, 0);\n}\n.md-has-toast-top-center .md-fab.md-fab-top-center {\n  transform: translate3D(-50%, 68px, 0);\n}\n.md-has-toast-top-left .md-fab.md-fab-top-left {\n  transform: translate3D(0, 68px, 0);\n}\n.md-has-toast-bottom-right .md-fab.md-fab-bottom-right {\n  transform: translate3D(0, -68px, 0);\n}\n.md-has-toast-bottom-center .md-fab.md-fab-bottom-center {\n  transform: translate3D(-50%, -68px, 0);\n}\n.md-has-toast-bottom-left .md-fab.md-fab-bottom-left {\n  transform: translate3D(0, -68px, 0);\n}\n@media (max-width: 600px) {\n  .md-snackbar {\n    margin: 0 !important;\n  }\n\n  .md-snackbar-container {\n    width: 100%;\n    max-width: 100%;\n    border-radius: 0;\n  }\n\n  .md-has-toast-top-right .md-fab.md-fab-top-right {\n    transform: translate3D(0, 48px, 0);\n  }\n\n  .md-has-toast-top-center .md-fab.md-fab-top-center {\n    transform: translate3D(-50%, 48px, 0);\n  }\n\n  .md-has-toast-top-left .md-fab.md-fab-top-left {\n    transform: translate3D(0, 48px, 0);\n  }\n\n  .md-has-toast-bottom-right .md-fab.md-fab-bottom-right {\n    transform: translate3D(0, -48px, 0);\n  }\n\n  .md-has-toast-bottom-center .md-fab.md-fab-bottom-center {\n    transform: translate3D(-50%, -48px, 0);\n  }\n\n  .md-has-toast-bottom-left .md-fab.md-fab-bottom-left {\n    transform: translate3D(0, -48px, 0);\n  }\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-speed-dial {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse;\n  -ms-flex-align: center;\n  align-items: center;\n}\n.md-speed-dial.md-direction-top.md-mode-fling [md-fab-trigger] ~ .md-button {\n  transform: scale(0.95) translate3D(0, 80%, 0);\n}\n.md-speed-dial.md-direction-top [md-fab-trigger] {\n  margin-top: 8px;\n}\n.md-speed-dial.md-direction-top [md-fab-trigger] ~ .md-button {\n  margin-bottom: 16px;\n}\n.md-speed-dial.md-direction-right {\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n.md-speed-dial.md-direction-right.md-mode-fling [md-fab-trigger] ~ .md-button {\n  transform: scale(0.95) translate3D(-80%, 0, 0);\n}\n.md-speed-dial.md-direction-right [md-fab-trigger] {\n  margin-right: 8px;\n}\n.md-speed-dial.md-direction-right [md-fab-trigger] ~ .md-button {\n  margin-left: 16px;\n}\n.md-speed-dial.md-direction-bottom {\n  -ms-flex-direction: column;\n  flex-direction: column;\n}\n.md-speed-dial.md-direction-bottom.md-mode-fling [md-fab-trigger] ~ .md-button {\n  transform: scale(0.95) translate3D(0, -80%, 0);\n}\n.md-speed-dial.md-direction-bottom [md-fab-trigger] {\n  margin-bottom: 8px;\n}\n.md-speed-dial.md-direction-bottom [md-fab-trigger] ~ .md-button {\n  margin-top: 16px;\n}\n.md-speed-dial.md-direction-left {\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n.md-speed-dial.md-direction-left.md-mode-fling [md-fab-trigger] ~ .md-button {\n  transform: scale(0.95) translate3D(80%, 0, 0);\n}\n.md-speed-dial.md-direction-left [md-fab-trigger] {\n  margin-left: 8px;\n}\n.md-speed-dial.md-direction-left [md-fab-trigger] ~ .md-button {\n  margin-right: 16px;\n}\n.md-speed-dial.md-mode-scale [md-fab-trigger] ~ .md-button {\n  transform: scale(0.6);\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translate3D(0, 0, 0) !important;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(2) {\n  transition-delay: 0.05s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(3) {\n  transition-delay: 0.1s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(4) {\n  transition-delay: 0.15s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(5) {\n  transition-delay: 0.2s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(6) {\n  transition-delay: 0.25s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(7) {\n  transition-delay: 0.3s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(8) {\n  transition-delay: 0.35s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(9) {\n  transition-delay: 0.4s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(10) {\n  transition-delay: 0.45s;\n}\n.md-speed-dial.md-active [md-fab-trigger] ~ .md-button:nth-child(11) {\n  transition-delay: 0.5s;\n}\n.md-speed-dial.md-active [md-fab-trigger] [md-icon-morph] {\n  transform: rotateZ(0);\n  opacity: 1;\n}\n.md-speed-dial.md-active [md-fab-trigger] [md-icon-morph] + .md-icon {\n  transform: rotateZ(90deg) scale(0.8);\n  opacity: 0;\n}\n.md-speed-dial .md-button {\n  margin: 0;\n}\n.md-speed-dial [md-fab-trigger] {\n  position: relative;\n  z-index: 2;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button {\n  position: relative;\n  z-index: 1;\n  opacity: 0;\n  pointer-events: none;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(2) {\n  transition-delay: 0.05s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(3) {\n  transition-delay: 0.1s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(4) {\n  transition-delay: 0.15s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(5) {\n  transition-delay: 0.2s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(6) {\n  transition-delay: 0.25s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(7) {\n  transition-delay: 0.3s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(8) {\n  transition-delay: 0.35s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(9) {\n  transition-delay: 0.4s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(10) {\n  transition-delay: 0.45s;\n}\n.md-speed-dial [md-fab-trigger] ~ .md-button:nth-last-child(11) {\n  transition-delay: 0.5s;\n}\n.md-speed-dial [md-icon-morph] + .md-icon,\n.md-speed-dial [md-icon-morph] {\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-speed-dial [md-icon-morph] {\n  opacity: 0;\n  transform: rotateZ(-90deg) scale(0.8);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-spinner {\n  display: inline-block;\n  position: relative;\n  pointer-events: none;\n  will-change: transform, opacity;\n}\n.md-spinner.md-indeterminate .md-spinner-draw {\n  animation: spinner-rotate 1.9s linear infinite;\n  transform: rotate(0deg) translateZ(0);\n}\n.md-spinner.md-indeterminate .md-spinner-path {\n  stroke-dasharray: 2, 200;\n  animation: spinner-dash 1.425s ease-in-out infinite;\n}\n.md-spinner.md-spinner-leave-active {\n  opacity: 0;\n  transform: scale(0.8) translateZ(0);\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-spinner:not(.md-indeterminate).md-spinner-enter-active {\n  transition-duration: 2s;\n}\n.md-spinner:not(.md-indeterminate).md-spinner-enter-active .md-spinner-draw {\n  animation: spinner-initial-rotate 1.98s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;\n}\n.md-spinner-draw {\n  width: 100%;\n  height: 100%;\n  margin: auto;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: rotate(270deg) translateZ(0);\n  transform-origin: center center;\n  will-change: transform, opacity;\n}\n.md-spinner-path {\n  fill: none;\n  stroke-dashoffset: 0;\n  stroke-miterlimit: 10;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n@keyframes spinner-rotate {\n  to {\n    transform: rotate(360deg) translateZ(0);\n  }\n}\n@keyframes spinner-initial-rotate {\n  0% {\n    opacity: 0;\n    transform: rotate(-90deg) translateZ(0);\n  }\n\n  20% {\n    opacity: 1;\n  }\n\n  100% {\n    transform: rotate(270deg) translateZ(0);\n  }\n}\n@keyframes spinner-dash {\n  0% {\n    stroke-dasharray: 2, 200;\n    stroke-dashoffset: 0;\n  }\n\n  50% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -35px;\n  }\n\n  100% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -124px;\n  }\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n/* Image aspect ratio calculator */\n/* Responsive breakpoints */\n.md-stepper {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n  position: relative;\n  width: 100%;\n}\n.md-stepper .md-step-header {\n  background: none;\n  border: 0;\n  cursor: pointer;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  font-family: inherit;\n  font-size: 12px;\n  font-weight: 500;\n  margin: 0;\n  max-height: 72px;\n  padding: 24px;\n  position: relative;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-stepper .md-step-header .md-step-icons,\n.md-stepper .md-step-header .md-step-titles {\n  display: inline-block;\n  vertical-align: middle;\n}\n.md-stepper .md-step-header.md-has-sub-message {\n  padding: 15px 24px;\n}\n.md-stepper .md-step-header.md-has-sub-message .md-step-title {\n  margin-bottom: -4px;\n}\n.md-stepper .md-step-header .md-step-icon {\n  border-radius: 50%;\n  font-size: 12px;\n  height: 24px;\n  line-height: 24px;\n  margin-right: 8px;\n  min-width: 24px;\n  padding: 0px 6px;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  width: 24px;\n}\n.md-stepper .md-step-header .md-step-number {\n  border-radius: 50%;\n  display: inline-block;\n  font-size: 12px;\n  margin-right: 8px;\n  width: 24px;\n}\n.md-stepper .md-step-header .md-step-number span {\n  display: block;\n  line-height: 24px;\n  text-align: center;\n}\n.md-stepper .md-step-header .md-step-title {\n  font-size: inherit;\n}\n.md-stepper .md-step-header.md-disabled {\n  cursor: default;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-user-drag: none;\n}\n.md-stepper .md-steps-navigation {\n  display: -ms-flexbox;\n  display: flex;\n  height: 72px;\n  min-height: 72px;\n  overflow: hidden;\n  position: relative;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  z-index: 1;\n}\n.md-stepper .md-steps-navigation.md-alternate-labels {\n  height: 104px;\n  min-height: 104px;\n}\n.md-stepper .md-steps-navigation .md-steps-navigation-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  width: 100%;\n}\n.md-stepper .md-steps-navigation .md-steps-navigation-container .md-divider {\n  margin: 36px 0;\n  position: relative;\n  width: 100%;\n}\n.md-stepper .md-steps-navigation .md-steps-navigation-container .md-step-header.md-alternate-labels {\n  max-height: 104px;\n  text-align: center;\n}\n.md-stepper .md-steps-navigation .md-steps-navigation-container .md-step-header.md-alternate-labels.md-has-sub-message {\n  padding: 24px;\n}\n.md-stepper .md-steps-navigation .md-steps-navigation-container .md-step-header.md-alternate-labels .md-step-icons,\n.md-stepper .md-steps-navigation .md-steps-navigation-container .md-step-header.md-alternate-labels .md-step-titles {\n  display: block;\n}\n.md-stepper .md-steps-navigation .md-steps-navigation-container .md-step-header.md-alternate-labels .md-step-titles {\n  margin-top: 10px;\n}\n.md-stepper .md-steps-container {\n  height: 0;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n}\n.md-stepper .md-steps-container .md-steps-wrapper {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  transform: translate3d(0, 0, 0);\n  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  width: 9999em;\n}\n.md-stepper .md-steps-container .md-steps-wrapper .md-step {\n  left: 0;\n  padding: 16px;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n.md-stepper .md-steps-container .md-steps-wrapper .md-step .md-step-content {\n  padding: 16px;\n  font-size: 14px;\n  line-height: 22px;\n}\n.md-stepper .md-steps-container .md-steps-wrapper .md-step .md-step-content:last-child {\n  padding-bottom: 24px;\n}\n.md-stepper .md-steps-vertical-container .md-step .md-step-header {\n  padding-bottom: 8px;\n}\n.md-stepper .md-steps-vertical-container .md-step:not(:first-of-type) .md-step-header {\n  padding-top: 8px;\n}\n.md-stepper .md-steps-vertical-container .md-step .md-step-content {\n  margin: 0 24px 0 34px;\n  padding-bottom: 32px;\n  padding-left: 24px;\n  padding-top: 8px;\n}\n.md-stepper .md-steps-vertical-container .md-step:not(:last-of-type) .md-step-content {\n  border-left: 1px solid #BDBDBD;\n}\n@media (min-width: 660px) {\n  .md-stepper .md-steps-navigation .md-steps-navigation-container {\n    margin-bottom: -15px;\n  }\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-subheader {\n  min-height: 48px;\n  padding: 0 16px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-flow: row wrap;\n  flex-flow: row wrap;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 14px;\n  font-weight: 500;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-switch {\n  width: auto;\n  margin: 16px 8px 16px 0;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n}\n.md-switch .md-switch-container {\n  width: 34px;\n  height: 14px;\n  position: relative;\n  border-radius: 14px;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  background-color: rgba(0, 0, 0, 0.38);\n}\n.md-switch .md-switch-container .md-switch-thumb {\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  top: 50%;\n  left: 0;\n  background-color: #fafafa;\n  border-radius: 50%;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);\n  transition: all 0.15s linear;\n}\n.md-switch .md-switch-container input {\n  position: absolute;\n  left: -999em;\n}\n.md-switch .md-switch-container .md-ink-ripple {\n  top: -16px;\n  right: -16px;\n  bottom: -16px;\n  left: -16px;\n  border-radius: 50%;\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-switch .md-switch-container .md-ink-ripple .md-ripple {\n  width: 48px !important;\n  height: 48px !important;\n  top: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  left: 0 !important;\n}\n.md-switch .md-switch-container .md-switch-holder {\n  width: 40px;\n  height: 40px;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  z-index: 2;\n  background: none;\n  border: none;\n  transform: translate(-50%, -50%);\n}\n.md-switch .md-switch-container .md-switch-holder:focus {\n  outline: none;\n}\n.md-switch .md-switch-label {\n  height: 14px;\n  padding-left: 8px;\n  line-height: 14px;\n}\n.md-switch.md-dragging .md-switch-thumb {\n  cursor: -webkit-grabbing;\n  cursor: grabbing;\n}\n.md-switch.md-disabled .md-switch-thumb {\n  cursor: default;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-table {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column wrap;\n  flex-flow: column wrap;\n  overflow-x: auto;\n}\n.md-table.md-transition-off .md-table-cell,\n.md-table.md-transition-off .md-checkbox .md-checkbox-container,\n.md-table.md-transition-off .md-checkbox .md-checkbox-container:after {\n  transition: none !important;\n}\n.md-table table {\n  width: 100%;\n  border-spacing: 0;\n  border-collapse: collapse;\n  overflow: hidden;\n}\n.md-table tbody .md-table-row {\n  border-top: 1px solid #e0e0e0;\n}\n.md-table tbody .md-table-row.md-selected .md-table-cell {\n  background-color: #f5f5f5;\n}\n.md-table tbody .md-table-row:hover .md-table-cell {\n  background-color: #eee;\n}\n.md-table .md-table-head {\n  padding: 0;\n  position: relative;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 12px;\n  line-height: 16px;\n  text-align: left;\n}\n.md-table .md-table-head:last-child .md-table-head-container .md-table-head-text {\n  padding-right: 24px;\n}\n.md-table .md-table-head.md-numeric {\n  text-align: right;\n}\n.md-table .md-table-head .md-icon {\n  width: 16px;\n  min-width: 16px;\n  height: 16px;\n  min-height: 16px;\n  font-size: 16px;\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-table .md-table-head .md-icon:not(.md-sortable-icon) {\n  margin: 0 4px;\n}\n.md-table .md-table-head .md-icon:first-child {\n  margin-left: 0;\n}\n.md-table .md-table-head .md-icon:last-child {\n  margin-right: 0;\n}\n.md-table .md-table-head-container {\n  height: 56px;\n  padding: 14px 0;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-table .md-table-head-text {\n  height: 28px;\n  padding-right: 32px;\n  padding-left: 24px;\n  display: inline-block;\n  position: relative;\n  overflow: hidden;\n  line-height: 28px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.md-table .md-sortable {\n  cursor: pointer;\n}\n.md-table .md-sortable:first-of-type .md-sortable-icon {\n  left: auto;\n  right: 10px;\n}\n.md-table .md-sortable:hover,\n.md-table .md-sortable.md-sorted {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-table .md-sortable:hover .md-sortable-icon,\n.md-table .md-sortable.md-sorted .md-sortable-icon {\n  opacity: 1;\n}\n.md-table .md-sortable.md-sorted .md-sortable-icon {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-table .md-sortable.md-sorted-descending .md-sortable-icon {\n  transform: translateY(-50%) rotate(180deg);\n}\n.md-table .md-sortable .md-sortable-icon {\n  position: absolute;\n  top: 50%;\n  left: 2px;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transform: translateY(-50%);\n  opacity: 0;\n  color: rgba(0, 0, 0, 0.38);\n}\n.md-table .md-sortable .md-ink-ripple {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-table .md-table-cell {\n  height: 48px;\n  position: relative;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  color: rgba(0, 0, 0, 0.87);\n  font-size: 13px;\n  line-height: 18px;\n}\n.md-table .md-table-cell:last-child .md-table-cell-container {\n  padding-right: 24px;\n}\n.md-table .md-table-cell.md-numeric {\n  text-align: right;\n}\n.md-table .md-table-cell.md-numeric .md-icon {\n  margin: 0;\n}\n.md-table .md-table-cell.md-numeric .md-table-cell-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n.md-table .md-table-cell.md-numeric .md-table-cell-container .md-icon,\n.md-table .md-table-cell.md-numeric .md-table-cell-container .md-button .md-icon {\n  margin: auto;\n}\n.md-table .md-table-cell.md-has-action .md-table-cell-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n.md-table .md-table-cell .md-table-cell-container {\n  padding: 6px 32px 6px 24px;\n}\n.md-table .md-table-cell .md-button {\n  width: 36px;\n  min-width: 36px;\n  height: 36px;\n  min-height: 36px;\n}\n.md-table .md-table-cell .md-button:last-child {\n  margin: 0 -10px 0 0;\n}\n.md-table .md-table-cell .md-button .md-icon {\n  margin: auto;\n  width: 18px;\n  min-width: 18px;\n  height: 18px;\n  min-height: 18px;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 18px;\n}\n.md-table .md-table-selection {\n  width: 60px;\n  position: relative;\n  vertical-align: middle;\n}\n.md-table .md-table-selection + .md-table-cell .md-table-cell-container,\n.md-table .md-table-selection + .md-table-head .md-table-head-container .md-table-head-text {\n  padding-left: 8px;\n}\n.md-table .md-table-selection .md-table-cell-container {\n  padding-right: 16px;\n  padding-left: 24px;\n}\n.md-table .md-table-selection .md-checkbox {\n  margin: 0;\n}\n.md-table .md-table-selection .md-checkbox-container {\n  width: 18px;\n  height: 18px;\n  margin-top: 1px;\n}\n.md-table .md-table-selection .md-checkbox-container:after {\n  top: -1px;\n  left: 4px;\n}\n.md-table .md-select {\n  min-width: 84px;\n}\n.md-table .md-select-value,\n.md-table .md-option {\n  font-size: 13px;\n}\n.md-table-edit-trigger {\n  display: inline-block;\n  cursor: pointer;\n  color: rgba(0, 0, 0, 0.38);\n}\n.md-table-edit-trigger.md-edited {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-table-dialog {\n  max-height: 0;\n  margin: 0;\n  padding: 0 24px 2px;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 24px;\n  z-index: 60;\n  overflow: hidden;\n  pointer-events: none;\n  border-radius: 2px;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  background-color: #fff;\n  opacity: 0;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), max-height 0s 0.5s;\n  transition-duration: .3s;\n  transform: translate3D(0, -8px, 0);\n}\n.md-table-dialog.md-active {\n  max-height: 400px;\n  pointer-events: auto;\n  transform: translate3D(#000);\n  opacity: 1;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-duration: .3s;\n}\n.md-table-dialog.md-large {\n  padding: 12px 24px 2px;\n}\n.md-table-dialog .md-input-container {\n  margin-top: 0;\n  margin-bottom: 16px;\n}\n.md-table-dialog .md-input-container.md-input-placeholder input {\n  font-size: 13px;\n}\n.md-table-dialog .md-input-container.md-input-placeholder input::-webkit-input-placeholder {\n  font-size: 13px;\n}\n.md-table-dialog .md-char-counter {\n  font-size: 13.5px;\n  color: rgba(0, 0, 0, 0.54);\n}\n.md-table-dialog .md-button {\n  min-width: 64px;\n}\n.md-table-card {\n  overflow: visible;\n}\n.md-table-card .md-toolbar {\n  padding-left: 16px;\n  background-color: #fff;\n}\n.md-table-card .md-title {\n  -ms-flex: 1;\n  flex: 1;\n  font-size: 20px;\n}\n.md-table-card .md-table-pagination {\n  height: 56px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex: 1;\n  flex: 1;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  border-top: 1px solid #e0e0e0;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 12px;\n}\n.md-table-card .md-table-pagination .md-table-pagination-previous {\n  margin-right: 2px;\n  margin-left: 18px;\n}\n.md-table-card .md-table-pagination .md-select {\n  width: auto;\n  min-width: 36px;\n  margin: 0 32px;\n}\n.md-table-card .md-table-pagination .md-select:after {\n  margin-top: 0;\n}\n.md-table-card .md-table-pagination .md-select .md-select-value {\n  padding: 0;\n  border: none;\n  font-size: 13px;\n}\n.md-table-card .md-table-pagination .md-button:not([disabled]) {\n  color: rgba(0, 0, 0, 0.87);\n}\n.md-table-card .md-table-pagination .md-button[disabled] .md-icon {\n  color: rgba(0, 0, 0, 0.26);\n}\n.md-pagination-select.md-direction-bottom-right {\n  margin-top: -16px;\n}\n.md-pagination-select .md-list-item-holder {\n  font-size: 13px;\n}\n.md-table-alternate-header {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 10;\n  pointer-events: none;\n  opacity: 0;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-duration: .3s;\n}\n.md-table-alternate-header.md-active {\n  pointer-events: auto;\n  opacity: 1;\n  transform: translate3D(#000);\n}\n.md-table-alternate-header .md-counter {\n  margin-left: 8px;\n  -ms-flex: 1;\n  flex: 1;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n/* Image aspect ratio calculator */\n/* Responsive breakpoints */\n.md-tabs {\n  width: 100%;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n  position: relative;\n}\n.md-tabs.md-transition-off * {\n  transition: none !important;\n}\n.md-tabs.md-dynamic-height .md-tabs-content {\n  transition: height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-tabs .md-tabs-navigation {\n  height: 48px;\n  min-height: 48px;\n  position: relative;\n  z-index: 1;\n  display: -ms-flexbox;\n  display: flex;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  overflow: hidden;\n}\n.md-tabs .md-tabs-navigation.md-has-navigation-scroll .md-tab-header-navigation-button.md-left {\n  -ms-flex-order: 1;\n  order: 1;\n}\n.md-tabs .md-tabs-navigation.md-has-navigation-scroll .md-tabs-navigation-container {\n  -ms-flex-order: 2;\n  order: 2;\n}\n.md-tabs .md-tabs-navigation.md-has-navigation-scroll .md-tab-header-navigation-button.md-right {\n  -ms-flex-order: 3;\n  order: 3;\n}\n.md-tabs .md-tabs-navigation.md-has-icon.md-has-label {\n  min-height: 72px;\n}\n.md-tabs .md-tabs-navigation.md-has-icon.md-has-label .md-icon {\n  margin-bottom: 10px;\n}\n.md-tabs .md-tabs-navigation.md-centered {\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n.md-tabs .md-tabs-navigation.md-fixed .md-tabs-navigation-container,\n.md-tabs .md-tabs-navigation.md-fixed .md-tabs-navigation-scroll-container {\n  -ms-flex: 1;\n  flex: 1;\n}\n.md-tabs .md-tabs-navigation.md-fixed .md-tab-header {\n  -ms-flex: 1;\n  flex: 1;\n  max-width: none;\n}\n.md-tabs .md-tabs-navigation.md-right {\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n}\n.md-tabs .md-tabs-navigation-container {\n  display: -ms-flexbox;\n  display: flex;\n  overflow-x: auto;\n}\n.md-tabs .md-tabs-navigation-scroll-container {\n  display: -ms-flexbox;\n  display: flex;\n}\n.md-tabs .md-tab-header {\n  min-width: 72px;\n  max-width: 264px;\n  margin: 0;\n  padding: 0 12px;\n  position: relative;\n  cursor: pointer;\n  border: 0;\n  background: none;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  font-family: inherit;\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n}\n.md-tabs .md-tab-header.md-disabled {\n  cursor: default;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-user-drag: none;\n}\n.md-tabs .md-tab-header-container {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column;\n  flex-flow: column;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n.md-tabs .md-tab-header-container .md-icon {\n  margin: 0;\n}\n.md-tabs .md-tab-indicator {\n  height: 2px;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  transform: translate3D(0, 0, 0);\n}\n.md-tabs .md-tab-indicator.md-transition-off {\n  transition: none !important;\n}\n.md-tabs .md-tab-indicator.md-to-right {\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), left 0.3s cubic-bezier(0.35, 0, 0.25, 1), right 0.15s cubic-bezier(0.35, 0, 0.25, 1);\n}\n.md-tabs .md-tab-indicator.md-to-left {\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), right 0.3s cubic-bezier(0.35, 0, 0.25, 1), left 0.15s cubic-bezier(0.35, 0, 0.25, 1);\n}\n.md-tabs .md-tab-header-navigation-button {\n  border: none;\n  height: 100%;\n  cursor: pointer;\n  position: relative;\n}\n.md-tabs .md-tab-header-navigation-button.md-left {\n  left: 0;\n}\n.md-tabs .md-tab-header-navigation-button.md-right {\n  right: 0;\n}\n.md-tabs .md-tab-header-navigation-button.md-disabled {\n  pointer-events: none;\n  opacity: .4;\n}\n.md-tabs .md-tabs-content {\n  width: 100%;\n  height: 0;\n  position: relative;\n  overflow: hidden;\n}\n.md-tabs .md-tabs-wrapper {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: translate3d(0, 0, 0);\n  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.md-tabs .md-tab {\n  padding: 16px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n@media (min-width: 660px) {\n  .md-tabs .md-tabs-navigation.md-has-navigation-scroll .md-tabs-navigation-container {\n    margin-bottom: -15px;\n  }\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-toolbar {\n  min-height: 64px;\n  padding: 0 8px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-line-pack: center;\n  align-content: center;\n  -ms-flex-flow: row wrap;\n  flex-flow: row wrap;\n  position: relative;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transform: translate3D(0, 0, 0);\n}\n.md-toolbar.md-dense {\n  min-height: 48px;\n}\n.md-toolbar.md-dense.md-medium {\n  min-height: 72px;\n}\n.md-toolbar.md-dense.md-large {\n  min-height: 96px;\n}\n.md-toolbar.md-dense .md-toolbar-container {\n  height: 48px;\n}\n.md-toolbar.md-medium {\n  min-height: 88px;\n}\n.md-toolbar.md-medium .md-toolbar-container:nth-child(2) .md-title:first-child {\n  margin-left: 56px;\n}\n.md-toolbar.md-large {\n  min-height: 128px;\n  -ms-flex-line-pack: inherit;\n  align-content: inherit;\n}\n.md-toolbar.md-large .md-toolbar-container:nth-child(2) .md-title:first-child {\n  margin-left: 56px;\n}\n.md-toolbar.md-account-header {\n  min-height: 164px;\n}\n.md-toolbar.md-account-header .md-ink-ripple {\n  color: #fff;\n}\n.md-toolbar.md-account-header .md-list-item-container:hover:not([disabled]) {\n  background-color: rgba(255, 255, 255, 0.12);\n}\n.md-toolbar.md-account-header .md-avatar-list {\n  margin: 16px 0 8px;\n}\n.md-toolbar.md-account-header .md-avatar-list .md-list-item-container {\n  -ms-flex-align: start;\n  align-items: flex-start;\n}\n.md-toolbar.md-account-header .md-avatar-list .md-avatar + .md-avatar {\n  margin-left: 16px;\n}\n.md-toolbar .md-toolbar-container {\n  width: 100%;\n  height: 64px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-item-align: start;\n  align-self: flex-start;\n}\n.md-toolbar .md-toolbar-container > .md-button:first-child {\n  margin-left: 0;\n  margin-right: 16px;\n}\n.md-toolbar .md-toolbar-container > .md-button + .md-button {\n  margin-left: 0;\n}\n.md-toolbar > .md-button:first-child {\n  margin-left: 0;\n  margin-right: 16px;\n}\n.md-toolbar > .md-button + .md-button {\n  margin-left: 0;\n}\n.md-toolbar .md-button:hover:not([disabled]):not(.md-raised):not(.md-icon-button):not(.md-fab) {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.md-toolbar .md-title {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 400;\n}\n.md-toolbar .md-title:first-child {\n  margin-left: 8px;\n}\n.md-toolbar .md-title + .md-input-container {\n  margin-left: 24px;\n}\n.md-toolbar .md-input-container {\n  min-height: 32px;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 0;\n}\n.md-toolbar .md-list {\n  padding: 0;\n  margin: 0 -8px;\n  -ms-flex: 1;\n  flex: 1;\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-tooltip {\n  height: 20px;\n  padding: 0 8px;\n  position: fixed;\n  z-index: 200;\n  pointer-events: none;\n  background-color: rgba(97, 97, 97, 0.87);\n  border-radius: 2px;\n  opacity: 0;\n  transform-origin: center top;\n  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n  transition-duration: .3s;\n  transition-delay: 0s;\n  color: #fff;\n  font-family: Roboto, \"Noto Sans\", Noto, sans-serif;\n  font-size: 10px;\n  line-height: 20px;\n  text-transform: none;\n  white-space: nowrap;\n}\n.md-tooltip.md-active {\n  opacity: 1;\n  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);\n  transition-duration: .3s;\n}\n.md-tooltip:not(.md-active) {\n  transition-delay: 0s !important;\n}\n.md-tooltip.md-transition-off {\n  transition: none !important;\n}\n.md-tooltip.md-tooltip-top {\n  margin-top: -14px;\n  transform: translate(-50%, 8px);\n}\n.md-tooltip.md-tooltip-top.md-active {\n  transform: translate(-50%, 0);\n}\n.md-tooltip.md-tooltip-right {\n  margin-left: 14px;\n  transform: translate(-8px, 50%);\n}\n.md-tooltip.md-tooltip-right.md-active {\n  transform: translate(0, 50%);\n}\n.md-tooltip.md-tooltip-bottom {\n  margin-top: 14px;\n  transform: translate(-50%, -8px);\n}\n.md-tooltip.md-tooltip-bottom.md-active {\n  transform: translate(-50%, 0);\n}\n.md-tooltip.md-tooltip-left {\n  margin-left: -14px;\n  transform: translate(8px, 50%);\n}\n.md-tooltip.md-tooltip-left.md-active {\n  transform: translate(0, 50%);\n}\n/* Common */\n/* Responsive Breakpoints */\n/* Transitions - Based on Angular Material */\n/* Elevation - Based on Angular Material */\n.md-whiteframe {\n  position: relative;\n  z-index: 1;\n}\n.md-whiteframe-1dp {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-2dp {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-3dp {\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-4dp {\n  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-5dp {\n  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px rgba(0, 0, 0, 0.14), 0 1px 14px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-6dp {\n  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-7dp {\n  box-shadow: 0 4px 5px -2px rgba(0, 0, 0, 0.2), 0 7px 10px 1px rgba(0, 0, 0, 0.14), 0 2px 16px 1px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-8dp {\n  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-9dp {\n  box-shadow: 0 5px 6px -3px rgba(0, 0, 0, 0.2), 0 9px 12px 1px rgba(0, 0, 0, 0.14), 0 3px 16px 2px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-10dp {\n  box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-11dp {\n  box-shadow: 0 6px 7px -4px rgba(0, 0, 0, 0.2), 0 11px 15px 1px rgba(0, 0, 0, 0.14), 0 4px 20px 3px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-12dp {\n  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 12px 17px 2px rgba(0, 0, 0, 0.14), 0 5px 22px 4px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-13dp {\n  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 13px 19px 2px rgba(0, 0, 0, 0.14), 0 5px 24px 4px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-14dp {\n  box-shadow: 0 7px 9px -4px rgba(0, 0, 0, 0.2), 0 14px 21px 2px rgba(0, 0, 0, 0.14), 0 5px 26px 4px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-15dp {\n  box-shadow: 0 8px 9px -5px rgba(0, 0, 0, 0.2), 0 15px 22px 2px rgba(0, 0, 0, 0.14), 0 6px 28px 5px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-16dp {\n  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-17dp {\n  box-shadow: 0 8px 11px -5px rgba(0, 0, 0, 0.2), 0 17px 26px 2px rgba(0, 0, 0, 0.14), 0 6px 32px 5px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-18dp {\n  box-shadow: 0 9px 11px -5px rgba(0, 0, 0, 0.2), 0 18px 28px 2px rgba(0, 0, 0, 0.14), 0 7px 34px 6px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-19dp {\n  box-shadow: 0 9px 12px -6px rgba(0, 0, 0, 0.2), 0 19px 29px 2px rgba(0, 0, 0, 0.14), 0 7px 36px 6px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-20dp {\n  box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-21dp {\n  box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 21px 33px 3px rgba(0, 0, 0, 0.14), 0 8px 40px 7px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-22dp {\n  box-shadow: 0 10px 14px -6px rgba(0, 0, 0, 0.2), 0 22px 35px 3px rgba(0, 0, 0, 0.14), 0 8px 42px 7px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-23dp {\n  box-shadow: 0 11px 14px -7px rgba(0, 0, 0, 0.2), 0 23px 36px 3px rgba(0, 0, 0, 0.14), 0 9px 44px 8px rgba(0, 0, 0, 0.12);\n}\n.md-whiteframe-24dp {\n  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);\n}\n/*# sourceMappingURL=vue-material.css.map*/\n"; (require("browserify-css").createStyle(css, { "href": "src/main.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":2}],9:[function(require,module,exports){
require('./main.css')

// Framework initialization
var Vue = require('vue')
var VueMaterial = require('vue-material')
Vue.use(VueMaterial)
Vue.material.registerTheme('default', {
  primary: {
  	color: 'cyan',
  	hue: 800,
  },
  accent: {
  	color: 'orange',
  	hue: 500,
  },
  warn: {
  	color: 'red',
  	hue: 500,
  }
})

// Global components
var Header = require('./header/header.vue')
Vue.component('ms-header', Header)

// App initialization
var Home = require('./home/home.vue')
var App = new Vue({
  el: '#app',
  render: ce => ce(Home)
})

},{"./header/header.vue":6,"./home/home.vue":7,"./main.css":8,"vue":5,"vue-material":4}]},{},[9]);
