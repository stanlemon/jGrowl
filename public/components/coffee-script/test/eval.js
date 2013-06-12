(function() {
  var vm;

  if (vm = typeof require === "function" ? require('vm') : void 0) {
    test("CoffeeScript.eval runs in the global context by default", function() {
      var code, result;
      global.punctuation = '!';
      code = 'global.fhqwhgads = "global superpower#{global.punctuation}"';
      result = CoffeeScript["eval"](code);
      eq(result, 'global superpower!');
      return eq(fhqwhgads, 'global superpower!');
    });
    test("CoffeeScript.eval can run in, and modify, a Script context sandbox", function() {
      var code, result, sandbox;
      sandbox = vm.Script.createContext();
      sandbox.foo = 'bar';
      code = 'global.foo = \'not bar!\'';
      result = CoffeeScript["eval"](code, {
        sandbox: sandbox
      });
      eq(result, 'not bar!');
      return eq(sandbox.foo, 'not bar!');
    });
    test("CoffeeScript.eval can run in, but cannot modify, an ordinary object sandbox", function() {
      var code, result, sandbox;
      sandbox = {
        foo: 'bar'
      };
      code = 'global.foo = \'not bar!\'';
      result = CoffeeScript["eval"](code, {
        sandbox: sandbox
      });
      eq(result, 'not bar!');
      return eq(sandbox.foo, 'bar');
    });
  }

}).call(this);
