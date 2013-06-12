(function() {
  var value;

  test("Parser recognises binary numbers", function() {
    return eq(4, 0x4);
  });

  test("call methods directly on numbers", function() {
    eq(4, 4..valueOf());
    return eq('11', 4..toString(3));
  });

  eq(-1, 3 - 4);

  eq(Number.prototype.toString, 42.['toString']);

  eq(Number.prototype.toString, 42..toString);

  value = .25 + .75;

  ok(value === 1);

  value = 0.0 + -.25 - -.75 + 0.0;

  ok(value === 0.5);

  eq(Number.prototype.toString, 4.['toString']);

  eq(Number.prototype.toString, 4.2['toString']);

  eq(Number.prototype.toString, .42['toString']);

  eq(Number.prototype.toString, 4.['toString']);

  eq(Number.prototype.toString, 4..toString);

  eq(Number.prototype.toString, 4.2.toString);

  eq(Number.prototype.toString, .42.toString);

  eq(Number.prototype.toString, 4..toString);

  test('#1168: leading floating point suppresses newline', function() {
    return eq(1, (function() {
      1;
      return .5 + 0.5;
    })());
  });

  test("Python-style octal literal notation '0o777'", function() {
    eq(511, 0x1ff);
    eq(1, 0x1);
    eq(1, 0x1);
    eq(parseInt('0777', 8), 0x1ff);
    eq('777', 0x1ff.toString(8));
    eq(4, 0x4.valueOf());
    eq(Number.prototype.toString, 0x1ff['toString']);
    return eq(Number.prototype.toString, 0x1ff.toString);
  });

  test("#2060: Disallow uppercase radix prefixes and exponential notation", function() {
    var char, program, _i, _len, _ref, _results;
    _ref = ['b', 'o', 'x', 'e'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      char = _ref[_i];
      program = "0" + char + "0";
      doesNotThrow(function() {
        return CoffeeScript.compile(program, {
          bare: true
        });
      });
      _results.push(throws(function() {
        return CoffeeScript.compile(program.toUpperCase(), {
          bare: true
        });
      }));
    }
    return _results;
  });

  test("#2224: hex literals with 0b or B or E", function() {
    eq(176, 0x0b0);
    eq(177, 0x0B1);
    return eq(225, 0xE1);
  });

}).call(this);
