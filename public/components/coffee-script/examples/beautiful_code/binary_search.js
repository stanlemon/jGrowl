(function() {
  var index;

  index = function(list, target) {
    var high, low, mid, val, _ref;
    _ref = [0, list.length], low = _ref[0], high = _ref[1];
    while (low < high) {
      mid = (low + high) >> 1;
      val = list[mid];
      if (val === target) {
        return mid;
      }
      if (val < target) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return -1;
  };

  console.log(2 === index([10, 20, 30, 40, 50], 30));

  console.log(4 === index([-97, 35, 67, 88, 1200], 1200));

  console.log(0 === index([0, 45, 70], 0));

}).call(this);
