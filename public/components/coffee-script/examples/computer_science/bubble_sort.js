(function() {
  var bubble_sort;

  bubble_sort = function(list) {
    var i, j, _i, _j, _ref, _ref1, _ref2;
    for (i = _i = 0, _ref = list.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = list.length - i; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        if (list[j] > list[j + 1]) {
          _ref2 = [list[j + 1], list[j]], list[j] = _ref2[0], list[j + 1] = _ref2[1];
        }
      }
    }
    return list;
  };

  console.log(bubble_sort([3, 2, 1]).join(' ') === '1 2 3');

  console.log(bubble_sort([9, 2, 7, 0, 1]).join(' ') === '0 1 2 7 9');

}).call(this);
