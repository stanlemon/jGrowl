(function() {
  var runtime;

  runtime = function(N) {
    var n, sum, t, _i, _ref;
    _ref = [0, 0], sum = _ref[0], t = _ref[1];
    for (n = _i = 1; 1 <= N ? _i <= N : _i >= N; n = 1 <= N ? ++_i : --_i) {
      sum += 2 * t;
      t = n - 1 + sum / n;
    }
    return t;
  };

  console.log(runtime(3) === 2.6666666666666665);

  console.log(runtime(5) === 7.4);

  console.log(runtime(8) === 16.92142857142857);

}).call(this);
