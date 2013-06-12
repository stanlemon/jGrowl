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
        message_is_html: false,
        classes: ['notification'],
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

      NotificationView.prototype.events = {
        "click .close": function() {
          return this.model.destroy();
        }
      };

      NotificationView.prototype.render = function() {
        var message_tag;
        this.className = this.model.get('classes').join(' ');
        p('classes: ' + this.className);
        message_tag = this.model.get('message_is_html') ? 'div' : 'p';
        return this.el.innerHTML = "<button class=\"close\">&times;</button>\n<h1>" + (this.model.get('title')) + "</h1>\n<" + message_tag + " class=\"message\">\n	" + (this.model.get('message')) + "\n</" + message_tag + ">";
      };

      NotificationView.prototype.initialize = function() {
        var _this = this;
        _.bindAll(this);
        this.model.view = this;
        p('init NotificationView');
        this.model.bind('change:title change:message change:classes change:message_is_html', this.render);
        this.render();
        return setTimeout(function(notification_element) {
          return notification_element.classList.add('open');
        }, 20, this.el);
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
      		 * close all the notifications in the collection. triggered when close_all
      	       button is clicked
      */


      Notifications.prototype.close_all = function() {
        p('Notifications close_all');
        return this.each(function(notification) {
          return notification.destroy();
        });
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
          return this.collection.close_all();
        }
      };

      NotificationsView.prototype.render = function() {
        p('render NotificationsView');
        return this.close_all_button.css({
          display: this.collection.length > 1 ? 'block' : 'none'
        });
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
        return this.notification_container.append(notification_view.el);
      };

      NotificationsView.prototype.initialize = function() {
        _.bindAll(this);
        this.collection.view = this;
        p('init NotificationsView');
        this.el.innerHTML = '<div class="notification_container"></div>\n<button class="close_all">close all</button>';
        this.close_all_button = this.$el.find('.close_all');
        this.notification_container = this.$el.find('.notification_container');
        this.render();
        this.collection.on({
          'change:length': this.render,
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
