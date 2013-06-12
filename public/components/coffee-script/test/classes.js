(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  test("classes with a four-level inheritance chain", function() {
    var Base, FirstChild, SecondChild, ThirdChild, result, thirdCtor, _ref, _ref1;
    Base = (function() {
      function Base() {}

      Base.prototype.func = function(string) {
        return "zero/" + string;
      };

      Base["static"] = function(string) {
        return "static/" + string;
      };

      return Base;

    })();
    FirstChild = (function(_super) {
      __extends(FirstChild, _super);

      function FirstChild() {
        _ref = FirstChild.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      FirstChild.prototype.func = function(string) {
        return FirstChild.__super__.func.call(this, 'one/') + string;
      };

      return FirstChild;

    })(Base);
    SecondChild = (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        _ref1 = _Class.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      _Class.prototype.func = function(string) {
        return _Class.__super__.func.call(this, 'two/') + string;
      };

      return _Class;

    })(FirstChild);
    thirdCtor = function() {
      return this.array = [1, 2, 3];
    };
    ThirdChild = (function(_super) {
      __extends(ThirdChild, _super);

      function ThirdChild() {
        thirdCtor.call(this);
      }

      ThirdChild.prototype.func = function(string) {
        return ThirdChild.__super__.func.call(this, 'three/') + string;
      };

      return ThirdChild;

    })(SecondChild);
    result = (new ThirdChild).func('four');
    ok(result === 'zero/one/two/three/four');
    ok(Base["static"]('word') === 'static/word');
    FirstChild.prototype.func = function(string) {
      return FirstChild.__super__.func.call(this, 'one/').length + string;
    };
    result = (new ThirdChild).func('four');
    ok(result === '9two/three/four');
    return ok((new ThirdChild).array.join(' ') === '1 2 3');
  });

  test("constructors with inheritance and super", function() {
    var SubClass, SuperClass, TopClass, identity;
    identity = function(f) {
      return f;
    };
    TopClass = (function() {
      function TopClass(arg) {
        this.prop = 'top-' + arg;
      }

      return TopClass;

    })();
    SuperClass = (function(_super) {
      __extends(SuperClass, _super);

      function SuperClass(arg) {
        identity(SuperClass.__super__.constructor.call(this, 'super-' + arg));
      }

      return SuperClass;

    })(TopClass);
    SubClass = (function(_super) {
      __extends(SubClass, _super);

      function SubClass() {
        identity(SubClass.__super__.constructor.call(this, 'sub'));
      }

      return SubClass;

    })(SuperClass);
    return ok((new SubClass).prop === 'top-super-sub');
  });

  test("Overriding the static property new doesn't clobber Function::new", function() {
    var OneClass, TwoClass, _ref;
    OneClass = (function() {
      OneClass["new"] = 'new';

      OneClass.prototype["function"] = 'function';

      function OneClass(name) {
        this.name = name;
      }

      return OneClass;

    })();
    TwoClass = (function(_super) {
      __extends(TwoClass, _super);

      function TwoClass() {
        _ref = TwoClass.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return TwoClass;

    })(OneClass);
    delete TwoClass["new"];
    Function.prototype["new"] = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(this, arguments, function(){});
    };
    ok((TwoClass["new"]('three')).name === 'three');
    ok((new OneClass)["function"] === 'function');
    ok(OneClass["new"] === 'new');
    return delete Function.prototype["new"];
  });

  test("basic classes, again, but in the manual prototype style", function() {
    var Base, FirstChild, SecondChild, ThirdChild, result;
    Base = function() {};
    Base.prototype.func = function(string) {
      return 'zero/' + string;
    };
    Base.prototype['func-func'] = function(string) {
      return "dynamic-" + string;
    };
    FirstChild = function() {};
    SecondChild = function() {};
    ThirdChild = function() {
      this.array = [1, 2, 3];
      return this;
    };
    __extends(ThirdChild, __extends(SecondChild, __extends(FirstChild, Base)));
    FirstChild.prototype.func = function(string) {
      return FirstChild.__super__.func.call(this, 'one/') + string;
    };
    SecondChild.prototype.func = function(string) {
      return SecondChild.__super__.func.call(this, 'two/') + string;
    };
    ThirdChild.prototype.func = function(string) {
      return ThirdChild.__super__.func.call(this, 'three/') + string;
    };
    result = (new ThirdChild).func('four');
    ok(result === 'zero/one/two/three/four');
    return ok((new ThirdChild)['func-func']('thing') === 'dynamic-thing');
  });

  test("super with plain ol' prototypes", function() {
    var SubClass, SuperClass, TopClass;
    TopClass = function() {};
    TopClass.prototype.func = function(arg) {
      return 'top-' + arg;
    };
    SuperClass = function() {};
    __extends(SuperClass, TopClass);
    SuperClass.prototype.func = function(arg) {
      return SuperClass.__super__.func.call(this, 'super-' + arg);
    };
    SubClass = function() {};
    __extends(SubClass, SuperClass);
    SubClass.prototype.func = function() {
      return SubClass.__super__.func.call(this, 'sub');
    };
    return eq((new SubClass).func(), 'top-super-sub');
  });

  test("'@' referring to the current instance, and not being coerced into a call", function() {
    var ClassName, obj;
    ClassName = (function() {
      function ClassName() {}

      ClassName.prototype.amI = function() {
        return this instanceof ClassName;
      };

      return ClassName;

    })();
    obj = new ClassName;
    return ok(obj.amI());
  });

  test("super() calls in constructors of classes that are defined as object properties", function() {
    var Hive, maya;
    Hive = (function() {
      function Hive(name) {
        this.name = name;
      }

      return Hive;

    })();
    Hive.Bee = (function(_super) {
      __extends(Bee, _super);

      function Bee(name) {
        Bee.__super__.constructor.apply(this, arguments);
      }

      return Bee;

    })(Hive);
    maya = new Hive.Bee('Maya');
    return ok(maya.name === 'Maya');
  });

  test("classes with JS-keyword properties", function() {
    var Class, instance;
    Class = (function() {
      function Class() {}

      Class.prototype["class"] = 'class';

      Class.prototype.name = function() {
        return this["class"];
      };

      return Class;

    })();
    instance = new Class;
    ok(instance["class"] === 'class');
    return ok(instance.name() === 'class');
  });

  test("Classes with methods that are pre-bound to the instance, or statically, to the class", function() {
    var Dog, fido, obj, spark;
    Dog = (function() {
      var _this = this;

      function Dog(name) {
        this.bark = __bind(this.bark, this);
        this.name = name;
      }

      Dog.prototype.bark = function() {
        return "" + this.name + " woofs!";
      };

      Dog["static"] = function() {
        return new Dog('Dog');
      };

      return Dog;

    }).call(this);
    spark = new Dog('Spark');
    fido = new Dog('Fido');
    fido.bark = spark.bark;
    ok(fido.bark() === 'Spark woofs!');
    obj = {
      func: Dog["static"]
    };
    return ok(obj.func().name === 'Dog');
  });

  test("a bound function in a bound function", function() {
    var Mini, func, m;
    Mini = (function() {
      function Mini() {
        this.generate = __bind(this.generate, this);
      }

      Mini.prototype.num = 10;

      Mini.prototype.generate = function() {
        var i, _i, _results,
          _this = this;
        _results = [];
        for (i = _i = 1; _i <= 3; i = ++_i) {
          _results.push(function() {
            return _this.num;
          });
        }
        return _results;
      };

      return Mini;

    })();
    m = new Mini;
    return eq(((function() {
      var _i, _len, _ref, _results;
      _ref = m.generate();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        func = _ref[_i];
        _results.push(func());
      }
      return _results;
    })()).join(' '), '10 10 10');
  });

  test("contructor called with varargs", function() {
    var Connection, conn, list;
    Connection = (function() {
      function Connection(one, two, three) {
        var _ref;
        _ref = [one, two, three], this.one = _ref[0], this.two = _ref[1], this.three = _ref[2];
      }

      Connection.prototype.out = function() {
        return "" + this.one + "-" + this.two + "-" + this.three;
      };

      return Connection;

    })();
    list = [3, 2, 1];
    conn = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Connection, list, function(){});
    ok(conn instanceof Connection);
    return ok(conn.out() === '3-2-1');
  });

  test("calling super and passing along all arguments", function() {
    var Child, Parent, c, _ref;
    Parent = (function() {
      function Parent() {}

      Parent.prototype.method = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.args = args;
      };

      return Parent;

    })();
    Child = (function(_super) {
      __extends(Child, _super);

      function Child() {
        _ref = Child.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Child.prototype.method = function() {
        return Child.__super__.method.apply(this, arguments);
      };

      return Child;

    })(Parent);
    c = new Child;
    c.method(1, 2, 3, 4);
    return ok(c.args.join(' ') === '1 2 3 4');
  });

  test("classes wrapped in decorators", function() {
    var Test, func;
    func = function(klass) {
      klass.prototype.prop = 'value';
      return klass;
    };
    func(Test = (function() {
      function Test() {}

      Test.prototype.prop2 = 'value2';

      return Test;

    })());
    ok((new Test).prop === 'value');
    return ok((new Test).prop2 === 'value2');
  });

  test("anonymous classes", function() {
    var instance, obj;
    obj = {
      klass: (function() {
        function _Class() {}

        _Class.prototype.method = function() {
          return 'value';
        };

        return _Class;

      })()
    };
    instance = new obj.klass;
    return ok(instance.method() === 'value');
  });

  test("Implicit objects as static properties", function() {
    var Static;
    Static = (function() {
      function Static() {}

      Static["static"] = {
        one: 1,
        two: 2
      };

      return Static;

    })();
    ok(Static["static"].one === 1);
    return ok(Static["static"].two === 2);
  });

  test("nothing classes", function() {
    var c;
    c = (function() {
      function _Class() {}

      return _Class;

    })();
    return ok(c instanceof Function);
  });

  test("classes with static-level implicit objects", function() {
    var A, B;
    A = (function() {
      function A() {}

      A["static"] = {
        one: 1
      };

      A.prototype.two = 2;

      return A;

    })();
    B = (function() {
      function B() {}

      B["static"] = {
        one: 1,
        two: 2
      };

      return B;

    })();
    eq(A["static"].one, 1);
    eq(A["static"].two, void 0);
    eq((new A).two, 2);
    eq(B["static"].one, 1);
    eq(B["static"].two, 2);
    return eq((new B).two, void 0);
  });

  test("classes with value'd constructors", function() {
    var One, Two, classMaker, counter, _class, _class1, _ref, _ref1;
    counter = 0;
    classMaker = function() {
      var inner;
      inner = ++counter;
      return function() {
        return this.value = inner;
      };
    };
    One = (function() {
      function One() {
        _ref = _class.apply(this, arguments);
        return _ref;
      }

      _class = classMaker();

      return One;

    })();
    Two = (function() {
      function Two() {
        _ref1 = _class1.apply(this, arguments);
        return _ref1;
      }

      _class1 = classMaker();

      return Two;

    })();
    eq((new One).value, 1);
    eq((new Two).value, 2);
    eq((new One).value, 1);
    return eq((new Two).value, 2);
  });

  test("executable class bodies", function() {
    var A, a;
    A = (function() {
      function A() {}

      if (true) {
        A.prototype.b = 'b';
      } else {
        A.prototype.c = 'c';
      }

      return A;

    })();
    a = new A;
    eq(a.b, 'b');
    return eq(a.c, void 0);
  });

  test("#2502: parenthesizing inner object values", function() {
    var A;
    A = (function() {
      function A() {}

      A.prototype.category = {
        type: 'string'
      };

      A.prototype.sections = {
        type: 'number',
        "default": 0
      };

      return A;

    })();
    eq((new A).category.type, 'string');
    return eq((new A).sections["default"], 0);
  });

  test("conditional prototype property assignment", function() {
    var Person, debug;
    debug = false;
    Person = (function() {
      function Person() {}

      if (debug) {
        Person.prototype.age = function() {
          return 10;
        };
      } else {
        Person.prototype.age = function() {
          return 20;
        };
      }

      return Person;

    })();
    return eq((new Person).age(), 20);
  });

  test("mild metaprogramming", function() {
    var Base, Robot, robby, _ref;
    Base = (function() {
      function Base() {}

      Base.attr = function(name) {
        return this.prototype[name] = function(val) {
          if (arguments.length > 0) {
            return this["_" + name] = val;
          } else {
            return this["_" + name];
          }
        };
      };

      return Base;

    })();
    Robot = (function(_super) {
      __extends(Robot, _super);

      function Robot() {
        _ref = Robot.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Robot.attr('power');

      Robot.attr('speed');

      return Robot;

    })(Base);
    robby = new Robot;
    ok(robby.power() === void 0);
    robby.power(11);
    robby.speed(Infinity);
    eq(robby.power(), 11);
    return eq(robby.speed(), Infinity);
  });

  test("namespaced classes do not reserve their function name in outside scope", function() {
    var one, two;
    one = {};
    two = {};
    one.Klass = (function() {
      function Klass() {}

      Klass.label = "one";

      return Klass;

    })();
    two.Klass = (function() {
      function Klass() {}

      Klass.label = "two";

      return Klass;

    })();
    eq(typeof Klass, 'undefined');
    eq(one.Klass.label, 'one');
    return eq(two.Klass.label, 'two');
  });

  test("nested classes", function() {
    var Outer;
    Outer = (function() {
      function Outer() {
        this.label = 'outer';
      }

      Outer.Inner = (function() {
        function Inner() {
          this.label = 'inner';
        }

        return Inner;

      })();

      return Outer;

    })();
    eq((new Outer).label, 'outer');
    return eq((new Outer.Inner).label, 'inner');
  });

  test("variables in constructor bodies are correctly scoped", function() {
    var A, a;
    A = (function() {
      var x, y;

      x = 1;

      function A() {
        var y;
        x = 10;
        y = 20;
      }

      y = 2;

      A.prototype.captured = function() {
        return {
          x: x,
          y: y
        };
      };

      return A;

    })();
    a = new A;
    eq(a.captured().x, 10);
    return eq(a.captured().y, 2);
  });

  test("Issue #924: Static methods in nested classes", function() {
    var A;
    A = (function() {
      function A() {}

      A.B = (function() {
        function _Class() {}

        _Class.c = function() {
          return 5;
        };

        return _Class;

      })();

      return A;

    }).call(this);
    return eq(A.B.c(), 5);
  });

  test("`class extends this`", function() {
    var A, B, makeClass;
    A = (function() {
      function A() {}

      A.prototype.func = function() {
        return 'A';
      };

      return A;

    })();
    B = null;
    makeClass = function() {
      var _ref;
      return B = (function(_super) {
        __extends(_Class, _super);

        function _Class() {
          _ref = _Class.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        _Class.prototype.func = function() {
          return _Class.__super__.func.apply(this, arguments) + ' B';
        };

        return _Class;

      })(this);
    };
    makeClass.call(A);
    return eq((new B()).func(), 'A B');
  });

  test("ensure that constructors invoked with splats return a new object", function() {
    var Type, Type1, args, called, get, i, type, type1, v, _i, _len, _ref;
    args = [1, 2, 3];
    Type = function(args) {
      this.args = args;
    };
    type = new Type(args);
    ok(type && type instanceof Type);
    ok(type.args && type.args instanceof Array);
    _ref = type.args;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      v = _ref[i];
      ok(v === args[i]);
    }
    Type1 = function(a, b, c) {
      this.a = a;
      this.b = b;
      this.c = c;
    };
    type1 = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Type1, args, function(){});
    ok(type1 instanceof Type1);
    eq(type1.constructor, Type1);
    ok(type1.a === args[0] && type1.b === args[1] && type1.c === args[2]);
    called = 0;
    get = function() {
      if (called++) {
        return false;
      } else {
        return Type = (function() {
          function Type() {}

          return Type;

        })();
      }
    };
    return new get().apply(null, args);
  });

  test("`new` shouldn't add extra parens", function() {
    return ok(new Date().constructor === Date);
  });

  test("`new` works against bare function", function() {
    return eq(Date, new function() {
      var _this = this;
      eq(this, new (function() {
        return _this;
      }));
      return Date;
    });
  });

  test("#1182: a subclass should be able to set its constructor to an external function", function() {
    var A, B, ctor, _class, _ref;
    ctor = function() {
      return this.val = 1;
    };
    A = (function() {
      function A() {}

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        _ref = _class.apply(this, arguments);
        return _ref;
      }

      _class = ctor;

      return B;

    })(A);
    return eq((new B).val, 1);
  });

  test("#1182: external constructors continued", function() {
    var A, B, ctor, _class, _ref;
    ctor = function() {};
    A = (function() {
      function A() {}

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        _ref = _class.apply(this, arguments);
        return _ref;
      }

      B.prototype.method = function() {};

      _class = ctor;

      return B;

    })(A);
    return ok(B.prototype.method);
  });

  test("#1313: misplaced __extends", function() {
    var A, B, nonce;
    nonce = {};
    A = (function() {
      function A() {}

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      B.prototype.prop = nonce;

      function B() {}

      return B;

    })(A);
    return eq(nonce, B.prototype.prop);
  });

  test("#1182: execution order needs to be considered as well", function() {
    var B, counter, makeFn, _class, _ref;
    counter = 0;
    makeFn = function(n) {
      eq(n, ++counter);
      return function() {};
    };
    return B = (function(_super) {
      __extends(B, _super);

      function B() {
        _ref = _class.apply(this, arguments);
        return _ref;
      }

      B.B = makeFn(2);

      _class = makeFn(3);

      return B;

    })(makeFn(1));
  });

  test("#1182: external constructors with bound functions", function() {
    var A, B, fn, _class, _ref;
    fn = function() {
      ({
        one: 1
      });
      return this;
    };
    B = (function() {
      function B() {}

      return B;

    })();
    A = (function() {
      function A() {
        this.method = __bind(this.method, this);
        _ref = _class.apply(this, arguments);
        return _ref;
      }

      _class = fn;

      A.prototype.method = function() {
        return this instanceof A;
      };

      return A;

    })();
    return ok((new A).method.call(new B));
  });

  test("#1372: bound class methods with reserved names", function() {
    var C;
    C = (function() {
      function C() {
        this["delete"] = __bind(this["delete"], this);
      }

      C.prototype["delete"] = function() {};

      return C;

    })();
    return ok(C.prototype["delete"]);
  });

  test("#1380: `super` with reserved names", function() {
    var B, C;
    C = (function() {
      function C() {}

      C.prototype["do"] = function() {
        return C.__super__["do"].apply(this, arguments);
      };

      return C;

    })();
    ok(C.prototype["do"]);
    B = (function() {
      function B() {}

      B.prototype[0] = function() {
        return B.__super__[0].apply(this, arguments);
      };

      return B;

    })();
    return ok(B.prototype[0]);
  });

  test("#1464: bound class methods should keep context", function() {
    var C, nonce, nonce2;
    nonce = {};
    nonce2 = {};
    C = (function() {
      var _this = this;

      function C(id) {
        this.id = id;
      }

      C.boundStaticColon = function() {
        return new C(nonce);
      };

      C.boundStaticEqual = function() {
        return new C(nonce2);
      };

      return C;

    }).call(this);
    eq(nonce, C.boundStaticColon().id);
    return eq(nonce2, C.boundStaticEqual().id);
  });

  test("#1009: classes with reserved words as determined names", function() {
    return (function() {
      eq('function', typeof (this["for"] = (function() {
        function _for() {}

        return _for;

      })()));
      ok(!/\beval\b/.test((this["eval"] = (function() {
        function _eval() {}

        return _eval;

      })()).toString()));
      return ok(!/\barguments\b/.test((this["arguments"] = (function() {
        function _arguments() {}

        return _arguments;

      })()).toString()));
    }).call({});
  });

  test("#1482: classes can extend expressions", function() {
    var A, B, id, nonce, _ref;
    id = function(x) {
      return x;
    };
    nonce = {};
    A = (function() {
      function A() {}

      A.prototype.nonce = nonce;

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        _ref = B.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return B;

    })(id(A));
    return eq(nonce, (new B).nonce);
  });

  test("#1598: super works for static methods too", function() {
    var Child, Parent, _ref;
    Parent = (function() {
      function Parent() {}

      Parent.prototype.method = function() {
        return 'NO';
      };

      Parent.method = function() {
        return 'yes';
      };

      return Parent;

    })();
    Child = (function(_super) {
      __extends(Child, _super);

      function Child() {
        _ref = Child.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Child.method = function() {
        return 'pass? ' + Child.__super__.constructor.method.apply(this, arguments);
      };

      return Child;

    })(Parent);
    return eq(Child.method(), 'pass? yes');
  });

  test("#1842: Regression with bound functions within bound class methods", function() {
    var Store;
    Store = (function() {
      function Store() {}

      Store.bound = function() {
        return (function() {
          return eq(Store, Store);
        })();
      };

      return Store;

    }).call(this);
    Store.bound();
    Store = (function() {
      function Store() {
        this.instance = __bind(this.instance, this);
      }

      eq(Store, Store);

      Store.bound = function() {
        return (function() {
          return eq(Store, Store);
        })();
      };

      Store.unbound = function() {
        return eq(this, Store);
      };

      Store.prototype.instance = function() {
        return ok(this instanceof Store);
      };

      return Store;

    }).call(this);
    Store.bound();
    Store.unbound();
    return (new Store).instance();
  });

  test("#1876: Class @A extends A", function() {
    var A, _ref;
    A = (function() {
      function A() {}

      return A;

    })();
    this.A = (function(_super) {
      __extends(A, _super);

      function A() {
        _ref = A.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return A;

    })(A);
    return ok((new this.A) instanceof A);
  });

  test("#1813: Passing class definitions as expressions", function() {
    var A, B, ident, result, _ref;
    ident = function(x) {
      return x;
    };
    result = ident(A = (function() {
      var x;

      function A() {}

      x = 1;

      return A;

    })());
    eq(result, A);
    result = ident(B = (function(_super) {
      var x;

      __extends(B, _super);

      function B() {
        _ref = B.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      x = 1;

      return B;

    })(A));
    return eq(result, B);
  });

  test("#1966: external constructors should produce their return value", function() {
    var A, ctor, _class, _ref;
    ctor = function() {
      return {};
    };
    A = (function() {
      function A() {
        _ref = _class.apply(this, arguments);
        return _ref;
      }

      _class = ctor;

      return A;

    })();
    return ok(!((new A) instanceof A));
  });

  test("#1980: regression with an inherited class with static function members", function() {
    var A, B, _ref;
    A = (function() {
      function A() {}

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        _ref = B.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      B["static"] = function() {
        return 'value';
      };

      return B;

    }).call(this, A);
    return eq(B["static"](), 'value');
  });

  test("#1534: class then 'use strict'", function() {
    var comment, comments, directive, directives, e, error, nonce, strictTest, _i, _j, _len, _len1, _results;
    nonce = {};
    error = 'do -> ok this';
    strictTest = "do ->'use strict';" + error;
    if (((function() {
      try {
        return CoffeeScript.run(strictTest, {
          bare: true
        });
      } catch (_error) {
        e = _error;
        return nonce;
      }
    })()) !== nonce) {
      return;
    }
    throws(function() {
      return CoffeeScript.run("class then 'use strict';" + error, {
        bare: true
      });
    });
    doesNotThrow(function() {
      return CoffeeScript.run("class then " + error, {
        bare: true
      });
    });
    doesNotThrow(function() {
      return CoffeeScript.run("class then " + error + ";'use strict'", {
        bare: true
      });
    });
    comments = ["class\n  ### comment ###\n  'use strict'\n  " + error, "class\n  ### comment 1 ###\n  ### comment 2 ###\n  'use strict'\n  " + error, "class\n  ### comment 1 ###\n  ### comment 2 ###\n  'use strict'\n  " + error + "\n  ### comment 3 ###"];
    for (_i = 0, _len = comments.length; _i < _len; _i++) {
      comment = comments[_i];
      throws((function() {
        return CoffeeScript.run(comment, {
          bare: true
        });
      }));
    }
    directives = ["class\n  'directive 1'\n  'use strict'\n  " + error, "class\n  'use strict'\n  'directive 2'\n  " + error, "class\n  ### comment 1 ###\n  'directive 1'\n  'use strict'\n  " + error, "class\n  ### comment 1 ###\n  'directive 1'\n  ### comment 2 ###\n  'use strict'\n  " + error];
    _results = [];
    for (_j = 0, _len1 = directives.length; _j < _len1; _j++) {
      directive = directives[_j];
      _results.push(throws((function() {
        return CoffeeScript.run(directive, {
          bare: true
        });
      })));
    }
    return _results;
  });

  test("#2052: classes should work in strict mode", function() {
    var e;
    try {
      return (function() {
        'use strict';
        var A;
        return A = (function() {
          function A() {}

          return A;

        })();
      })();
    } catch (_error) {
      e = _error;
      return ok(false);
    }
  });

  test("#2630: class bodies can't reference arguments", function() {
    return throws(function() {
      return CoffeeScript.compile('class Test then arguments');
    });
  });

  test("#2319: fn class n extends o.p [INDENT] x = 123", function() {
    var OneKeeper, base, first, _ref;
    first = function() {};
    base = {
      onebase: function() {}
    };
    first(OneKeeper = (function(_super) {
      var one;

      __extends(OneKeeper, _super);

      function OneKeeper() {
        _ref = OneKeeper.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      one = 1;

      OneKeeper.prototype.one = function() {
        return one;
      };

      return OneKeeper;

    })(base.onebase));
    return eq(new OneKeeper().one(), 1);
  });

  test("#2599: other typed constructors should be inherited", function() {
    var Base, Derived, _ref;
    Base = (function() {
      function Base() {
        return {};
      }

      return Base;

    })();
    Derived = (function(_super) {
      __extends(Derived, _super);

      function Derived() {
        _ref = Derived.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return Derived;

    })(Base);
    ok(!((new Derived) instanceof Derived));
    ok(!((new Derived) instanceof Base));
    return ok(!((new Base) instanceof Base));
  });

  test("#2359: extending native objects that use other typed constructors requires defining a constructor", function() {
    var BrokenArray, WorkingArray, brokenArray, workingArray, _ref;
    BrokenArray = (function(_super) {
      __extends(BrokenArray, _super);

      function BrokenArray() {
        _ref = BrokenArray.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      BrokenArray.prototype.method = function() {
        return 'no one will call me';
      };

      return BrokenArray;

    })(Array);
    brokenArray = new BrokenArray;
    ok(!(brokenArray instanceof BrokenArray));
    ok(typeof brokenArray.method === 'undefined');
    WorkingArray = (function(_super) {
      __extends(WorkingArray, _super);

      function WorkingArray() {
        WorkingArray.__super__.constructor.apply(this, arguments);
      }

      WorkingArray.prototype.method = function() {
        return 'yes!';
      };

      return WorkingArray;

    })(Array);
    workingArray = new WorkingArray;
    ok(workingArray instanceof WorkingArray);
    return eq('yes!', workingArray.method());
  });

  test("#2782: non-alphanumeric-named bound functions", function() {
    var A;
    A = (function() {
      function A() {
        this['b:c'] = __bind(this['b:c'], this);
      }

      A.prototype['b:c'] = function() {
        return 'd';
      };

      return A;

    })();
    return eq((new A)['b:c'](), 'd');
  });

  test("#2781: overriding bound functions", function() {
    var A, B, b, _ref;
    A = (function() {
      function A() {
        this.b = __bind(this.b, this);
      }

      A.prototype.a = function() {
        return this.b();
      };

      A.prototype.b = function() {
        return 1;
      };

      return A;

    })();
    B = (function(_super) {
      __extends(B, _super);

      function B() {
        this.b = __bind(this.b, this);
        _ref = B.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      B.prototype.b = function() {
        return 2;
      };

      return B;

    })(A);
    b = (new A).b;
    eq(b(), 1);
    b = (new B).b;
    return eq(b(), 2);
  });

  test("#2791: bound function with destructured argument", function() {
    var Foo;
    Foo = (function() {
      function Foo() {
        this.method = __bind(this.method, this);
      }

      Foo.prototype.method = function(_arg) {
        var a;
        a = _arg.a;
        return 'Bar';
      };

      return Foo;

    })();
    return eq((new Foo).method({
      a: 'Bar'
    }), 'Bar');
  });

  test("#2796: ditto, ditto, ditto", function() {
    var Base, answer, outsideMethod;
    answer = null;
    outsideMethod = function(func) {
      return func.call({
        message: 'wrong!'
      });
    };
    Base = (function() {
      function Base() {
        this.echo = __bind(this.echo, this);
        this.message = 'right!';
        outsideMethod(this.echo);
      }

      Base.prototype.echo = function() {
        return answer = this.message;
      };

      return Base;

    })();
    new Base;
    return eq(answer, 'right!');
  });

}).call(this);
