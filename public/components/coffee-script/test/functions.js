(function() {
  var del, func, obj, x, y,
    __slice = [].slice;

  x = 1;

  y = {};

  y.x = function() {
    return 3;
  };

  ok(x === 1);

  ok(typeof y.x === 'function');

  ok(y.x instanceof Function);

  ok(y.x() === 3);

  (function() {});

  (function() {});

  (function(one) {
    return function(two) {
      return three(four, function(five) {
        return six(seven, eight, function(nine) {});
      });
    };
  });

  func = function(x) {
    return function(x) {
      return function(x) {
        return x;
      };
    };
  };

  ok(func(1)(2)(3) === 3);

  func = function() {
    var obj;
    obj = {
      key: 10
    };
    return obj.key - 5;
  };

  eq(func(), 5);

  del = function() {
    return 5;
  };

  ok(del() === 5);

  obj = {
    bound: function() {
      var _this = this;
      return (function() {
        return _this;
      })();
    },
    unbound: function() {
      return (function() {
        return this;
      })();
    },
    nested: function() {
      var _this = this;
      return (function() {
        return (function() {
          return (function() {
            return _this;
          })();
        })();
      })();
    }
  };

  eq(obj, obj.bound());

  ok(obj !== obj.unbound());

  eq(obj, obj.nested());

  test("even more fancy bound functions", function() {
    obj = {
      one: function() {
        var _this = this;
        return (function() {
          return _this.two();
        })();
      },
      two: function() {
        var _this = this;
        return (function() {
          return (function() {
            return (function() {
              return _this.three;
            })();
          })();
        })();
      },
      three: 3
    };
    return eq(obj.one(), 3);
  });

  test("self-referencing functions", function() {
    var changeMe;
    changeMe = function() {
      return changeMe = 2;
    };
    changeMe();
    return eq(changeMe, 2);
  });

  test("splats", function() {
    arrayEq([0, 1, 2], (function() {
      var splat;
      splat = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return splat;
    })(0, 1, 2));
    arrayEq([2, 3], (function() {
      var splat, _, _1;
      _ = arguments[0], _1 = arguments[1], splat = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return splat;
    })(0, 1, 2, 3));
    arrayEq([0, 1], (function() {
      var splat, _, _1, _i;
      splat = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), _ = arguments[_i++], _1 = arguments[_i++];
      return splat;
    })(0, 1, 2, 3));
    return arrayEq([2], (function() {
      var splat, _, _1, _2, _i;
      _ = arguments[0], _1 = arguments[1], splat = 4 <= arguments.length ? __slice.call(arguments, 2, _i = arguments.length - 1) : (_i = 2, []), _2 = arguments[_i++];
      return splat;
    })(0, 1, 2, 3));
  });

  test("destructured splatted parameters", function() {
    var arr, splatArray, splatArrayRest;
    arr = [0, 1, 2];
    splatArray = function(_arg) {
      var a;
      a = 1 <= _arg.length ? __slice.call(_arg, 0) : [];
      return a;
    };
    splatArrayRest = function() {
      var a, b, _arg;
      _arg = arguments[0], b = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      a = 1 <= _arg.length ? __slice.call(_arg, 0) : [];
      arrayEq(a, b);
      return b;
    };
    arrayEq(splatArray(arr), arr);
    return arrayEq(splatArrayRest(arr, 0, 1, 2), arr);
  });

  test("@-parameters: automatically assign an argument's value to a property of the context", function() {
    var context, nonce;
    nonce = {};
    (function(prop) {
      this.prop = prop;
    }).call(context = {}, nonce);
    eq(nonce, context.prop);
    (function() {
      var prop, splat, _i;
      splat = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), prop = arguments[_i++];
      this.prop = prop;
    }).apply(context = {}, [0, 0, nonce]);
    eq(nonce, context.prop);
    (function() {
      var prop;
      prop = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.prop = prop;
    }).call(context = {}, 0, nonce, 0);
    eq(nonce, context.prop[1]);
    return eq(nonce, (function(prop) {
      this.prop = prop;
      return prop;
    }).call({}, nonce));
  });

  test("@-parameters and splats with constructors", function() {
    var Klass, a, b;
    a = {};
    b = {};
    Klass = (function() {
      function Klass() {
        var first, last, splat, _i;
        first = arguments[0], splat = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), last = arguments[_i++];
        this.first = first;
        this.last = last;
      }

      return Klass;

    })();
    obj = new Klass(a, 0, 0, b);
    eq(a, obj.first);
    return eq(b, obj.last);
  });

  test("destructuring in function definition", function() {
    return (function() {
      var b, c, _arg, _ref, _ref1;
      _arg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = _arg[0], (_ref1 = _ref.a, b = _ref1[0]), c = _ref.c;
      eq(1, b);
      return eq(2, c);
    })({
      a: [1],
      c: 2
    });
  });

  test("default values", function() {
    var a, b, c, nonceA, nonceB;
    nonceA = {};
    nonceB = {};
    a = function(_, _1, arg) {
      if (arg == null) {
        arg = nonceA;
      }
      return arg;
    };
    eq(nonceA, a());
    eq(nonceA, a(0));
    eq(nonceB, a(0, 0, nonceB));
    eq(nonceA, a(0, 0, void 0));
    eq(nonceA, a(0, 0, null));
    eq(false, a(0, 0, false));
    eq(nonceB, a(void 0, void 0, nonceB, void 0));
    b = function(_, arg, _1, _2) {
      if (arg == null) {
        arg = nonceA;
      }
      return arg;
    };
    eq(nonceA, b());
    eq(nonceA, b(0));
    eq(nonceB, b(0, nonceB));
    eq(nonceA, b(0, void 0));
    eq(nonceA, b(0, null));
    eq(false, b(0, false));
    eq(nonceB, b(void 0, nonceB, void 0));
    c = function(arg, _, _1) {
      if (arg == null) {
        arg = nonceA;
      }
      return arg;
    };
    eq(nonceA, c());
    eq(0, c(0));
    eq(nonceB, c(nonceB));
    eq(nonceA, c(void 0));
    eq(nonceA, c(null));
    eq(false, c(false));
    return eq(nonceB, c(nonceB, void 0, void 0));
  });

  test("default values with @-parameters", function() {
    var a, b;
    a = {};
    b = {};
    obj = {
      f: function(q, p) {
        if (q == null) {
          q = a;
        }
        this.p = p != null ? p : b;
        return q;
      }
    };
    eq(a, obj.f());
    return eq(b, obj.p);
  });

  test("default values with splatted arguments", function() {
    var withSplats;
    withSplats = function() {
      var a, b, c, d, _i;
      a = arguments[0], b = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), c = arguments[_i++], d = arguments[_i++];
      if (a == null) {
        a = 2;
      }
      if (c == null) {
        c = 3;
      }
      if (d == null) {
        d = 5;
      }
      return a * (b.length + 1) * c * d;
    };
    eq(30, withSplats());
    eq(15, withSplats(1));
    eq(5, withSplats(1, 1));
    eq(1, withSplats(1, 1, 1));
    return eq(2, withSplats(1, 1, 1, 1));
  });

  test("default values with function calls", function() {
    return doesNotThrow(function() {
      return CoffeeScript.compile("(x = f()) ->");
    });
  });

  test("arguments vs parameters", function() {
    var f;
    doesNotThrow(function() {
      return CoffeeScript.compile("f(x) ->");
    });
    f = function(g) {
      return g();
    };
    return eq(5, f(function(x) {
      return 5;
    }));
  });

  test("#1844: bound functions in nested comprehensions causing empty var statements", function() {
    var a, b;
    a = (function() {
      var _i, _len, _ref, _results;
      _ref = [0];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1,
            _this = this;
          _ref1 = [0];
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            a = _ref1[_j];
            _results1.push(function() {});
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }).call(this);
    return eq(1, a.length);
  });

  test("#1859: inline function bodies shouldn't modify prior postfix ifs", function() {
    var list;
    list = [1, 2, 3];
    if (list.some(function(x) {
      return x === 2;
    })) {
      return ok(true);
    }
  });

  test("#2258: allow whitespace-style parameter lists in function definitions", function() {
    func = function(a, b, c) {
      return c;
    };
    eq(func(1, 2, 3), 3);
    func = function(a, b, c) {
      return b;
    };
    return eq(func(1, 2, 3), 2);
  });

  test("#2621: fancy destructuring in parameter lists", function() {
    func = function(_arg) {
      var a, b, c, key1, key2, _ref, _ref1, _ref2;
      (_ref = _arg.prop1, key1 = _ref.key1), (_ref1 = _arg.prop2, key2 = _ref1.key2, (_ref2 = _ref1.key3, a = _ref2[0], b = _ref2[1], c = _ref2[2]));
      eq(key2, 'key2');
      return eq(a, 'a');
    };
    return func({
      prop1: {
        key1: 'key1'
      },
      prop2: {
        key2: 'key2',
        key3: ['a', 'b', 'c']
      }
    });
  });

  test("#1435 Indented property access", function() {
    var rec;
    rec = function() {
      return {
        rec: rec
      };
    };
    return eq(1, (function() {
      rec().rec(function() {
        return rec().rec(function() {
          return rec.rec();
        }).rec();
      });
      return 1;
    })());
  });

}).call(this);
