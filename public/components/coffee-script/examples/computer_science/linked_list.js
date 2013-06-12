(function() {
  var LinkedList, list;

  LinkedList = (function() {
    function LinkedList() {}

    (function() {
      return this._head = null;
    });

    LinkedList.prototype.add = function(data) {
      var current, node;
      node = {
        data: data,
        next: null
      };
      current = this._head || (this._head = node);
      if (this._head !== node) {
        while (current.next) {
          current = current.next;
        }
        current.next = node;
      }
      return this;
    };

    LinkedList.prototype.item = function(index) {
      var current, i;
      if (index < 0) {
        return null;
      }
      current = this._head || null;
      i = -1;
      while (current && index > (i += 1)) {
        current = current.next;
      }
      return current && current.data;
    };

    LinkedList.prototype.remove = function(index) {
      var current, i, previous, _ref;
      if (index < 0) {
        return null;
      }
      current = this._head || null;
      i = -1;
      if (index === 0) {
        this._head = current.next;
      } else {
        while (index > (i += 1)) {
          _ref = [current, current.next], previous = _ref[0], current = _ref[1];
        }
        previous.next = current.next;
      }
      return current && current.data;
    };

    LinkedList.prototype.size = function() {
      var count, current;
      current = this._head;
      count = 0;
      while (current) {
        count += 1;
        current = current.next;
      }
      return count;
    };

    LinkedList.prototype.toArray = function() {
      var current, result;
      result = [];
      current = this._head;
      while (current) {
        result.push(current.data);
        current = current.next;
      }
      return result;
    };

    LinkedList.prototype.toString = function() {
      return this.toArray().toString();
    };

    return LinkedList;

  })();

  list = new LinkedList;

  list.add("Hi");

  console.log(list.size() === 1);

  console.log(list.item(0) === "Hi");

  console.log(list.item(1) === null);

  list = new LinkedList;

  list.add("zero").add("one").add("two");

  console.log(list.size() === 3);

  console.log(list.item(2) === "two");

  console.log(list.remove(1) === "one");

  console.log(list.item(0) === "zero");

  console.log(list.item(1) === "two");

  console.log(list.size() === 2);

  console.log(list.item(-10) === null);

}).call(this);
