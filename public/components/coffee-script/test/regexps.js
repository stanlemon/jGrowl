(function() {
  test("basic regular expression literals", function() {
    ok('a'.match(/a/));
    ok('a'.match(/a/));
    ok('a'.match(/a/g));
    return ok('a'.match(/a/g));
  });

  test("division is not confused for a regular expression", function() {
    var a, b, g, i, obj, two;
    eq(2, 4 / 2 / 1);
    a = 4;
    b = 2;
    g = 1;
    eq(2, a / b / g);
    a = 10;
    b = a /= 4 / 2;
    eq(a, 5);
    obj = {
      method: function() {
        return 2;
      }
    };
    two = 2;
    eq(2, obj.method() / two + obj.method() / two);
    i = 1;
    eq(2, 4. / 2 / i);
    return eq(1, i / i / i);
  });

  test("#764: regular expressions should be indexable", function() {
    return eq(/0/['source'], RegExp("" + 0)['source']);
  });

  test("#584: slashes are allowed unescaped in character classes", function() {
    return ok(/^a\/[/]b$/.test('a//b'));
  });

  test("#1724: regular expressions beginning with `*`", function() {
    return throws(function() {
      return CoffeeScript.compile('/*/');
    });
  });

  test("a heregex will ignore whitespace and comments", function() {
    return eq(/^I'm\x20+[a]\s+Heregex?\/\/\//gim + '', /^I'm\x20+[a]\s+Heregex?\/\/\//gim + '');
  });

  test("an empty heregex will compile to an empty, non-capturing group", function() {
    return eq(/(?:)/ + '', /(?:)/ + '');
  });

  test("#1724: regular expressions beginning with `*`", function() {
    return throws(function() {
      return CoffeeScript.compile('/// * ///');
    });
  });

  test("empty regular expressions with flags", function() {
    var a, fn;
    fn = function(x) {
      return x;
    };
    a = "" + /(?:)/i;
    fn("");
    return eq('/(?:)/i', a);
  });

}).call(this);
