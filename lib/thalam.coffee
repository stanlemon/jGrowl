define ['jquery', 'underscore', 'backbone'], ($, _, BackBone) ->
	p = (text) -> console.log text

	class Notification extends Backbone.Model
		defaults:
			title: ""
			message: ""
			message_is_html: false

			# list of classes (used for theming)
			classes: ['notification']

			# if timeout = 0 then it will not have a timeout (sticky)
			# timeouts can be set and changed even after a notification is made
			timeout: 0

		###*
		 * set a timout that will trigger model.destroy(). triggered by
	       change:timeout event
		 * @private
		###
		_set_timeout: ->
			p '_set_timeout Notification'
			clearTimeout @_timeout_id
			if @get('timeout') isnt 0
				@_timeout_id = setTimeout(
					((notification) ->
						notification.destroy()
						return
					),
					@get('timeout'),
					@,
				)
			return

		###*
		 * delete model and view. triggered by model.destroy()
		 * @private
		###
		_close: () ->
			p '_close Notification'
			@view.remove()

		initialize: () ->
			_.bindAll @
			p 'init Notification'
			@on(
				'destroy': @_close
				'change:timeout': @_set_timeout
			)
			@_set_timeout()


	class NotificationView extends Backbone.View
		tagName: 'div'

		events:
			"click .close": -> @model.destroy()

		render: ->
			@className = @model.get('classes').join ' '
			p 'classes: ' + @className
			
			message_tag = if @model.get 'message_is_html' then 'div' else 'p'

			@el.innerHTML = """
				<button class="close">&times;</button>
				<h1>#{@model.get 'title'}</h1>
				<#{message_tag} class="message">
					#{@model.get 'message'}
				</#{message_tag}>
			"""

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
			notification_view = new NotificationView model: notification
			@notification_container.append notification_view.el

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
				'change:length': @render
				'add': @_add_notification
			)
			return

	return {
		Notifications: Notifications
		NotificationsView: NotificationsView
	}
