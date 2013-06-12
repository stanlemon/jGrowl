(function() {
  var a;

  test("backslash escapes", function() {
    return eq("\\/\\\\", /\/\\/.source);
  });

  eq('(((dollars)))', '\(\(\(dollars\)\)\)');

  eq('one two three', "one two three");

  eq("four five", 'four\
\
 five');

  eq("''Hello, World\\''", '\'\'Hello, World\\\'\'');

  eq('""Hello, World\\""', "\"\"Hello, World\\\"\"");

  eq('Hello, World\n', 'Hello, World\n');

  a = "basic heredoc\non two lines";

  ok(a === "basic heredoc\non two lines");

  a = 'a\n  "b\nc';

  ok(a === "a\n  \"b\nc");

  a = "a\n b\n  c";

  ok(a === "a\n b\n  c");

  a = 'one-liner';

  ok(a === 'one-liner');

  a = "out\nhere";

  ok(a === "out\nhere");

  a = '    a\n  b\nc';

  ok(a === "    a\n  b\nc");

  a = 'a\n\n\nb c';

  ok(a === "a\n\n\nb c");

  a = 'more"than"one"quote';

  ok(a === 'more"than"one"quote');

  a = 'here\'s an apostrophe';

  ok(a === "here's an apostrophe");

  a = "one\ntwo\n";

  ok(a === "one\ntwo\n");

  eq(' line 0\nshould not be relevant\n  to the indent level', '\
 line 0\n\
should not be relevant\n\
  to the indent level\
');

  eq(' \'\\\' ', " '\\' ");

  eq(" \"\\\" ", ' "\\" ');

  eq('  <- keep these spaces ->  ', '  <- keep these spaces ->  ');

  test("#1046, empty string interpolations", function() {
    return eq("", '');
  });

}).call(this);
