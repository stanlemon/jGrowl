(function() {
  var copy, end, middle, numbers, start;

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  start = numbers.slice(0, 3);

  middle = numbers.slice(3, 6);

  end = numbers.slice(6);

  copy = numbers.slice(0);

}).call(this);