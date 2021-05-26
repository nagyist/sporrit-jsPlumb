'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function filterList(list, value, missingIsFalse) {
  if (list === "*") {
    return true;
  }
  return list.length > 0 ? list.indexOf(value) !== -1 : !missingIsFalse;
}
function extend(o1, o2, keys) {
  var i;
  o1 = o1 || {};
  o2 = o2 || {};
  var _o1 = o1,
      _o2 = o2;
  if (keys) {
    for (i = 0; i < keys.length; i++) {
      _o1[keys[i]] = _o2[keys[i]];
    }
  } else {
    for (i in _o2) {
      _o1[i] = _o2[i];
    }
  }
  return o1;
}
function isArray(a) {
  return Array.isArray(a);
}
function isNumber(n) {
  return Object.prototype.toString.call(n) === "[object Number]";
}
function isString(s) {
  return typeof s === "string";
}
function isBoolean(s) {
  return typeof s === "boolean";
}
function isNull(s) {
  return s == null;
}
function isObject(o) {
  return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
}
function isDate(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
}
function isFunction(o) {
  return Object.prototype.toString.call(o) === "[object Function]";
}
function isNamedFunction(o) {
  return isFunction(o) && o.name != null && o.name.length > 0;
}
function isEmpty(o) {
  for (var i in o) {
    if (o.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}
var IS = {
  anObject: function anObject(o) {
    return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
  },
  aString: function aString(o) {
    return isString(o);
  }
};
function clone(a) {
  if (isString(a)) {
    return "" + a;
  } else if (isBoolean(a)) {
    return !!a;
  } else if (isDate(a)) {
    return new Date(a.getTime());
  } else if (isFunction(a)) {
    return a;
  } else if (isArray(a)) {
    var _b = [];
    for (var i = 0; i < a.length; i++) {
      _b.push(clone(a[i]));
    }
    return _b;
  } else if (IS.anObject(a)) {
    var c = {};
    for (var j in a) {
      c[j] = clone(a[j]);
    }
    return c;
  } else {
    return a;
  }
}
function filterNull(obj) {
  var o = {};
  for (var k in obj) {
    if (obj[k] != null) {
      o[k] = obj[k];
    }
  }
  return o;
}
function merge(a, b, collations, overwrites) {
  var cMap = {},
      ar,
      i,
      oMap = {};
  collations = collations || [];
  overwrites = overwrites || [];
  for (i = 0; i < collations.length; i++) {
    cMap[collations[i]] = true;
  }
  for (i = 0; i < overwrites.length; i++) {
    oMap[overwrites[i]] = true;
  }
  var c = clone(a);
  for (i in b) {
    if (c[i] == null || oMap[i]) {
      c[i] = b[i];
    } else if (cMap[i]) {
      ar = [];
      ar.push.apply(ar, isArray(c[i]) ? c[i] : [c[i]]);
      ar.push(b[i]);
      c[i] = ar;
    } else if (isString(b[i]) || isBoolean(b[i]) || isFunction(b[i]) || isNumber(b[i])) {
      c[i] = b[i];
    } else {
      if (isArray(b[i])) {
        ar = [];
        if (isArray(c[i])) {
          ar.push.apply(ar, c[i]);
        }
        ar.push.apply(ar, b[i]);
        c[i] = ar;
      } else if (IS.anObject(b[i])) {
        if (!IS.anObject(c[i])) {
          c[i] = {};
        }
        for (var j in b[i]) {
          c[i][j] = b[i][j];
        }
      }
    }
  }
  return c;
}
function replace(inObj, path, value) {
  if (inObj == null) {
    return;
  }
  var q = inObj,
      t = q;
  path.replace(/([^\.])+/g, function (term, lc, pos, str) {
    var array = term.match(/([^\[0-9]+){1}(\[)([0-9+])/),
        last = pos + term.length >= str.length,
        _getArray = function _getArray() {
      return t[array[1]] || function () {
        t[array[1]] = [];
        return t[array[1]];
      }();
    };
    if (last) {
      if (array) {
        _getArray()[array[3]] = value;
      } else {
        t[term] = value;
      }
    } else {
      if (array) {
        var _a2 = _getArray();
        t = _a2[array[3]] || function () {
          _a2[array[3]] = {};
          return _a2[array[3]];
        }();
      } else {
        t = t[term] || function () {
          t[term] = {};
          return t[term];
        }();
      }
    }
    return "";
  });
  return inObj;
}
function functionChain(successValue, failValue, fns) {
  for (var i = 0; i < fns.length; i++) {
    var o = fns[i][0][fns[i][1]].apply(fns[i][0], fns[i][2]);
    if (o === failValue) {
      return o;
    }
  }
  return successValue;
}
function populate(model, values, functionPrefix, doNotExpandFunctions) {
  var getValue = function getValue(fromString) {
    var matches = fromString.match(/(\${.*?})/g);
    if (matches != null) {
      for (var i = 0; i < matches.length; i++) {
        var val = values[matches[i].substring(2, matches[i].length - 1)] || "";
        if (val != null) {
          fromString = fromString.replace(matches[i], val);
        }
      }
    }
    return fromString;
  };
  var _one = function _one(d) {
    if (d != null) {
      if (isString(d)) {
        return getValue(d);
      } else if (isFunction(d) && !doNotExpandFunctions && (functionPrefix == null || (d.name || "").indexOf(functionPrefix) === 0)) {
        return d(values);
      } else if (isArray(d)) {
        var r = [];
        for (var i = 0; i < d.length; i++) {
          r.push(_one(d[i]));
        }
        return r;
      } else if (IS.anObject(d)) {
        var s = {};
        for (var j in d) {
          s[j] = _one(d[j]);
        }
        return s;
      } else {
        return d;
      }
    }
  };
  return _one(model);
}
function forEach(a, f) {
  if (a) {
    for (var i = 0; i < a.length; i++) {
      f(a[i]);
    }
  } else {
    return null;
  }
}
function findWithFunction(a, f) {
  if (a) {
    for (var i = 0; i < a.length; i++) {
      if (f(a[i])) {
        return i;
      }
    }
  }
  return -1;
}
function findAllWithFunction(a, f) {
  var o = [];
  if (a) {
    for (var i = 0; i < a.length; i++) {
      if (f(a[i])) {
        o.push(i);
      }
    }
  }
  return o;
}
function getWithFunction(a, f) {
  var idx = findWithFunction(a, f);
  return idx === -1 ? null : a[idx];
}
function getAllWithFunction(a, f) {
  var indexes = findAllWithFunction(a, f);
  return indexes.map(function (i) {
    return a[i];
  });
}
function getFromSetWithFunction(s, f) {
  var out = null;
  s.forEach(function (t) {
    if (f(t)) {
      out = t;
    }
  });
  return out;
}
function setToArray(s) {
  var a = [];
  s.forEach(function (t) {
    a.push(t);
  });
  return a;
}
function removeWithFunction(a, f) {
  var idx = findWithFunction(a, f);
  if (idx > -1) {
    a.splice(idx, 1);
  }
  return idx !== -1;
}
function fromArray(a) {
  if (Array.fromArray != null) {
    return Array.from(a);
  } else {
    var arr = [];
    Array.prototype.push.apply(arr, a);
    return arr;
  }
}
function remove(l, v) {
  var idx = l.indexOf(v);
  if (idx > -1) {
    l.splice(idx, 1);
  }
  return idx !== -1;
}
function addWithFunction(list, item, hashFunction) {
  if (findWithFunction(list, hashFunction) === -1) {
    list.push(item);
  }
}
function addToDictionary(map, key, value, insertAtStart) {
  var l = map[key];
  if (l == null) {
    l = [];
    map[key] = l;
  }
  l[insertAtStart ? "unshift" : "push"](value);
  return l;
}
function addToList(map, key, value, insertAtStart) {
  var l = map.get(key);
  if (l == null) {
    l = [];
    map.set(key, l);
  }
  l[insertAtStart ? "unshift" : "push"](value);
  return l;
}
function suggest(list, item, insertAtHead) {
  if (list.indexOf(item) === -1) {
    if (insertAtHead) {
      list.unshift(item);
    } else {
      list.push(item);
    }
    return true;
  }
  return false;
}
var lut = [];
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
function uuid() {
  var d0 = Math.random() * 0xffffffff | 0;
  var d1 = Math.random() * 0xffffffff | 0;
  var d2 = Math.random() * 0xffffffff | 0;
  var d3 = Math.random() * 0xffffffff | 0;
  return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}
function rotatePoint(point, center, rotation) {
  var radial = {
    x: point.x - center.x,
    y: point.y - center.y
  },
      cr = Math.cos(rotation / 360 * Math.PI * 2),
      sr = Math.sin(rotation / 360 * Math.PI * 2);
  return {
    x: radial.x * cr - radial.y * sr + center.x,
    y: radial.y * cr + radial.x * sr + center.y,
    cr: cr,
    sr: sr
  };
}
function rotateAnchorOrientation(orientation, rotation) {
  var r = rotatePoint({
    x: orientation[0],
    y: orientation[1]
  }, {
    x: 0,
    y: 0
  }, rotation);
  return [Math.round(r.x), Math.round(r.y)];
}
function fastTrim(s) {
  if (s == null) {
    return null;
  }
  var str = s.replace(/^\s\s*/, ''),
      ws = /\s/,
      i = str.length;
  while (ws.test(str.charAt(--i))) {}
  return str.slice(0, i + 1);
}
function each(obj, fn) {
  obj = obj.length == null || typeof obj === "string" ? [obj] : obj;
  for (var _i = 0; _i < obj.length; _i++) {
    fn(obj[_i]);
  }
}
function map(obj, fn) {
  var o = [];
  for (var _i2 = 0; _i2 < obj.length; _i2++) {
    o.push(fn(obj[_i2]));
  }
  return o;
}
var logEnabled = true;
function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if ( typeof console !== "undefined") {
    try {
      var msg = arguments[arguments.length - 1];
      console.log(msg);
    } catch (e) {}
  }
}
function wrap(wrappedFunction, newFunction, returnOnThisValue) {
  return function () {
    var r = null;
    try {
      if (newFunction != null) {
        r = newFunction.apply(this, arguments);
      }
    } catch (e) {
      log("jsPlumb function failed : " + e);
    }
    if (wrappedFunction != null && (returnOnThisValue == null || r !== returnOnThisValue)) {
      try {
        r = wrappedFunction.apply(this, arguments);
      } catch (e) {
        log("wrapped function failed : " + e);
      }
    }
    return r;
  };
}
function sortHelper(_array, _fn) {
  return _array.sort(_fn);
}
function _mergeOverrides(def, values) {
  var m = extend({}, def);
  for (var _i3 in values) {
    if (values[_i3]) {
      m[_i3] = values[_i3];
    }
  }
  return m;
}
function getsert(map, key, valueGenerator) {
  if (!map.has(key)) {
    map.set(key, valueGenerator());
  }
  return map.get(key);
}
function isAssignableFrom(object, cls) {
  var proto = object.__proto__;
  while (proto != null) {
    if (proto instanceof cls) {
      return true;
    } else {
      proto = proto.__proto__;
    }
  }
  return false;
}
function insertSorted(value, array, comparator, sortDescending) {
  if (array.length === 0) {
    array.push(value);
  } else {
    var flip = sortDescending ? -1 : 1;
    var min = 0;
    var max = array.length;
    var index = Math.floor((min + max) / 2);
    while (max > min) {
      var c = comparator(value, array[index]) * flip;
      if (c < 0) {
        max = index;
      } else {
        min = index + 1;
      }
      index = Math.floor((min + max) / 2);
    }
    array.splice(index, 0, value);
  }
}
function pointSubtract(p1, p2) {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var EventGenerator =
function () {
  function EventGenerator() {
    _classCallCheck(this, EventGenerator);
    _defineProperty(this, "_listeners", {});
    _defineProperty(this, "eventsSuspended", false);
    _defineProperty(this, "tick", false);
    _defineProperty(this, "eventsToDieOn", {
      "ready": true
    });
    _defineProperty(this, "queue", []);
  }
  _createClass(EventGenerator, [{
    key: "fire",
    value: function fire(event, value, originalEvent) {
      var ret = null;
      if (!this.tick) {
        this.tick = true;
        if (!this.eventsSuspended && this._listeners[event]) {
          var l = this._listeners[event].length,
              i = 0,
              _gone = false;
          if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
            while (!_gone && i < l && ret !== false) {
              if (this.eventsToDieOn[event]) {
                this._listeners[event][i].apply(this, [value, originalEvent]);
              } else {
                try {
                  ret = this._listeners[event][i].apply(this, [value, originalEvent]);
                } catch (e) {
                  log("jsPlumb: fire failed for event " + event + " : " + (e.message || e));
                }
              }
              i++;
              if (this._listeners == null || this._listeners[event] == null) {
                _gone = true;
              }
            }
          }
        }
        this.tick = false;
        this._drain();
      } else {
        this.queue.unshift(arguments);
      }
      return ret;
    }
  }, {
    key: "_drain",
    value: function _drain() {
      var n = this.queue.pop();
      if (n) {
        this.fire.apply(this, n);
      }
    }
  }, {
    key: "unbind",
    value: function unbind(eventOrListener, listener) {
      if (arguments.length === 0) {
        this._listeners = {};
      } else if (arguments.length === 1) {
        if (typeof eventOrListener === "string") {
          delete this._listeners[eventOrListener];
        } else if (eventOrListener.__jsPlumb) {
          var evt;
          for (var i in eventOrListener.__jsPlumb) {
            evt = eventOrListener.__jsPlumb[i];
            remove(this._listeners[evt] || [], eventOrListener);
          }
        }
      } else if (arguments.length === 2) {
        remove(this._listeners[eventOrListener] || [], listener);
      }
      return this;
    }
  }, {
    key: "getListener",
    value: function getListener(forEvent) {
      return this._listeners[forEvent] || [];
    }
  }, {
    key: "isSuspendEvents",
    value: function isSuspendEvents() {
      return this.eventsSuspended;
    }
  }, {
    key: "setSuspendEvents",
    value: function setSuspendEvents(val) {
      this.eventsSuspended = val;
    }
  }, {
    key: "bind",
    value: function bind(event, listener, insertAtStart) {
      var _this = this;
      var _one = function _one(evt) {
        addToDictionary(_this._listeners, evt, listener, insertAtStart);
        listener.__jsPlumb = listener.__jsPlumb || {};
        listener.__jsPlumb[uuid()] = evt;
      };
      if (typeof event === "string") {
        _one(event);
      } else if (event.length != null) {
        for (var i = 0; i < event.length; i++) {
          _one(event[i]);
        }
      }
      return this;
    }
  }, {
    key: "silently",
    value: function silently(fn) {
      this.setSuspendEvents(true);
      try {
        fn();
      } catch (e) {
        log("Cannot execute silent function " + e);
      }
      this.setSuspendEvents(false);
    }
  }]);
  return EventGenerator;
}();
var OptimisticEventGenerator =
function (_EventGenerator) {
  _inherits(OptimisticEventGenerator, _EventGenerator);
  function OptimisticEventGenerator() {
    _classCallCheck(this, OptimisticEventGenerator);
    return _possibleConstructorReturn(this, _getPrototypeOf(OptimisticEventGenerator).apply(this, arguments));
  }
  _createClass(OptimisticEventGenerator, [{
    key: "shouldFireEvent",
    value: function shouldFireEvent(event, value, originalEvent) {
      return true;
    }
  }]);
  return OptimisticEventGenerator;
}(EventGenerator);

exports.EventGenerator = EventGenerator;
exports.IS = IS;
exports.OptimisticEventGenerator = OptimisticEventGenerator;
exports._mergeOverrides = _mergeOverrides;
exports.addToDictionary = addToDictionary;
exports.addToList = addToList;
exports.addWithFunction = addWithFunction;
exports.clone = clone;
exports.each = each;
exports.extend = extend;
exports.fastTrim = fastTrim;
exports.filterList = filterList;
exports.filterNull = filterNull;
exports.findAllWithFunction = findAllWithFunction;
exports.findWithFunction = findWithFunction;
exports.forEach = forEach;
exports.fromArray = fromArray;
exports.functionChain = functionChain;
exports.getAllWithFunction = getAllWithFunction;
exports.getFromSetWithFunction = getFromSetWithFunction;
exports.getWithFunction = getWithFunction;
exports.getsert = getsert;
exports.insertSorted = insertSorted;
exports.isArray = isArray;
exports.isAssignableFrom = isAssignableFrom;
exports.isBoolean = isBoolean;
exports.isDate = isDate;
exports.isEmpty = isEmpty;
exports.isFunction = isFunction;
exports.isNamedFunction = isNamedFunction;
exports.isNull = isNull;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.log = log;
exports.logEnabled = logEnabled;
exports.map = map;
exports.merge = merge;
exports.pointSubtract = pointSubtract;
exports.populate = populate;
exports.remove = remove;
exports.removeWithFunction = removeWithFunction;
exports.replace = replace;
exports.rotateAnchorOrientation = rotateAnchorOrientation;
exports.rotatePoint = rotatePoint;
exports.setToArray = setToArray;
exports.sortHelper = sortHelper;
exports.suggest = suggest;
exports.uuid = uuid;
exports.wrap = wrap;
