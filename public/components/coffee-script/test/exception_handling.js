(function() {
  var nonce;

  nonce = {};

  test("basic exception throwing", function() {
    return throws((function() {
      throw 'error';
    }), 'error');
  });

  test("try can exist alone", function() {
    try {

    } catch (_error) {}
  });

  test("try/catch with empty try, empty catch", function() {
    var err;
    try {

    } catch (_error) {
      err = _error;
    }
  });

  test("single-line try/catch with empty try, empty catch", function() {
    var err;
    try {

    } catch (_error) {
      err = _error;
    }
  });

  test("try/finally with empty try, empty finally", function() {
    try {

    } finally {

    }
  });

  test("single-line try/finally with empty try, empty finally", function() {
    try {

    } finally {

    }
  });

  test("try/catch/finally with empty try, empty catch, empty finally", function() {
    var err;
    try {

    } catch (_error) {
      err = _error;
    } finally {

    }
  });

  test("single-line try/catch/finally with empty try, empty catch, empty finally", function() {
    var err;
    try {

    } catch (_error) {
      err = _error;
    } finally {

    }
  });

  test("return the result of try when no exception is thrown", function() {
    var err, result;
    result = (function() {
      try {
        return nonce;
      } catch (_error) {
        err = _error;
        return void 0;
      } finally {
        void 0;
      }
    })();
    return eq(nonce, result);
  });

  test("single-line result of try when no exception is thrown", function() {
    var err, result;
    result = (function() {
      try {
        return nonce;
      } catch (_error) {
        err = _error;
        return void 0;
      }
    })();
    return eq(nonce, result);
  });

  test("return the result of catch when an exception is thrown", function() {
    var fn;
    fn = function() {
      var err;
      try {
        throw function() {};
      } catch (_error) {
        err = _error;
        return nonce;
      }
    };
    doesNotThrow(fn);
    return eq(nonce, fn());
  });

  test("single-line result of catch when an exception is thrown", function() {
    var fn;
    fn = function() {
      var err;
      try {
        throw (function() {});
      } catch (_error) {
        err = _error;
        return nonce;
      }
    };
    doesNotThrow(fn);
    return eq(nonce, fn());
  });

  test("optional catch", function() {
    var fn;
    fn = function() {
      try {
        throw function() {};
      } catch (_error) {}
      return nonce;
    };
    doesNotThrow(fn);
    return eq(nonce, fn());
  });

  test("try/catch with empty catch as last statement in a function body", function() {
    var fn;
    fn = function() {
      var err;
      try {
        return nonce;
      } catch (_error) {
        err = _error;
      }
    };
    return eq(nonce, fn());
  });

  test("try/catch with a reused variable name.", function() {
    (function() {
      var inner;
      try {
        return inner = 5;
      } catch (_error) {
        inner = _error;
      }
    })();
    return eq(typeof inner, 'undefined');
  });

  test("try/catch with destructuring the exception object", function() {
    var message, result;
    result = (function() {
      try {
        return missing.object;
      } catch (_error) {
        message = _error.message;
        return message;
      }
    })();
    return eq(message, 'missing is not defined');
  });

  test("Try catch finally as implicit arguments", function() {
    var bar, e, first, foo;
    first = function(x) {
      return x;
    };
    foo = false;
    try {
      first((function() {
        try {
          return iamwhoiam();
        } finally {
          foo = true;
        }
      })());
    } catch (_error) {
      e = _error;
    }
    eq(foo, true);
    bar = false;
    try {
      first((function() {
        try {
          return iamwhoiam();
        } catch (_error) {
          e = _error;
        } finally {

        }
      })());
      bar = true;
    } catch (_error) {
      e = _error;
    }
    return eq(bar, true);
  });

  test("parameter-less catch clause", function() {
    try {
      throw new Error('failed');
    } catch (_error) {
      ok(true);
    }
    try {
      throw new Error('failed');
    } catch (_error) {

    } finally {
      ok(true);
    }
    return ok((function() {
      try {
        throw new Error('failed');
      } catch (_error) {
        return true;
      }
    })());
  });

}).call(this);
