(function() {
  test("#764 Booleans should be indexable", function() {
    var toString;
    toString = Boolean.prototype.toString;
    eq(toString, true['toString']);
    eq(toString, false['toString']);
    eq(toString, true['toString']);
    eq(toString, false['toString']);
    eq(toString, true['toString']);
    eq(toString, false['toString']);
    eq(toString, true.toString);
    eq(toString, false.toString);
    eq(toString, true.toString);
    eq(toString, false.toString);
    eq(toString, true.toString);
    return eq(toString, false.toString);
  });

}).call(this);
