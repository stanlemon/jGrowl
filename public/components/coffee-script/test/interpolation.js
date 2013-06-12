(function() {
  var a, b, c, foo, g, hello, i, list, n, obj, r, result, s, stash, t, val, world, _ref;

  eq('multiline nested "interpolations" work', "multiline " + ("nested " + (ok(true), "\"interpolations\"")) + " work");

  eq("" + "{", "{");

  eq("" + '#{}}' + " }", '#{}} }');

  eq("" + ("'" + {
    a: "b" + 1
  }['a'] + "'"), "'b1'");

  eq("" + '"/', '"/');

  eq("" + "/'", "/'");

  eq("" + /'"/, '/\'"/');

  eq("" + ("'/" + '/"' + /"'/), '\'//"/"\'/');

  eq("" + "'/" + '/"' + /"'/, '\'//"/"\'/');

  eq("" + (6 / 2), '3');

  eq("" + (6 / 2) + (6 / 2), '33');

  eq("" + (6 + /2}#{6/ + 2), '6/2}#{6/2');

  eq("" + (6 / 2) + "    " + (6 / 2), '3    3');

  eq("" + /"'\/'"\/"/, '/"\'\\/\'"\\/"/');

  eq("" + /\\'/, "/\\\\'/");

  hello = 'Hello';

  world = 'World';

  ok('#{hello} #{world}!' === '#{hello} #{world}!');

  ok(("" + hello + " " + world + "!") === 'Hello World!');

  ok(("[" + hello + world + "]") === '[HelloWorld]');

  ok(("" + hello + "#" + world) === 'Hello#World');

  ok(("Hello " + (1 + 2) + " World") === 'Hello 3 World');

  ok(("" + hello + " " + (1 + 2) + " " + world) === "Hello 3 World");

  _ref = ['s', 't', 'r', 'i', 'n', 'g'], s = _ref[0], t = _ref[1], r = _ref[2], i = _ref[3], n = _ref[4], g = _ref[5];

  ok(("" + s + t + r + i + n + g) === 'string');

  ok("\#{s}\#{t}\#{r}\#{i}\#{n}\#{g}" === '#{s}#{t}#{r}#{i}#{n}#{g}');

  ok("\#{string}" === '#{string}');

  ok("\#{Escaping} first" === '#{Escaping} first');

  ok("Escaping \#{in} middle" === 'Escaping #{in} middle');

  ok("Escaping \#{last}" === 'Escaping #{last}');

  ok("##" === '##');

  ok("" === '');

  ok(("A" + " " + " " + "B") === 'A  B');

  ok("\\\#{}" === '\\#{}');

  ok(("I won #" + 20 + " last night.") === 'I won #20 last night.');

  ok(("I won #" + '#20' + " last night.") === 'I won ##20 last night.');

  ok(("" + (hello + world)) === 'HelloWorld');

  ok(("" + (hello + ' ' + world + '!')) === 'Hello World!');

  list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  ok(("values: " + (list.join(', ')) + ", length: " + list.length + ".") === 'values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, length: 10.');

  ok(("values: " + (list.join(' '))) === 'values: 0 1 2 3 4 5 6 7 8 9');

  obj = {
    name: 'Joe',
    hi: function() {
      return "Hello " + this.name + ".";
    },
    cya: function() {
      return ("Hello " + this.name + ".").replace('Hello', 'Goodbye');
    }
  };

  ok(obj.hi() === "Hello Joe.");

  ok(obj.cya() === "Goodbye Joe.");

  ok(("With " + "quotes") === 'With quotes');

  ok('With #{"quotes"}' === 'With #{"quotes"}');

  ok(("Where is " + (obj["name"] + '?')) === 'Where is Joe?');

  ok(("Where is " + ("the nested " + obj["name"]) + "?") === 'Where is the nested Joe?');

  ok(("Hello " + (world != null ? world : "" + hello)) === 'Hello World');

  ok(("Hello " + ("" + (("" + obj["name"]) + '!'))) === 'Hello Joe!');

  a = "Hello " + "Joe";

  ok(a === "Hello Joe");

  a = 1;

  b = 2;

  c = 3;

  ok(("" + a + b + c) === '123');

  result = null;

  stash = function(str) {
    return result = str;
  };

  stash("a " + ('aa'.replace(/a/g, 'b')) + " c");

  ok(result === 'a bb c');

  foo = "hello";

  ok(("" + (foo.replace("\"", ""))) === 'hello');

  val = 10;

  a = "basic heredoc " + val + "\non two lines";

  b = 'basic heredoc #{val}\non two lines';

  ok(a === "basic heredoc 10\non two lines");

  ok(b === "basic heredoc \#{val}\non two lines");

  eq('multiline nested "interpolations" work', "multiline " + ("nested " + ((function() {
    ok(true);
    return "\"interpolations\"";
  })())) + " work");

  test("heregex interpolation", function() {
    return eq(/\\#{}\\\"/ + '', RegExp("" + ("" + '\\') + "\\#{}\\\\\\\"") + '');
  });

}).call(this);
