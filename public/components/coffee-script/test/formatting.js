(function() {
  doesNotThrow(function() {
    return CoffeeScript.compile("a = then b");
  });

  test("multiple semicolon-separated statements in parentheticals", function() {
    var nonce;
    nonce = {};
    eq(nonce, (1, 2, nonce));
    return eq(nonce, (function() {
      return (1, 2, nonce);
    })());
  });

  test("chained accesses split on period/newline, backwards and forwards", function() {
    var result, str;
    str = 'abc';
    result = str.split('').reverse().reverse().reverse();
    arrayEq(['c', 'b', 'a'], result);
    arrayEq(['c', 'b', 'a'], str.split('').reverse().reverse().reverse());
    result = str.split('').reverse().reverse().reverse();
    arrayEq(['c', 'b', 'a'], result);
    arrayEq(['c', 'b', 'a'], str.split('').reverse().reverse().reverse());
    return arrayEq(['c', 'b', 'a'], str.split('').reverse().reverse().reverse());
  });

  test("newline suppression for operators", function() {
    var six;
    six = 1 + 2 + 3;
    return eq(6, six);
  });

  test("`?.` and `::` should continue lines", function() {
    var _ref;
    return ok(!((_ref = Date.prototype) != null ? _ref.foo : void 0));
  });

  doesNotThrow(function() {
    return CoffeeScript.compile("oh. yes\noh?. true\noh:: return");
  });

  doesNotThrow(function() {
    return CoffeeScript.compile("a?[b..]\na?[...b]\na?[b..c]");
  });

  test("indented array literals don't trigger whitespace rewriting", function() {
    var getArgs, result;
    getArgs = function() {
      return arguments;
    };
    result = getArgs([[[[[], []], [[]]]], []]);
    return eq(1, result.length);
  });

  doesNotThrow(function() {
    return CoffeeScript.compile("obj = then fn 1,\n  1: 1\n  a:\n    b: ->\n      fn c,\n        d: e\n  f: 1");
  });

  test("indented heredoc", function() {
    var result;
    result = (function(_) {
      return _;
    })("abc");
    return eq("abc", result);
  });

  test("#1492: Nested blocks don't cause double semicolons", function() {
    var js;
    js = CoffeeScript.compile('(0;0)');
    return eq(-1, js.indexOf(';;'));
  });

  test("#1195 Ignore trailing semicolons (before newlines or as the last char in a program)", function() {
    var lastChar, n, preNewline, _i, _len, _ref;
    preNewline = function(numSemicolons) {
      return "nonce = {}; nonce2 = {}\nf = -> nonce" + (Array(numSemicolons + 1).join(';')) + "\nnonce2\nunless f() is nonce then throw new Error('; before linebreak should = newline')";
    };
    _ref = [1, 2, 3];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      n = _ref[_i];
      CoffeeScript.run(preNewline(n), {
        bare: true
      });
    }
    lastChar = '-> lastChar;';
    return doesNotThrow(function() {
      return CoffeeScript.compile(lastChar, {
        bare: true
      });
    });
  });

  test("#1299: Disallow token misnesting", function() {
    var e;
    try {
      CoffeeScript.compile('[{\n   ]}');
      return ok(false);
    } catch (_error) {
      e = _error;
      return eq('unmatched ]', e.message);
    }
  });

}).call(this);
