(function() {
  var baseFileName, compact, count, del, ends, extend, flatten, last, merge, repeat, starts, _ref,
    __hasProp = {}.hasOwnProperty;

  _ref = CoffeeScript.helpers, starts = _ref.starts, ends = _ref.ends, repeat = _ref.repeat, compact = _ref.compact, count = _ref.count, merge = _ref.merge, extend = _ref.extend, flatten = _ref.flatten, del = _ref.del, last = _ref.last, baseFileName = _ref.baseFileName;

  test("the `starts` helper tests if a string starts with another string", function() {
    ok(starts('01234', '012'));
    return ok(!starts('01234', '123'));
  });

  test("the `starts` helper can take an optional offset", function() {
    ok(starts('01234', '34', 3));
    return ok(!starts('01234', '01', 1));
  });

  test("the `ends` helper tests if a string ends with another string", function() {
    ok(ends('01234', '234'));
    return ok(!ends('01234', '012'));
  });

  test("the `ends` helper can take an optional offset", function() {
    ok(ends('01234', '012', 2));
    return ok(!ends('01234', '234', 6));
  });

  test("the `repeat` helper concatenates a given number of times", function() {
    return eq('asdasdasd', repeat('asd', 3));
  });

  test("`repeat`ing a string 0 times always returns the empty string", function() {
    return eq('', repeat('whatever', 0));
  });

  test("the `compact` helper removes falsey values from an array, preserves truthy ones", function() {
    var allValues, obj, truthyValues;
    allValues = [1, 0, false, obj = {}, [], '', ' ', -1, null, void 0, true];
    truthyValues = [1, obj, [], ' ', -1, true];
    return arrayEq(truthyValues, compact(allValues));
  });

  test("the `count` helper counts the number of occurances of a string in another string", function() {
    eq(1 / 0, count('abc', ''));
    eq(0, count('abc', 'z'));
    eq(1, count('abc', 'a'));
    eq(1, count('abc', 'b'));
    eq(2, count('abcdc', 'c'));
    return eq(2, count('abcdabcd', 'abc'));
  });

  test("the `merge` helper makes a new object with all properties of the objects given as its arguments", function() {
    var ary, key, merged, obj, val, _results;
    ary = [0, 1, 2, 3, 4];
    obj = {};
    merged = merge(obj, ary);
    ok(merged !== obj);
    ok(merged !== ary);
    _results = [];
    for (key in ary) {
      if (!__hasProp.call(ary, key)) continue;
      val = ary[key];
      _results.push(eq(val, merged[key]));
    }
    return _results;
  });

  test("the `extend` helper performs a shallow copy", function() {
    var ary, obj;
    ary = [0, 1, 2, 3];
    obj = {};
    eq(obj, extend(obj, ary));
    return eq(2, obj[2]);
  });

  test("the `flatten` helper flattens an array", function() {
    var n, success, _i, _len, _ref1;
    success = true;
    _ref1 = flatten([0, [[[1]], 2], 3, [4]]);
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      n = _ref1[_i];
      success && (success = typeof n === 'number');
    }
    return ok(success);
  });

  test("the `del` helper deletes a property from an object and returns the deleted value", function() {
    var obj;
    obj = [0, 1, 2];
    eq(1, del(obj, 1));
    return ok(!(1 in obj));
  });

  test("the `last` helper returns the last item of an array-like object", function() {
    var ary;
    ary = [0, 1, 2, 3, 4];
    return eq(4, last(ary));
  });

  test("the `last` helper allows one to specify an optional offset", function() {
    var ary;
    ary = [0, 1, 2, 3, 4];
    return eq(2, last(ary, 2));
  });

  test("the `baseFileName` helper returns the file name to write to", function() {
    var expectedFileName, ext, filename, name, sourceFileName, sourceToCompiled, _results;
    ext = '.js';
    sourceToCompiled = {
      '.coffee': ext,
      'a.coffee': 'a' + ext,
      'b.coffee': 'b' + ext,
      'coffee.coffee': 'coffee' + ext,
      '.litcoffee': ext,
      'a.litcoffee': 'a' + ext,
      'b.litcoffee': 'b' + ext,
      'coffee.litcoffee': 'coffee' + ext,
      '.lit': ext,
      'a.lit': 'a' + ext,
      'b.lit': 'b' + ext,
      'coffee.lit': 'coffee' + ext,
      '.coffee.md': ext,
      'a.coffee.md': 'a' + ext,
      'b.coffee.md': 'b' + ext,
      'coffee.coffee.md': 'coffee' + ext
    };
    _results = [];
    for (sourceFileName in sourceToCompiled) {
      expectedFileName = sourceToCompiled[sourceFileName];
      name = baseFileName(sourceFileName, true);
      filename = name + ext;
      _results.push(eq(filename, expectedFileName));
    }
    return _results;
  });

}).call(this);
