(function() {
  var append, index, synchronize, write;

  get('/hello', function() {
    return 'Hello World';
  });

  append = function(location, data) {
    var path;
    path = new Pathname(location);
    if (!fs.existsSync(location)) {
      throw new Error("Location does not exist");
    }
    File.open(path, 'a', function(file) {
      return file.console.log(YAML.dump(data));
    });
    return data;
  };

  File.open = function(path, mode, block) {
    var io;
    io = new File(path, mode);
    if (!block) {
      return io;
    }
    try {
      return block(io);
    } finally {
      if (!io.closed()) {
        io.close();
      }
    }
  };

  write = function(location, data) {
    var path;
    path = new Pathname(location);
    if (!fs.existsSync(location)) {
      throw new Error("Location does not exist");
    }
    return File.open(path, 'w', function(file) {
      if (Digest.MD5.hexdigest(file.read()) === data.hash()) {
        return false;
      }
      file.console.log(YAML.dump(data));
      return true;
    });
  };

  index = function() {
    var people;
    people = Person.find('all');
    return respond_to(function(format) {
      format.html();
      return format.xml(function() {
        return render({
          xml: people.xml()
        });
      });
    });
  };

  synchronize = function(block) {
    lock();
    try {
      return block();
    } finally {
      unlock();
    }
  };

}).call(this);
