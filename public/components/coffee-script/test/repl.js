(function() {
  var MockInputStream, MockOutputStream, Stream, ctrlV, fs, historyFile, testRepl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (global.testingBrowser) {
    return;
  }

  fs = require('fs');

  Stream = require('stream');

  MockInputStream = (function(_super) {
    __extends(MockInputStream, _super);

    function MockInputStream() {
      this.readable = true;
    }

    MockInputStream.prototype.resume = function() {};

    MockInputStream.prototype.emitLine = function(val) {
      return this.emit('data', new Buffer("" + val + "\n"));
    };

    return MockInputStream;

  })(Stream);

  MockOutputStream = (function(_super) {
    __extends(MockOutputStream, _super);

    function MockOutputStream() {
      this.writable = true;
      this.written = [];
    }

    MockOutputStream.prototype.write = function(data) {
      return this.written.push(data);
    };

    MockOutputStream.prototype.lastWrite = function(fromEnd) {
      if (fromEnd == null) {
        fromEnd = -1;
      }
      return this.written[this.written.length - 1 + fromEnd].replace(/\n$/, '');
    };

    return MockOutputStream;

  })(Stream);

  historyFile = '.coffee_history_test';

  fs.writeFileSync(historyFile, '1 + 2\n');

  testRepl = function(desc, fn) {
    var input, output, repl;
    input = new MockInputStream;
    output = new MockOutputStream;
    repl = Repl.start({
      input: input,
      output: output,
      historyFile: historyFile
    });
    return test(desc, function() {
      return fn(input, output, repl);
    });
  };

  ctrlV = {
    ctrl: true,
    name: 'v'
  };

  testRepl('reads history file', function(input, output, repl) {
    input.emitLine(repl.rli.history[0]);
    return eq('3', output.lastWrite());
  });

  testRepl("starts with coffee prompt", function(input, output) {
    return eq('coffee> ', output.lastWrite(0));
  });

  testRepl("writes eval to output", function(input, output) {
    input.emitLine('1+1');
    return eq('2', output.lastWrite());
  });

  testRepl("comments are ignored", function(input, output) {
    input.emitLine('1 + 1 #foo');
    return eq('2', output.lastWrite());
  });

  testRepl("output in inspect mode", function(input, output) {
    input.emitLine('"1 + 1\\n"');
    return eq("'1 + 1\\n'", output.lastWrite());
  });

  testRepl("variables are saved", function(input, output) {
    input.emitLine("foo = 'foo'");
    input.emitLine('foobar = "#{foo}bar"');
    return eq("'foobar'", output.lastWrite());
  });

  testRepl("empty command evaluates to undefined", function(input, output) {
    input.emitLine('');
    return eq('undefined', output.lastWrite());
  });

  testRepl("ctrl-v toggles multiline prompt", function(input, output) {
    input.emit('keypress', null, ctrlV);
    eq('------> ', output.lastWrite(0));
    input.emit('keypress', null, ctrlV);
    return eq('coffee> ', output.lastWrite(0));
  });

  testRepl("multiline continuation changes prompt", function(input, output) {
    input.emit('keypress', null, ctrlV);
    input.emitLine('');
    return eq('....... ', output.lastWrite(0));
  });

  testRepl("evaluates multiline", function(input, output) {
    output.cursorTo = function(pos) {};
    output.clearLine = function() {};
    input.emit('keypress', null, ctrlV);
    input.emitLine('do ->');
    input.emitLine('  1 + 1');
    input.emit('keypress', null, ctrlV);
    return eq('2', output.lastWrite());
  });

  testRepl("variables in scope are preserved", function(input, output) {
    input.emitLine('a = 1');
    input.emitLine('do -> a = 2');
    input.emitLine('a');
    return eq('2', output.lastWrite());
  });

  testRepl("existential assignment of previously declared variable", function(input, output) {
    input.emitLine('a = null');
    input.emitLine('a ?= 42');
    return eq('42', output.lastWrite());
  });

  testRepl("keeps running after runtime error", function(input, output) {
    input.emitLine('a = b');
    eq(0, output.lastWrite().indexOf('ReferenceError: b is not defined'));
    input.emitLine('a');
    return eq('undefined', output.lastWrite());
  });

  process.on('exit', function() {
    return fs.unlinkSync(historyFile);
  });

}).call(this);
