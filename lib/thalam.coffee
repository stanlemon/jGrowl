define ['jquery', 'underscore', 'backbone'], ($, _, BackBone) ->
	p = (text) -> console.log text

	class Notification extends Backbone.Model
		title: ""
		message: ""
		message_is_html: false

		# list of classes (used for theming)
		classes: ['notification']

		# if timeout = 0 then it will not have a timeout (sticky)
		# timeouts can be set and changed even after a notification is made
		timeout: 1000

		###*
		 * set a timout that will trigger model.destroy(). triggered by
	       change:timeout event
		 * @private
		###
		_set_timeout: ->
			window.clearTimeout @_timeout_id
			@_timeout_id = window.setTimeout(
				(notification) => notification.destroy(),
				@timeout,
				@,
			)

		###*
		 * delete model and view. triggered by model.destroy()
		 * @private
		###
		_close: () ->
			@view.remove()

		initialize: () ->
			_.bindAll @
			p 'init Notification'
			@bind('destroy', @_close)
			@bind('change:timeout', @_set_timeout)


	class NotificationView extends Backbone.View
		tagName: 'div'

		events:
			"click .close": -> @model.destroy,

		render: ->
			# build string for notification
			@className = @model.classes.join ' '
			p 'classes:' + @className
			
			message_tag = if @model.message_is_html then 'div' else 'p'

			@el.innerHTML = """
				<div class="close">&times;</div>
				<h1>#{@model.title}</h1>
				<#{message_tag} class="message">
					#{@model.message}
				</#{message_tag}>
			"""

			return @ # so render().el can be appended to NotificationsView

		initialize: ->
			_.bindAll @
			@model.view = @;
			p 'init NotificationView'
			@model.bind('change:title change:message change:classes change:message_is_html', @render)

			@render()
			
			setTimeout(
				(notification_element) =>
					notification_element.classList.add('open') # used by css to trigger animation/transition
				,
				20,
				@el,
			)


	class Notifications extends Backbone.Collection
		model: Notification

		events:
			'add': -> p 'added'

		###*
		 * close all the notifications in the collection. triggered when close_all
	       button is clicked
		###
		close_all: ->
			p 'Notifications close_all'
			@each(
				(notification) ->
					notification.destroy()
			)

		initialize: ->
			_.bindAll @


	class NotificationsView extends Backbone.View
		tagName: 'div'
		className: 'thalam_container'

		events:
			'click .close_all': -> @collection.close_all()

		render: ->
			p 'render NotificationsView'
			
			@close_all_button.css(
				display: if @collection.length > 1 then 'block' else 'none'
			)

		###*
		 * create a view for new notifications
		 * @private
		###
		_add_notification: (notification) ->
			p 'NotificationsView _add_notification'
			p notification
			notification_view = new NotificationView model: notification
			@$el.notification_container.append notification_view.el

		initialize: ->
			_.bindAll @
			@collection.view = @

			p 'init NotificationsView'
			@el.innerHTML = '''
				<div class="notification_container"></div>
				<button class="close_all">close all</button>
			'''
			@close_all_button = @$el.find('.close_all') 
			@notification_container =  @$el.find('.notification_container') 
			@render()

			@collection.on(
				'change:length', @render
				'add', @_add_notification
			)
			return

	return {
		Notifications: Notifications
		NotificationsView: NotificationsView
	}
