(function() {
  var CoffeeScript, compile, runScripts,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CoffeeScript = require('./coffee-script');

  CoffeeScript.require = require;

  compile = CoffeeScript.compile;

  CoffeeScript["eval"] = function(code, options) {
    if (options == null) {
      options = {};
    }
    if (options.bare == null) {
      options.bare = true;
    }
    return eval(compile(code, options));
  };

  CoffeeScript.run = function(code, options) {
    if (options == null) {
      options = {};
    }
    options.bare = true;
    options.shiftLine = true;
    return Function(compile(code, options))();
  };

  if (typeof window === "undefined" || window === null) {
    return;
  }

  if ((typeof btoa !== "undefined" && btoa !== null) && (typeof JSON !== "undefined" && JSON !== null) && (typeof unescape !== "undefined" && unescape !== null) && (typeof encodeURIComponent !== "undefined" && encodeURIComponent !== null)) {
    compile = function(code, options) {
      var js, v3SourceMap, _ref;
      if (options == null) {
        options = {};
      }
      options.sourceMap = true;
      options.inline = true;
      _ref = CoffeeScript.compile(code, options), js = _ref.js, v3SourceMap = _ref.v3SourceMap;
      return "" + js + "\n//@ sourceMappingURL=data:application/json;base64," + (btoa(unescape(encodeURIComponent(v3SourceMap)))) + "\n//@ sourceURL=coffeescript";
    };
  }

  CoffeeScript.load = function(url, callback, options) {
    var xhr;
    if (options == null) {
      options = {};
    }
    options.sourceFiles = [url];
    xhr = window.ActiveXObject ? new window.ActiveXObject('Microsoft.XMLHTTP') : new window.XMLHttpRequest();
    xhr.open('GET', url, true);
    if ('overrideMimeType' in xhr) {
      xhr.overrideMimeType('text/plain');
    }
    xhr.onreadystatechange = function() {
      var _ref;
      if (xhr.readyState === 4) {
        if ((_ref = xhr.status) === 0 || _ref === 200) {
          CoffeeScript.run(xhr.responseText, options);
        } else {
          throw new Error("Could not load " + url);
        }
        if (callback) {
          return callback();
        }
      }
    };
    return xhr.send(null);
  };

  runScripts = function() {
    var coffees, coffeetypes, execute, index, length, s, scripts;
    scripts = window.document.getElementsByTagName('script');
    coffeetypes = ['text/coffeescript', 'text/literate-coffeescript'];
    coffees = (function() {
      var _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = scripts.length; _i < _len; _i++) {
        s = scripts[_i];
        if (_ref = s.type, __indexOf.call(coffeetypes, _ref) >= 0) {
          _results.push(s);
        }
      }
      return _results;
    })();
    index = 0;
    length = coffees.length;
    (execute = function() {
      var mediatype, options, script;
      script = coffees[index++];
      mediatype = script != null ? script.type : void 0;
      if (__indexOf.call(coffeetypes, mediatype) >= 0) {
        options = {
          literate: mediatype === 'text/literate-coffeescript'
        };
        if (script.src) {
          return CoffeeScript.load(script.src, execute, options);
        } else {
          options.sourceFiles = ['embedded'];
          CoffeeScript.run(script.innerHTML, options);
          return execute();
        }
      }
    })();
    return null;
  };

  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', runScripts, false);
  } else {
    window.attachEvent('onload', runScripts);
  }

}).call(this);