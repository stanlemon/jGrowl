# like all good projects, Thalam is a proper require.js module
require.config
	paths:
		jquery: '/components/jquery/jquery.min'
		underscore: '/components/underscore/underscore'
		backbone: '/components/backbone/backbone'
		thalam: '/lib/thalam'
	shim:
		underscore:
			exports: '_'
		backbone:
			deps: ['underscore', 'jquery']
			exports: 'Backbone'

require ['jquery', 'thalam'], ($, t) ->
	# yeah, I know that I shoudn't make globals, but it's just for this demo
	# and Thalam doesn't rely on it.
	window.Thalam = new t.NotificationsView(collection: new t.Notifications())

	# add the notification container to the DOM
	$('body').append(Thalam.el)

	# lets start by adding a notification
	Thalam.collection.add([
		title: 'blah'
		message: 'meh'
	])

	# our first notification didn't have any timeout, so it's sticky. this one
	# will die automatically after 3 seconds
	Thalam.collection.add([
		title: 'i\'m gonna die'
		message: 'cause i\'ve got a timeout' 
		timeout: 3000
	])

	return