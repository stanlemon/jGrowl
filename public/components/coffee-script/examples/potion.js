(function() {
  var BTree, Person, Policeman, a, add, app, b, block, count, foods, i, key, minus, p, table, val, x, y, _i, _j, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  for (i = _i = 1; _i <= 5; i = ++_i) {
    print("Odelay!");
  }

  add = function(x, y) {
    return x + y;
  };

  print(add(2, 4));

  while (true) {
    print('quaff');
  }

  print(['cheese', 'bread', 'mayo'][1]);

  print({
    language: 'Potion',
    pointless: true
  }['language']);

  minus = function(x, y) {
    return x - y;
  };

  minus(6, 10);

  foods = ['cheese', 'bread', 'mayo'];

  foods[2];

  _ref = {
    dog: 'canine',
    cat: 'feline',
    fox: 'vulpine'
  };
  for (key in _ref) {
    val = _ref[key];
    print(key + ' is a ' + val);
  }

  Person = (function() {
    function Person() {}

    Person.prototype.print = function() {
      return print('My name is ' + this.name + '.');
    };

    return Person;

  })();

  p = new Person;

  print(p.name);

  Policeman = (function(_super) {
    __extends(Policeman, _super);

    function Policeman() {
      _ref1 = Policeman.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    (function(rank) {
      this.rank = rank;
    });

    Policeman.prototype.print = function() {
      return print('My name is ' + this.name + " and I'm a " + this.rank + '.');
    };

    return Policeman;

  })(Person);

  print(new Policeman('Constable'));

  app = {
    window: {
      width: 200,
      height: 200
    },
    para: 'Welcome.',
    button: 'OK'
  };

  app.window;

  x = 1;

  y = 2;

  x = 1;

  y = 2;

  table = {
    language: 'Potion',
    pointless: true
  };

  String.prototype.length = function() {
    return 10;
  };

  block = function() {
    return print('potion');
  };

  if (age > 100) {
    'ancient';
  }

  switch (author) {
    case 'Jonathan Strange & Mr. Norrell':
      'Susanna Clarke';
      break;
    case 'The Star Diaries':
      'Stanislaw Lem';
      break;
    case 'The Slynx':
      'Tatyana Tolstaya';
      break;
    default:
      '... probably Philip K. Dick';
  }

  count = 8;

  while (count > 0) {
    print('quaff');
    count--;
  }

  for (a = _j = 1; _j <= 5; a = ++_j) {
    print(a);
  }

  if (3..gender != null) {
    print("Huh? Numbers are sexed? That's amazing.");
  }

  HomePage.prototype.get = function(url) {
    var session;
    if (url.query != null) {
      return session = url.query.session;
    }
  };

  BTree = function() {};

  b = new BTree;

  b.left = new BTree;

  b.right = new BTree;

  BTree = function() {};

  b = new BTree;

  if (b.left != null) {
    print('left path found!');
  }

}).call(this);
