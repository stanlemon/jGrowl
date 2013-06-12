(function() {
  var merge_sort;

  merge_sort = function(list) {
    var left, pivot, result, right;
    if (list.length === 1) {
      return list;
    }
    result = [];
    pivot = Math.floor(list.length / 2);
    left = merge_sort(list.slice(0, pivot));
    right = merge_sort(list.slice(pivot));
    while (left.length && right.length) {
      result.push(left[0] < right[0] ? left.shift() : right.shift());
    }
    return result.concat(left).concat(right);
  };

  console.log(merge_sort([3, 2, 1]).join(' ') === '1 2 3');

  console.log(merge_sort([9, 2, 7, 0, 1]).join(' ') === '0 1 2 7 9');

}).call(this);
