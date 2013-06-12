(function() {
  if (!((typeof window !== "undefined" && window !== null) || (typeof testingBrowser !== "undefined" && testingBrowser !== null))) {
    test("coffeescript modules can be imported and executed", function() {
      var local, magicKey, magicValue;
      magicKey = __filename;
      magicValue = 0xFFFF;
      if (global[magicKey] != null) {
        if (typeof exports !== "undefined" && exports !== null) {
          local = magicValue;
          return exports.method = function() {
            return local;
          };
        }
      } else {
        global[magicKey] = {};
        if ((typeof require !== "undefined" && require !== null ? require.extensions : void 0) != null) {
          ok(require(__filename).method() === magicValue);
        }
        return delete global[magicKey];
      }
    });
    test("javascript modules can be imported", function() {
      var magicVal, module, _base, _i, _len, _ref, _results;
      magicVal = 1;
      _ref = 'test.js test2 .test2 test.extension.js test.unknownextension .coffee .coffee.md'.split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        module = _ref[_i];
        _results.push(ok((typeof (_base = require("./importing/" + module)).value === "function" ? _base.value() : void 0) === magicVal, module));
      }
      return _results;
    });
    test("coffeescript modules can be imported", function() {
      var magicVal, module, _base, _i, _len, _ref, _results;
      magicVal = 2;
      _ref = '.test.coffee test.coffee test.extension.coffee'.split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        module = _ref[_i];
        _results.push(ok((typeof (_base = require("./importing/" + module)).value === "function" ? _base.value() : void 0) === magicVal, module));
      }
      return _results;
    });
    test("literate coffeescript modules can be imported", function() {
      var magicVal, module, _base, _i, _len, _ref, _results;
      magicVal = 3;
      _ref = ' .test.coffee.md test.coffee.md test.litcoffee test.extension.coffee.md'.split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        module = _ref[_i];
        _results.push(ok((typeof (_base = require("./importing/" + module)).value === "function" ? _base.value() : void 0) === magicVal, module));
      }
      return _results;
    });
  }

}).call(this);
