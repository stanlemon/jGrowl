
(($) ->
	
	# jGrowl Wrapper - Establish a base jGrowl Container for compatibility with older releases.
	$.jGrowl = (m, o) ->
		# Create a notification on the container.
		$("#jGrowl").jGrowl m, o

	# Raise jGrowl Notification on a jGrowl Container
	$.fn.jGrowl = (m, o) ->
		if $.isFunction(@each)
			args = arguments
			return @each(->
				self = this
				
				# Create a jGrowl Instance on the Container if it does not exist
				if $(this).data("jGrowl.instance") is `undefined`
					$(this).data "jGrowl.instance", $.extend(new $.fn.jGrowl(),
						notifications: []
						element: null
						interval: null
					)
					$(this).data("jGrowl.instance").startup this
				
				# Optionally call jGrowl instance methods, or just raise a normal notification
				if $.isFunction($(this).data("jGrowl.instance")[m])
					$(this).data("jGrowl.instance")[m].apply $(this).data("jGrowl.instance"), $.makeArray(args).slice(1)
				else
					$(this).data("jGrowl.instance").create m, o
			)

	$.extend $.fn.jGrowl::,
		
		# Default JGrowl Settings
		defaults:
			pool: 0
			header: ""
			group: ""
			sticky: false
			glue: "before"
			check: 250
			life: 7000
			closeDuration: "normal"
			openDuration: "normal"
			easing: "swing"
			closer: true
			closeTemplate: "&times;"
			closerTemplate: "<div>close all</div>"

			beforeOpen: (e, m, o) ->

			afterOpen: (e, m, o) ->

			open: (e, m, o) ->

			beforeClose: (e, m, o) ->

			close: (e, m, o) ->

			animateOpen:
				opacity: "show"

			animateClose:
				opacity: "hide"

		notifications: []
		
		# jGrowl Container Node
		element: null
		
		# Interval Function
		interval: null
		
		# Create a Notification
		create: (message, o) ->
			o = $.extend({}, @defaults, o)
			@notifications.push
				message: message
				options: o

		render: (notification) ->
			self = this
			message = notification.message
			o = notification.options
			notification = $(
				"""
				<div class="jGrowl-notification #{o.group}">
					<div class="jGrowl-close">#{o.closeTemplate}</div>
					<div class="jGrowl-header">#{o.header}</div>
					<div class="jGrowl-message">#{message}</div>
				</div>
				"""
			)
			.data("jGrowl", o)
			.addClass(o.theme)
			.children("div.jGrowl-close")
			.bind("click.jGrowl", ->
				$(this).parent().trigger "jGrowl.close"
			).parent()
			
			# Notification Actions
			
			# Fixes some anti-aliasing issues with IE filters.
			# Happens when a notification is closing before it's open.
			
			# Pause the notification, lest during the course of animation another close event gets called.
			$(notification).bind("mouseover.jGrowl", ->
				$("div.jGrowl-notification", self.element).data "jGrowl.pause", true
			).bind("mouseout.jGrowl", ->
				$("div.jGrowl-notification", self.element).data "jGrowl.pause", false
			).bind("jGrowl.beforeOpen", ->
				$(this).trigger "jGrowl.open"  unless o.beforeOpen.apply(notification, [notification, message, o, self.element]) is false
			).bind("jGrowl.open", ->
				unless o.open.apply(notification, [notification, message, o, self.element]) is false
					if o.glue is "after"
						$("div.jGrowl-notification:last", self.element).after notification
					else
						$("div.jGrowl-notification:first", self.element).before notification
					$(this).animate o.animateOpen, o.openDuration, o.easing, ->
						@style.removeAttribute "filter" if $.browser.msie and (parseInt($(this).css("opacity"), 10) is 1 or parseInt($(this).css("opacity"), 10) is 0)
						$(this).data("jGrowl").created = new Date()  if $(this).data("jGrowl")?
						$(this).trigger "jGrowl.afterOpen"

			).bind("jGrowl.afterOpen", ->
				o.afterOpen.apply notification, [notification, message, o, self.element]
			).bind("jGrowl.beforeClose", ->
				$(this).trigger "jGrowl.close"  unless o.beforeClose.apply(notification, [notification, message, o, self.element]) is false
			).bind("jGrowl.close", ->
				$(this).data "jGrowl.pause", true
				$(this).animate o.animateClose, o.closeDuration, o.easing, ->
					if $.isFunction(o.close)
						$(this).remove()  if o.close.apply(notification, [notification, message, o, self.element]) isnt false
					else
						$(this).remove()

			).trigger "jGrowl.beforeOpen"
			
			# Add a Global Closer if more than one notification exists
			if $("div.jGrowl-notification:parent", self.element).size() > 1 and $("div.jGrowl-closer", self.element).size() is 0 and @defaults.closer isnt false
				$(@defaults.closerTemplate).addClass("jGrowl-closer " + @defaults.themeState).addClass(@defaults.theme).prependTo(self.element).animate(@defaults.animateOpen, @defaults.speed, @defaults.easing).bind "click.jGrowl", ->
					$(this).siblings().trigger "jGrowl.beforeClose"
					self.defaults.closer.apply $(this).parent()[0], [$(this).parent()[0]]  if $.isFunction(self.defaults.closer)


		
		# Update the jGrowl Container, removing old jGrowl notifications
		update: ->
			$(@element).find("div.jGrowl-notification:parent").each ->
				
				# Pause the notification, lest during the course of animation another close event gets called.
				$(this).trigger "jGrowl.beforeClose" if (
					$(this).data("jGrowl")? and
					$(this).data("jGrowl").created? and
					($(this).data("jGrowl").created.getTime() + parseInt($(this).data("jGrowl").life)) < (new Date()).getTime() and
					$(this).data("jGrowl").sticky isnt true and
					(not $(this).data("jGrowl.pause")? or $(this).data("jGrowl.pause") isnt true)
				)

			@render @notifications.shift() if (
				@notifications.length > 0 and (
					@defaults.pool is 0 or
					$(@element).find("div.jGrowl-notification:parent").size() < @defaults.pool
				)
			)
			if $(@element).find("div.jGrowl-notification:parent").size() < 2
				$(@element).find("div.jGrowl-closer").animate @defaults.animateClose, @defaults.speed, @defaults.easing, ->
					$(this).remove()


		
		# Setup the jGrowl Notification Container
		startup: (e) ->
			@element = $(e).addClass("jGrowl").append('<div class="jGrowl-notification"></div>')
			@interval = setInterval(->
				$(e).data("jGrowl.instance").update()
			, parseInt(@defaults.check))

		
		# Shutdown jGrowl, removing it and clearing the interval
		shutdown: ->
			$(@element).removeClass("jGrowl").find("div.jGrowl-notification").remove()
			clearInterval @interval

		close: ->
			$(@element).find("div.jGrowl-notification").each ->
				$(this).trigger "jGrowl.beforeClose"


	
	# Reference the Defaults Object for compatibility with older versions of jGrowl
	$.jGrowl.defaults = $.fn.jGrowl::defaults
) jQuery