(function() {
  var cluster;

  if (typeof testingBrowser !== "undefined" && testingBrowser !== null) {
    return;
  }

  cluster = require('cluster');

  if (cluster.isMaster) {
    test("#2737 - cluster module can spawn workers from a coffeescript process", function() {
      cluster.once('exit', function(worker, code) {
        return eq(code, 0);
      });
      return cluster.fork();
    });
  } else {
    process.exit(0);
  }

}).call(this);
