(function() {
  var shared;

  shared = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  test("basic inclusive ranges", function() {
    arrayEq([1, 2, 3], [1, 2, 3]);
    arrayEq([0, 1, 2], [0, 1, 2]);
    arrayEq([0, 1], [0, 1]);
    arrayEq([0], [0]);
    arrayEq([-1], [-1]);
    arrayEq([-1, 0], [-1, 0]);
    return arrayEq([-1, 0, 1], [-1, 0, 1]);
  });

  test("basic exclusive ranges", function() {
    arrayEq([1, 2, 3], [1, 2, 3]);
    arrayEq([0, 1, 2], [0, 1, 2]);
    arrayEq([0, 1], [0, 1]);
    arrayEq([0], [0]);
    arrayEq([-1], [-1]);
    arrayEq([-1, 0], [-1, 0]);
    arrayEq([-1, 0, 1], [-1, 0, 1]);
    arrayEq([], []);
    arrayEq([], []);
    return arrayEq([], []);
  });

  test("downward ranges", function() {
    arrayEq(shared, [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].reverse());
    arrayEq([5, 4, 3, 2], [5, 4, 3, 2]);
    arrayEq([2, 1, 0, -1], [2, 1, 0, -1]);
    arrayEq([3, 2, 1], [3, 2, 1]);
    arrayEq([2, 1, 0], [2, 1, 0]);
    arrayEq([1, 0], [1, 0]);
    arrayEq([0], [0]);
    arrayEq([-1], [-1]);
    arrayEq([0, -1], [0, -1]);
    arrayEq([1, 0, -1], [1, 0, -1]);
    arrayEq([0, -1, -2], [0, -1, -2]);
    arrayEq([4, 3, 2], [4, 3, 2]);
    arrayEq([3, 2, 1], [3, 2, 1]);
    arrayEq([2, 1], [2, 1]);
    arrayEq([1], [1]);
    arrayEq([], []);
    arrayEq([], []);
    arrayEq([0], [0]);
    arrayEq([0, -1], [0, -1]);
    arrayEq([1, 0], [1, 0]);
    return arrayEq([2, 1, 0], [2, 1, 0]);
  });

  test("ranges with variables as enpoints", function() {
    var a, b, _i, _j, _k, _l, _ref, _results, _results1, _results2, _results3;
    _ref = [1, 3], a = _ref[0], b = _ref[1];
    arrayEq([1, 2, 3], (function() {
      _results = [];
      for (var _i = a; a <= b ? _i <= b : _i >= b; a <= b ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this));
    arrayEq([1, 2], (function() {
      _results1 = [];
      for (var _j = a; a <= b ? _j < b : _j > b; a <= b ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this));
    b = -2;
    arrayEq([1, 0, -1, -2], (function() {
      _results2 = [];
      for (var _k = a; a <= b ? _k <= b : _k >= b; a <= b ? _k++ : _k--){ _results2.push(_k); }
      return _results2;
    }).apply(this));
    return arrayEq([1, 0, -1], (function() {
      _results3 = [];
      for (var _l = a; a <= b ? _l < b : _l > b; a <= b ? _l++ : _l--){ _results3.push(_l); }
      return _results3;
    }).apply(this));
  });

  test("ranges with expressions as endpoints", function() {
    var a, b, _i, _j, _ref, _ref1, _ref2, _ref3, _ref4, _results, _results1;
    _ref = [1, 3], a = _ref[0], b = _ref[1];
    arrayEq([2, 3, 4, 5, 6], (function() {
      _results = [];
      for (var _i = _ref1 = a + 1, _ref2 = 2 * b; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this));
    return arrayEq([2, 3, 4, 5], (function() {
      _results1 = [];
      for (var _j = _ref3 = a + 1, _ref4 = 2 * b; _ref3 <= _ref4 ? _j < _ref4 : _j > _ref4; _ref3 <= _ref4 ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this));
  });

  test("large ranges are generated with looping constructs", function() {
    var down, len, up, _i, _j, _results, _results1;
    down = (function() {
      _results = [];
      for (_i = 99; _i >= 0; _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    eq(100, (len = down.length));
    eq(0, down[len - 1]);
    up = (function() {
      _results1 = [];
      for (_j = 0; _j < 100; _j++){ _results1.push(_j); }
      return _results1;
    }).apply(this);
    eq(100, (len = up.length));
    return eq(99, up[len - 1]);
  });

  test("#1012 slices with arguments object", function() {
    var argsAtBoth, argsAtEnd, argsAtStart, expected;
    expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    argsAtStart = (function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = _ref = arguments[0]; _ref <= 9 ? _i <= 9 : _i >= 9; _ref <= 9 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this, arguments);
    })(0);
    arrayEq(expected, argsAtStart);
    argsAtEnd = (function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = arguments[0]; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this, arguments);
    })(9);
    arrayEq(expected, argsAtEnd);
    argsAtBoth = (function() {
      var _i, _ref, _ref1, _results;
      return (function() {
        _results = [];
        for (var _i = _ref = arguments[0], _ref1 = arguments[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this, arguments);
    })(0, 9);
    return arrayEq(expected, argsAtBoth);
  });

  test("#1409: creating large ranges outside of a function body", function() {
    return CoffeeScript["eval"]('[0..100]');
  });

}).call(this);
