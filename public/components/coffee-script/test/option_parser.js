(function() {
  var OptionParser, opt;

  if (typeof require === "undefined" || require === null) {
    return;
  }

  OptionParser = require('./../lib/coffee-script/optparse').OptionParser;

  opt = new OptionParser([['-r', '--required [DIR]', 'desc required'], ['-o', '--optional', 'desc optional'], ['-l', '--list [FILES*]', 'desc list']]);

  test("basic arguments", function() {
    var args, result;
    args = ['one', 'two', 'three', '-r', 'dir'];
    result = opt.parse(args);
    arrayEq(args, result["arguments"]);
    return eq(void 0, result.required);
  });

  test("boolean and parameterised options", function() {
    var result;
    result = opt.parse(['--optional', '-r', 'folder', 'one', 'two']);
    ok(result.optional);
    eq('folder', result.required);
    return arrayEq(['one', 'two'], result["arguments"]);
  });

  test("list options", function() {
    var result;
    result = opt.parse(['-l', 'one.txt', '-l', 'two.txt', 'three']);
    arrayEq(['one.txt', 'two.txt'], result.list);
    return arrayEq(['three'], result["arguments"]);
  });

  test("-- and interesting combinations", function() {
    var args, result;
    result = opt.parse(['-o', '-r', 'a', '-r', 'b', '-o', '--', '-a', 'b', '--c', 'd']);
    arrayEq(['-a', 'b', '--c', 'd'], result["arguments"]);
    ok(result.optional);
    eq('b', result.required);
    args = ['--', '-o', 'a', '-r', 'c', '-o', '--', '-a', 'arg0', '-b', 'arg1'];
    result = opt.parse(args);
    eq(void 0, result.optional);
    eq(void 0, result.required);
    return arrayEq(args.slice(1), result["arguments"]);
  });

}).call(this);
