define ['jquery', 'underscore', 'backbone'], ($, _, BackBone) ->
	p = (text) -> console.log text

	class Notification extends Backbone.Model
		defaults:
			title: ""
			message: ""

			# list of extra classes, used for themes
			classes: []

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
		className: 'notification'

		events:
			"click .close": -> @model.destroy()

		render: ->
			@el.classList.add(@model.get('classes')...)
			
			@el.innerHTML = """
				<button class="close">&times;</button>
				<h1>#{@model.get 'title'}</h1>
			"""

			# if it's a string, make it into a <p>, otherwise assume it's a
			# DOM element
			if typeof (msg = @model.get 'message') is 'string'
				text = msg
				(msg = document.createElement('p')).appendChild(
					document.createTextNode(text)
				)

			@el.appendChild msg

		initialize: ->
			_.bindAll @
			@model.view = @;
			p 'init NotificationView'
			@model.bind('change:title change:message change:classes change:message_is_html', @render)

			@render()


	class Notifications extends Backbone.Collection
		model: Notification

		###*
		 * close all the notifications in the collection. triggered when _close_all
	       button is clicked
	     * @private
		###
		_close_all: ->
			p 'Notifications _close_all'
			
			# need to copy the array first, otherwise array indices get screwed up as the models are removed
			@[...].forEach (notification) ->
				notification.destroy()
				return
			p @
			return


		initialize: ->
			_.bindAll @


	class NotificationsView extends Backbone.View
		tagName: 'div'
		className: 'thalam_container'

		events:
			'click .close_all': -> @collection._close_all()

		render: ->
			p 'render NotificationsView'
			p @_close_all_button
			
			if @collection.length > 1
				@_close_all_button.classList.remove('hide')
			else
				@_close_all_button.classList.add('hide')

		###*
		 * create a view for new notifications
		 * @private
		###
		_add_notification: (notification) ->
			p 'NotificationsView _add_notification'
			notification_view = new NotificationView model: notification
			$(@notification_container).append notification_view.el

		initialize: ->
			_.bindAll @
			@collection.view = @

			p 'init NotificationsView'
			@el.innerHTML = '''
				<div class="notification_container"></div>
				<button class="close_all">close all</button>
			'''

			@_close_all_button = @$el.find('.close_all')[0]
			@notification_container =  @$el.find('.notification_container')[0]
			@render()

			@collection.on(
				'add remove': @render
				'add': @_add_notification
			)
			return

	return {
		Notifications: Notifications
		NotificationsView: NotificationsView
	}
