(function() {
  var id,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  id = function(_) {
    if (arguments.length === 1) {
      return _;
    } else {
      return __slice.call(arguments);
    }
  };

  test("basic argument passing", function() {
    var a, b, c;
    a = {};
    b = {};
    c = {};
    eq(1, id(1));
    eq(2, (id(1, 2))[1]);
    eq(a, id(a));
    return eq(c, (id(a, b, c))[2]);
  });

  test("passing arguments on separate lines", function() {
    var a, b, c;
    a = {};
    b = {};
    c = {};
    ok(id(a, b, c)[1] === b);
    eq(0, id(0, 10)[0]);
    eq(a, id(a));
    return eq(b, id(b));
  });

  test("optional parens can be used in a nested fashion", function() {
    var add, call, result;
    call = function(func) {
      return func();
    };
    add = function(a, b) {
      return a + b;
    };
    result = call(function() {
      var inner;
      return inner = call(function() {
        return add(5, 5);
      });
    });
    return ok(result === 10);
  });

  test("hanging commas and semicolons in argument list", function() {
    var fn;
    fn = function() {
      return arguments.length;
    };
    eq(2, fn(0, 1));
    eq(3, fn(0, 1, 2));
    eq(2, fn(0, 1));
    throws(function() {
      return CoffeeScript.compile("fn(0,1,;;)");
    });
    throws(function() {
      return CoffeeScript.compile("fn(0, 1;,)");
    });
    throws(function() {
      return CoffeeScript.compile("fn(,0)");
    });
    return throws(function() {
      return CoffeeScript.compile("fn(;0)");
    });
  });

  test("function invocation", function() {
    var func, result;
    func = function() {
      if (true) {

      }
    };
    eq(void 0, func());
    result = "hello".slice(3);
    return ok(result === 'lo');
  });

  test("And even with strange things like this:", function() {
    var funcs, result;
    funcs = [
      (function(x) {
        return x;
      }), (function(x) {
        return x * x;
      })
    ];
    result = funcs[1](5);
    return ok(result === 25);
  });

  test("More fun with optional parens.", function() {
    var fn, okFunc;
    fn = function(arg) {
      return arg;
    };
    ok(fn(fn({
      prop: 101
    })).prop === 101);
    okFunc = function(f) {
      return ok(f());
    };
    return okFunc(function() {
      return true;
    });
  });

  test("chained function calls", function() {
    var identityWrap, nonce;
    nonce = {};
    identityWrap = function(x) {
      return function() {
        return x;
      };
    };
    eq(nonce, identityWrap(identityWrap(nonce))()());
    return eq(nonce, (identityWrap(identityWrap(nonce)))()());
  });

  test("Multi-blocks with optional parens.", function() {
    var fn, result;
    fn = function(arg) {
      return arg;
    };
    result = fn(function() {
      return fn(function() {
        return "Wrapped";
      });
    });
    return ok(result()() === 'Wrapped');
  });

  test("method calls", function() {
    var fnId, math;
    fnId = function(fn) {
      return function() {
        return fn.apply(this, arguments);
      };
    };
    math = {
      add: function(a, b) {
        return a + b;
      },
      anonymousAdd: function(a, b) {
        return a + b;
      },
      fastAdd: fnId(function(a, b) {
        return a + b;
      })
    };
    ok(math.add(5, 5) === 10);
    ok(math.anonymousAdd(10, 10) === 20);
    return ok(math.fastAdd(20, 20) === 40);
  });

  test("Ensure that functions can have a trailing comma in their argument list", function() {
    var i, mult;
    mult = function() {
      var mids, n, x, y, _i, _j, _len;
      x = arguments[0], mids = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), y = arguments[_i++];
      for (_j = 0, _len = mids.length; _j < _len; _j++) {
        n = mids[_j];
        x *= n;
      }
      return x *= y;
    };
    return ok(mult.apply(null, [10].concat(__slice.call(((function() {
      var _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 6; i = ++_i) {
        _results.push(i);
      }
      return _results;
    })())))) === 7200);
  });

  test("`@` and `this` should both be able to invoke a method", function() {
    var fn, nonce;
    nonce = {};
    fn = function(arg) {
      return eq(nonce, arg);
    };
    fn.withAt = function() {
      return this(nonce);
    };
    fn.withThis = function() {
      return this(nonce);
    };
    fn.withAt();
    return fn.withThis();
  });

  test("Trying an implicit object call with a trailing function.", function() {
    var a, meth;
    a = null;
    meth = function(arg, obj, func) {
      return a = [obj.a, arg, func()].join(' ');
    };
    meth('apple', {
      b: 1,
      a: 13
    }, function() {
      return 'orange';
    });
    return ok(a === '13 apple orange');
  });

  test("Ensure that empty functions don't return mistaken values.", function() {
    var obj;
    obj = {
      func: function() {
        var param, rest;
        param = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        this.param = param;
        this.rest = rest;
      }
    };
    ok(obj.func(101, 102, 103, 104) === void 0);
    ok(obj.param === 101);
    return ok(obj.rest.join(' ') === '102 103 104');
  });

  test("Passing multiple functions without paren-wrapping is legal, and should compile.", function() {
    var result, sum;
    sum = function(one, two) {
      return one() + two();
    };
    result = sum(function() {
      return 7 + 9;
    }, function() {
      return 1 + 3;
    });
    return ok(result === 20);
  });

  test("Implicit call with a trailing if statement as a param.", function() {
    var func, result;
    func = function() {
      return arguments[1];
    };
    result = func('one', false ? 100 : 13);
    return ok(result === 13);
  });

  test("Test more function passing:", function() {
    var result, sum;
    sum = function(one, two) {
      return one() + two();
    };
    result = sum(function() {
      return 1 + 2;
    }, function() {
      return 2 + 1;
    });
    ok(result === 6);
    sum = function(a, b) {
      return a + b;
    };
    result = sum(1, 2);
    return ok(result === 3);
  });

  test("Chained blocks, with proper indentation levels:", function() {
    var counter;
    counter = {
      results: [],
      tick: function(func) {
        this.results.push(func());
        return this;
      }
    };
    counter.tick(function() {
      return 3;
    }).tick(function() {
      return 2;
    }).tick(function() {
      return 1;
    });
    return arrayEq([3, 2, 1], counter.results);
  });

  test("This is a crazy one.", function() {
    var ident, result, x;
    x = function(obj, func) {
      return func(obj);
    };
    ident = function(x) {
      return x;
    };
    result = x({
      one: ident(1)
    }, function(obj) {
      var inner;
      inner = ident(obj);
      return ident(inner);
    });
    return ok(result.one === 1);
  });

  test("More paren compilation tests:", function() {
    var reverse;
    reverse = function(obj) {
      return obj.reverse();
    };
    return ok(reverse([1, 2].concat(3)).join(' ') === '3 2 1');
  });

  test("Test for inline functions with parentheses and implicit calls.", function() {
    var combine, result;
    combine = function(func, num) {
      return func() * num;
    };
    result = combine((function() {
      return 1 + 2;
    }), 3);
    return ok(result === 9);
  });

  test("Test for calls/parens/multiline-chains.", function() {
    var f, result;
    f = function(x) {
      return x;
    };
    result = (f(1)).toString().length;
    return ok(result === 1);
  });

  test("Test implicit calls in functions in parens:", function() {
    var result;
    result = (function(val) {
      [].push(val);
      return val;
    })(10);
    return ok(result === 10);
  });

  test("Ensure that chained calls with indented implicit object literals below are alright.", function() {
    var obj, result;
    result = null;
    obj = {
      method: function(val) {
        return this;
      },
      second: function(hash) {
        return result = hash.three;
      }
    };
    obj.method(101).second({
      one: {
        two: 2
      },
      three: 3
    });
    return eq(result, 3);
  });

  test("Test newline-supressed call chains with nested functions.", function() {
    var func, obj;
    obj = {
      call: function() {
        return this;
      }
    };
    func = function() {
      obj.call(function() {
        return one(two);
      }).call(function() {
        return three(four);
      });
      return 101;
    };
    return eq(func(), 101);
  });

  test("Implicit objects with number arguments.", function() {
    var func, obj;
    func = function(x, y) {
      return y;
    };
    obj = {
      prop: func("a", 1)
    };
    return ok(obj.prop === 1);
  });

  test("Non-spaced unary and binary operators should cause a function call.", function() {
    var func;
    func = function(val) {
      return val + 1;
    };
    ok((func(+5)) === 6);
    return ok((func(-5)) === -4);
  });

  test("Prefix unary assignment operators are allowed in parenless calls.", function() {
    var func, val;
    func = function(val) {
      return val + 1;
    };
    val = 5;
    return ok((func(--val)) === 5);
  });

  test("#855: execution context for `func arr...` should be `null`", function() {
    var array, contextTest;
    contextTest = function() {
      return eq(this, typeof window !== "undefined" && window !== null ? window : global);
    };
    array = [];
    contextTest(array);
    contextTest.apply(null, array);
    return contextTest.apply(null, array);
  });

  test("#904: Destructuring function arguments with same-named variables in scope", function() {
    var a, b, c, d, fn, nonce, result;
    a = b = nonce = {};
    fn = function(_arg) {
      var a, b;
      a = _arg[0], b = _arg[1];
      return {
        a: a,
        b: b
      };
    };
    result = fn([c = {}, d = {}]);
    eq(c, result.a);
    eq(d, result.b);
    eq(nonce, a);
    return eq(nonce, b);
  });

  test("Simple Destructuring function arguments with same-named variables in scope", function() {
    var f, x;
    x = 1;
    f = function(_arg) {
      var x;
      x = _arg[0];
      return x;
    };
    eq(f([2]), 2);
    return eq(x, 1);
  });

  test("caching base value", function() {
    var obj, _ref;
    obj = {
      index: 0,
      0: {
        method: function() {
          return this === obj[0];
        }
      }
    };
    return ok((_ref = obj[obj.index++]).method.apply(_ref, []));
  });

  test("passing splats to functions", function() {
    var first, fn, last, others, range, second, _ref;
    arrayEq([0, 1, 2, 3, 4], id(id.apply(null, [0, 1, 2, 3, 4])));
    fn = function() {
      var a, b, c, d, _i;
      a = arguments[0], b = arguments[1], c = 4 <= arguments.length ? __slice.call(arguments, 2, _i = arguments.length - 1) : (_i = 2, []), d = arguments[_i++];
      return [a, b, c, d];
    };
    range = [0, 1, 2, 3];
    _ref = fn.apply(null, __slice.call(range).concat([4], __slice.call([5, 6, 7]))), first = _ref[0], second = _ref[1], others = _ref[2], last = _ref[3];
    eq(0, first);
    eq(1, second);
    arrayEq([2, 3, 4, 5, 6], others);
    return eq(7, last);
  });

  test("splat variables are local to the function", function() {
    var clobber, outer;
    outer = "x";
    clobber = function() {
      var avar, outer;
      avar = arguments[0], outer = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return outer;
    };
    clobber("foo", "bar");
    return eq("x", outer);
  });

  test("Issue 894: Splatting against constructor-chained functions.", function() {
    var Foo, x, _ref;
    x = null;
    Foo = (function() {
      function Foo() {}

      Foo.prototype.bar = function(y) {
        return x = y;
      };

      return Foo;

    })();
    (_ref = new Foo()).bar.apply(_ref, [101]);
    return eq(x, 101);
  });

  test("Functions with splats being called with too few arguments.", function() {
    var method, pen;
    pen = null;
    method = function() {
      var first, penultimate, ultimate, variable, _i;
      first = arguments[0], variable = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), penultimate = arguments[_i++], ultimate = arguments[_i++];
      return pen = penultimate;
    };
    method(1, 2, 3, 4, 5, 6, 7, 8, 9);
    ok(pen === 8);
    method(1, 2, 3);
    ok(pen === 2);
    method(1, 2);
    return ok(pen === 2);
  });

  test("splats with super() within classes.", function() {
    var Child, Parent, _ref;
    Parent = (function() {
      function Parent() {}

      Parent.prototype.meth = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return args;
      };

      return Parent;

    })();
    Child = (function(_super) {
      __extends(Child, _super);

      function Child() {
        _ref = Child.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Child.prototype.meth = function() {
        var nums;
        nums = [3, 2, 1];
        return Child.__super__.meth.apply(this, nums);
      };

      return Child;

    })(Parent);
    return ok((new Child).meth().join(' ') === '3 2 1');
  });

  test("#1011: passing a splat to a method of a number", function() {
    var _ref, _ref1;
    eq('1011', (11).toString.apply((11), [2]));
    eq('1011', (_ref = 31.).toString.apply(_ref, [3]));
    eq('1011', 69.0.toString.apply(69.0, [4]));
    return eq('1011', (_ref1 = 131.0).toString.apply(_ref1, [5]));
  });

  test("splats and the `new` operator: functions that return `null` should construct their instance", function() {
    var args, child, constructor;
    args = [];
    child = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })((constructor = function() {
      return null;
    }), args, function(){});
    return ok(child instanceof constructor);
  });

  test("splats and the `new` operator: functions that return functions should construct their return value", function() {
    var args, child, constructor, fn;
    args = [];
    fn = function() {};
    child = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })((constructor = function() {
      return fn;
    }), args, function(){});
    ok(!(child instanceof constructor));
    return eq(fn, child);
  });

  test("implicit return", function() {
    return eq(ok, new function() {
      return ok;
      /* Should `return` implicitly*/

      /* even with trailing comments.*/

    });
  });

  test("implicit returns with multiple branches", function() {
    var fn, nonce;
    nonce = {};
    fn = function() {
      var a, _i, _len;
      if (false) {
        for (_i = 0, _len = b.length; _i < _len; _i++) {
          a = b[_i];
          if (d) {
            return c;
          }
        }
      } else {
        return nonce;
      }
    };
    return eq(nonce, fn());
  });

  test("implicit returns with switches", function() {
    var fn, nonce;
    nonce = {};
    fn = function() {
      switch (nonce) {
        case nonce:
          return nonce;
        default:
          return void 0;
      }
    };
    return eq(nonce, fn());
  });

  test("preserve context when generating closure wrappers for expression conversions", function() {
    var nonce, obj;
    nonce = {};
    obj = {
      property: nonce,
      method: function() {
        return this.result = false ? 10 : ("a", "b", this.property);
      }
    };
    eq(nonce, obj.method());
    return eq(nonce, obj.property);
  });

  test("don't wrap 'pure' statements in a closure", function() {
    var fn, items, nonce;
    nonce = {};
    items = [0, 1, 2, 3, nonce, 4, 5];
    fn = function(items) {
      var item, _i, _len;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item === nonce) {
          return item;
        }
      }
    };
    return eq(nonce, fn(items));
  });

  test("usage of `new` is careful about where the invocation parens end up", function() {
    eq('object', typeof new ((function() {
      try {
        return Array;
      } catch (_error) {}
    })()));
    return eq('object', typeof new ((function() {
      return function() {};
    })()));
  });

  test("implicit call against control structures", function() {
    var error, result, save;
    result = null;
    save = function(obj) {
      return result = obj;
    };
    save((function() {
      switch (id(false)) {
        case true:
          return 'true';
        case false:
          return 'false';
      }
    })());
    eq(result, 'false');
    save(id(false) ? 'false' : 'true');
    eq(result, 'true');
    save(!id(false) ? 'true' : 'false');
    eq(result, 'true');
    save((function() {
      try {
        return doesnt(exist);
      } catch (_error) {
        error = _error;
        return 'caught';
      }
    })());
    eq(result, 'caught');
    save((function() {
      try {
        return doesnt(exist);
      } catch (_error) {
        error = _error;
        return 'caught2';
      }
    })());
    return eq(result, 'caught2');
  });

  test("#1420: things like `(fn() ->)`; there are no words for this one", function() {
    var fn, nonce;
    fn = function() {
      return function(f) {
        return f();
      };
    };
    nonce = {};
    return eq(nonce, fn()(function() {
      return nonce;
    }));
  });

  test("#1416: don't omit one 'new' when compiling 'new new'", function() {
    var nonce, obj;
    nonce = {};
    obj = new new function() {
      return function() {
        return {
          prop: nonce
        };
      };
    };
    return eq(obj.prop, nonce);
  });

  test("#1416: don't omit one 'new' when compiling 'new new fn()()'", function() {
    var argNonceA, argNonceB, fn, nonce, obj;
    nonce = {};
    argNonceA = {};
    argNonceB = {};
    fn = function(a) {
      return function(b) {
        return {
          a: a,
          b: b,
          prop: nonce
        };
      };
    };
    obj = new new fn(argNonceA)(argNonceB);
    eq(obj.prop, nonce);
    eq(obj.a, argNonceA);
    return eq(obj.b, argNonceB);
  });

  test("#1840: accessing the `prototype` after function invocation should compile", function() {
    var Test, dotAccess, nonce, protoAccess;
    doesNotThrow(function() {
      return CoffeeScript.compile('fn()::prop');
    });
    nonce = {};
    Test = (function() {
      function Test() {}

      Test.prototype.id = nonce;

      return Test;

    })();
    dotAccess = function() {
      return Test.prototype;
    };
    protoAccess = function() {
      return Test;
    };
    eq(dotAccess().id, nonce);
    return eq(protoAccess().prototype.id, nonce);
  });

  test("#960: improved 'do'", function() {
    var func, overridden, ret, two;
    (function(nonExistent) {
      return eq(nonExistent, 'one');
    })('one');
    overridden = 1;
    (function(overridden) {
      return eq(overridden, 2);
    })(2);
    two = 2;
    (function(one, two, three) {
      eq(one, 1);
      eq(two, 2);
      return eq(three, 3);
    })(1, two, 3);
    ret = (func = function(two) {
      eq(two, 2);
      return func;
    })(two);
    return eq(ret, func);
  });

  test("#2617: implicit call before unrelated implicit object", function() {
    var pass, result;
    pass = function() {
      return true;
    };
    result = pass(1) ? {
      one: 1
    } : void 0;
    return eq(result.one, 1);
  });

  test("#2292, b: f (z),(x)", function() {
    var f, o, one, two;
    f = function(x, y) {
      return y;
    };
    one = 1;
    two = 2;
    o = {
      b: f(one, two)
    };
    return eq(o.b, 2);
  });

  test("#2297, Different behaviors on interpreting literal", function() {
    var bar, foo, quux, qux, xyzzy;
    foo = function(x, y) {
      return y;
    };
    bar = {
      baz: foo(100, true)
    };
    eq(bar.baz, true);
    qux = function(x) {
      return x;
    };
    quux = qux({
      corge: foo(100, true)
    });
    eq(quux.corge, true);
    xyzzy = {
      e: 1,
      f: foo({
        a: 1,
        b: 2
      }, {
        one: 1,
        two: 2,
        three: 3
      }),
      g: {
        a: 1,
        b: 2,
        c: foo(2, {
          one: 1,
          two: 2,
          three: 3
        }),
        d: 3
      },
      four: 4,
      h: foo({
        one: 1,
        two: 2,
        three: {
          three: {
            three: 3
          }
        }
      }, 2)
    };
    eq(xyzzy.f.two, 2);
    eq(xyzzy.g.c.three, 3);
    eq(xyzzy.four, 4);
    return eq(xyzzy.h, 2);
  });

  test("#2715, Chained implicit calls", function() {
    var bar, baz, first, foo, second;
    first = function(x) {
      return x;
    };
    second = function(x, y) {
      return y;
    };
    foo = first(first({
      one: 1
    }));
    eq(foo.one, 1);
    bar = first(second({
      one: 1
    }, 2));
    eq(bar, 2);
    baz = first(second({
      one: 1
    }, 2));
    return eq(baz, 2);
  });

  test("Implicit calls and new", function() {
    var bar, baz, first, foo, third;
    first = function(x) {
      return x;
    };
    foo = function(x) {
      this.x = x;
    };
    bar = first(new foo(first(1)));
    eq(bar.x, 1);
    third = function(x, y, z) {
      return z;
    };
    baz = first(new foo(new foo(third({
      one: 1,
      two: 2
    }, 1, {
      three: 3
    }, 2))));
    return eq(baz.x.x.three, 3);
  });

  test("Loose tokens inside of explicit call lists", function() {
    var bar, first, foo, one, second;
    first = function(x) {
      return x;
    };
    second = function(x, y) {
      return y;
    };
    one = 1;
    foo = second(one, 2);
    eq(foo, 2);
    bar = first(first({
      one: 1
    }));
    return eq(bar.one, 1);
  });

}).call(this);
