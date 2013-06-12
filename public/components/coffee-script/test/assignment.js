(function() {
  var __slice = [].slice;

  test("context property assignment (using @)", function() {
    var addMethod, nonce;
    nonce = {};
    addMethod = function() {
      this.method = function() {
        return nonce;
      };
      return this;
    };
    return eq(nonce, addMethod.call({}).method());
  });

  test("unassignable values", function() {
    var e, nonce, nonref, _i, _len, _ref, _results;
    nonce = {};
    _ref = ['', '""', '0', 'f()'].concat(CoffeeScript.RESERVED);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      nonref = _ref[_i];
      _results.push(eq(nonce, ((function() {
        try {
          return CoffeeScript.compile("" + nonref + " = v");
        } catch (_error) {
          e = _error;
          return nonce;
        }
      })())));
    }
    return _results;
  });

  test("boolean operators", function() {
    var a, b, c, d, e, f, nonce;
    nonce = {};
    a = 0;
    a || (a = nonce);
    eq(nonce, a);
    b = 1;
    b || (b = nonce);
    eq(1, b);
    c = 0;
    c && (c = nonce);
    eq(0, c);
    d = 1;
    d && (d = nonce);
    eq(nonce, d);
    e = f = false;
    e && (e = f || true);
    return eq(false, e);
  });

  test("compound assignment as a sub expression", function() {
    var a, b, c, _ref;
    _ref = [1, 2, 3], a = _ref[0], b = _ref[1], c = _ref[2];
    eq(6, a + (b += c));
    eq(1, a);
    eq(5, b);
    return eq(3, c);
  });

  test("compound assignment should be careful about caching variables", function() {
    var base, count, list, _base, _base1, _name, _name1, _name2;
    count = 0;
    list = [];
    list[_name = ++count] || (list[_name] = 1);
    eq(1, list[1]);
    eq(1, count);
    if (list[_name1 = ++count] == null) {
      list[_name1] = 2;
    }
    eq(2, list[2]);
    eq(2, count);
    list[_name2 = count++] && (list[_name2] = 6);
    eq(6, list[2]);
    eq(3, count);
    base = function() {
      ++count;
      return base;
    };
    (_base = base()).four || (_base.four = 4);
    eq(4, base.four);
    eq(4, count);
    if ((_base1 = base()).five == null) {
      _base1.five = 5;
    }
    eq(5, base.five);
    return eq(5, count);
  });

  test("compound assignment with implicit objects", function() {
    var obj;
    obj = void 0;
    if (obj == null) {
      obj = {
        one: 1
      };
    }
    eq(1, obj.one);
    obj && (obj = {
      two: 2
    });
    eq(void 0, obj.one);
    return eq(2, obj.two);
  });

  test("compound assignment (math operators)", function() {
    var num;
    num = 10;
    num -= 5;
    eq(5, num);
    num *= 10;
    eq(50, num);
    num /= 10;
    eq(5, num);
    num %= 3;
    return eq(2, num);
  });

  test("more compound assignment", function() {
    var a, b, c, val;
    a = {};
    val = void 0;
    val || (val = a);
    val || (val = true);
    eq(a, val);
    b = {};
    val && (val = true);
    eq(val, true);
    val && (val = b);
    eq(b, val);
    c = {};
    val = null;
    if (val == null) {
      val = c;
    }
    if (val == null) {
      val = true;
    }
    return eq(c, val);
  });

  test("empty destructuring assignment", function() {
    return void 0;
  });

  test("chained destructuring assignments", function() {
    var a, b, c, nonce, _ref, _ref1;
    a = (_ref1 = (_ref = [nonce = {}], c = _ref['0'], _ref), b = _ref1[0], _ref1)[0];
    eq(nonce, a);
    eq(nonce, b);
    return eq(nonce, c);
  });

  test("variable swapping to verify caching of RHS values when appropriate", function() {
    var a, b, c, fn, nonceA, nonceB, nonceC, _ref, _ref1;
    a = nonceA = {};
    b = nonceB = {};
    c = nonceC = {};
    _ref = [b, c, a], a = _ref[0], b = _ref[1], c = _ref[2];
    eq(nonceB, a);
    eq(nonceC, b);
    eq(nonceA, c);
    _ref1 = [b, c, a], a = _ref1[0], b = _ref1[1], c = _ref1[2];
    eq(nonceC, a);
    eq(nonceA, b);
    eq(nonceB, c);
    fn = function() {
      var _ref2;
      return _ref2 = [b, c, a], a = _ref2[0], b = _ref2[1], c = _ref2[2], _ref2;
    };
    arrayEq([nonceA, nonceB, nonceC], fn());
    eq(nonceA, a);
    eq(nonceB, b);
    return eq(nonceC, c);
  });

  test("#713", function() {
    var a, b, c, d, nonceA, nonceB, nonces, _ref;
    nonces = [nonceA = {}, nonceB = {}];
    eq(nonces, (_ref = (c = nonces[0], d = nonces[1], nonces), a = _ref[0], b = _ref[1], _ref));
    eq(nonceA, a);
    eq(nonceA, c);
    eq(nonceB, b);
    return eq(nonceB, d);
  });

  test("destructuring assignment with splats", function() {
    var a, b, c, d, e, x, y, z, _i, _ref;
    a = {};
    b = {};
    c = {};
    d = {};
    e = {};
    _ref = [a, b, c, d, e], x = _ref[0], y = 3 <= _ref.length ? __slice.call(_ref, 1, _i = _ref.length - 1) : (_i = 1, []), z = _ref[_i++];
    eq(a, x);
    arrayEq([b, c, d], y);
    return eq(e, z);
  });

  test("deep destructuring assignment with splats", function() {
    var a, b, c, d, e, f, g, h, i, u, v, w, x, y, z, _i, _j, _ref, _ref1;
    a = {};
    b = {};
    c = {};
    d = {};
    e = {};
    f = {};
    g = {};
    h = {};
    i = {};
    _ref = [a, [b, c, d, e], f, g, h, i], u = _ref[0], (_ref1 = _ref[1], v = _ref1[0], w = 3 <= _ref1.length ? __slice.call(_ref1, 1, _i = _ref1.length - 1) : (_i = 1, []), x = _ref1[_i++]), y = 4 <= _ref.length ? __slice.call(_ref, 2, _j = _ref.length - 1) : (_j = 2, []), z = _ref[_j++];
    eq(a, u);
    eq(b, v);
    arrayEq([c, d], w);
    eq(e, x);
    arrayEq([f, g, h], y);
    return eq(i, z);
  });

  test("destructuring assignment with objects", function() {
    var a, b, c, obj, x, y, z;
    a = {};
    b = {};
    c = {};
    obj = {
      a: a,
      b: b,
      c: c
    };
    x = obj.a, y = obj.b, z = obj.c;
    eq(a, x);
    eq(b, y);
    return eq(c, z);
  });

  test("deep destructuring assignment with objects", function() {
    var a, b, c, d, obj, w, x, y, z, _ref, _ref1, _ref2, _ref3;
    a = {};
    b = {};
    c = {};
    d = {};
    obj = {
      a: a,
      b: {
        'c': {
          d: [
            b, {
              e: c,
              f: d
            }
          ]
        }
      }
    };
    w = obj.a, (_ref = obj['b'], (_ref1 = _ref.c, (_ref2 = _ref1.d, x = _ref2[0], (_ref3 = _ref2[1], z = _ref3['f'], y = _ref3.e))));
    eq(a, w);
    eq(b, x);
    eq(c, y);
    return eq(d, z);
  });

  test("destructuring assignment with objects and splats", function() {
    var a, b, c, d, obj, y, z, _ref;
    a = {};
    b = {};
    c = {};
    d = {};
    obj = {
      a: {
        b: [a, b, c, d]
      }
    };
    _ref = obj.a.b, y = _ref[0], z = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    eq(a, y);
    return arrayEq([b, c, d], z);
  });

  test("destructuring assignment against an expression", function() {
    var a, b, y, z, _ref;
    a = {};
    b = {};
    _ref = true ? [a, b] : [b, a], y = _ref[0], z = _ref[1];
    eq(a, y);
    return eq(b, z);
  });

  test("bracket insertion when necessary", function() {
    var a, _ref;
    a = ((_ref = [0]) != null ? _ref : [1])[0];
    return eq(a, 0);
  });

  test("destructuring assignment with context (@) properties", function() {
    var a, b, c, d, e, key, obj, _i, _len, _ref;
    a = {};
    b = {};
    c = {};
    d = {};
    e = {};
    obj = {
      fn: function() {
        var local, _ref;
        local = [
          a, {
            b: b,
            c: c
          }, d, e
        ];
        return this.a = local[0], (_ref = local[1], this.b = _ref.b, this.c = _ref.c), this.d = local[2], this.e = local[3], local;
      }
    };
    _ref = ['a', 'b', 'c', 'd', 'e'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      eq(void 0, obj[key]);
    }
    obj.fn();
    eq(a, obj.a);
    eq(b, obj.b);
    eq(c, obj.c);
    eq(d, obj.d);
    return eq(e, obj.e);
  });

  test("#1024", function() {
    return eq(2 * (3 + 5), 16);
  });

  test("#1005: invalid identifiers allowed on LHS of destructuring assignment", function() {
    var disallowed, t, tSplat, v, _i, _len;
    disallowed = ['eval', 'arguments'].concat(CoffeeScript.RESERVED);
    throws((function() {
      return CoffeeScript.compile("[" + (disallowed.join(', ')) + "] = x");
    }), null, 'all disallowed');
    throws((function() {
      return CoffeeScript.compile("[" + (disallowed.join('..., ')) + "...] = x");
    }), null, 'all disallowed as splats');
    t = tSplat = null;
    for (_i = 0, _len = disallowed.length; _i < _len; _i++) {
      v = disallowed[_i];
      if (!(v !== 'class')) {
        continue;
      }
      throws((function() {
        return CoffeeScript.compile(t);
      }), null, t = "[" + v + "] = x");
      throws((function() {
        return CoffeeScript.compile(tSplat);
      }), null, tSplat = "[" + v + "...] = x");
    }
    return doesNotThrow(function() {
      var _j, _len1, _results;
      _results = [];
      for (_j = 0, _len1 = disallowed.length; _j < _len1; _j++) {
        v = disallowed[_j];
        CoffeeScript.compile("[a." + v + "] = x");
        CoffeeScript.compile("[a." + v + "...] = x");
        CoffeeScript.compile("[@" + v + "] = x");
        _results.push(CoffeeScript.compile("[@" + v + "...] = x"));
      }
      return _results;
    });
  });

  test("#2055: destructuring assignment with `new`", function() {
    var length;
    length = (new Array).length;
    return eq(0, length);
  });

  test("existential assignment", function() {
    var a, b, c, nonce;
    nonce = {};
    a = false;
    if (a == null) {
      a = nonce;
    }
    eq(false, a);
    b = void 0;
    if (b == null) {
      b = nonce;
    }
    eq(nonce, b);
    c = null;
    if (c == null) {
      c = nonce;
    }
    return eq(nonce, c);
  });

  test("#1627: prohibit conditional assignment of undefined variables", function() {
    throws((function() {
      return CoffeeScript.compile("x ?= 10");
    }), null, "prohibit (x ?= 10)");
    throws((function() {
      return CoffeeScript.compile("x ||= 10");
    }), null, "prohibit (x ||= 10)");
    throws((function() {
      return CoffeeScript.compile("x or= 10");
    }), null, "prohibit (x or= 10)");
    throws((function() {
      return CoffeeScript.compile("do -> x ?= 10");
    }), null, "prohibit (do -> x ?= 10)");
    throws((function() {
      return CoffeeScript.compile("do -> x ||= 10");
    }), null, "prohibit (do -> x ||= 10)");
    throws((function() {
      return CoffeeScript.compile("do -> x or= 10");
    }), null, "prohibit (do -> x or= 10)");
    doesNotThrow((function() {
      return CoffeeScript.compile("x = null; x ?= 10");
    }), "allow (x = null; x ?= 10)");
    doesNotThrow((function() {
      return CoffeeScript.compile("x = null; x ||= 10");
    }), "allow (x = null; x ||= 10)");
    doesNotThrow((function() {
      return CoffeeScript.compile("x = null; x or= 10");
    }), "allow (x = null; x or= 10)");
    doesNotThrow((function() {
      return CoffeeScript.compile("x = null; do -> x ?= 10");
    }), "allow (x = null; do -> x ?= 10)");
    doesNotThrow((function() {
      return CoffeeScript.compile("x = null; do -> x ||= 10");
    }), "allow (x = null; do -> x ||= 10)");
    doesNotThrow((function() {
      return CoffeeScript.compile("x = null; do -> x or= 10");
    }), "allow (x = null; do -> x or= 10)");
    throws((function() {
      return CoffeeScript.compile("-> -> -> x ?= 10");
    }), null, "prohibit (-> -> -> x ?= 10)");
    return doesNotThrow((function() {
      return CoffeeScript.compile("x = null; -> -> -> x ?= 10");
    }), "allow (x = null; -> -> -> x ?= 10)");
  });

  test("more existential assignment", function() {
    if (global.temp == null) {
      global.temp = 0;
    }
    eq(global.temp, 0);
    global.temp || (global.temp = 100);
    eq(global.temp, 100);
    return delete global.temp;
  });

  test("#1348, #1216: existential assignment compilation", function() {
    var a, b, nonce;
    nonce = {};
    a = nonce;
    b = (a != null ? a : a = 0);
    eq(nonce, b);
    eq(a != null ? a : a = b != null ? b : b = 1, nonce);
    if (a) {
      if (a == null) {
        a = 2;
      }
    } else {
      a = 3;
    }
    return eq(a, nonce);
  });

  test("#1591, #1101: splatted expressions in destructuring assignment must be assignable", function() {
    var e, nonce, nonref, _i, _len, _ref, _results;
    nonce = {};
    _ref = ['', '""', '0', 'f()', '(->)'].concat(CoffeeScript.RESERVED);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      nonref = _ref[_i];
      _results.push(eq(nonce, ((function() {
        try {
          return CoffeeScript.compile("[" + nonref + "...] = v");
        } catch (_error) {
          e = _error;
          return nonce;
        }
      })())));
    }
    return _results;
  });

  test("#1643: splatted accesses in destructuring assignments should not be declared as variables", function() {
    var access, accesses, code, e, i, j, nonce, subpattern, subpatterns, _i, _j, _k, _len, _len1, _len2, _ref, _results;
    nonce = {};
    accesses = ['o.a', 'o["a"]', '(o.a)', '(o.a).a', '@o.a', 'C::a', 'C::', 'f().a', 'o?.a', 'o?.a.b', 'f?().a'];
    for (_i = 0, _len = accesses.length; _i < _len; _i++) {
      access = accesses[_i];
      _ref = [1, 2, 3];
      for (j = _j = 0, _len1 = _ref.length; _j < _len1; j = ++_j) {
        i = _ref[j];
        code = "nonce = {}; nonce2 = {}; nonce3 = {};\n@o = o = new (class C then a:{}); f = -> o\n[" + (new Array(i).join('x,')) + access + "...] = [" + (new Array(i).join('0,')) + "nonce, nonce2, nonce3]\nunless " + access + "[0] is nonce and " + access + "[1] is nonce2 and " + access + "[2] is nonce3 then throw new Error('[...]')";
        eq(nonce, !((function() {
          try {
            return CoffeeScript.run(code, {
              bare: true
            });
          } catch (_error) {
            e = _error;
            return true;
          }
        })()) ? nonce : void 0);
      }
    }
    subpatterns = ['[sub, sub2, sub3]', '{0: sub, 1: sub2, 2: sub3}'];
    _results = [];
    for (_k = 0, _len2 = subpatterns.length; _k < _len2; _k++) {
      subpattern = subpatterns[_k];
      _results.push((function() {
        var _l, _len3, _ref1, _results1;
        _ref1 = [1, 2, 3];
        _results1 = [];
        for (j = _l = 0, _len3 = _ref1.length; _l < _len3; j = ++_l) {
          i = _ref1[j];
          code = "nonce = {}; nonce2 = {}; nonce3 = {};\n[" + (new Array(i).join('x,')) + subpattern + "...] = [" + (new Array(i).join('0,')) + "nonce, nonce2, nonce3]\nunless sub is nonce and sub2 is nonce2 and sub3 is nonce3 then throw new Error('[sub...]')";
          _results1.push(eq(nonce, !((function() {
            try {
              return CoffeeScript.run(code, {
                bare: true
              });
            } catch (_error) {
              e = _error;
              return true;
            }
          })()) ? nonce : void 0));
        }
        return _results1;
      })());
    }
    return _results;
  });

  test("#1838: Regression with variable assignment", function() {
    var name;
    name = 'dave';
    return eq(name, 'dave');
  });

  test('#2211: splats in destructured parameters', function() {
    doesNotThrow(function() {
      return CoffeeScript.compile('([a...]) ->');
    });
    doesNotThrow(function() {
      return CoffeeScript.compile('([a...],b) ->');
    });
    doesNotThrow(function() {
      return CoffeeScript.compile('([a...],[b...]) ->');
    });
    throws(function() {
      return CoffeeScript.compile('([a...,[a...]]) ->');
    });
    return doesNotThrow(function() {
      return CoffeeScript.compile('([a...,[b...]]) ->');
    });
  });

  test('#2213: invocations within destructured parameters', function() {
    throws(function() {
      return CoffeeScript.compile('([a()])->');
    });
    throws(function() {
      return CoffeeScript.compile('([a:b()])->');
    });
    throws(function() {
      return CoffeeScript.compile('([a:b.c()])->');
    });
    throws(function() {
      return CoffeeScript.compile('({a()})->');
    });
    throws(function() {
      return CoffeeScript.compile('({a:b()})->');
    });
    return throws(function() {
      return CoffeeScript.compile('({a:b.c()})->');
    });
  });

  test('#2532: compound assignment with terminator', function() {
    return doesNotThrow(function() {
      return CoffeeScript.compile("a = \"hello\"\na +=\n\"\nworld\n!\n\"");
    });
  });

  test("#2613: parens on LHS of destructuring", function() {
    var a;
    a = {};
    a.b = [1, 2, 3][0];
    return eq(a.b, 1);
  });

}).call(this);
