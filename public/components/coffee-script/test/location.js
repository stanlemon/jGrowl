(function() {
  var testScript;

  testScript = 'if true\n  x = 6\n  console.log "A console #{x + 7} log"\n\nfoo = "bar"\nz = /// ^ (a#{foo}) ///\n\nx = () ->\n    try\n        console.log "foo"\n    catch err\n        # Rewriter will generate explicit indentation here.\n\n    return null';

  test("Verify location of generated tokens", function() {
    var aToken, equalsToken, numberToken, tokens;
    tokens = CoffeeScript.tokens("a = 79");
    eq(tokens.length, 4);
    aToken = tokens[0];
    eq(aToken[2].first_line, 0);
    eq(aToken[2].first_column, 0);
    eq(aToken[2].last_line, 0);
    eq(aToken[2].last_column, 0);
    equalsToken = tokens[1];
    eq(equalsToken[2].first_line, 0);
    eq(equalsToken[2].first_column, 2);
    eq(equalsToken[2].last_line, 0);
    eq(equalsToken[2].last_column, 2);
    numberToken = tokens[2];
    eq(numberToken[2].first_line, 0);
    eq(numberToken[2].first_column, 4);
    eq(numberToken[2].last_line, 0);
    return eq(numberToken[2].last_column, 5);
  });

  test("Verify location of generated tokens (with indented first line)", function() {
    var IndentToken, aToken, equalsToken, numberToken, tokens;
    tokens = CoffeeScript.tokens("  a = 83");
    eq(tokens.length, 6);
    IndentToken = tokens[0], aToken = tokens[1], equalsToken = tokens[2], numberToken = tokens[3];
    eq(aToken[2].first_line, 0);
    eq(aToken[2].first_column, 2);
    eq(aToken[2].last_line, 0);
    eq(aToken[2].last_column, 2);
    eq(equalsToken[2].first_line, 0);
    eq(equalsToken[2].first_column, 4);
    eq(equalsToken[2].last_line, 0);
    eq(equalsToken[2].last_column, 4);
    eq(numberToken[2].first_line, 0);
    eq(numberToken[2].first_column, 6);
    eq(numberToken[2].last_line, 0);
    return eq(numberToken[2].last_column, 7);
  });

  test("Verify all tokens get a location", function() {
    return doesNotThrow(function() {
      var token, tokens, _i, _len, _results;
      tokens = CoffeeScript.tokens(testScript);
      _results = [];
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        _results.push(ok(!!token[2]));
      }
      return _results;
    });
  });

}).call(this);
