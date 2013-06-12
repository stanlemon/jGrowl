(function() {
  var __slice = [].slice;

  test("trailing commas", function() {
    var a, n, sum, trailingComma, _i, _len;
    trailingComma = [1, 2, 3];
    ok((trailingComma[0] === 1) && (trailingComma[2] === 3) && (trailingComma.length === 3));
    trailingComma = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (_i = 0, _len = trailingComma.length; _i < _len; _i++) {
      n = trailingComma[_i];
      sum = (sum || 0) + n;
    }
    a = [
      (function(x) {
        return x;
      }), (function(x) {
        return x * x;
      })
    ];
    return ok(a.length === 2);
  });

  test("incorrect indentation without commas", function() {
    var result;
    result = [
      ['a'], {
        b: 'c'
      }
    ];
    ok(result[0][0] === 'a');
    return ok(result[1]['b'] === 'c');
  });

  test("array splat expansions with assignments", function() {
    var a, b, list, nums;
    nums = [1, 2, 3];
    list = [a = 0].concat(__slice.call(nums), [b = 4]);
    eq(0, a);
    eq(4, b);
    return arrayEq([0, 1, 2, 3, 4], list);
  });

  test("mixed shorthand objects in array lists", function() {
    var arr;
    arr = [
      {
        a: 1
      }, 'b', {
        c: 1
      }
    ];
    ok(arr.length === 3);
    ok(arr[2].c === 1);
    arr = [
      {
        b: 1,
        a: 2
      }, 100
    ];
    eq(arr[1], 100);
    arr = [
      {
        a: 0,
        b: 1
      }, 1 + 1
    ];
    eq(arr[1], 2);
    arr = [
      {
        a: 1
      }, 'a', {
        b: 1
      }, 'b'
    ];
    eq(arr.length, 4);
    eq(arr[2].b, 1);
    return eq(arr[3], 'b');
  });

  test("array splats with nested arrays", function() {
    var a, list, nonce;
    nonce = {};
    a = [nonce];
    list = [1, 2].concat(__slice.call(a));
    eq(list[0], 1);
    eq(list[2], nonce);
    a = [[nonce]];
    list = [1, 2].concat(__slice.call(a));
    return arrayEq(list, [1, 2, [nonce]]);
  });

  test("#1274: `[] = a()` compiles to `false` instead of `a()`", function() {
    var a, fn;
    a = false;
    fn = function() {
      return a = true;
    };
    fn();
    return ok(a);
  });

}).call(this);
