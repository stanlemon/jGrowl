(function() {
  var match, match_here, match_star;

  match = function(regexp, text) {
    if (regexp[0] === '^') {
      return match_here(regexp.slice(1), text);
    }
    while (text) {
      if (match_here(regexp, text)) {
        return true;
      }
      text = text.slice(1);
    }
    return false;
  };

  match_here = function(regexp, text) {
    var cur, next, _ref;
    _ref = [regexp[0], regexp[1]], cur = _ref[0], next = _ref[1];
    if (regexp.length === 0) {
      return true;
    }
    if (next === '*') {
      return match_star(cur, regexp.slice(2), text);
    }
    if (cur === '$' && !next) {
      return text.length === 0;
    }
    if (text && (cur === '.' || cur === text[0])) {
      return match_here(regexp.slice(1), text.slice(1));
    }
    return false;
  };

  match_star = function(c, regexp, text) {
    while (true) {
      if (match_here(regexp, text)) {
        return true;
      }
      if (!(text && (text[0] === c || c === '.'))) {
        return false;
      }
      text = text.slice(1);
    }
  };

  console.log(match("ex", "some text"));

  console.log(match("s..t", "spit"));

  console.log(match("^..t", "buttercup"));

  console.log(match("i..$", "cherries"));

  console.log(match("o*m", "vrooooommm!"));

  console.log(match("^hel*o$", "hellllllo"));

}).call(this);
