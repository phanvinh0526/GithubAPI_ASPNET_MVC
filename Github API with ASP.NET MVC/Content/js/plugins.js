﻿!function (a, b, c) { var d = window.matchMedia; "undefined" != typeof module && module.exports ? module.exports = c(d) : "function" == typeof define && define.amd ? define(function () { return b[a] = c(d) }) : b[a] = c(d) }("enquire", this, function (a) { "use strict"; function b(a, b) { var c = 0, d = a.length; for (c; c < d; c++) if (!1 === b(a[c], c)) break } function c(a) { return "[object Array]" === Object.prototype.toString.apply(a) } function d(a) { return "function" == typeof a } function e(a) { this.options = a, !a.deferSetup && this.setup() } function f(b, c) { this.query = b, this.isUnconditional = c, this.handlers = [], this.mql = a(b); var d = this; this.listener = function (a) { d.mql = a, d.assess() }, this.mql.addListener(this.listener) } function g() { if (!a) throw new Error("matchMedia not present, legacy browsers require a polyfill"); this.queries = {}, this.browserIsIncapable = !a("only all").matches } return e.prototype = { setup: function () { this.options.setup && this.options.setup(), this.initialised = !0 }, on: function () { !this.initialised && this.setup(), this.options.match && this.options.match() }, off: function () { this.options.unmatch && this.options.unmatch() }, destroy: function () { this.options.destroy ? this.options.destroy() : this.off() }, equals: function (a) { return this.options === a || this.options.match === a } }, f.prototype = { addHandler: function (a) { var b = new e(a); this.handlers.push(b), this.matches() && b.on() }, removeHandler: function (a) { var c = this.handlers; b(c, function (b, d) { if (b.equals(a)) return b.destroy(), !c.splice(d, 1) }) }, matches: function () { return this.mql.matches || this.isUnconditional }, clear: function () { b(this.handlers, function (a) { a.destroy() }), this.mql.removeListener(this.listener), this.handlers.length = 0 }, assess: function () { var a = this.matches() ? "on" : "off"; b(this.handlers, function (b) { b[a]() }) } }, g.prototype = { register: function (a, e, g) { var h = this.queries, i = g && this.browserIsIncapable; return h[a] || (h[a] = new f(a, i)), d(e) && (e = { match: e }), c(e) || (e = [e]), b(e, function (b) { d(b) && (b = { match: b }), h[a].addHandler(b) }), this }, unregister: function (a, b) { var c = this.queries[a]; return c && (b ? c.removeHandler(b) : (c.clear(), delete this.queries[a])), this } }, new g }), function () { "use strict"; function a(b, d) { function e(a, b) { return function () { return a.apply(b, arguments) } } var f; if (d = d || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = d.touchBoundary || 10, this.layer = b, this.tapDelay = d.tapDelay || 200, this.tapTimeout = d.tapTimeout || 700, !a.notNeeded(b)) { for (var g = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], h = this, i = 0, j = g.length; i < j; i++) h[g[i]] = e(h[g[i]], h); c && (b.addEventListener("mouseover", this.onMouse, !0), b.addEventListener("mousedown", this.onMouse, !0), b.addEventListener("mouseup", this.onMouse, !0)), b.addEventListener("click", this.onClick, !0), b.addEventListener("touchstart", this.onTouchStart, !1), b.addEventListener("touchmove", this.onTouchMove, !1), b.addEventListener("touchend", this.onTouchEnd, !1), b.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (b.removeEventListener = function (a, c, d) { var e = Node.prototype.removeEventListener; "click" === a ? e.call(b, a, c.hijacked || c, d) : e.call(b, a, c, d) }, b.addEventListener = function (a, c, d) { var e = Node.prototype.addEventListener; "click" === a ? e.call(b, a, c.hijacked || (c.hijacked = function (a) { a.propagationStopped || c(a) }), d) : e.call(b, a, c, d) }), "function" == typeof b.onclick && (f = b.onclick, b.addEventListener("click", function (a) { f(a) }, !1), b.onclick = null) } } var b = navigator.userAgent.indexOf("Windows Phone") >= 0, c = navigator.userAgent.indexOf("Android") > 0 && !b, d = /iP(ad|hone|od)/.test(navigator.userAgent) && !b, e = d && /OS 4_\d(_\d)?/.test(navigator.userAgent), f = d && /OS [6-7]_\d/.test(navigator.userAgent), g = navigator.userAgent.indexOf("BB10") > 0; a.prototype.needsClick = function (a) { switch (a.nodeName.toLowerCase()) { case "button": case "select": case "textarea": if (a.disabled) return !0; break; case "input": if (d && "file" === a.type || a.disabled) return !0; break; case "label": case "iframe": case "video": return !0 } return /\bneedsclick\b/.test(a.className) }, a.prototype.needsFocus = function (a) { switch (a.nodeName.toLowerCase()) { case "textarea": return !0; case "select": return !c; case "input": switch (a.type) { case "button": case "checkbox": case "file": case "image": case "radio": case "submit": return !1 } return !a.disabled && !a.readOnly; default: return /\bneedsfocus\b/.test(a.className) } }, a.prototype.sendClick = function (a, b) { var c, d; document.activeElement && document.activeElement !== a && document.activeElement.blur(), d = b.changedTouches[0], c = document.createEvent("MouseEvents"), c.initMouseEvent(this.determineEventType(a), !0, !0, window, 1, d.screenX, d.screenY, d.clientX, d.clientY, !1, !1, !1, !1, 0, null), c.forwardedTouchEvent = !0, a.dispatchEvent(c) }, a.prototype.determineEventType = function (a) { return c && "select" === a.tagName.toLowerCase() ? "mousedown" : "click" }, a.prototype.focus = function (a) { var b; d && a.setSelectionRange && 0 !== a.type.indexOf("date") && "time" !== a.type && "month" !== a.type ? (b = a.value.length, a.setSelectionRange(b, b)) : a.focus() }, a.prototype.updateScrollParent = function (a) { var b, c; if (!(b = a.fastClickScrollParent) || !b.contains(a)) { c = a; do { if (c.scrollHeight > c.offsetHeight) { b = c, a.fastClickScrollParent = c; break } c = c.parentElement } while (c) } b && (b.fastClickLastScrollTop = b.scrollTop) }, a.prototype.getTargetElementFromEventTarget = function (a) { return a.nodeType === Node.TEXT_NODE ? a.parentNode : a }, a.prototype.onTouchStart = function (a) { var b, c, f; if (a.targetTouches.length > 1) return !0; if (b = this.getTargetElementFromEventTarget(a.target), c = a.targetTouches[0], d) { if (f = window.getSelection(), f.rangeCount && !f.isCollapsed) return !0; if (!e) { if (c.identifier && c.identifier === this.lastTouchIdentifier) return a.preventDefault(), !1; this.lastTouchIdentifier = c.identifier, this.updateScrollParent(b) } } return this.trackingClick = !0, this.trackingClickStart = a.timeStamp, this.targetElement = b, this.touchStartX = c.pageX, this.touchStartY = c.pageY, a.timeStamp - this.lastClickTime < this.tapDelay && a.preventDefault(), !0 }, a.prototype.touchHasMoved = function (a) { var b = a.changedTouches[0], c = this.touchBoundary; return Math.abs(b.pageX - this.touchStartX) > c || Math.abs(b.pageY - this.touchStartY) > c }, a.prototype.onTouchMove = function (a) { return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(a.target) || this.touchHasMoved(a)) && (this.trackingClick = !1, this.targetElement = null), !0) }, a.prototype.findControl = function (a) { return void 0 !== a.control ? a.control : a.htmlFor ? document.getElementById(a.htmlFor) : a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea") }, a.prototype.onTouchEnd = function (a) { var b, g, h, i, j, k = this.targetElement; if (!this.trackingClick) return !0; if (a.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0; if (a.timeStamp - this.trackingClickStart > this.tapTimeout) return !0; if (this.cancelNextClick = !1, this.lastClickTime = a.timeStamp, g = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, f && (j = a.changedTouches[0], k = document.elementFromPoint(j.pageX - window.pageXOffset, j.pageY - window.pageYOffset) || k, k.fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (h = k.tagName.toLowerCase())) { if (b = this.findControl(k)) { if (this.focus(k), c) return !1; k = b } } else if (this.needsFocus(k)) return a.timeStamp - g > 100 || d && window.top !== window && "input" === h ? (this.targetElement = null, !1) : (this.focus(k), this.sendClick(k, a), d && "select" === h || (this.targetElement = null, a.preventDefault()), !1); return !(!d || e || !(i = k.fastClickScrollParent) || i.fastClickLastScrollTop === i.scrollTop) || (this.needsClick(k) || (a.preventDefault(), this.sendClick(k, a)), !1) }, a.prototype.onTouchCancel = function () { this.trackingClick = !1, this.targetElement = null }, a.prototype.onMouse = function (a) { return !this.targetElement || (!!a.forwardedTouchEvent || (!a.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.propagationStopped = !0, a.stopPropagation(), a.preventDefault(), !1)))) }, a.prototype.onClick = function (a) { var b; return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === a.target.type && 0 === a.detail || (b = this.onMouse(a), b || (this.targetElement = null), b) }, a.prototype.destroy = function () { var a = this.layer; c && (a.removeEventListener("mouseover", this.onMouse, !0), a.removeEventListener("mousedown", this.onMouse, !0), a.removeEventListener("mouseup", this.onMouse, !0)), a.removeEventListener("click", this.onClick, !0), a.removeEventListener("touchstart", this.onTouchStart, !1), a.removeEventListener("touchmove", this.onTouchMove, !1), a.removeEventListener("touchend", this.onTouchEnd, !1), a.removeEventListener("touchcancel", this.onTouchCancel, !1) }, a.notNeeded = function (a) { var b, d, e; if (void 0 === window.ontouchstart) return !0; if (d = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) { if (!c) return !0; if (b = document.querySelector("meta[name=viewport]")) { if (-1 !== b.content.indexOf("user-scalable=no")) return !0; if (d > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0 } } if (g && (e = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), e[1] >= 10 && e[2] >= 3 && (b = document.querySelector("meta[name=viewport]")))) { if (-1 !== b.content.indexOf("user-scalable=no")) return !0; if (document.documentElement.scrollWidth <= window.outerWidth) return !0 } return "none" === a.style.msTouchAction || "manipulation" === a.style.touchAction || (!!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] >= 27 && (b = document.querySelector("meta[name=viewport]")) && (-1 !== b.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === a.style.touchAction || "manipulation" === a.style.touchAction)) }, a.attach = function (b, c) { return new a(b, c) }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () { return a }) : "undefined" != typeof module && module.exports ? (module.exports = a.attach, module.exports.FastClick = a) : window.FastClick = a }(), function (a, b) { "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? module.exports = b() : a.Handlebars = a.Handlebars || b() }(this, function () { var a = function () { "use strict"; function a(a) { this.string = a } return a.prototype.toString = function () { return "" + this.string }, a }(), b = function (a) { "use strict"; function b(a) { return i[a] } function c(a) { for (var b = 1; b < arguments.length; b++) for (var c in arguments[b]) Object.prototype.hasOwnProperty.call(arguments[b], c) && (a[c] = arguments[b][c]); return a } function d(a) { return a instanceof h ? a.toString() : null == a ? "" : a ? (a = "" + a, k.test(a) ? a.replace(j, b) : a) : a + "" } function e(a) { return !a && 0 !== a || !(!n(a) || 0 !== a.length) } function f(a, b) { return (a ? a + "." : "") + b } var g = {}, h = a, i = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }, j = /[&<>"'`]/g, k = /[&<>"'`]/; g.extend = c; var l = Object.prototype.toString; g.toString = l; var m = function (a) { return "function" == typeof a }; m(/x/) && (m = function (a) { return "function" == typeof a && "[object Function]" === l.call(a) }); var m; g.isFunction = m; var n = Array.isArray || function (a) { return !(!a || "object" != typeof a) && "[object Array]" === l.call(a) }; return g.isArray = n, g.escapeExpression = d, g.isEmpty = e, g.appendContextPath = f, g }(a), c = function () { "use strict"; function a(a, c) { var d; c && c.firstLine && (d = c.firstLine, a += " - " + d + ":" + c.firstColumn); for (var e = Error.prototype.constructor.call(this, a), f = 0; f < b.length; f++) this[b[f]] = e[b[f]]; d && (this.lineNumber = d, this.column = c.firstColumn) } var b = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"]; return a.prototype = new Error, a }(), d = function (a, b) { "use strict"; function c(a, b) { this.helpers = a || {}, this.partials = b || {}, d(this) } function d(a) { a.registerHelper("helperMissing", function () { if (1 !== arguments.length) throw new g("Missing helper: '" + arguments[arguments.length - 1].name + "'") }), a.registerHelper("blockHelperMissing", function (b, c) { var d = c.inverse, e = c.fn; if (!0 === b) return e(this); if (!1 === b || null == b) return d(this); if (i(b)) return b.length > 0 ? (c.ids && (c.ids = [c.name]), a.helpers.each(b, c)) : d(this); if (c.data && c.ids) { var g = o(c.data); g.contextPath = f.appendContextPath(c.data.contextPath, c.name), c = { data: g } } return e(b, c) }), a.registerHelper("each", function (a, b) { if (!b) throw new g("Must pass iterator to #each"); var c, d, e = b.fn, h = b.inverse, k = 0, l = ""; if (b.data && b.ids && (d = f.appendContextPath(b.data.contextPath, b.ids[0]) + "."), j(a) && (a = a.call(this)), b.data && (c = o(b.data)), a && "object" == typeof a) if (i(a)) for (var m = a.length; k < m; k++) c && (c.index = k, c.first = 0 === k, c.last = k === a.length - 1, d && (c.contextPath = d + k)), l += e(a[k], { data: c }); else for (var n in a) a.hasOwnProperty(n) && (c && (c.key = n, c.index = k, c.first = 0 === k, d && (c.contextPath = d + n)), l += e(a[n], { data: c }), k++); return 0 === k && (l = h(this)), l }), a.registerHelper("if", function (a, b) { return j(a) && (a = a.call(this)), !b.hash.includeZero && !a || f.isEmpty(a) ? b.inverse(this) : b.fn(this) }), a.registerHelper("unless", function (b, c) { return a.helpers.if.call(this, b, { fn: c.inverse, inverse: c.fn, hash: c.hash }) }), a.registerHelper("with", function (a, b) { j(a) && (a = a.call(this)); var c = b.fn; if (f.isEmpty(a)) return b.inverse(this); if (b.data && b.ids) { var d = o(b.data); d.contextPath = f.appendContextPath(b.data.contextPath, b.ids[0]), b = { data: d } } return c(a, b) }), a.registerHelper("log", function (b, c) { var d = c.data && null != c.data.level ? parseInt(c.data.level, 10) : 1; a.log(d, b) }), a.registerHelper("lookup", function (a, b) { return a && a[b] }) } var e = {}, f = a, g = b; e.VERSION = "2.0.0", e.COMPILER_REVISION = 6; var h = { 1: "<= 1.0.rc.2", 2: "== 1.0.0-rc.3", 3: "== 1.0.0-rc.4", 4: "== 1.x.x", 5: "== 2.0.0-alpha.x", 6: ">= 2.0.0-beta.1" }; e.REVISION_CHANGES = h; var i = f.isArray, j = f.isFunction, k = f.toString, l = "[object Object]"; e.HandlebarsEnvironment = c, c.prototype = { constructor: c, logger: m, log: n, registerHelper: function (a, b) { if (k.call(a) === l) { if (b) throw new g("Arg not supported with multiple helpers"); f.extend(this.helpers, a) } else this.helpers[a] = b }, unregisterHelper: function (a) { delete this.helpers[a] }, registerPartial: function (a, b) { k.call(a) === l ? f.extend(this.partials, a) : this.partials[a] = b }, unregisterPartial: function (a) { delete this.partials[a] } }; var m = { methodMap: { 0: "debug", 1: "info", 2: "warn", 3: "error" }, DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3, log: function (a, b) { if (m.level <= a) { var c = m.methodMap[a]; "undefined" != typeof console && console[c] } } }; e.logger = m; var n = m.log; e.log = n; var o = function (a) { var b = f.extend({}, a); return b._parent = a, b }; return e.createFrame = o, e }(b, c), e = function (a, b, c) { "use strict"; function d(a) { var b = a && a[0] || 1, c = m; if (b !== c) { if (b < c) { var d = n[c], e = n[b]; throw new l("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + d + ") or downgrade your runtime to an older version (" + e + ").") } throw new l("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + a[1] + ").") } } function e(a, b) { if (!b) throw new l("No environment passed to template"); if (!a || !a.main) throw new l("Unknown template object: " + typeof a); b.VM.checkRevision(a.compiler); var c = function (c, d, e, f, g, h, i, j, m) { g && (f = k.extend({}, f, g)); var n = b.VM.invokePartial.call(this, c, e, f, h, i, j, m); if (null == n && b.compile) { var o = { helpers: h, partials: i, data: j, depths: m }; i[e] = b.compile(c, { data: void 0 !== j, compat: a.compat }, b), n = i[e](f, o) } if (null != n) { if (d) { for (var p = n.split("\n"), q = 0, r = p.length; q < r; q++) { if (!p[q] && q + 1 === r) break; p[q] = d + p[q] } n = p.join("\n") } return n } throw new l("The partial " + e + " could not be compiled when running in runtime-only mode") }, d = { lookup: function (a, b) { for (var c = a.length, d = 0; d < c; d++) if (a[d] && null != a[d][b]) return a[d][b] }, lambda: function (a, b) { return "function" == typeof a ? a.call(b) : a }, escapeExpression: k.escapeExpression, invokePartial: c, fn: function (b) { return a[b] }, programs: [], program: function (a, b, c) { var d = this.programs[a], e = this.fn(a); return b || c ? d = f(this, a, e, b, c) : d || (d = this.programs[a] = f(this, a, e)), d }, data: function (a, b) { while (a && b--) a = a._parent; return a }, merge: function (a, b) { var c = a || b; return a && b && a !== b && (c = k.extend({}, b, a)), c }, noop: b.VM.noop, compilerInfo: a.compiler }, e = function (b, c) { c = c || {}; var f = c.data; e._setup(c), !c.partial && a.useData && (f = i(b, f)); var g; return a.useDepths && (g = c.depths ? [b].concat(c.depths) : [b]), a.main.call(d, b, d.helpers, d.partials, f, g) }; return e.isTop = !0, e._setup = function (c) { c.partial ? (d.helpers = c.helpers, d.partials = c.partials) : (d.helpers = d.merge(c.helpers, b.helpers), a.usePartial && (d.partials = d.merge(c.partials, b.partials))) }, e._child = function (b, c, e) { if (a.useDepths && !e) throw new l("must pass parent depths"); return f(d, b, a[b], c, e) }, e } function f(a, b, c, d, e) { var f = function (b, f) { return f = f || {}, c.call(a, b, a.helpers, a.partials, f.data || d, e && [b].concat(e)) }; return f.program = b, f.depth = e ? e.length : 0, f } function g(a, b, c, d, e, f, g) { var h = { partial: !0, helpers: d, partials: e, data: f, depths: g }; if (void 0 === a) throw new l("The partial " + b + " could not be found"); if (a instanceof Function) return a(c, h) } function h() { return "" } function i(a, b) { return b && "root" in b || (b = b ? o(b) : {}, b.root = a), b } var j = {}, k = a, l = b, m = c.COMPILER_REVISION, n = c.REVISION_CHANGES, o = c.createFrame; return j.checkRevision = d, j.template = e, j.program = f, j.invokePartial = g, j.noop = h, j }(b, c, d); return function (a, b, c, d, e) { "use strict"; var f = a, g = b, h = c, i = d, j = e, k = function () { var a = new f.HandlebarsEnvironment; return i.extend(a, f), a.SafeString = g, a.Exception = h, a.Utils = i, a.escapeExpression = i.escapeExpression, a.VM = j, a.template = function (b) { return j.template(b, a) }, a }, l = k(); return l.create = k, l.default = l, l }(d, a, c, b, e) }), function () { "use strict"; function a(a) { return c(d(a), arguments) } function b(b, c) { return a.apply(null, [b].concat(c || [])) } function c(b, c) { var d, f, g, h, i, j, k, l, m, n = 1, o = b.length, p = ""; for (f = 0; f < o; f++) if ("string" == typeof b[f]) p += b[f]; else if (Array.isArray(b[f])) { if (h = b[f], h[2]) for (d = c[n], g = 0; g < h[2].length; g++) { if (!d.hasOwnProperty(h[2][g])) throw new Error(a('[sprintf] property "%s" does not exist', h[2][g])); d = d[h[2][g]] } else d = h[1] ? c[h[1]] : c[n++]; if (e.not_type.test(h[8]) && e.not_primitive.test(h[8]) && d instanceof Function && (d = d()), e.numeric_arg.test(h[8]) && "number" != typeof d && isNaN(d)) throw new TypeError(a("[sprintf] expecting number but found %T", d)); switch (e.number.test(h[8]) && (l = d >= 0), h[8]) { case "b": d = parseInt(d, 10).toString(2); break; case "c": d = String.fromCharCode(parseInt(d, 10)); break; case "d": case "i": d = parseInt(d, 10); break; case "j": d = JSON.stringify(d, null, h[6] ? parseInt(h[6]) : 0); break; case "e": d = h[7] ? parseFloat(d).toExponential(h[7]) : parseFloat(d).toExponential(); break; case "f": d = h[7] ? parseFloat(d).toFixed(h[7]) : parseFloat(d); break; case "g": d = h[7] ? String(Number(d.toPrecision(h[7]))) : parseFloat(d); break; case "o": d = (parseInt(d, 10) >>> 0).toString(8); break; case "s": d = String(d), d = h[7] ? d.substring(0, h[7]) : d; break; case "t": d = String(!!d), d = h[7] ? d.substring(0, h[7]) : d; break; case "T": d = Object.prototype.toString.call(d).slice(8, -1).toLowerCase(), d = h[7] ? d.substring(0, h[7]) : d; break; case "u": d = parseInt(d, 10) >>> 0; break; case "v": d = d.valueOf(), d = h[7] ? d.substring(0, h[7]) : d; break; case "x": d = (parseInt(d, 10) >>> 0).toString(16); break; case "X": d = (parseInt(d, 10) >>> 0).toString(16).toUpperCase() } e.json.test(h[8]) ? p += d : (!e.number.test(h[8]) || l && !h[3] ? m = "" : (m = l ? "+" : "-", d = d.toString().replace(e.sign, "")), j = h[4] ? "0" === h[4] ? "0" : h[4].charAt(1) : " ", k = h[6] - (m + d).length, i = h[6] && k > 0 ? j.repeat(k) : "", p += h[5] ? m + d + i : "0" === j ? m + i + d : i + m + d) } return p } function d(a) { if (f[a]) return f[a]; var b, c = a, d = [], g = 0; while (c) { if (null !== (b = e.text.exec(c))) d.push(b[0]); else if (null !== (b = e.modulo.exec(c))) d.push("%"); else { if (null === (b = e.placeholder.exec(c))) throw new SyntaxError("[sprintf] unexpected placeholder"); if (b[2]) { g |= 1; var h = [], i = b[2], j = []; if (null === (j = e.key.exec(i))) throw new SyntaxError("[sprintf] failed to parse named argument key"); h.push(j[1]); while ("" !== (i = i.substring(j[0].length))) if (null !== (j = e.key_access.exec(i))) h.push(j[1]); else { if (null === (j = e.index_access.exec(i))) throw new SyntaxError("[sprintf] failed to parse named argument key"); h.push(j[1]) } b[2] = h } else g |= 2; if (3 === g) throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported"); d.push(b) } c = c.substring(b[0].length) } return f[a] = d } var e = { not_string: /[^s]/, not_bool: /[^t]/, not_type: /[^T]/, not_primitive: /[^v]/, number: /[diefg]/, numeric_arg: /[bcdiefguxX]/, json: /[j]/, not_json: /[^j]/, text: /^[^\x25]+/, modulo: /^\x25{2}/, placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/, key: /^([a-z_][a-z_\d]*)/i, key_access: /^\.([a-z_][a-z_\d]*)/i, index_access: /^\[(\d+)\]/, sign: /^[\+\-]/ }, f = Object.create(null); "undefined" != typeof exports && (exports.sprintf = a, exports.vsprintf = b), "undefined" != typeof window && (window.sprintf = a, window.vsprintf = b, "function" == typeof define && define.amd && define(function () { return { sprintf: a, vsprintf: b } })) }();