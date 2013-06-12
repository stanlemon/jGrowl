(function() {
  test("comments in objects", function() {
    var obj1;
    obj1 = {
      one: 1,
      two: 2
    };
    ok(Object.prototype.hasOwnProperty.call(obj1, 'one'));
    eq(obj1.one, 1);
    ok(Object.prototype.hasOwnProperty.call(obj1, 'two'));
    return eq(obj1.two, 2);
  });

  test("comments in YAML-style objects", function() {
    var obj2;
    obj2 = {
      three: 3,
      four: 4
    };
    ok(Object.prototype.hasOwnProperty.call(obj2, 'three'));
    eq(obj2.three, 3);
    ok(Object.prototype.hasOwnProperty.call(obj2, 'four'));
    return eq(obj2.four, 4);
  });

  test("comments following operators that continue lines", function() {
    var sum;
    sum = 1 + 1 + 1;
    return eq(3, sum);
  });

  test("comments in functions", function() {
    var fn, fn2;
    fn = function() {
      false;
      false;
      false;
      return true;
    };
    ok(fn());
    fn2 = function() {
      return fn();
    };
    return ok(fn2());
  });

  test("trailing comment before an outdent", function() {
    var fn3, nonce;
    nonce = {};
    fn3 = function() {
      if (true) {
        void 0;
      }
      return nonce;
    };
    return eq(nonce, fn3());
  });

  test("comments in a switch", function() {
    var nonce, result;
    nonce = {};
    result = (function() {
      switch (nonce) {
        case false:
          return void 0;
        case null:
          return void 0;
        default:
          return nonce;
      }
    })();
    return eq(nonce, result);
  });

  test("comment with conditional statements", function() {
    var nonce, result;
    nonce = {};
    result = false ? void 0 : nonce;
    return eq(nonce, result);
  });

  test("spaced comments with conditional statements", function() {
    var nonce, result;
    nonce = {};
    result = false ? void 0 : false ? void 0 : nonce;
    return eq(nonce, result);
  });

  /*
    This is a here-comment.
    Kind of like a heredoc.
  */


  test("block comments in objects", function() {
    var a, b, obj;
    a = {};
    b = {};
    obj = {
      a: a,
      /*
      comment
      */

      b: b
    };
    eq(a, obj.a);
    return eq(b, obj.b);
  });

  test("block comments in YAML-style", function() {
    var a, b, obj;
    a = {};
    b = {};
    obj = {
      a: a,
      /*
      comment
      */

      b: b
    };
    eq(a, obj.a);
    return eq(b, obj.b);
  });

  test("block comments in functions", function() {
    var fn1, fn2, fn3, fn4, nonce;
    nonce = {};
    fn1 = function() {
      return true;
      /*
      false
      */

    };
    ok(fn1());
    fn2 = function() {
      /*
      block comment
      */

      return nonce;
    };
    eq(nonce, fn2());
    fn3 = function() {
      return nonce;
    };
    /*
    block comment
    */

    eq(nonce, fn3());
    fn4 = function() {
      var one;
      return one = function() {
        /*
          block comment
        */

        var two;
        return two = function() {
          var three;
          return three = function() {
            return nonce;
          };
        };
      };
    };
    return eq(nonce, fn4()()()());
  });

  test("block comments inside class bodies", function() {
    var A, B;
    A = (function() {
      function A() {}

      A.prototype.a = function() {};

      /*
      Comment
      */


      A.prototype.b = function() {};

      return A;

    })();
    ok(A.prototype.b instanceof Function);
    B = (function() {
      function B() {}

      /*
      Comment
      */


      B.prototype.a = function() {};

      B.prototype.b = function() {};

      return B;

    })();
    return ok(B.prototype.a instanceof Function);
  });

  test("#2037: herecomments shouldn't imply line terminators", function() {
    return (function() {
      /**/

      return fail;
    })();
  });

  test("#2916: block comment before implicit call with implicit object", function() {
    var fn;
    fn = function(obj) {
      return ok(obj.a);
    };
    /**/

    return fn({
      a: true
    });
  });

}).call(this);
