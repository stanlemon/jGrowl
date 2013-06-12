(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  test("binary (2-ary) math operators do not require spaces", function() {
    var a, b;
    a = 1;
    b = -1;
    eq(+1, a * -b);
    eq(-1, a * +b);
    eq(+1, a / -b);
    return eq(-1, a / +b);
  });

  test("operators should respect new lines as spaced", function() {
    var a, b;
    a = 123 + 456;
    eq(579, a);
    b = ("1" + 2 + "3") + "456";
    return eq('123456', b);
  });

  test("multiple operators should space themselves", function() {
    return eq(+ (+1), - (-1));
  });

  test("compound operators on successive lines", function() {
    var a;
    a = 1;
    a += 1;
    return eq(a, 2);
  });

  test("bitwise operators", function() {
    var num;
    eq(2, 10 & 3);
    eq(11, 10 | 3);
    eq(9, 10 ^ 3);
    eq(80, 10 << 3);
    eq(1, 10 >> 3);
    eq(1, 10 >>> 3);
    num = 10;
    eq(2, (num &= 3));
    num = 10;
    eq(11, (num |= 3));
    num = 10;
    eq(9, (num ^= 3));
    num = 10;
    eq(80, (num <<= 3));
    num = 10;
    eq(1, (num >>= 3));
    num = 10;
    return eq(1, (num >>>= 3));
  });

  test("`instanceof`", function() {
    ok(new String instanceof String);
    ok(new Boolean instanceof Boolean);
    ok(!(new Number instanceof String));
    return ok(!(new Array instanceof Boolean));
  });

  test("use `::` operator on keywords `this` and `@`", function() {
    var nonce, obj;
    nonce = {};
    obj = {
      withAt: function() {
        return this.prototype.prop;
      },
      withThis: function() {
        return this.prototype.prop;
      }
    };
    obj.prototype = {
      prop: nonce
    };
    eq(nonce, obj.withAt());
    return eq(nonce, obj.withThis());
  });

  test("binary existential operator", function() {
    var a, b, nonce;
    nonce = {};
    b = typeof a !== "undefined" && a !== null ? a : nonce;
    eq(nonce, b);
    a = null;
    b = void 0;
    b = a != null ? a : nonce;
    eq(nonce, b);
    a = false;
    b = a != null ? a : nonce;
    eq(false, b);
    a = 0;
    b = a != null ? a : nonce;
    return eq(0, b);
  });

  test("binary existential operator conditionally evaluates second operand", function() {
    var func, i, result, _ref;
    i = 1;
    func = function() {
      return i -= 1;
    };
    result = (_ref = func()) != null ? _ref : func();
    return eq(result, 0);
  });

  test("binary existential operator with negative number", function() {
    var a;
    a = typeof null !== "undefined" && null !== null ? null : -1;
    return eq(-1, a);
  });

  test("postfix existential operator", function() {
    var defined;
    ok((typeof nonexistent !== "undefined" && nonexistent !== null ? false : true));
    defined = true;
    ok(defined != null);
    defined = false;
    return ok(defined != null);
  });

  test("postfix existential operator only evaluates its operand once", function() {
    var fn, semaphore;
    semaphore = 0;
    fn = function() {
      if (semaphore) {
        ok(false);
      }
      return ++semaphore;
    };
    return ok(fn() != null ? true : false);
  });

  test("negated postfix existential operator", function() {
    return ok(!(typeof nothing !== "undefined" && nothing !== null ? nothing.value : void 0));
  });

  test("postfix existential operator on expressions", function() {
    return eq(true, (1 || 0) != null, true);
  });

  test("`==` and `is` should be interchangeable", function() {
    var a, b;
    a = b = 1;
    ok(a === 1 && b === 1);
    ok(a === b);
    return ok(a === b);
  });

  test("`!=` and `isnt` should be interchangeable", function() {
    var a, b;
    a = 0;
    b = 1;
    ok(a !== 1 && b !== 0);
    ok(a !== b);
    return ok(a !== b);
  });

  test("in, of", function() {
    var arr;
    arr = [1];
    ok(0 in arr);
    ok(__indexOf.call(arr, 1) >= 0);
    ok(!(1 in arr));
    return ok(__indexOf.call(arr, 0) < 0);
  });

  test("`in` should be able to operate on an array literal", function() {
    var arr, val, _ref, _ref1;
    ok(2 === 0 || 2 === 1 || 2 === 2 || 2 === 3);
    ok(4 !== 0 && 4 !== 1 && 4 !== 2 && 4 !== 3);
    arr = [0, 1, 2, 3];
    ok(__indexOf.call(arr, 2) >= 0);
    ok(__indexOf.call(arr, 4) < 0);
    arr = [0];
    val = 0;
    ok((_ref = val++, __indexOf.call(arr, _ref) >= 0));
    ok((_ref1 = val++, __indexOf.call(arr, _ref1) < 0));
    val = 0;
    ok(val++ in arr);
    return ok(!(val++ in arr));
  });

  test("`of` and `in` should be able to operate on instance variables", function() {
    var obj;
    obj = {
      list: [2, 3],
      in_list: function(value) {
        return __indexOf.call(this.list, value) >= 0;
      },
      not_in_list: function(value) {
        return __indexOf.call(this.list, value) < 0;
      },
      of_list: function(value) {
        return value in this.list;
      },
      not_of_list: function(value) {
        return !(value in this.list);
      }
    };
    ok(obj.in_list(3));
    ok(obj.not_in_list(1));
    ok(obj.of_list(0));
    return ok(obj.not_of_list(2));
  });

  test("#???: `in` with cache and `__indexOf` should work in argument lists", function() {
    var _ref;
    return eq(1, [(_ref = Object(), __indexOf.call(Array(), _ref) >= 0)].length);
  });

  test("#737: `in` should have higher precedence than logical operators", function() {
    return eq(1, (1 === 1) && 1);
  });

  test("#768: `in` should preserve evaluation order", function() {
    var a, b, c, share, _ref;
    share = 0;
    a = function() {
      if (share === 0) {
        return share++;
      }
    };
    b = function() {
      if (share === 1) {
        return share++;
      }
    };
    c = function() {
      if (share === 2) {
        return share++;
      }
    };
    ok((_ref = a()) !== b() && _ref !== c());
    return eq(3, share);
  });

  test("#1099: empty array after `in` should compile to `false`", function() {
    eq(1, [false].length);
    return eq(false, (function() {
      return false;
    })());
  });

  test("#1354: optimized `in` checks should not happen when splats are present", function() {
    var a;
    a = [6, 9];
    return eq(__indexOf.call([3].concat(__slice.call(a)), 9) >= 0, true);
  });

  test("#1100: precedence in or-test compilation of `in`", function() {
    ok(0 === (1 && 0));
    ok(0 === 1 || 0 === (1 && 0));
    return ok(!(0 === 1 || 0 === (0 || 1)));
  });

  test("#1630: `in` should check `hasOwnProperty`", function() {
    return ok(__indexOf.call({
      length: 1
    }, void 0) < 0);
  });

  test("#1714: lexer bug with raw range `for` followed by `in`", function() {
    var _i, _j, _k;
    for (_i = 1; _i <= 2; _i++) {
      0;
    }
    ok(!('a' === 'b'));
    for (_j = 1; _j <= 2; _j++) {
      0;
    }
    ok(!('a' === 'b'));
    for (_k = 1; _k <= 10; _k++) {
      0;
    }
    return ok(!('a' === 'b'));
  });

  test("#1099: statically determined `not in []` reporting incorrect result", function() {
    return ok(true);
  });

  test("chainable operators", function() {
    ok((((100 > 10 && 10 > 1) && 1 > 0) && 0 > -1));
    return ok((((-1 < 0 && 0 < 1) && 1 < 10) && 10 < 100));
  });

  test("`is` and `isnt` may be chained", function() {
    var _ref;
    ok(((true === (_ref = !false) && _ref === true) && true === !false));
    return ok(((0 === 0 && 0 !== 1) && 1 === 1));
  });

  test("different comparison operators (`>`,`<`,`is`,etc.) may be combined", function() {
    var _ref;
    ok((1 < 2 && 2 > 1));
    return ok(((10 < 20 && 20 > (_ref = 2 + 3)) && _ref === 5));
  });

  test("some chainable operators can be negated by `unless`", function() {
    return ok(((0 !== 10 || 10 === 100) ? true : void 0));
  });

  test("operator precedence: `|` lower than `<`", function() {
    return eq(1, 1 | (2 < 3 && 3 < 4));
  });

  test("preserve references", function() {
    var a, b, c;
    a = b = c = 1;
    return ok((a === b && b <= c));
  });

  test("chained operations should evaluate each value only once", function() {
    var a, _ref;
    a = 0;
    return ok((1 > (_ref = a++) && _ref < 1));
  });

  test("#891: incorrect inversion of chained comparisons", function() {
    var NaN, _ref;
    ok((!((0 > 1 && 1 > 2)) ? true : void 0));
    return ok((!(((NaN = 0 / 0) < (_ref = 0 / 0) && _ref < NaN)) ? true : void 0));
  });

  test("#1234: Applying a splat to :: applies the splat to the wrong object", function() {
    var C, arr, nonce, _ref;
    nonce = {};
    C = (function() {
      function C() {}

      C.prototype.method = function() {
        return this.nonce;
      };

      C.prototype.nonce = nonce;

      return C;

    })();
    arr = [];
    return eq(nonce, (_ref = C.prototype).method.apply(_ref, arr));
  });

  test("#1102: String literal prevents line continuation", function() {
    return eq("': '", '' + "': '");
  });

  test("#1703, ---x is invalid JS", function() {
    var x;
    x = 2;
    return eq(-(--x), -1);
  });

  test("Regression with implicit calls against an indented assignment", function() {
    var a;
    eq(1, a = 1);
    return eq(a, 1);
  });

  test("#2155 ... conditional assignment to a closure", function() {
    var func, x;
    x = null;
    func = function() {
      return x != null ? x : x = (function() {
        if (true) {
          return 'hi';
        }
      });
    };
    func();
    return eq(x(), 'hi');
  });

  test("#2197: Existential existential double trouble", function() {
    var counter, func, _ref;
    counter = 0;
    func = function() {
      return counter++;
    };
        if ((_ref = func() != null) != null) {
      _ref;
    } else {
      100;
    };
    return eq(counter, 1);
  });

  test("#2567: Optimization of negated existential produces correct result", function() {
    var a;
    a = 1;
    ok(!(a == null));
    return ok(typeof b === "undefined" || b === null);
  });

  test("#2508: Existential access of the prototype", function() {
    eq(typeof NonExistent !== "undefined" && NonExistent !== null ? NonExistent.prototype.nothing : void 0, void 0);
    return ok(typeof Object !== "undefined" && Object !== null ? Object.prototype.toString : void 0);
  });

}).call(this);
