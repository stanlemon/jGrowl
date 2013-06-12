(function() {
  var binary_search;

  binary_search = function(items, value) {
    var pivot, start, stop;
    start = 0;
    stop = items.length - 1;
    pivot = Math.floor((start + stop) / 2);
    while (items[pivot] !== value && start < stop) {
      if (value < items[pivot]) {
        stop = pivot - 1;
      }
      if (value > items[pivot]) {
        start = pivot + 1;
      }
      pivot = Math.floor((stop + start) / 2);
    }
    if (items[pivot] === value) {
      return pivot;
    } else {
      return -1;
    }
  };

  console.log(2 === binary_search([10, 20, 30, 40, 50], 30));

  console.log(4 === binary_search([-97, 35, 67, 88, 1200], 1200));

  console.log(0 === binary_search([0, 45, 70], 0));

  console.log(-1 === binary_search([0, 45, 70], 10));

}).call(this);
