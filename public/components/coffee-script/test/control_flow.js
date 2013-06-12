(function() {
  var id,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  id = function(_) {
    if (arguments.length === 1) {
      return _;
    } else {
      return Array.prototype.slice.call(arguments);
    }
  };

  test("basic conditionals", function() {
    if (false) {
      ok(false);
    } else if (false) {
      ok(false);
    } else {
      ok(true);
    }
    if (true) {
      ok(true);
    } else if (true) {
      ok(false);
    } else {
      ok(true);
    }
    if (!true) {
      ok(false);
    } else if (!true) {
      ok(false);
    } else {
      ok(true);
    }
    if (!false) {
      return ok(true);
    } else if (!false) {
      return ok(false);
    } else {
      return ok(true);
    }
  });

  test("single-line conditional", function() {
    if (false) {
      ok(false);
    } else {
      ok(true);
    }
    if (!false) {
      return ok(true);
    } else {
      return ok(false);
    }
  });

  test("nested conditionals", function() {
    var nonce;
    nonce = {};
    return eq(nonce, (true ? !false ? false ? false : true ? nonce : void 0 : void 0 : void 0));
  });

  test("nested single-line conditionals", function() {
    var a, b, c, d, nonce;
    nonce = {};
    a = false ? void 0 : b = 0 ? void 0 : nonce;
    eq(nonce, a);
    eq(nonce, b);
    c = false ? void 0 : (0 ? void 0 : nonce);
    eq(nonce, c);
    d = true ? id(false ? void 0 : nonce) : void 0;
    return eq(nonce, d);
  });

  test("empty conditional bodies", function() {
    return eq(void 0, (false ? void 0 : false ? void 0 : void 0));
  });

  test("conditional bodies containing only comments", function() {
    eq(void 0, ((function() {
      if (true) {
        /*
        block comment
        */

      } else {

      }
    })()));
    return eq(void 0, ((function() {
      if (false) {

      } else if (true) {
        /*
        block comment
        */

      } else {

      }
    })()));
  });

  test("return value of if-else is from the proper body", function() {
    var nonce;
    nonce = {};
    return eq(nonce, false ? void 0 : nonce);
  });

  test("return value of unless-else is from the proper body", function() {
    var nonce;
    nonce = {};
    return eq(nonce, !true ? void 0 : nonce);
  });

  test("assign inside the condition of a conditional statement", function() {
    var a, b, nonce;
    nonce = {};
    if (a = nonce) {
      1;
    }
    eq(nonce, a);
    if (b = nonce) {
      1;
    }
    return eq(nonce, b);
  });

  test("single-line function definition with single-line conditional", function() {
    var fn;
    fn = function() {
      if (1 < 0.5) {
        return 1;
      } else {
        return -1;
      }
    };
    return ok(fn() === -1);
  });

  test("function resturns conditional value with no `else`", function() {
    var fn;
    fn = function() {
      if (false) {
        return true;
      }
    };
    return eq(void 0, fn());
  });

  test("function returns a conditional value", function() {
    var a, b, fnA, fnB;
    a = {};
    fnA = function() {
      if (false) {
        return void 0;
      } else {
        return a;
      }
    };
    eq(a, fnA());
    b = {};
    fnB = function() {
      if (!false) {
        return b;
      } else {
        return void 0;
      }
    };
    return eq(b, fnB());
  });

  test("passing a conditional value to a function", function() {
    var nonce;
    nonce = {};
    return eq(nonce, id(false ? void 0 : nonce));
  });

  test("unmatched `then` should catch implicit calls", function() {
    var a, trueFn;
    a = 0;
    trueFn = function() {
      return true;
    };
    if (trueFn(void 0)) {
      a++;
    }
    return eq(1, a);
  });

  test("if-to-ternary with instanceof requires parentheses", function() {
    var nonce;
    nonce = {};
    return eq(nonce, ({} instanceof Object ? nonce : void 0));
  });

  test("if-to-ternary as part of a larger operation requires parentheses", function() {
    return ok(2, 1 + (false ? 0 : 1));
  });

  test("if-else indented within an assignment", function() {
    var nonce, result;
    nonce = {};
    result = false ? void 0 : nonce;
    return eq(nonce, result);
  });

  test("suppressed indentation via assignment", function() {
    var nonce, result;
    nonce = {};
    result = false ? void 0 : false ? void 0 : 0 ? void 0 : 1 < 0 ? void 0 : id(false ? void 0 : nonce);
    return eq(nonce, result);
  });

  test("tight formatting with leading `then`", function() {
    var nonce;
    nonce = {};
    return eq(nonce, true ? nonce : void 0);
  });

  test("#738", function() {
    var fn, nonce;
    nonce = {};
    fn = true ? function() {
      return nonce;
    } : void 0;
    return eq(nonce, fn());
  });

  test("#748: trailing reserved identifiers", function() {
    var nonce, obj, result;
    nonce = {};
    obj = {
      "delete": true
    };
    result = obj["delete"] ? nonce : void 0;
    return eq(nonce, result);
  });

  test("basic `while` loops", function() {
    var assert, func, i, list, results;
    i = 5;
    list = (function() {
      var _results;
      _results = [];
      while (i -= 1) {
        _results.push(i * 2);
      }
      return _results;
    })();
    ok(list.join(' ') === "8 6 4 2");
    i = 5;
    list = ((function() {
      var _results;
      _results = [];
      while (i -= 1) {
        _results.push(i * 3);
      }
      return _results;
    })());
    ok(list.join(' ') === "12 9 6 3");
    i = 5;
    func = function(num) {
      return i -= num;
    };
    assert = function() {
      return ok((i < 5 && 5 > 0));
    };
    results = (function() {
      var _results;
      _results = [];
      while (func(1)) {
        assert();
        _results.push(i);
      }
      return _results;
    })();
    ok(results.join(' ') === '4 3 2 1');
    i = 10;
    results = (function() {
      var _results;
      _results = [];
      while (i -= 1) {
        if (i % 2 === 0) {
          _results.push(i * 2);
        }
      }
      return _results;
    })();
    return ok(results.join(' ') === '16 12 8 4');
  });

  test("Issue 759: `if` within `while` condition", function() {
    var _results;
    _results = [];
    while (1 ? 0 : void 0) {
      _results.push(2);
    }
    return _results;
  });

  test("assignment inside the condition of a `while` loop", function() {
    var a, b, count, nonce;
    nonce = {};
    count = 1;
    while (count--) {
      a = nonce;
    }
    eq(nonce, a);
    count = 1;
    while (count--) {
      b = nonce;
    }
    return eq(nonce, b);
  });

  test("While over break.", function() {
    var i, result;
    i = 0;
    result = (function() {
      var _results;
      _results = [];
      while (i < 10) {
        i++;
        break;
      }
      return _results;
    })();
    return arrayEq(result, []);
  });

  test("While over continue.", function() {
    var i, result;
    i = 0;
    result = (function() {
      var _results;
      _results = [];
      while (i < 10) {
        i++;
        continue;
      }
      return _results;
    })();
    return arrayEq(result, []);
  });

  test("Basic `until`", function() {
    var i, results, value;
    value = false;
    i = 0;
    results = (function() {
      var _results;
      _results = [];
      while (!value) {
        if (i === 5) {
          value = true;
        }
        _results.push(i++);
      }
      return _results;
    })();
    return ok(i === 6);
  });

  test("Basic `loop`", function() {
    var i, list;
    i = 5;
    list = [];
    while (true) {
      i -= 1;
      if (i === 0) {
        break;
      }
      list.push(i * 2);
    }
    return ok(list.join(' ') === '8 6 4 2');
  });

  test("break at the top level", function() {
    var i, result, _i, _len, _ref;
    _ref = [1, 2, 3];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      result = i;
      if (i === 2) {
        break;
      }
    }
    return eq(2, result);
  });

  test("break *not* at the top level", function() {
    var someFunc;
    someFunc = function() {
      var i, result;
      i = 0;
      while (++i < 3) {
        result = i;
        if (i > 1) {
          break;
        }
      }
      return result;
    };
    return eq(2, someFunc());
  });

  test("basic `switch`", function() {
    var func, num, result;
    num = 10;
    result = (function() {
      switch (num) {
        case 5:
          return false;
        case 'a':
          true;
          true;
          return false;
        case 10:
          return true;
        case 11:
          return false;
        default:
          return false;
      }
    })();
    ok(result);
    func = function(num) {
      switch (num) {
        case 2:
        case 4:
        case 6:
          return true;
        case 1:
        case 3:
        case 5:
          return false;
      }
    };
    ok(func(2));
    ok(func(6));
    ok(!func(3));
    return eq(func(8), void 0);
  });

  test("Ensure that trailing switch elses don't get rewritten.", function() {
    var result;
    result = false;
    switch ("word") {
      case "one thing":
        doSomething();
        break;
      default:
        if (!false) {
          result = true;
        }
    }
    ok(result);
    result = false;
    switch ("word") {
      case "one thing":
        doSomething();
        break;
      case "other thing":
        doSomething();
        break;
      default:
        if (!false) {
          result = true;
        }
    }
    return ok(result);
  });

  test("Should be able to handle switches sans-condition.", function() {
    var result;
    result = (function() {
      switch (false) {
        case !null:
          return 0;
        case !!1:
          return 1;
        case '' in {
            '': ''
          }:
          return 2;
        case [] instanceof Array:
          return 3;
        case true !== false:
          return 4;
        case !(('x' < 'y' && 'y' > 'z')):
          return 5;
        case 'a' !== 'b' && 'a' !== 'c':
          return 6;
        case __indexOf.call(['e', 'f'], 'd') < 0:
          return 7;
        default:
          return ok;
      }
    })();
    return eq(result, ok);
  });

  test("Should be able to use `@properties` within the switch clause.", function() {
    var obj;
    obj = {
      num: 101,
      func: function() {
        switch (this.num) {
          case 101:
            return '101!';
          default:
            return 'other';
        }
      }
    };
    return ok(obj.func() === '101!');
  });

  test("Should be able to use `@properties` within the switch cases.", function() {
    var obj;
    obj = {
      num: 101,
      func: function(yesOrNo) {
        var result;
        result = (function() {
          switch (yesOrNo) {
            case true:
              return this.num;
            default:
              return 'other';
          }
        }).call(this);
        return result;
      }
    };
    return ok(obj.func(true) === 101);
  });

  test("Switch with break as the return value of a loop.", function() {
    var i, results;
    i = 10;
    results = (function() {
      var _results;
      _results = [];
      while (i > 0) {
        i--;
        switch (i % 2) {
          case 1:
            _results.push(i);
            break;
          case 0:
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    })();
    return eq(results.join(', '), '9, 7, 5, 3, 1');
  });

  test("Issue #997. Switch doesn't fallthrough.", function() {
    var val;
    val = 1;
    switch (true) {
      case true:
        if (false) {
          return 5;
        }
        break;
      default:
        val = 2;
    }
    return eq(val, 1);
  });

  test("Throw should be usable as an expression.", function() {
    var e;
    try {
      false || (function() {
        throw 'up';
      })();
      throw new Error('failed');
    } catch (_error) {
      e = _error;
      return ok(e === 'up');
    }
  });

  test("#2555, strange function if bodies", function() {
    var failure, success;
    success = function() {
      return ok(true);
    };
    failure = function() {
      return ok(false);
    };
    if ((function() {
      return true;
    })()) {
      success();
    }
    if ((function() {
      try {
        return false;
      } catch (_error) {}
    })()) {
      return failure();
    }
  });

  test("#1057: `catch` or `finally` in single-line functions", function() {
    ok((function() {
      try {
        throw 'up';
      } catch (_error) {
        return true;
      }
    })());
    return ok((function() {
      try {
        return true;
      } finally {
        'nothing';
      }
    })());
  });

}).call(this);
