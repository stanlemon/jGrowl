(function() {
  (function($) {
    $.jGrowl = function(m, o) {
      return $("#jGrowl").jGrowl(m, o);
    };
    $.fn.jGrowl = function(m, o) {
      var args;
      if ($.isFunction(this.each)) {
        args = arguments;
        return this.each(function() {
          var self;
          self = this;
          if ($(this).data("jGrowl.instance") === undefined) {
            $(this).data("jGrowl.instance", $.extend(new $.fn.jGrowl(), {
              notifications: [],
              element: null,
              interval: null
            }));
            $(this).data("jGrowl.instance").startup(this);
          }
          if ($.isFunction($(this).data("jGrowl.instance")[m])) {
            return $(this).data("jGrowl.instance")[m].apply($(this).data("jGrowl.instance"), $.makeArray(args).slice(1));
          } else {
            return $(this).data("jGrowl.instance").create(m, o);
          }
        });
      }
    };
    $.extend($.fn.jGrowl.prototype, {
      defaults: {
        pool: 0,
        header: "",
        group: "",
        sticky: false,
        glue: "before",
        check: 250,
        life: 7000,
        closeDuration: "normal",
        openDuration: "normal",
        easing: "swing",
        closer: true,
        closeTemplate: "&times;",
        closerTemplate: "<div>close all</div>",
        beforeOpen: function(e, m, o) {},
        afterOpen: function(e, m, o) {},
        open: function(e, m, o) {},
        beforeClose: function(e, m, o) {},
        close: function(e, m, o) {},
        animateOpen: {
          opacity: "show"
        },
        animateClose: {
          opacity: "hide"
        }
      },
      notifications: [],
      element: null,
      interval: null,
      create: function(message, o) {
        o = $.extend({}, this.defaults, o);
        return this.notifications.push({
          message: message,
          options: o
        });
      },
      render: function(notification) {
        var message, o, self;
        self = this;
        message = notification.message;
        o = notification.options;
        notification = $("<div class=\"jGrowl-notification " + o.group + "\">\n	<div class=\"jGrowl-close\">" + o.closeTemplate + "</div>\n	<div class=\"jGrowl-header\">" + o.header + "</div>\n	<div class=\"jGrowl-message\">" + message + "</div>\n</div>").data("jGrowl", o).addClass(o.theme).children("div.jGrowl-close").bind("click.jGrowl", function() {
          return $(this).parent().trigger("jGrowl.close");
        }).parent();
        $(notification).bind("mouseover.jGrowl", function() {
          return $("div.jGrowl-notification", self.element).data("jGrowl.pause", true);
        }).bind("mouseout.jGrowl", function() {
          return $("div.jGrowl-notification", self.element).data("jGrowl.pause", false);
        }).bind("jGrowl.beforeOpen", function() {
          if (o.beforeOpen.apply(notification, [notification, message, o, self.element]) !== false) {
            return $(this).trigger("jGrowl.open");
          }
        }).bind("jGrowl.open", function() {
          if (o.open.apply(notification, [notification, message, o, self.element]) !== false) {
            if (o.glue === "after") {
              $("div.jGrowl-notification:last", self.element).after(notification);
            } else {
              $("div.jGrowl-notification:first", self.element).before(notification);
            }
            return $(this).animate(o.animateOpen, o.openDuration, o.easing, function() {
              if ($.browser.msie && (parseInt($(this).css("opacity"), 10) === 1 || parseInt($(this).css("opacity"), 10) === 0)) {
                this.style.removeAttribute("filter");
              }
              if ($(this).data("jGrowl") != null) {
                $(this).data("jGrowl").created = new Date();
              }
              return $(this).trigger("jGrowl.afterOpen");
            });
          }
        }).bind("jGrowl.afterOpen", function() {
          return o.afterOpen.apply(notification, [notification, message, o, self.element]);
        }).bind("jGrowl.beforeClose", function() {
          if (o.beforeClose.apply(notification, [notification, message, o, self.element]) !== false) {
            return $(this).trigger("jGrowl.close");
          }
        }).bind("jGrowl.close", function() {
          $(this).data("jGrowl.pause", true);
          return $(this).animate(o.animateClose, o.closeDuration, o.easing, function() {
            if ($.isFunction(o.close)) {
              if (o.close.apply(notification, [notification, message, o, self.element]) !== false) {
                return $(this).remove();
              }
            } else {
              return $(this).remove();
            }
          });
        }).trigger("jGrowl.beforeOpen");
        if ($("div.jGrowl-notification:parent", self.element).size() > 1 && $("div.jGrowl-closer", self.element).size() === 0 && this.defaults.closer !== false) {
          return $(this.defaults.closerTemplate).addClass("jGrowl-closer " + this.defaults.themeState).addClass(this.defaults.theme).prependTo(self.element).animate(this.defaults.animateOpen, this.defaults.speed, this.defaults.easing).bind("click.jGrowl", function() {
            $(this).siblings().trigger("jGrowl.beforeClose");
            if ($.isFunction(self.defaults.closer)) {
              return self.defaults.closer.apply($(this).parent()[0], [$(this).parent()[0]]);
            }
          });
        }
      },
      update: function() {
        $(this.element).find("div.jGrowl-notification:parent").each(function() {
          if (($(this).data("jGrowl") != null) && ($(this).data("jGrowl").created != null) && ($(this).data("jGrowl").created.getTime() + parseInt($(this).data("jGrowl").life)) < (new Date()).getTime() && $(this).data("jGrowl").sticky !== true && (($(this).data("jGrowl.pause") == null) || $(this).data("jGrowl.pause") !== true)) {
            return $(this).trigger("jGrowl.beforeClose");
          }
        });
        if (this.notifications.length > 0 && (this.defaults.pool === 0 || $(this.element).find("div.jGrowl-notification:parent").size() < this.defaults.pool)) {
          this.render(this.notifications.shift());
        }
        if ($(this.element).find("div.jGrowl-notification:parent").size() < 2) {
          return $(this.element).find("div.jGrowl-closer").animate(this.defaults.animateClose, this.defaults.speed, this.defaults.easing, function() {
            return $(this).remove();
          });
        }
      },
      startup: function(e) {
        this.element = $(e).addClass("jGrowl").append('<div class="jGrowl-notification"></div>');
        return this.interval = setInterval(function() {
          return $(e).data("jGrowl.instance").update();
        }, parseInt(this.defaults.check));
      },
      shutdown: function() {
        $(this.element).removeClass("jGrowl").find("div.jGrowl-notification").remove();
        return clearInterval(this.interval);
      },
      close: function() {
        return $(this.element).find("div.jGrowl-notification").each(function() {
          return $(this).trigger("jGrowl.beforeClose");
        });
      }
    });
    return $.jGrowl.defaults = $.fn.jGrowl.prototype.defaults;
  })(jQuery);

}).call(this);
