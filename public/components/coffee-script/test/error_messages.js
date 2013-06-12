(function() {
  var assertErrorFormat, prettyErrorMessage;

  prettyErrorMessage = CoffeeScript.helpers.prettyErrorMessage;

  assertErrorFormat = function(code, expectedErrorFormat) {
    return throws((function() {
      return CoffeeScript.compile(code);
    }), function(err) {
      var message;
      message = prettyErrorMessage(err, 'test.coffee', code);
      eq(expectedErrorFormat, message);
      return true;
    });
  };

  test("lexer errors formating", function() {
    return assertErrorFormat('normalObject    = {}\ninsideOutObject = }{', 'test.coffee:2:19: error: unmatched }\ninsideOutObject = }{\n                  ^');
  });

  test("parser error formating", function() {
    return assertErrorFormat('foo in bar or in baz', 'test.coffee:1:15: error: unexpected RELATION\nfoo in bar or in baz\n              ^^');
  });

  test("compiler error formatting", function() {
    return assertErrorFormat('evil = (foo, eval, bar) ->', 'test.coffee:1:14: error: parameter name "eval" is not allowed\nevil = (foo, eval, bar) ->\n             ^^^^');
  });

}).call(this);
