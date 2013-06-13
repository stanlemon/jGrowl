(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone'], function($, _, BackBone) {
    var Notification, NotificationView, Notifications, NotificationsView, p, _ref, _ref1, _ref2, _ref3;
    p = function(text) {
      return console.log(text);
    };
    Notification = (function(_super) {
      __extends(Notification, _super);

      function Notification() {
        _ref = Notification.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Notification.prototype.defaults = {
        title: "",
        message: "",
        classes: [],
        timeout: 0
      };

      /**
      		 * set a timout that will trigger model.destroy(). triggered by
      	       change:timeout event
      		 * @private
      */


      Notification.prototype._set_timeout = function() {
        p('_set_timeout Notification');
        clearTimeout(this._timeout_id);
        if (this.get('timeout') !== 0) {
          this._timeout_id = setTimeout((function(notification) {
            notification.destroy();
          }), this.get('timeout'), this);
        }
      };

      /**
      		 * delete model and view. triggered by model.destroy()
      		 * @private
      */


      Notification.prototype._close = function() {
        p('_close Notification');
        return this.view.remove();
      };

      Notification.prototype.initialize = function() {
        _.bindAll(this);
        p('init Notification');
        this.on({
          'destroy': this._close,
          'change:timeout': this._set_timeout
        });
        return this._set_timeout();
      };

      return Notification;

    })(Backbone.Model);
    NotificationView = (function(_super) {
      __extends(NotificationView, _super);

      function NotificationView() {
        _ref1 = NotificationView.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      NotificationView.prototype.tagName = 'div';

      NotificationView.prototype.className = 'notification';

      NotificationView.prototype.events = {
        "click .close": function() {
          return this.model.destroy();
        }
      };

      NotificationView.prototype.render = function() {
        var msg, text, _ref2;
        (_ref2 = this.el.classList).add.apply(_ref2, this.model.get('classes'));
        this.el.innerHTML = "<button class=\"close\">&times;</button>\n<h1>" + (this.model.get('title')) + "</h1>";
        if (typeof (msg = this.model.get('message')) === 'string') {
          text = msg;
          (msg = document.createElement('p')).appendChild(document.createTextNode(text));
        }
        return this.el.appendChild(msg);
      };

      NotificationView.prototype.initialize = function() {
        _.bindAll(this);
        this.model.view = this;
        p('init NotificationView');
        this.model.bind('change:title change:message change:classes change:message_is_html', this.render);
        return this.render();
      };

      return NotificationView;

    })(Backbone.View);
    Notifications = (function(_super) {
      __extends(Notifications, _super);

      function Notifications() {
        _ref2 = Notifications.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      Notifications.prototype.model = Notification;

      /**
      		 * close all the notifications in the collection. triggered when _close_all
      	       button is clicked
      	     * @private
      */


      Notifications.prototype._close_all = function() {
        p('Notifications _close_all');
        this.slice(0).forEach(function(notification) {
          notification.destroy();
        });
        p(this);
      };

      Notifications.prototype.initialize = function() {
        return _.bindAll(this);
      };

      return Notifications;

    })(Backbone.Collection);
    NotificationsView = (function(_super) {
      __extends(NotificationsView, _super);

      function NotificationsView() {
        _ref3 = NotificationsView.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      NotificationsView.prototype.tagName = 'div';

      NotificationsView.prototype.className = 'thalam_container';

      NotificationsView.prototype.events = {
        'click .close_all': function() {
          return this.collection._close_all();
        }
      };

      NotificationsView.prototype.render = function() {
        p('render NotificationsView');
        p(this._close_all_button);
        if (this.collection.length > 1) {
          return this._close_all_button.classList.remove('hide');
        } else {
          return this._close_all_button.classList.add('hide');
        }
      };

      /**
      		 * create a view for new notifications
      		 * @private
      */


      NotificationsView.prototype._add_notification = function(notification) {
        var notification_view;
        p('NotificationsView _add_notification');
        notification_view = new NotificationView({
          model: notification
        });
        return $(this.notification_container).append(notification_view.el);
      };

      NotificationsView.prototype.initialize = function() {
        _.bindAll(this);
        this.collection.view = this;
        p('init NotificationsView');
        this.el.innerHTML = '<div class="notification_container"></div>\n<button class="close_all">close all</button>';
        this._close_all_button = this.$el.find('.close_all')[0];
        this.notification_container = this.$el.find('.notification_container')[0];
        this.render();
        this.collection.on({
          'add remove': this.render,
          'add': this._add_notification
        });
      };

      return NotificationsView;

    })(Backbone.View);
    return {
      Notifications: Notifications,
      NotificationsView: NotificationsView
    };
  });

}).call(this);
