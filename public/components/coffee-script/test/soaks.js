(function() {
  test("soaked property access", function() {
    var nonce, obj, _ref, _ref1, _ref2, _ref3, _ref4;
    nonce = {};
    obj = {
      a: {
        b: nonce
      }
    };
    eq(nonce, obj != null ? obj.a.b : void 0);
    eq(nonce, obj != null ? obj['a'].b : void 0);
    eq(nonce, (_ref = obj.a) != null ? _ref.b : void 0);
    eq(nonce, obj != null ? (_ref1 = obj.a) != null ? _ref1['b'] : void 0 : void 0);
    return eq(void 0, obj != null ? (_ref2 = obj.a) != null ? (_ref3 = _ref2.non) != null ? (_ref4 = _ref3.existent) != null ? _ref4.property : void 0 : void 0 : void 0 : void 0);
  });

  test("soaked property access caches method calls", function() {
    var nonce, obj, _ref, _ref1;
    nonce = {};
    obj = {
      fn: function() {
        return {
          a: nonce
        };
      }
    };
    eq(nonce, (_ref = obj.fn()) != null ? _ref.a : void 0);
    return eq(void 0, (_ref1 = obj.fn()) != null ? _ref1.b : void 0);
  });

  test("soaked property access caching", function() {
    var counter, fn, nonce, obj, _ref;
    nonce = {};
    counter = 0;
    fn = function() {
      counter++;
      return 'self';
    };
    obj = {
      self: function() {
        return this;
      },
      prop: nonce
    };
    eq(nonce, (_ref = obj[fn()]()[fn()]()[fn()]()) != null ? _ref.prop : void 0);
    return eq(3, counter);
  });

  test("method calls on soaked methods", function() {
    var nonce, obj;
    nonce = {};
    obj = null;
    eq(void 0, obj != null ? obj.a().b() : void 0);
    obj = {
      a: function() {
        return {
          b: function() {
            return nonce;
          }
        };
      }
    };
    return eq(nonce, obj != null ? obj.a().b() : void 0);
  });

  test("postfix existential operator mixes well with soaked property accesses", function() {
    return eq(false, (typeof nonexistent !== "undefined" && nonexistent !== null ? nonexistent.property : void 0) != null);
  });

  test("function invocation with soaked property access", function() {
    var id;
    id = function(_) {
      return _;
    };
    return eq(void 0, id(typeof nonexistent !== "undefined" && nonexistent !== null ? nonexistent.method() : void 0));
  });

  test("if-to-ternary should safely parenthesize soaked property accesses", function() {
    return ok(((typeof nonexistent !== "undefined" && nonexistent !== null ? nonexistent.property : void 0) ? false : true));
  });

  test("#726", function() {
    return eq(void 0, typeof nonexistent !== "undefined" && nonexistent !== null ? nonexistent[Date()] : void 0);
  });

  test("#756", function() {
    var a;
    a = null;
    ok(isNaN((a != null ? a.b.c : void 0) + 1));
    eq(void 0, a != null ? a.b.c += 1 : void 0);
    eq(void 0, a != null ? ++a.b.c : void 0);
    return eq(void 0, a != null ? delete a.b.c : void 0);
  });

  test("operations on soaked properties", function() {
    var a;
    a = {
      b: {
        c: 0
      }
    };
    eq(1, (a != null ? a.b.c : void 0) + 1);
    eq(1, a != null ? a.b.c += 1 : void 0);
    eq(2, a != null ? ++a.b.c : void 0);
    return eq(true, a != null ? delete a.b.c : void 0);
  });

  test("soaked method invocation", function() {
    var counter, nonce, obj, _base;
    nonce = {};
    counter = 0;
    obj = {
      self: function() {
        return this;
      },
      increment: function() {
        counter++;
        return this;
      }
    };
    eq(obj, typeof obj.self === "function" ? obj.self() : void 0);
    eq(void 0, typeof obj.method === "function" ? obj.method() : void 0);
    eq(nonce, typeof obj.self === "function" ? obj.self().property = nonce : void 0);
    eq(void 0, typeof obj.method === "function" ? obj.method().property = nonce : void 0);
    eq(obj, typeof (_base = obj.increment().increment()).self === "function" ? _base.self() : void 0);
    return eq(2, counter);
  });

  test("#733", function() {
    var a, _ref, _ref1, _ref2, _ref3;
    a = {
      b: {
        c: null
      }
    };
    eq((_ref = a.b) != null ? typeof _ref.c === "function" ? _ref.c() : void 0 : void 0, void 0);
    if ((_ref1 = a.b) != null) {
      _ref1.c || (_ref1.c = function(it) {
        return it;
      });
    }
    eq((_ref2 = a.b) != null ? typeof _ref2.c === "function" ? _ref2.c(1) : void 0 : void 0, 1);
    return eq((_ref3 = a.b) != null ? typeof _ref3.c === "function" ? _ref3.c.apply(_ref3, [2, 3]) : void 0 : void 0, 2);
  });

  test("soaked function invocation", function() {
    var id, nonce;
    nonce = {};
    id = function(_) {
      return _;
    };
    eq(nonce, typeof id === "function" ? id(nonce) : void 0);
    eq(nonce, typeof id === "function" ? id(nonce) : void 0);
    eq(void 0, typeof nonexistent === "function" ? nonexistent(nonce) : void 0);
    return eq(void 0, typeof nonexistent === "function" ? nonexistent(nonce) : void 0);
  });

  test("soaked function invocation with generated functions", function() {
    var id, maybe, nonce, _base, _base1, _base2;
    nonce = {};
    id = function(_) {
      return _;
    };
    maybe = function(fn, arg) {
      if (typeof fn === 'function') {
        return function() {
          return fn(arg);
        };
      }
    };
    eq(typeof (_base = maybe(id, nonce)) === "function" ? _base() : void 0, nonce);
    eq(typeof (_base1 = maybe(id, nonce)) === "function" ? _base1() : void 0, nonce);
    return eq(typeof (_base2 = maybe(false, nonce)) === "function" ? _base2() : void 0, void 0);
  });

  test("soaked constructor invocation", function() {
    eq(42, +(typeof Number === "function" ? new Number(42) : void 0));
    return eq(void 0, typeof Other === "function" ? new Other(42) : void 0);
  });

  test("soaked constructor invocations with caching and property access", function() {
    var C, nonce, semaphore, _ref;
    semaphore = 0;
    nonce = {};
    C = (function() {
      function C() {
        if (semaphore) {
          ok(false);
        }
        semaphore++;
      }

      C.prototype.prop = nonce;

      return C;

    })();
    eq(nonce, (_ref = new C()) != null ? _ref.prop : void 0);
    return eq(1, semaphore);
  });

  test("soaked function invocation safe on non-functions", function() {
    eq(void 0, typeof 0 === "function" ? 0(1) : void 0);
    return eq(void 0, typeof 0 === "function" ? 0(1, 2) : void 0);
  });

}).call(this);
