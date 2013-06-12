(function() {
  var Array, Object,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  test("reference `arguments` inside of functions", function() {
    var sumOfArgs;
    sumOfArgs = function() {
      var num, sum, _i, _len;
      sum = function(a, b) {
        return a + b;
      };
      sum = 0;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        num = arguments[_i];
        sum += num;
      }
      return sum;
    };
    return eq(10, sumOfArgs(0, 1, 2, 3, 4));
  });

  test("assignment to an Object.prototype-named variable should not leak to outer scope", function() {
    (function() {
      var constructor;
      return constructor = 'word';
    })();
    return ok(constructor !== 'word');
  });

  test("siblings of splat parameters shouldn't leak to surrounding scope", function() {
    var oops, x;
    x = 10;
    oops = function() {
      var args, x;
      x = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    };
    oops(20, 1, 2, 3);
    return eq(x, 10);
  });

  test("catch statements should introduce their argument to scope", function() {
    var e;
    try {
      throw '';
    } catch (_error) {
      e = _error;
      (function() {
        return e = 5;
      })();
      return eq(5, e);
    }
  });

  Array = (function() {
    function Array() {}

    Array.prototype.slice = fail;

    return Array;

  })();

  Object = (function() {
    function Object() {}

    Object.prototype.hasOwnProperty = fail;

    return Object;

  })();

  test("#1973: redefining Array/Object constructors shouldn't confuse __X helpers", function() {
    var arr, k, obj, _results;
    arr = [1, 2, 3, 4];
    arrayEq([3, 4], arr.slice(2));
    obj = {
      arr: arr
    };
    _results = [];
    for (k in obj) {
      if (!__hasProp.call(obj, k)) continue;
      _results.push(eq(arr, obj[k]));
    }
    return _results;
  });

  test("#2255: global leak with splatted @-params", function() {
    ok(typeof x === "undefined" || x === null);
    arrayEq([0], (function() {
      var x;
      x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.x = x;
      return this.x;
    }).call({}, 0));
    return ok(typeof x === "undefined" || x === null);
  });

  test("#1183: super + fat arrows", function() {
    var A, B, b, dolater,
      _this = this;
    dolater = function(cb) {
      return cb();
    };
    A = (function() {
      function A() {
        this._i = 0;
      }

      A.prototype.foo = function(cb) {
        var _this = this;
        return dolater(function() {
          _this._i += 1;
          return cb();
        });
      };

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        B.__super__.constructor.apply(this, arguments);
      }

      B.prototype.foo = function(cb) {
        var _this = this;
        return dolater(function() {
          return dolater(function() {
            _this._i += 2;
            return B.__super__.foo.call(_this, cb);
          });
        });
      };

      return B;

    })(A);
    b = new B;
    return b.foo(function() {
      return eq(b._i, 3);
    });
  });

  test("#1183: super + wrap", function() {
    var A, B;
    A = (function() {
      function A() {}

      A.prototype.m = function() {
        return 10;
      };

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        B.__super__.constructor.apply(this, arguments);
      }

      return B;

    })(A);
    B.prototype.m = function() {
      var r;
      return r = (function() {
        try {
          return B.__super__.m.call(this);
        } catch (_error) {}
      }).call(this);
    };
    return eq((new B).m(), 10);
  });

  test("#1183: super + closures", function() {
    var A, B, _ref;
    A = (function() {
      function A() {
        this.i = 10;
      }

      A.prototype.foo = function() {
        return this.i;
      };

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        _ref = B.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      B.prototype.foo = function() {
        var ret;
        ret = (function() {
          switch (1) {
            case 0:
              return 0;
            case 1:
              return B.__super__.foo.call(this);
          }
        }).call(this);
        return ret;
      };

      return B;

    })(A);
    return eq((new B).foo(), 10);
  });

  test("#2331: bound super regression", function() {
    var A, B, _ref;
    A = (function() {
      function A() {}

      A.value = 'A';

      A.prototype.method = function() {
        return this.constructor.value;
      };

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        this.method = __bind(this.method, this);
        _ref = B.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      B.prototype.method = function() {
        return B.__super__.method.apply(this, arguments);
      };

      return B;

    })(A);
    return eq((new B).method(), 'A');
  });

}).call(this);
