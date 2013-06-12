(function() {
  var __hasProp = {}.hasOwnProperty;

  test("Basic array comprehensions.", function() {
    var n, nums, results;
    nums = (function() {
      var _i, _len, _ref, _results;
      _ref = [1, 2, 3];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (n & 1) {
          _results.push(n * n);
        }
      }
      return _results;
    })();
    results = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = nums.length; _i < _len; _i++) {
        n = nums[_i];
        _results.push(n * 2);
      }
      return _results;
    })();
    return ok(results.join(',') === '2,18');
  });

  test("Basic object comprehensions.", function() {
    var names, obj, odds, prop, value;
    obj = {
      one: 1,
      two: 2,
      three: 3
    };
    names = (function() {
      var _results;
      _results = [];
      for (prop in obj) {
        _results.push(prop + '!');
      }
      return _results;
    })();
    odds = (function() {
      var _results;
      _results = [];
      for (prop in obj) {
        value = obj[prop];
        if (value & 1) {
          _results.push(prop + '!');
        }
      }
      return _results;
    })();
    ok(names.join(' ') === "one! two! three!");
    return ok(odds.join(' ') === "one! three!");
  });

  test("Basic range comprehensions.", function() {
    var i, negs, nums, result, x;
    nums = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 3; i = ++_i) {
        _results.push(i * 3);
      }
      return _results;
    })();
    negs = (function() {
      var _i, _ref, _results;
      _results = [];
      for (x = _i = -20, _ref = -5 * 2; -20 <= _ref ? _i <= _ref : _i >= _ref; x = -20 <= _ref ? ++_i : --_i) {
        _results.push(x);
      }
      return _results;
    })();
    negs = negs.slice(0, 3);
    result = nums.concat(negs).join(', ');
    return ok(result === '3, 6, 9, -20, -19, -18');
  });

  test("With range comprehensions, you can loop in steps.", function() {
    var results, x;
    results = (function() {
      var _i, _results;
      _results = [];
      for (x = _i = 0; _i < 15; x = _i += 5) {
        _results.push(x);
      }
      return _results;
    })();
    ok(results.join(' ') === '0 5 10');
    results = (function() {
      var _i, _results;
      _results = [];
      for (x = _i = 0; _i <= 100; x = _i += 10) {
        _results.push(x);
      }
      return _results;
    })();
    return ok(results.join(' ') === '0 10 20 30 40 50 60 70 80 90 100');
  });

  test("And can loop downwards, with a negative step.", function() {
    var results, x, _i, _ref, _ref1, _results;
    results = (function() {
      var _i, _results;
      _results = [];
      for (x = _i = 5; _i >= 1; x = --_i) {
        _results.push(x);
      }
      return _results;
    })();
    ok(results.join(' ') === '5 4 3 2 1');
    ok(results.join(' ') === (function() {
      _results = [];
      for (var _i = _ref = 10 - 5, _ref1 = -2 + 3; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).join(' '));
    results = (function() {
      var _j, _results1;
      _results1 = [];
      for (x = _j = 10; _j >= 1; x = --_j) {
        _results1.push(x);
      }
      return _results1;
    })();
    ok(results.join(' ') === [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].join(' '));
    results = (function() {
      var _j, _results1;
      _results1 = [];
      for (x = _j = 10; _j > 0; x = _j += -2) {
        _results1.push(x);
      }
      return _results1;
    })();
    return ok(results.join(' ') === [10, 8, 6, 4, 2].join(' '));
  });

  test("Range comprehension gymnastics.", function() {
    var a, b, c, i;
    eq("" + ((function() {
      var _i, _results;
      _results = [];
      for (i = _i = 5; _i >= 1; i = --_i) {
        _results.push(i);
      }
      return _results;
    })()), '5,4,3,2,1');
    eq("" + ((function() {
      var _i, _results;
      _results = [];
      for (i = _i = 5; _i >= -5; i = _i += -5) {
        _results.push(i);
      }
      return _results;
    })()), '5,0,-5');
    a = 6;
    b = 0;
    c = -2;
    eq("" + ((function() {
      var _i, _results;
      _results = [];
      for (i = _i = a; a <= b ? _i <= b : _i >= b; i = a <= b ? ++_i : --_i) {
        _results.push(i);
      }
      return _results;
    })()), '6,5,4,3,2,1,0');
    return eq("" + ((function() {
      var _i, _results;
      _results = [];
      for (i = _i = a; c > 0 ? _i <= b : _i >= b; i = _i += c) {
        _results.push(i);
      }
      return _results;
    })()), '6,4,2,0');
  });

  test("Multiline array comprehension with filter.", function() {
    var evens, num;
    evens = (function() {
      var _i, _len, _ref, _results;
      _ref = [1, 2, 3, 4, 5, 6];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        num = _ref[_i];
        if (!(!(num & 1))) {
          continue;
        }
        num *= -1;
        num -= 2;
        _results.push(num * -1);
      }
      return _results;
    })();
    eq(evens + '', '4,6,8');
    return test("The in operator still works, standalone.", function() {
      return ok(2 in evens);
    });
  });

  test("all isn't reserved.", function() {
    var all;
    return all = 1;
  });

  test("Ensure that the closure wrapper preserves local variables.", function() {
    var method, obj, _fn, _i, _len, _ref;
    obj = {};
    _ref = ['one', 'two', 'three'];
    _fn = function(method) {
      return obj[method] = function() {
        return "I'm " + method;
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      _fn(method);
    }
    ok(obj.one() === "I'm one");
    ok(obj.two() === "I'm two");
    return ok(obj.three() === "I'm three");
  });

  test("Index values at the end of a loop.", function() {
    var i, _i;
    i = 0;
    for (i = _i = 1; _i <= 3; i = ++_i) {
      (function() {
        return 'func';
      });
      if (false) {
        break;
      }
    }
    return ok(i === 4);
  });

  test("Ensure that local variables are closed over for range comprehensions.", function() {
    var func, funcs, i;
    funcs = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 3; i = ++_i) {
        _results.push((function(i) {
          return function() {
            return -i;
          };
        })(i));
      }
      return _results;
    })();
    eq(((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = funcs.length; _i < _len; _i++) {
        func = funcs[_i];
        _results.push(func());
      }
      return _results;
    })()).join(' '), '-1 -2 -3');
    return ok(i === 4);
  });

  test("Even when referenced in the filter.", function() {
    var i, list, methods, num;
    list = ['one', 'two', 'three'];
    methods = (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        num = list[i];
        if (num !== 'two' && i !== 1) {
          _results.push((function(num, i) {
            return function() {
              return num + ' ' + i;
            };
          })(num, i));
        }
      }
      return _results;
    })();
    ok(methods.length === 2);
    ok(methods[0]() === 'one 0');
    return ok(methods[1]() === 'three 2');
  });

  test("Even a convoluted one.", function() {
    var func, funcs, i, results, _fn, _i;
    funcs = [];
    _fn = function(i) {
      var x;
      x = i * 2;
      return (function(z) {
        return funcs.push(function() {
          return z + ' ' + i;
        });
      })(x);
    };
    for (i = _i = 1; _i <= 3; i = ++_i) {
      _fn(i);
    }
    ok(((function() {
      var _j, _len, _results;
      _results = [];
      for (_j = 0, _len = funcs.length; _j < _len; _j++) {
        func = funcs[_j];
        _results.push(func());
      }
      return _results;
    })()).join(', ') === '2 1, 4 2, 6 3');
    funcs = [];
    results = (function() {
      var _j, _results;
      _results = [];
      for (i = _j = 1; _j <= 3; i = ++_j) {
        _results.push((function(i) {
          var x, z;
          z = (function() {
            var _k, _results1;
            _results1 = [];
            for (x = _k = 1; 1 <= i ? _k <= i : _k >= i; x = 1 <= i ? ++_k : --_k) {
              _results1.push(x * 3);
            }
            return _results1;
          })();
          return (function(a, b, c) {
            return [a, b, c].join(' ');
          }).apply(this, z);
        })(i));
      }
      return _results;
    })();
    return ok(results.join(', ') === '3  , 3 6 , 3 6 9');
  });

  test("Naked ranges are expanded into arrays.", function() {
    var array, num;
    array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return ok((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i += 2) {
        num = array[_i];
        _results.push(num % 2 === 0);
      }
      return _results;
    })());
  });

  test("Nested shared scopes.", function() {
    var foo;
    foo = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 7; i = ++_i) {
        _results.push((function(i) {
          var j, _j, _results1;
          _results1 = [];
          for (j = _j = 0; _j <= 7; j = ++_j) {
            _results1.push((function(j) {
              return function() {
                return i + j;
              };
            })(j));
          }
          return _results1;
        })(i));
      }
      return _results;
    };
    return eq(foo()[3][4](), 7);
  });

  test("Scoped loop pattern matching.", function() {
    var a, funcs, v, _fn, _i, _len;
    a = [[0], [1]];
    funcs = [];
    _fn = function(v) {
      return funcs.push(function() {
        return v;
      });
    };
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      v = a[_i][0];
      _fn(v);
    }
    eq(funcs[0](), 0);
    return eq(funcs[1](), 1);
  });

  test("Nested comprehensions.", function() {
    var multiLiner, singleLiner, x, y;
    multiLiner = (function() {
      var _i, _results;
      _results = [];
      for (x = _i = 3; _i <= 5; x = ++_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (y = _j = 3; _j <= 5; y = ++_j) {
            _results1.push([x, y]);
          }
          return _results1;
        })());
      }
      return _results;
    })();
    singleLiner = (function() {
      var _i, _results;
      _results = [];
      for (x = _i = 3; _i <= 5; x = ++_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (y = _j = 3; _j <= 5; y = ++_j) {
            _results1.push([x, y]);
          }
          return _results1;
        })());
      }
      return _results;
    })();
    ok(multiLiner.length === singleLiner.length);
    ok(5 === multiLiner[2][2][1]);
    return ok(5 === singleLiner[2][2][1]);
  });

  test("Comprehensions within parentheses.", function() {
    var result, store, x;
    result = null;
    store = function(obj) {
      return result = obj;
    };
    store((function() {
      var _i, _len, _ref, _results;
      _ref = [3, 2, 1];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push(x * 2);
      }
      return _results;
    })());
    return ok(result.join(' ') === '6 4 2');
  });

  test("Closure-wrapped comprehensions that refer to the 'arguments' object.", function() {
    var expr;
    expr = function() {
      var item, result;
      return result = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          item = arguments[_i];
          _results.push(item * item);
        }
        return _results;
      }).apply(this, arguments);
    };
    return ok(expr(2, 4, 8).join(' ') === '4 16 64');
  });

  test("Fast object comprehensions over all properties, including prototypal ones.", function() {
    var Cat, all, key, own, value, whiskers;
    Cat = (function() {
      function Cat() {
        this.name = 'Whiskers';
      }

      Cat.prototype.breed = 'tabby';

      Cat.prototype.hair = 'cream';

      return Cat;

    })();
    whiskers = new Cat;
    own = (function() {
      var _results;
      _results = [];
      for (key in whiskers) {
        if (!__hasProp.call(whiskers, key)) continue;
        value = whiskers[key];
        _results.push(value);
      }
      return _results;
    })();
    all = (function() {
      var _results;
      _results = [];
      for (key in whiskers) {
        value = whiskers[key];
        _results.push(value);
      }
      return _results;
    })();
    ok(own.join(' ') === 'Whiskers');
    return ok(all.sort().join(' ') === 'Whiskers cream tabby');
  });

  test("Optimized range comprehensions.", function() {
    var exxes;
    exxes = (function() {
      var _i, _results;
      _results = [];
      for (_i = 0; _i < 10; _i++) {
        _results.push('x');
      }
      return _results;
    })();
    return ok(exxes.join(' ') === 'x x x x x x x x x x');
  });

  test("Loop variables should be able to reference outer variables", function() {
    var outer;
    outer = 1;
    (function() {
      var _i, _len, _ref, _results;
      _ref = [1, 2, 3];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        outer = _ref[_i];
        _results.push(null);
      }
      return _results;
    })();
    return eq(outer, 3);
  });

  test("Lenient on pure statements not trying to reach out of the closure", function() {
    var i, j, val;
    val = (function() {
      var _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = [1];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _ref1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          j = _ref1[_j];
          break;
        }
        _results.push(i);
      }
      return _results;
    })();
    return ok(val[0] === i);
  });

  test("Comprehensions only wrap their last line in a closure, allowing other lines  to have pure expressions in them.", function() {
    var func, i, odds;
    func = function() {
      var i, j, _i, _len, _ref, _results;
      _ref = [1];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i === 2) {
          break;
        }
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = [1];
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            j = _ref1[_j];
            _results1.push(j);
          }
          return _results1;
        })());
      }
      return _results;
    };
    ok(func()[0][0] === 1);
    i = 6;
    odds = (function() {
      var _results;
      _results = [];
      while (i--) {
        if (!(i & 1)) {
          continue;
        }
        _results.push(i);
      }
      return _results;
    })();
    return ok(odds.join(', ') === '5, 3, 1');
  });

  test("Issue #897: Ensure that plucked function variables aren't leaked.", function() {
    var facets, list;
    facets = {};
    list = ['one', 'two'];
    (function() {
      var entity, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        entity = list[_i];
        _results.push(facets[entity] = function() {
          return entity;
        });
      }
      return _results;
    })();
    eq(typeof entity, 'undefined');
    return eq(facets['two'](), 'two');
  });

  test("Issue #905. Soaks as the for loop subject.", function() {
    var a, d, e, _i, _len, _ref, _ref1;
    a = {
      b: {
        c: [1, 2, 3]
      }
    };
    _ref1 = (_ref = a.b) != null ? _ref.c : void 0;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      d = _ref1[_i];
      e = d;
    }
    return eq(e, 3);
  });

  test("Issue #948. Capturing loop variables.", function() {
    var funcs, list, y, _fn, _i, _len, _ref;
    funcs = [];
    list = function() {
      return [1, 2, 3];
    };
    _ref = list();
    _fn = function(y) {
      var z;
      z = y;
      return funcs.push(function() {
        return "y is " + y + " and z is " + z;
      });
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      y = _ref[_i];
      _fn(y);
    }
    return eq(funcs[1](), "y is 2 and z is 2");
  });

  test("Cancel the comprehension if there's a jump inside the loop.", function() {
    var i, result;
    result = (function() {
      var _i;
      try {
        for (i = _i = 0; _i < 10; i = ++_i) {
          if (i < 5) {
            continue;
          }
        }
        return i;
      } catch (_error) {}
    })();
    return eq(result, 10);
  });

  test("Comprehensions over break.", function() {
    return arrayEq((function() {
      var _i, _results;
      _results = [];
      for (_i = 1; _i <= 10; _i++) {
        break;
      }
      return _results;
    })(), []);
  });

  test("Comprehensions over continue.", function() {
    return arrayEq((function() {
      var _i, _results;
      _results = [];
      for (_i = 1; _i <= 10; _i++) {
        continue;
      }
      return _results;
    })(), []);
  });

  test("Comprehensions over function literals.", function() {
    var a, f, _fn, _i, _len, _ref;
    a = 0;
    _ref = [
      function() {
        return a = 1;
      }
    ];
    _fn = function(f) {
      return f();
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      _fn(f);
    }
    return eq(a, 1);
  });

  test("Comprehensions that mention arguments.", function() {
    var args, f, list;
    list = [
      {
        "arguments": 10
      }
    ];
    args = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        f = list[_i];
        _results.push((function(f) {
          return f["arguments"];
        })(f));
      }
      return _results;
    })();
    return eq(args[0], 10);
  });

  test("expression conversion under explicit returns", function() {
    var fn, nonce;
    nonce = {};
    fn = function() {
      var x;
      return (function() {
        var _i, _len, _ref, _results;
        _ref = [1, 2, 3];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(nonce);
        }
        return _results;
      })();
    };
    arrayEq([nonce, nonce, nonce], fn());
    fn = function() {
      var x;
      return [
        (function() {
          var _i, _len, _ref, _results;
          _ref = [1, 2, 3];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            _results.push(nonce);
          }
          return _results;
        })()
      ][0];
    };
    arrayEq([nonce, nonce, nonce], fn());
    fn = function() {
      var x;
      return [
        (function() {
          var _i, _results;
          _results = [];
          for (x = _i = 1; _i <= 3; x = ++_i) {
            _results.push(nonce);
          }
          return _results;
        })()
      ][0];
    };
    return arrayEq([nonce, nonce, nonce], fn());
  });

  test("implicit destructuring assignment in object of objects", function() {
    var a, b, c, obj, result, y, z;
    a = {};
    b = {};
    c = {};
    obj = {
      a: {
        d: a
      },
      b: {
        d: b
      },
      c: {
        d: c
      }
    };
    result = (function() {
      var _results;
      _results = [];
      for (y in obj) {
        z = obj[y].d;
        _results.push([y, z]);
      }
      return _results;
    })();
    return arrayEq([['a', a], ['b', b], ['c', c]], result);
  });

  test("implicit destructuring assignment in array of objects", function() {
    var a, arr, b, c, d, e, f, result, y, z;
    a = {};
    b = {};
    c = {};
    d = {};
    e = {};
    f = {};
    arr = [
      {
        a: a,
        b: {
          c: b
        }
      }, {
        a: c,
        b: {
          c: d
        }
      }, {
        a: e,
        b: {
          c: f
        }
      }
    ];
    result = (function() {
      var _i, _len, _ref, _ref1, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        _ref = arr[_i], y = _ref.a, (_ref1 = _ref.b, z = _ref1.c);
        _results.push([y, z]);
      }
      return _results;
    })();
    return arrayEq([[a, b], [c, d], [e, f]], result);
  });

  test("implicit destructuring assignment in array of arrays", function() {
    var a, arr, b, c, d, e, f, result, y, z;
    a = {};
    b = {};
    c = {};
    d = {};
    e = {};
    f = {};
    arr = [[a, [b]], [c, [d]], [e, [f]]];
    result = (function() {
      var _i, _len, _ref, _ref1, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        _ref = arr[_i], y = _ref[0], (_ref1 = _ref[1], z = _ref1[0]);
        _results.push([y, z]);
      }
      return _results;
    })();
    return arrayEq([[a, b], [c, d], [e, f]], result);
  });

  test("issue #1124: don't assign a variable in two scopes", function() {
    var lista, listb, _i;
    lista = [1, 2, 3, 4, 5];
    listb = (function() {
      var _j, _len, _results;
      _results = [];
      for (_j = 0, _len = lista.length; _j < _len; _j++) {
        _i = lista[_j];
        _results.push(_i + 1);
      }
      return _results;
    })();
    return arrayEq([2, 3, 4, 5, 6], listb);
  });

  test("#1326: `by` value is uncached", function() {
    var a, f, fi, forCompile, g, gi, h, hi, i, rangeCompileSimple, v, _i, _len, _ref;
    a = [0, 1, 2];
    fi = gi = hi = 0;
    f = function() {
      return ++fi;
    };
    g = function() {
      return ++gi;
    };
    h = function() {
      return ++hi;
    };
    forCompile = [];
    rangeCompileSimple = [];
    _ref = f();
    for ((_ref > 0 ? (i = _i = 0, _len = a.length) : i = _i = a.length - 1); _ref > 0 ? _i < _len : _i >= 0; i = _i += _ref) {
      v = a[i];
      forCompile.push(i);
    }
    rangeCompileSimple = (function() {
      var _j, _ref1, _results;
      _results = [];
      for (i = _j = 0, _ref1 = g(); _j <= 2; i = _j += _ref1) {
        _results.push(i);
      }
      return _results;
    })();
    arrayEq(a, forCompile);
    arrayEq(a, rangeCompileSimple);
    return eq("" + ((function() {
      var _j, _ref1, _results;
      _results = [];
      for (i = _j = 0, _ref1 = h(); _j <= 2; i = _j += _ref1) {
        _results.push(i);
      }
      return _results;
    })()), '0,1,2');
  });

  test("#1669: break/continue should skip the result only for that branch", function() {
    var n, ns;
    ns = (function() {
      var _i, _results;
      _results = [];
      for (n = _i = 0; _i <= 99; n = ++_i) {
        if (n > 9) {
          break;
        } else if (n & 1) {
          continue;
        } else {
          _results.push(n);
        }
      }
      return _results;
    })();
    eq("" + ns, '0,2,4,6,8');
    ns = (function() {
      var _i, _results;
      _results = [];
      for (n = _i = 1; _i <= 9; n = ++_i) {
        if (n % 2) {
          if (!(n % 5)) {
            continue;
          }
          _results.push(n);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    })();
    eq("" + ns, "1,,3,,,7,,9");
    ns = (function() {
      var _i, _results;
      _results = [];
      for (n = _i = 1; _i <= 9; n = ++_i) {
        switch (false) {
          case !(n % 2):
            if (!(n % 5)) {
              continue;
            }
            _results.push(n);
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    })();
    return eq("" + ns, "1,,3,,,7,,9");
  });

  test("#1850: inner `for` should not be expression-ized if `return`ing", function() {
    return eq('3,4,5', (function() {
      var a, b, c, _i, _j;
      for (a = _i = 1; _i <= 9; a = ++_i) {
        for (b = _j = 1; _j <= 9; b = ++_j) {
          c = Math.sqrt(a * a + b * b);
          if (!(c % 1)) {
            return String([a, b, c]);
          }
        }
      }
    })());
  });

  test("#1910: loop index should be mutable within a loop iteration and immutable between loop iterations", function() {
    var arr, iterations, k, n, v, v0, v1, _i, _j, _k, _l, _len, _len1, _ref, _results;
    n = 1;
    iterations = 0;
    arr = (function() {
      _results = [];
      for (var _i = 0; 0 <= n ? _i <= n : _i >= n; 0 <= n ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    for (k = _j = 0, _len = arr.length; _j < _len; k = ++_j) {
      v = arr[k];
      ++iterations;
      v = k = 5;
      eq(5, k);
    }
    eq(2, k);
    eq(2, iterations);
    iterations = 0;
    for (v = _k = 0; 0 <= n ? _k <= n : _k >= n; v = 0 <= n ? ++_k : --_k) {
      ++iterations;
    }
    eq(2, k);
    eq(2, iterations);
    arr = (function() {
      var _l, _results1;
      _results1 = [];
      for (v = _l = 0; _l <= 5; v = ++_l) {
        _results1.push([v, v + 1]);
      }
      return _results1;
    })();
    iterations = 0;
    for (k = _l = 0, _len1 = arr.length; _l < _len1; k = ++_l) {
      _ref = arr[k], v0 = _ref[0], v1 = _ref[1];
      if (!(v0)) {
        continue;
      }
      k += 3;
      ++iterations;
    }
    eq(6, k);
    return eq(5, iterations);
  });

  test("#2007: Return object literal from comprehension", function() {
    var x, y;
    y = (function() {
      var _i, _len, _ref, _results;
      _ref = [1, 2];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push({
          foo: "foo" + x
        });
      }
      return _results;
    })();
    eq(2, y.length);
    eq("foo1", y[0].foo);
    eq("foo2", y[1].foo);
    x = 2;
    y = (function() {
      var _results;
      _results = [];
      while (x) {
        _results.push({
          x: --x
        });
      }
      return _results;
    })();
    eq(2, y.length);
    eq(1, y[0].x);
    return eq(0, y[1].x);
  });

  test("#2274: Allow @values as loop variables", function() {
    var obj;
    obj = {
      item: null,
      method: function() {
        var _i, _len, _ref, _results;
        _ref = [1, 2, 3];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          this.item = _ref[_i];
          _results.push(null);
        }
        return _results;
      }
    };
    eq(obj.item, null);
    obj.method();
    return eq(obj.item, 3);
  });

  test("#2525, #1187, #1208, #1758, looping over an array forwards", function() {
    var i, ident, index, list;
    list = [0, 1, 2, 3, 4];
    ident = function(x) {
      return x;
    };
    arrayEq((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        i = list[_i];
        _results.push(i);
      }
      return _results;
    })(), list);
    arrayEq((function() {
      var _i, _len, _results;
      _results = [];
      for (index = _i = 0, _len = list.length; _i < _len; index = ++_i) {
        i = list[index];
        _results.push(index);
      }
      return _results;
    })(), list);
    arrayEq((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i += 1) {
        i = list[_i];
        _results.push(i);
      }
      return _results;
    })(), list);
    arrayEq((function() {
      var _i, _len, _ref, _results;
      _ref = ident(1);
      _results = [];
      for ((_ref > 0 ? (_i = 0, _len = list.length) : _i = list.length - 1); _ref > 0 ? _i < _len : _i >= 0; _i += _ref) {
        i = list[_i];
        _results.push(i);
      }
      return _results;
    })(), list);
    arrayEq((function() {
      var _i, _len, _ref, _results;
      _ref = ident(1) * 2;
      _results = [];
      for ((_ref > 0 ? (_i = 0, _len = list.length) : _i = list.length - 1); _ref > 0 ? _i < _len : _i >= 0; _i += _ref) {
        i = list[_i];
        _results.push(i);
      }
      return _results;
    })(), [0, 2, 4]);
    return arrayEq((function() {
      var _i, _len, _ref, _results;
      _ref = ident(1) * 2;
      _results = [];
      for ((_ref > 0 ? (index = _i = 0, _len = list.length) : index = _i = list.length - 1); _ref > 0 ? _i < _len : _i >= 0; index = _i += _ref) {
        i = list[index];
        _results.push(index);
      }
      return _results;
    })(), [0, 2, 4]);
  });

  test("#2525, #1187, #1208, #1758, looping over an array backwards", function() {
    var backwards, i, ident, index, list;
    list = [0, 1, 2, 3, 4];
    backwards = [4, 3, 2, 1, 0];
    ident = function(x) {
      return x;
    };
    arrayEq((function() {
      var _i, _results;
      _results = [];
      for (_i = list.length - 1; _i >= 0; _i += -1) {
        i = list[_i];
        _results.push(i);
      }
      return _results;
    })(), backwards);
    arrayEq((function() {
      var _i, _results;
      _results = [];
      for (index = _i = list.length - 1; _i >= 0; index = _i += -1) {
        i = list[index];
        _results.push(index);
      }
      return _results;
    })(), backwards);
    arrayEq((function() {
      var _i, _len, _ref, _results;
      _ref = ident(-1);
      _results = [];
      for ((_ref > 0 ? (_i = 0, _len = list.length) : _i = list.length - 1); _ref > 0 ? _i < _len : _i >= 0; _i += _ref) {
        i = list[_i];
        _results.push(i);
      }
      return _results;
    })(), backwards);
    arrayEq((function() {
      var _i, _len, _ref, _results;
      _ref = ident(-1) * 2;
      _results = [];
      for ((_ref > 0 ? (_i = 0, _len = list.length) : _i = list.length - 1); _ref > 0 ? _i < _len : _i >= 0; _i += _ref) {
        i = list[_i];
        _results.push(i);
      }
      return _results;
    })(), [4, 2, 0]);
    return arrayEq((function() {
      var _i, _len, _ref, _results;
      _ref = ident(-1) * 2;
      _results = [];
      for ((_ref > 0 ? (index = _i = 0, _len = list.length) : index = _i = list.length - 1); _ref > 0 ? _i < _len : _i >= 0; index = _i += _ref) {
        i = list[index];
        _results.push(index);
      }
      return _results;
    })(), [4, 2, 0]);
  });

}).call(this);
