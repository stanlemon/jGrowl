(function() {
  var selection_sort;

  selection_sort = function(list) {
    var i, k, len, min, v, _i, _j, _len, _ref, _ref1;
    len = list.length;
    for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
      min = i;
      _ref = list.slice(i + 1);
      for (k = _j = 0, _len = _ref.length; _j < _len; k = ++_j) {
        v = _ref[k];
        if (v < list[min]) {
          min = k;
        }
      }
      if (i !== min) {
        _ref1 = [list[min], list[i]], list[i] = _ref1[0], list[min] = _ref1[1];
      }
    }
    return list;
  };

  console.log(selection_sort([3, 2, 1]).join(' ') === '1 2 3');

  console.log(selection_sort([9, 2, 7, 0, 1]).join(' ') === '0 1 2 7 9');

}).call(this);
