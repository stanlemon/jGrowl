(function() {
  var ArrayProto, ObjProto, addToWrapper, breaker, escapeRegExp, hasOwnProperty, idCounter, nativeEvery, nativeFilter, nativeForEach, nativeIndexOf, nativeIsArray, nativeKeys, nativeLastIndexOf, nativeMap, nativeReduce, nativeReduceRight, nativeSome, previousUnderscore, propertyIsEnumerable, result, root, slice, toString, unshift, wrapper, _,
    __hasProp = {}.hasOwnProperty;

  root = this;

  previousUnderscore = root._;

  breaker = typeof StopIteration === 'undefined' ? '__break__' : StopIteration;

  escapeRegExp = function(string) {
    return string.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
  };

  ArrayProto = Array.prototype;

  ObjProto = Object.prototype;

  slice = ArrayProto.slice;

  unshift = ArrayProto.unshift;

  toString = ObjProto.toString;

  hasOwnProperty = ObjProto.hasOwnProperty;

  propertyIsEnumerable = ObjProto.propertyIsEnumerable;

  nativeForEach = ArrayProto.forEach;

  nativeMap = ArrayProto.map;

  nativeReduce = ArrayProto.reduce;

  nativeReduceRight = ArrayProto.reduceRight;

  nativeFilter = ArrayProto.filter;

  nativeEvery = ArrayProto.every;

  nativeSome = ArrayProto.some;

  nativeIndexOf = ArrayProto.indexOf;

  nativeLastIndexOf = ArrayProto.lastIndexOf;

  nativeIsArray = Array.isArray;

  nativeKeys = Object.keys;

  _ = function(obj) {
    return new wrapper(obj);
  };

  if (typeof exports !== 'undefined') {
    exports._ = _;
  }

  root._ = _;

  _.VERSION = '1.1.0';

  _.each = function(obj, iterator, context) {
    var e, i, key, val, _i, _ref;
    try {
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (_.isNumber(obj.length)) {
        for (i = _i = 0, _ref = obj.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          iterator.call(context, obj[i], i, obj);
        }
      } else {
        for (key in obj) {
          if (!__hasProp.call(obj, key)) continue;
          val = obj[key];
          iterator.call(context, val, key, obj);
        }
      }
    } catch (_error) {
      e = _error;
      if (e !== breaker) {
        throw e;
      }
    }
    return obj;
  };

  _.map = function(obj, iterator, context) {
    var results;
    if (nativeMap && obj.map === nativeMap) {
      return obj.map(iterator, context);
    }
    results = [];
    _.each(obj, function(value, index, list) {
      return results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  _.reduce = function(obj, iterator, memo, context) {
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) {
        iterator = _.bind(iterator, context);
      }
      return obj.reduce(iterator, memo);
    }
    _.each(obj, function(value, index, list) {
      return memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  };

  _.reduceRight = function(obj, iterator, memo, context) {
    var reversed;
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) {
        iterator = _.bind(iterator, context);
      }
      return obj.reduceRight(iterator, memo);
    }
    reversed = _.clone(_.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  _.detect = function(obj, iterator, context) {
    var result;
    result = null;
    _.each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return _.breakLoop();
      }
    });
    return result;
  };

  _.filter = function(obj, iterator, context) {
    var results;
    if (nativeFilter && obj.filter === nativeFilter) {
      return obj.filter(iterator, context);
    }
    results = [];
    _.each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        return results.push(value);
      }
    });
    return results;
  };

  _.reject = function(obj, iterator, context) {
    var results;
    results = [];
    _.each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) {
        return results.push(value);
      }
    });
    return results;
  };

  _.every = function(obj, iterator, context) {
    var result;
    iterator || (iterator = _.identity);
    if (nativeEvery && obj.every === nativeEvery) {
      return obj.every(iterator, context);
    }
    result = true;
    _.each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) {
        return _.breakLoop();
      }
    });
    return result;
  };

  _.some = function(obj, iterator, context) {
    var result;
    iterator || (iterator = _.identity);
    if (nativeSome && obj.some === nativeSome) {
      return obj.some(iterator, context);
    }
    result = false;
    _.each(obj, function(value, index, list) {
      if ((result = iterator.call(context, value, index, list))) {
        return _.breakLoop();
      }
    });
    return result;
  };

  _.include = function(obj, target) {
    var key, val;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return _.indexOf(obj, target) !== -1;
    }
    for (key in obj) {
      if (!__hasProp.call(obj, key)) continue;
      val = obj[key];
      if (val === target) {
        return true;
      }
    }
    return false;
  };

  _.invoke = function(obj, method) {
    var args, val, _i, _len, _results;
    args = _.rest(arguments, 2);
    _results = [];
    for (_i = 0, _len = obj.length; _i < _len; _i++) {
      val = obj[_i];
      _results.push((method ? val[method] : val).apply(val, args));
    }
    return _results;
  };

  _.pluck = function(obj, key) {
    return _.map(obj, function(val) {
      return val[key];
    });
  };

  _.max = function(obj, iterator, context) {
    var result;
    if (!iterator && _.isArray(obj)) {
      return Math.max.apply(Math, obj);
    }
    result = {
      computed: -Infinity
    };
    _.each(obj, function(value, index, list) {
      var computed;
      computed = iterator ? iterator.call(context, value, index, list) : value;
      return computed >= result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };

  _.min = function(obj, iterator, context) {
    var result;
    if (!iterator && _.isArray(obj)) {
      return Math.min.apply(Math, obj);
    }
    result = {
      computed: Infinity
    };
    _.each(obj, function(value, index, list) {
      var computed;
      computed = iterator ? iterator.call(context, value, index, list) : value;
      return computed < result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };

  _.sortBy = function(obj, iterator, context) {
    return _.pluck((_.map(obj, function(value, index, list) {
      return {
        value: value,
        criteria: iterator.call(context, value, index, list)
      };
    })).sort(function(left, right) {
      var a, b;
      a = left.criteria;
      b = right.criteria;
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }), 'value');
  };

  _.sortedIndex = function(array, obj, iterator) {
    var high, low, mid;
    iterator || (iterator = _.identity);
    low = 0;
    high = array.length;
    while (low < high) {
      mid = (low + high) >> 1;
      if (iterator(array[mid]) < iterator(obj)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  };

  _.toArray = function(iterable) {
    if (!iterable) {
      return [];
    }
    if (iterable.toArray) {
      return iterable.toArray();
    }
    if (_.isArray(iterable)) {
      return iterable;
    }
    if (_.isArguments(iterable)) {
      return slice.call(iterable);
    }
    return _.values(iterable);
  };

  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  _.first = function(array, n, guard) {
    if (n && !guard) {
      return slice.call(array, 0, n);
    } else {
      return array[0];
    }
  };

  _.rest = function(array, index, guard) {
    return slice.call(array, _.isUndefined(index) || guard ? 1 : index);
  };

  _.last = function(array) {
    return array[array.length - 1];
  };

  _.compact = function(array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (item) {
        _results.push(item);
      }
    }
    return _results;
  };

  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) {
        return memo.concat(_.flatten(value));
      }
      memo.push(value);
      return memo;
    }, []);
  };

  _.without = function(array) {
    var val, values, _i, _len, _ref, _results;
    values = _.rest(arguments);
    _ref = _.toArray(array);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      val = _ref[_i];
      if (!_.include(values, val)) {
        _results.push(val);
      }
    }
    return _results;
  };

  _.uniq = function(array, isSorted) {
    var el, i, memo, _i, _len, _ref;
    memo = [];
    _ref = _.toArray(array);
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      el = _ref[i];
      if (i === 0 || (isSorted === true ? _.last(memo) !== el : !_.include(memo, el))) {
        memo.push(el);
      }
    }
    return memo;
  };

  _.intersect = function(array) {
    var rest;
    rest = _.rest(arguments);
    return _.select(_.uniq(array), function(item) {
      return _.all(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  _.zip = function() {
    var i, length, results, _i;
    length = _.max(_.pluck(arguments, 'length'));
    results = new Array(length);
    for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
      results[i] = _.pluck(arguments, String(i));
    }
    return results;
  };

  _.indexOf = function(array, item) {
    var i, l;
    if (nativeIndexOf && array.indexOf === nativeIndexOf) {
      return array.indexOf(item);
    }
    i = 0;
    l = array.length;
    while (l - i) {
      if (array[i] === item) {
        return i;
      } else {
        i++;
      }
    }
    return -1;
  };

  _.lastIndexOf = function(array, item) {
    var i;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return array.lastIndexOf(item);
    }
    i = array.length;
    while (i) {
      if (array[i] === item) {
        return i;
      } else {
        i--;
      }
    }
    return -1;
  };

  _.range = function(start, stop, step) {
    var a, i, idx, len, range, solo;
    a = arguments;
    solo = a.length <= 1;
    i = start = solo ? 0 : a[0];
    stop = solo ? a[0] : a[1];
    step = a[2] || 1;
    len = Math.ceil((stop - start) / step);
    if (len <= 0) {
      return [];
    }
    range = new Array(len);
    idx = 0;
    while (true) {
      if ((step > 0 ? i - stop : stop - i) >= 0) {
        return range;
      }
      range[idx] = i;
      idx++;
      i += step;
    }
  };

  _.bind = function(func, obj) {
    var args;
    args = _.rest(arguments, 2);
    return function() {
      return func.apply(obj || root, args.concat(arguments));
    };
  };

  _.bindAll = function(obj) {
    var funcs;
    funcs = arguments.length > 1 ? _.rest(arguments) : _.functions(obj);
    _.each(funcs, function(f) {
      return obj[f] = _.bind(obj[f], obj);
    });
    return obj;
  };

  _.delay = function(func, wait) {
    var args;
    args = _.rest(arguments, 2);
    return setTimeout((function() {
      return func.apply(func, args);
    }), wait);
  };

  _.memoize = function(func, hasher) {
    var memo;
    memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key;
      key = hasher.apply(this, arguments);
      if (key in memo) {
        return memo[key];
      }
      return memo[key] = func.apply(this, arguments);
    };
  };

  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(_.rest(arguments)));
  };

  _.wrap = function(func, wrapper) {
    return function() {
      return wrapper.apply(wrapper, [func].concat(arguments));
    };
  };

  _.compose = function() {
    var funcs;
    funcs = arguments;
    return function() {
      var args, i, _i, _ref;
      args = arguments;
      for (i = _i = _ref = funcs.length - 1; _i >= 0; i = _i += -1) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  _.keys = nativeKeys || function(obj) {
    var key, val, _results;
    if (_.isArray(obj)) {
      return _.range(0, obj.length);
    }
    _results = [];
    for (key in obj) {
      val = obj[key];
      _results.push(key);
    }
    return _results;
  };

  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  _.functions = function(obj) {
    return _.filter(_.keys(obj), function(key) {
      return _.isFunction(obj[key]);
    }).sort();
  };

  _.extend = function(obj) {
    var key, source, val, _i, _len, _ref;
    _ref = _.rest(arguments);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      source = _ref[_i];
      for (key in source) {
        val = source[key];
        obj[key] = val;
      }
    }
    return obj;
  };

  _.clone = function(obj) {
    if (_.isArray(obj)) {
      return obj.slice(0);
    }
    return _.extend({}, obj);
  };

  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  _.isEqual = function(a, b) {
    var aKeys, atype, bKeys, btype, key, val;
    if (a === b) {
      return true;
    }
    atype = typeof a;
    btype = typeof b;
    if (atype !== btype) {
      return false;
    }
    if (a == b) {
      return true;
    }
    if ((!a && b) || (a && !b)) {
      return false;
    }
    if (a.isEqual) {
      return a.isEqual(b);
    }
    if (_.isDate(a) && _.isDate(b)) {
      return a.getTime() === b.getTime();
    }
    if (_.isNaN(a) && _.isNaN(b)) {
      return false;
    }
    if (_.isRegExp(a) && _.isRegExp(b)) {
      return a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
    }
    if (atype !== 'object') {
      return false;
    }
    if (a.length && (a.length !== b.length)) {
      return false;
    }
    aKeys = _.keys(a);
    bKeys = _.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    for (key in a) {
      val = a[key];
      if (!(key in b) || !_.isEqual(val, b[key])) {
        return false;
      }
    }
    return true;
  };

  _.isEmpty = function(obj) {
    var key;
    if (_.isArray(obj) || _.isString(obj)) {
      return obj.length === 0;
    }
    for (key in obj) {
      if (!__hasProp.call(obj, key)) continue;
      return false;
    }
    return true;
  };

  _.isElement = function(obj) {
    return obj && obj.nodeType === 1;
  };

  _.isArray = nativeIsArray || function(obj) {
    return !!(obj && obj.concat && obj.unshift && !obj.callee);
  };

  _.isArguments = function(obj) {
    return obj && obj.callee;
  };

  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  _.isNumber = function(obj) {
    return (obj === +obj) || toString.call(obj) === '[object Number]';
  };

  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  _.isRegExp = function(obj) {
    return !!(obj && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  _.isNaN = function(obj) {
    return _.isNumber(obj) && window.isNaN(obj);
  };

  _.isNull = function(obj) {
    return obj === null;
  };

  _.isUndefined = function(obj) {
    return typeof obj === 'undefined';
  };

  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  _.identity = function(value) {
    return value;
  };

  _.times = function(n, iterator, context) {
    var i, _i, _results;
    _results = [];
    for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
      _results.push(iterator.call(context, i));
    }
    return _results;
  };

  _.breakLoop = function() {
    throw breaker;
  };

  _.mixin = function(obj) {
    var name, _i, _len, _ref, _results;
    _ref = _.functions(obj);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push(addToWrapper(name, _[name] = obj[name]));
    }
    return _results;
  };

  idCounter = 0;

  _.uniqueId = function(prefix) {
    return (prefix || '') + idCounter++;
  };

  _.templateSettings = {
    start: '<%',
    end: '%>',
    interpolate: /<%=(.+?)%>/g
  };

  _.template = function(str, data) {
    var c, endMatch, fn;
    c = _.templateSettings;
    endMatch = new RegExp("'(?=[^" + c.end.substr(0, 1) + "]*" + escapeRegExp(c.end) + ")", "g");
    fn = new Function('obj', 'var p=[],print=function(){p.push.apply(p,arguments);};' + 'with(obj||{}){p.push(\'' + str.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(endMatch, "✄").split("'").join("\\'").split("✄").join("'").replace(c.interpolate, "',$1,'").split(c.start).join("');").split(c.end).join("p.push('") + "');}return p.join('');");
    if (data) {
      return fn(data);
    } else {
      return fn;
    }
  };

  _.forEach = _.each;

  _.foldl = _.inject = _.reduce;

  _.foldr = _.reduceRight;

  _.select = _.filter;

  _.all = _.every;

  _.any = _.some;

  _.contains = _.include;

  _.head = _.first;

  _.tail = _.rest;

  _.methods = _.functions;

  wrapper = function(obj) {
    this._wrapped = obj;
    return this;
  };

  result = function(obj, chain) {
    if (chain) {
      return _(obj).chain();
    } else {
      return obj;
    }
  };

  addToWrapper = function(name, func) {
    return wrapper.prototype[name] = function() {
      var args;
      args = _.toArray(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  _.mixin(_);

  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method;
    method = Array.prototype[name];
    return wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  _.each(['concat', 'join', 'slice'], function(name) {
    var method;
    method = Array.prototype[name];
    return wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);
