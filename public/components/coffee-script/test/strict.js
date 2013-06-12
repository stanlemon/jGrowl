(function() {
  var strict, strictOk;

  strict = function(code, msg) {
    return throws((function() {
      return CoffeeScript.compile(code);
    }), null, msg != null ? msg : code);
  };

  strictOk = function(code, msg) {
    return doesNotThrow((function() {
      return CoffeeScript.compile(code);
    }), msg != null ? msg : code);
  };

  test("octal integer literals prohibited", function() {
    strict('01');
    strict('07777');
    strict('09');
    strict('079');
    return strictOk('`01`');
  });

  test("octal escape sequences prohibited", function() {
    strict('"\\1"');
    strict('"\\7"');
    strict('"\\001"');
    strict('"\\777"');
    strict('"_\\1"');
    strict('"\\1_"');
    strict('"_\\1_"');
    strict('"\\\\\\1"');
    strictOk('"\\0"');
    eq("\x00", "\0");
    strictOk('"\\08"');
    eq("\x008", "\08");
    strictOk('"\\0\\8"');
    eq("\x008", "\0\8");
    strictOk('"\\8"');
    eq("8", "\8");
    strictOk('"\\\\1"');
    eq("\\" + "1", "\\1");
    strictOk('"\\\\\\\\1"');
    eq("\\\\" + "1", "\\\\1");
    strictOk("`'\\1'`");
    return eq("\\" + "1", "\\1");
  });

  test("duplicate formal parameters are prohibited", function() {
    var nonce;
    nonce = {};
    strict('(_,_)->', 'param, param');
    strict('(_,@_)->', 'param, @param');
    strict('(_,_...)->', 'param, param...');
    strict('(@_,_...)->', '@param, param...');
    strict('(_,_ = true)->', 'param, param=');
    strict('(@_,@_)->', 'two @params');
    strict('(_,@_ = true)->', 'param, @param=');
    strict('(_,{_})->', 'param, {param}');
    strict('(@_,{_})->', '@param, {param}');
    strict('({_,_})->', '{param, param}');
    strict('({_,@_})->', '{param, @param}');
    strict('(_,[_])->', 'param, [param]');
    strict('([_,_])->', '[param, param]');
    strict('([_,@_])->', '[param, @param]');
    strict('(_,[_]=true)->', 'param, [param]=');
    strict('(_,[@_,{_}])->', 'param, [@param, {param}]');
    strict('(_,[_,{@_}])->', 'param, [param, {@param}]');
    strict('(_,[_,{_}])->', 'param, [param, {param}]');
    strict('(_,[_,{__}])->', 'param, [param, {param2}]');
    strict('(_,[__,{_}])->', 'param, [param2, {param}]');
    strict('(__,[_,{_}])->', 'param, [param2, {param2}]');
    strict('(0:a,1:a)->', '0:param,1:param');
    strict('({0:a,1:a})->', '{0:param,1:param}');
    strictOk('({},_arg)->');
    strictOk('({},{})->');
    strictOk('([]...,_arg)->');
    strictOk('({}...,_arg)->');
    strictOk('({}...,[],_arg)->');
    strictOk('([]...,{},_arg)->');
    strictOk('(@case,_case)->');
    strictOk('(@case,_case...)->');
    strictOk('(@case...,_case)->');
    strictOk('(_case,@case)->');
    strictOk('(_case,@case...)->');
    strictOk('(a:a)->');
    return strictOk('(a:a,a:b)->');
  });

  test("`delete` operand restrictions", function() {
    strict('a = 1; delete a');
    strictOk('delete a');
    strict('(a) -> delete a');
    strict('(@a) -> delete a');
    strict('(a...) -> delete a');
    strict('(a = 1) -> delete a');
    strict('([a]) -> delete a');
    return strict('({a}) -> delete a');
  });

  test("`Future Reserved Word`s, `eval` and `arguments` restrictions", function() {
    var access, assign, destruct, fnDecl, future, invoke, keyword, param, prop, tryCatch, _i, _j, _len, _len1, _ref, _results;
    access = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      check("" + keyword + ".a = 1");
      return check("" + keyword + "[0] = 1");
    };
    assign = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      check("" + keyword + " = 1");
      check("" + keyword + " += 1");
      check("" + keyword + " -= 1");
      check("" + keyword + " *= 1");
      check("" + keyword + " /= 1");
      check("" + keyword + " ?= 1");
      check("{keyword}++");
      check("++{keyword}");
      check("{keyword}--");
      return check("--{keyword}");
    };
    destruct = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      check("{" + keyword + "}");
      return check("o = {" + keyword + "}");
    };
    invoke = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      check("" + keyword + " yes");
      return check("do " + keyword);
    };
    fnDecl = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      return check("class " + keyword);
    };
    param = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      check("(" + keyword + ") ->");
      return check("({" + keyword + "}) ->");
    };
    prop = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      return check("a." + keyword + " = 1");
    };
    tryCatch = function(keyword, check) {
      if (check == null) {
        check = strict;
      }
      return check("try new Error catch " + keyword);
    };
    future = 'implements interface let package private protected public static yield'.split(' ');
    for (_i = 0, _len = future.length; _i < _len; _i++) {
      keyword = future[_i];
      access(keyword);
      assign(keyword);
      destruct(keyword);
      invoke(keyword);
      fnDecl(keyword);
      param(keyword);
      prop(keyword, strictOk);
      tryCatch(keyword);
    }
    _ref = ['eval', 'arguments'];
    _results = [];
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      keyword = _ref[_j];
      access(keyword, strictOk);
      assign(keyword);
      destruct(keyword, strictOk);
      invoke(keyword, strictOk);
      fnDecl(keyword);
      param(keyword);
      prop(keyword, strictOk);
      _results.push(tryCatch(keyword));
    }
    return _results;
  });

}).call(this);
