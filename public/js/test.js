(function() {
  require.config({
    paths: {
      jquery: '/components/jquery/jquery.min',
      underscore: '/components/underscore/underscore',
      backbone: '/components/backbone/backbone',
      thalam: '/lib/thalam'
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      }
    }
  });

  require(['jquery', 'thalam'], function($, t) {
    window.Thalam = new t.NotificationsView({
      collection: new t.Notifications()
    });
    $('body').append(Thalam.el);
    Thalam.collection.add([
      {
        title: 'blah',
        message: 'meh'
      }
    ]);
    Thalam.collection.add([
      {
        title: 'i\'m gonna die',
        message: 'cause i\'ve got a timeout',
        timeout: 3000
      }
    ]);
  });

}).call(this);
