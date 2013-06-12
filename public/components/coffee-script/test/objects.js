(function() {
  var key, moe, obj, one, pluck, result, third, trailingComma;

  trailingComma = {
    k1: "v1",
    k2: 4,
    k3: (function() {
      return true;
    })
  };

  ok(trailingComma.k3() && (trailingComma.k2 === 4) && (trailingComma.k1 === "v1"));

  ok({
    a: function(num) {
      return num === 10;
    }
  }.a(10));

  moe = {
    name: 'Moe',
    greet: function(salutation) {
      return salutation + " " + this.name;
    },
    hello: function() {
      return this['greet']("Hello");
    },
    10: 'number'
  };

  ok(moe.hello() === "Hello Moe");

  ok(moe[10] === 'number');

  moe.hello = function() {
    return this['greet']("Hello");
  };

  ok(moe.hello() === 'Hello Moe');

  obj = {
    is: function() {
      return true;
    },
    'not': function() {
      return false;
    }
  };

  ok(obj.is());

  ok(!obj.not());

  ({
    /* Top-level object literal...*/

    obj: 1
  });

  /* ...doesn't break things.*/


  obj = {
    "class": 'höt'
  };

  obj["function"] = 'dog';

  ok(obj["class"] + obj["function"] === 'hötdog');

  pluck = function(x) {
    return x.a;
  };

  eq(100, pluck(pluck(pluck({
    a: {
      a: {
        a: 100
      }
    }
  }))));

  test("YAML-style object literals", function() {
    var config;
    obj = {
      a: 1,
      b: 2
    };
    eq(1, obj.a);
    eq(2, obj.b);
    config = {
      development: {
        server: 'localhost',
        timeout: 10
      },
      production: {
        server: 'dreamboat',
        timeout: 1000
      }
    };
    ok(config.development.server === 'localhost');
    ok(config.production.server === 'dreamboat');
    ok(config.development.timeout === 10);
    return ok(config.production.timeout === 1000);
  });

  obj = {
    a: 1,
    b: 2
  };

  ok(obj.a === 1);

  ok(obj.b === 2);

  obj = {
    options: {
      value: true
    },
    fn: function() {
      ({});
      return null;
    }
  };

  ok(obj.options.value === true);

  ok(obj.fn() === null);

  obj = {
    'reverse': function(obj) {
      return Array.prototype.reverse.call(obj);
    },
    abc: function() {
      return this.reverse(this.reverse(this.reverse(['a', 'b', 'c'].reverse())));
    },
    one: [
      1, 2, {
        a: 'b'
      }, 3, 4
    ],
    red: {
      orange: {
        yellow: {
          green: 'blue'
        }
      },
      indigo: 'violet'
    },
    misdent: [[], [], [], []]
  };

  ok(obj.abc().join(' ') === 'a b c');

  ok(obj.one.length === 5);

  ok(obj.one[4] === 4);

  ok(obj.one[2].a === 'b');

  ok(((function() {
    var _results;
    _results = [];
    for (key in obj.red) {
      _results.push(key);
    }
    return _results;
  })()).length === 2);

  ok(obj.red.orange.yellow.green === 'blue');

  ok(obj.red.indigo === 'violet');

  ok(obj.misdent.toString() === ',,,');

  ({
    f: function() {
      return ok(true);
    }
  }).f() + 1;

  one = {
    '>!': 3
  };

  ({
    six: function() {
      return 10;
    }
  });

  ok(!one.six);

  obj = {
    /* comment one*/

    /* comment two*/

    one: 1,
    two: 2,
    object: function() {
      return {
        one: this.one,
        two: this.two
      };
    },
    list: function() {
      return [this.one, this.two];
    }
  };

  result = obj.object();

  eq(result.one, 1);

  eq(result.two, 2);

  eq(result.two, obj.list()[1]);

  third = function(a, b, c) {
    return c;
  };

  obj = {
    one: 'one',
    two: third('one', 'two', 'three')
  };

  ok(obj.one === 'one');

  ok(obj.two === 'three');

  test("invoking functions with implicit object literals", function() {
    var a, b, generateGetter, getA, getArgs;
    generateGetter = function(prop) {
      return function(obj) {
        return obj[prop];
      };
    };
    getA = generateGetter('a');
    getArgs = function() {
      return arguments;
    };
    a = b = 30;
    result = getA({
      a: 10
    });
    eq(10, result);
    result = getA({
      "a": 20
    });
    eq(20, result);
    result = getA(a, {
      b: 1
    });
    eq(void 0, result);
    result = getA({
      b: 1,
      a: 43
    });
    eq(43, result);
    result = getA({
      b: 1
    }, {
      a: 62
    });
    eq(void 0, result);
    result = getA({
      b: 1
    }, a);
    eq(void 0, result);
    result = getA({
      a: {
        b: 2
      },
      b: 1
    });
    eq(2, result.b);
    result = getArgs({
      a: 1
    }, b, {
      c: 1
    });
    ok(result.length === 3);
    ok(result[2].c === 1);
    result = getA({
      b: 13,
      a: 42
    }, 2);
    eq(42, result);
    result = getArgs({
      a: 1
    }, 1 + 1);
    ok(result[1] === 2);
    result = getArgs({
      a: 1
    }, b);
    ok(result.length === 2);
    ok(result[1] === 30);
    result = getArgs({
      a: 1
    }, b, {
      b: 1
    }, a);
    ok(result.length === 4);
    ok(result[2].b === 1);
    return throws(function() {
      return CoffeeScript.compile("a = b:1, c");
    });
  });

  test("some weird indentation in YAML-style object literals", function() {
    var two;
    two = function(a, b) {
      return b;
    };
    obj = two(1, {
      1: 1,
      a: {
        b: function() {
          return fn(c, {
            d: e
          });
        }
      },
      f: 1
    });
    return eq(1, obj[1]);
  });

  test("#1274: `{} = a()` compiles to `false` instead of `a()`", function() {
    var a, fn;
    a = false;
    fn = function() {
      return a = true;
    };
    fn();
    return ok(a);
  });

  test("#1436: `for` etc. work as normal property names", function() {
    obj = {};
    eq(false, obj.hasOwnProperty('for'));
    obj["for"] = 'foo' in obj;
    return eq(true, obj.hasOwnProperty('for'));
  });

  test("#2706, Un-bracketed object as argument causes inconsistent behavior", function() {
    var bar, foo;
    foo = function(x, y) {
      return y;
    };
    bar = {
      baz: true
    };
    return eq(true, foo({
      x: 1
    }, bar.baz));
  });

  test("#2608, Allow inline objects in arguments to be followed by more arguments", function() {
    var foo;
    foo = function(x, y) {
      return y;
    };
    return eq(true, foo({
      x: 1,
      y: 2
    }, true));
  });

  test("#2308, a: b = c:1", function() {
    var b, foo;
    foo = {
      a: b = {
        c: true
      }
    };
    eq(b.c, true);
    return eq(foo.a.c, true);
  });

  test("#2317, a: b c: 1", function() {
    var bar, foo;
    foo = function(x) {
      return x;
    };
    bar = {
      a: foo({
        c: true
      })
    };
    return eq(bar.a.c, true);
  });

  test("#1896, a: func b, {c: d}", function() {
    var bar, baz, corge, first, foo, four, quux, qux, second, three, two;
    first = function(x) {
      return x;
    };
    second = function(x, y) {
      return y;
    };
    third = function(x, y, z) {
      return z;
    };
    one = 1;
    two = 2;
    three = 3;
    four = 4;
    foo = {
      a: second(one, {
        c: two
      })
    };
    eq(foo.a.c, two);
    bar = {
      a: second(one, {
        c: two
      })
    };
    eq(bar.a.c, two);
    baz = {
      a: second(one, {
        c: two
      }, {
        e: first(first({
          h: three
        }))
      })
    };
    eq(baz.a.c, two);
    qux = {
      a: third(one, {
        c: two
      }, {
        e: first(first({
          h: three
        }))
      })
    };
    eq(qux.a.e.h, three);
    quux = {
      a: third(one, {
        c: two
      }, {
        e: first(three),
        h: four
      })
    };
    eq(quux.a.e, three);
    eq(quux.a.h, four);
    corge = {
      a: third(one, {
        c: two
      }, {
        e: second(three, {
          h: four
        })
      })
    };
    return eq(corge.a.e.h, four);
  });

  test("Implicit objects, functions and arrays", function() {
    var bar, first, foo, second;
    first = function(x) {
      return x;
    };
    second = function(x, y) {
      return y;
    };
    foo = [
      1, {
        one: 1,
        two: 2,
        three: 3,
        more: {
          four: 4,
          five: 5,
          six: 6
        }
      }, 2, 3, 4, 5
    ];
    eq(foo[2], 2);
    eq(foo[1].more.six, 6);
    bar = [
      1, first(first(first(second(1, {
        one: 1,
        twoandthree: {
          twoandthree: {
            two: 2,
            three: 3
          }
        }
      }, 2)))), 2, {
        one: 1,
        two: 2,
        three: first(second(function() {
          return false;
        }, function() {
          return 3;
        }))
      }, 3, 4
    ];
    eq(bar[2], 2);
    eq(bar[1].twoandthree.twoandthree.two, 2);
    eq(bar[3].three(), 3);
    return eq(bar[4], 3);
  });

  test("#2549, Brace-less Object Literal as a Second Operand on a New Line", function() {
    var bar, baz, foo;
    foo = false || {
      one: 1,
      two: 2,
      three: 3
    };
    eq(foo.one, 1);
    bar = true && {
      one: 1
    };
    eq(bar.one, 1);
    baz = typeof null !== "undefined" && null !== null ? null : {
      one: 1,
      two: 2
    };
    return eq(baz.two, 2);
  });

  test("#2757, Nested", function() {
    var baz, foo;
    foo = {
      bar: {
        one: 1
      }
    };
    eq(foo.bar.one, 1);
    baz = {
      qux: {
        one: 1
      },
      corge: {
        two: 2,
        three: {
          three: {
            three: 3
          }
        }
      },
      xyzzy: {
        thud: {
          four: {
            four: 4
          }
        },
        five: 5
      }
    };
    eq(baz.qux.one, 1);
    eq(baz.corge.three.three.three, 3);
    eq(baz.xyzzy.thud.four.four, 4);
    return eq(baz.xyzzy.five, 5);
  });

  test("#1865, syntax regression 1.1.3", function() {
    var bar, baz, foo;
    foo = function(x, y) {
      return y;
    };
    bar = {
      a: foo((function() {}), {
        c: true
      })
    };
    eq(bar.a.c, true);
    baz = {
      a: foo((function() {}), {
        c: true
      })
    };
    return eq(baz.a.c, true);
  });

  test("#1322: implicit call against implicit object with block comments", function() {
    return (function(obj, arg) {
      eq(obj.x * obj.y, 6);
      return ok(!arg);
    })({
      /*
      x
      */

      x: 2,
      /* y*/

      y: 3
    });
  });

  test("#1513: Top level bare objs need to be wrapped in parens for unary and existence ops", function() {
    doesNotThrow(function() {
      return CoffeeScript.run("{}?", {
        bare: true
      });
    });
    return doesNotThrow(function() {
      return CoffeeScript.run("{}.a++", {
        bare: true
      });
    });
  });

  test("#1871: Special case for IMPLICIT_END in the middle of an implicit object", function() {
    var i, ident;
    result = 'result';
    ident = function(x) {
      return x;
    };
    if (false) {
      result = ident({
        one: 1
      });
    }
    eq(result, 'result');
    result = ident({
      one: 1,
      two: (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 3; i = ++_i) {
          _results.push(2);
        }
        return _results;
      })()
    });
    return eq(result.two.join(' '), '2 2 2');
  });

  test("#1961, #1974, regression with compound assigning to an implicit object", function() {
    obj = null;
    if (obj == null) {
      obj = {
        one: 1,
        two: 2
      };
    }
    eq(obj.two, 2);
    obj = null;
    obj || (obj = {
      three: 3,
      four: 4
    });
    return eq(obj.four, 4);
  });

  test("#2207: Immediate implicit closes don't close implicit objects", function() {
    var func;
    func = function() {
      var i;
      return {
        key: (function() {
          var _i, _len, _ref, _results;
          _ref = [1, 2, 3];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(i);
          }
          return _results;
        })()
      };
    };
    return eq(func().key.join(' '), '1 2 3');
  });

}).call(this);
