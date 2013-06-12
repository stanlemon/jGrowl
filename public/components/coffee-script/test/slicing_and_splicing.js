(function() {
  var shared;

  shared = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  test("basic slicing", function() {
    arrayEq([7, 8, 9], shared.slice(7, 10));
    arrayEq([2, 3], shared.slice(2, 4));
    return arrayEq([2, 3, 4, 5], shared.slice(2, 6));
  });

  test("slicing with variables as endpoints", function() {
    var a, b, _ref;
    _ref = [1, 4], a = _ref[0], b = _ref[1];
    arrayEq([1, 2, 3, 4], shared.slice(a, +b + 1 || 9e9));
    return arrayEq([1, 2, 3], shared.slice(a, b));
  });

  test("slicing with expressions as endpoints", function() {
    var a, b, _ref;
    _ref = [1, 3], a = _ref[0], b = _ref[1];
    arrayEq([2, 3, 4, 5, 6], shared.slice(a + 1, +(2 * b) + 1 || 9e9));
    return arrayEq([2, 3, 4, 5], shared.slice(a + 1, 2 * b));
  });

  test("unbounded slicing", function() {
    var a, _i, _j, _ref, _ref1, _ref2, _ref3;
    arrayEq([7, 8, 9], shared.slice(7));
    arrayEq([8, 9], shared.slice(-2));
    arrayEq([9], shared.slice(-1));
    arrayEq([0, 1, 2], shared.slice(0, 3));
    arrayEq([0, 1, 2, 3], shared.slice(0, -6));
    arrayEq(shared, shared.slice(0));
    arrayEq(shared.slice(0, 9), shared.slice(0, -1));
    for (a = _i = _ref = -shared.length, _ref1 = shared.length; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; a = _ref <= _ref1 ? ++_i : --_i) {
      arrayEq(shared.slice(a), shared.slice(a));
    }
    for (a = _j = _ref2 = -shared.length + 1, _ref3 = shared.length; _ref2 <= _ref3 ? _j < _ref3 : _j > _ref3; a = _ref2 <= _ref3 ? ++_j : --_j) {
      arrayEq(shared.slice(0, +a + 1 || 9e9).slice(0, -1), shared.slice(0, a));
    }
    return arrayEq([1, 2, 3], [1, 2, 3].slice(0));
  });

  test("#930, #835, #831, #746 #624: inclusive slices to -1 should slice to end", function() {
    arrayEq(shared, shared.slice(0));
    arrayEq(shared, shared.slice(0));
    return arrayEq(shared.slice(1, shared.length), shared.slice(1));
  });

  test("string slicing", function() {
    var str;
    str = "abcdefghijklmnopqrstuvwxyz";
    ok(str.slice(1, 1) === "");
    ok(str.slice(1, 2) === "b");
    ok(str.slice(1, 5) === "bcde");
    ok(str.slice(0, 5) === "abcde");
    return ok(str.slice(-5) === "vwxyz");
  });

  test("#1722: operator precedence in unbounded slice compilation", function() {
    var list, n, _i, _j, _k, _results, _results1, _results2;
    list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    n = 2;
    arrayEq((function() {
      _results = [];
      for (var _i = 0; 0 <= n ? _i <= n : _i >= n; 0 <= n ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), list.slice(0, +n + 1 || 9e9));
    arrayEq((function() {
      _results1 = [];
      for (var _j = 0; 0 <= n ? _j <= n : _j >= n; 0 <= n ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this), list.slice(0, +(n || 0) + 1 || 9e9));
    return arrayEq((function() {
      _results2 = [];
      for (var _k = 0; 0 <= n ? _k <= n : _k >= n; 0 <= n ? _k++ : _k--){ _results2.push(_k); }
      return _results2;
    }).apply(this), list.slice(0, +(n ? n : 0) + 1 || 9e9));
  });

  test("#2349: inclusive slicing to numeric strings", function() {
    return arrayEq([0, 1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, +"1" + 1 || 9e9));
  });

  test("basic splicing", function() {
    var ary, _ref, _ref1;
    ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(ary, [5, 5].concat(_ref = [0, 0, 0])), _ref;
    arrayEq([0, 1, 2, 3, 4, 0, 0, 0], ary);
    ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(ary, [2, 6].concat(_ref1 = [])), _ref1;
    return arrayEq([0, 1, 8, 9], ary);
  });

  test("unbounded splicing", function() {
    var ary, _ref, _ref1, _ref2;
    ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(ary, [3, 9e9].concat(_ref = [9, 8, 7])), _ref;
    arrayEq([0, 1, 2, 9, 8, 7].ary);
    [].splice.apply(ary, [0, 3 - 0].concat(_ref1 = [7, 8, 9])), _ref1;
    arrayEq([7, 8, 9, 9, 8, 7], ary);
    [].splice.apply(ary, [0, 9e9].concat(_ref2 = [1, 2, 3])), _ref2;
    return arrayEq([1, 2, 3], ary);
  });

  test("splicing with variables as endpoints", function() {
    var a, ary, b, _ref, _ref1, _ref2;
    _ref = [1, 8], a = _ref[0], b = _ref[1];
    ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(ary, [a, b - a + 1].concat(_ref1 = [2, 3])), _ref1;
    arrayEq([0, 2, 3, 9], ary);
    ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(ary, [a, b - a].concat(_ref2 = [5])), _ref2;
    return arrayEq([0, 5, 8, 9], ary);
  });

  test("splicing with expressions as endpoints", function() {
    var a, ary, b, _ref, _ref1, _ref2, _ref3, _ref4;
    _ref = [1, 3], a = _ref[0], b = _ref[1];
    ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(ary, [(_ref1 = a + 1), (2 * b + 1) - _ref1 + 1].concat(_ref2 = [4])), _ref2;
    arrayEq([0, 1, 4, 8, 9], ary);
    ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(ary, [(_ref3 = a + 1), (2 * b + 1) - _ref3].concat(_ref4 = [4])), _ref4;
    return arrayEq([0, 1, 4, 7, 8, 9], ary);
  });

  test("splicing to the end, against a one-time function", function() {
    var ary, fn;
    ary = null;
    fn = function() {
      if (ary) {
        throw 'err';
      } else {
        return ary = [1, 2, 3];
      }
    };
    [].splice.apply(fn(), [0, 9e9].concat(1)), 1;
    return arrayEq(ary, [1]);
  });

  test("the return value of a splice literal should be the RHS", function() {
    var ary;
    ary = [0, 0, 0];
    eq((([].splice.apply(ary, [0, 2].concat(2)), 2)), 2);
    ary = [0, 0, 0];
    eq((([].splice.apply(ary, [0, 9e9].concat(3)), 3)), 3);
    return arrayEq([([].splice.apply(ary, [0, 1].concat(0)), 0)], [0]);
  });

  test("#1723: operator precedence in unbounded splice compilation", function() {
    var list, n, _i, _j, _k, _results, _results1, _results2;
    n = 4;
    list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(list, [0, n - 0 + 1].concat(n)), n;
    arrayEq((function() {
      _results = [];
      for (var _i = n; n <= 9 ? _i <= 9 : _i >= 9; n <= 9 ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), list);
    list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(list, [0, (n || 0) - 0 + 1].concat(n)), n;
    arrayEq((function() {
      _results1 = [];
      for (var _j = n; n <= 9 ? _j <= 9 : _j >= 9; n <= 9 ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this), list);
    list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    [].splice.apply(list, [0, (n ? n : 0) - 0 + 1].concat(n)), n;
    return arrayEq((function() {
      _results2 = [];
      for (var _k = n; n <= 9 ? _k <= 9 : _k >= 9; n <= 9 ? _k++ : _k--){ _results2.push(_k); }
      return _results2;
    }).apply(this), list);
  });

}).call(this);
