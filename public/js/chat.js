(function($){ $(function(){
	

	/**
	 * Method to create a new message.	
	 * called when the server emits an event for a new message from any user,
	 * takes the content sent by the server and puts the message in the display
	 * element on the DOM.
	 * @param {string} username: the username passed by the server 
	 * @param {string} text: the message text passed by the server
	 * @returns {string} the html ready to be rendered
	*/
	/* function _addNewMessage(username, text, time) {
		return '<li class="list-group-item"><h5><span class="badge badge-dark">' + username + '</span>&nbsp;<span class="badge badge-light">' + moment(time).format("MM/DD/YYYY h:mm a") +'</span></h5>' + text + '</li>';
	}; */

	/* After the user logs in, get the username and the chat room from the url
	 * using regular expressions
	*/
	// array with the url params for name and chat room
	var urlParams = window.location.href.match(/=(.*)\&|=(.*)/g);
	// set the display name and chat room
	var displayName = urlParams[0].slice(1, -1).replace(/\+/g,' ');
	var chatRoom = urlParams[1].slice(1).replace(/\+/g,' ');

	// messages display parent wrapper
	var messagesDisplayWrapper = $("#messages-wraper");
	// message display element
	var messagesContainer = $("#msg-display");
	// the users list
	var usersList = $("#users-list");
	
	/**
	 * Method to auto-scroll the screen after adding a new message.
	*/
	var scrollBottom = function () {
		//
		// get the hieght of the messages container and it's parent
		var messagesContainerHeight = messagesContainer.outerHeight();
		var messageDisplayWrapHeight = messagesDisplayWrapper.outerHeight();
		// height of the last message
		var lastMsgHeight = $(".single-message:last").outerHeight();
		// get the current scroll position
		var messagesDisplayWrapScroll = messagesDisplayWrapper.scrollTop();
		/* If the msg display wrapper height plus it's scroll position is
		 * equal to the messages container height, then scroll to the bottom
		*/
		if (messageDisplayWrapHeight + messagesDisplayWrapScroll <= messagesContainerHeight + lastMsgHeight && messagesContainerHeight - (messagesDisplayWrapScroll + messageDisplayWrapHeight) <= lastMsgHeight * 2 ) {
			console.log( "scroll to bottom" );
			// console.log( messagesDisplayWrapScroll, messagesContainerHeight, messageDisplayWrapHeight, lastMsgHeight );
			console.log(messagesContainerHeight - (messagesDisplayWrapScroll + messageDisplayWrapHeight), lastMsgHeight * 2 );
			messagesDisplayWrapper.scrollTop( messagesContainerHeight - messageDisplayWrapHeight );
		}
	};

	// create a variable to hold the display name of the user
	var displayUserName;


	// create the socket instance
	var socket = io();

	socket.on("connect", function () {
		// emit the join event to tell the server the user display
		// and chat room the user will join
		var params = $.deparam(window.location.search);

		// set the display user name
		displayUserName = params.displayName;

		socket.emit("join", params, function(error){
			// check if there is an error
			if( error ) {
				alert(error);
				// send the user back to the login page
				window.location.href = "/";
			} else {}
		});

	});

	socket.on( "disconnect", function(){
		console.log( "disconnected from server" );
	});



	console.log("connected to server");
	// in case of a server restart, remove all previous listeners to avoid duplicated
	// messages and notifications.
	// socket.removeAllListeners();
	/* Once we're connected to thte server, start listening for
	 * the messages sent by other users connected to the server as
	 * well.
	*/
	/* New Message listener.	
	 * When the server emits a new message event, call the event listener
	 * and inside that call the method to create a new message element in the
	 * DOM and attach it to the message container.
	*/
	socket.on("clientMsg", function (msg) {
		var template = $("#message-template").html();
		// render the template
		var html = Mustache.render(template, {
			from: msg.from, text: msg.text, time: moment(msg.createdAt).format("MM/DD/YYYY h:mm a")
		});
		// add the template to the message container
		messagesContainer.append(html);
		// after adding the new message scroll to the bottom
		scrollBottom();
		// create the HTML for the new message
		// var newMessage = _addNewMessage(msg.from, msg.text, msg.createdAt);
		// add the new message to the DOM
		// messagesContainer.append(newMessage);
	});

	// listen to the welcome event
	socket.on("greetUser", function (msg) {
		console.log(msg);
	});

	// listen to other users joining to the app
	socket.on("userJoined", function (data) {
		console.log(data);
	})


	/**
	 * Event listener to update users list.	
	 * @param {array} users the users array for the current room.
	 * @private
	*/
	socket.on( "updateUsersList", function(users){
		// update the dom list
		// remove all users
		usersList.html("");
		// add each user
		users.forEach( function(user){
			usersList.append( $("<li/>").addClass("list-group-item").text(user) );
		}); // users loop
	}); // update list listener


	/* CUSTOM EVENTS */
	// listener for new messages from the server
	socket.on( "serverMsg", function( msg ){
		console.log( "new message from the server!!" );
		console.log( msg );
	});







	/*
	*******************************************************************************************
			FORM CODE
	*******************************************************************************************
	*/
	var msgForm = $("#clientMsgForm");
	// message input
	var userMessageInput = $("#userMessage");

	// variables for the name and message
	var userName, userMessage;

	// submit code
	msgForm.submit(function(e){
		e.preventDefault();

		// with the values emit the socket event to the server
		socket.emit( "clientMsg", {
			from: displayUserName,
			text: userMessageInput.val()
		}, function(){
			// acknowlegdement callback passed to the server
			// this is called by the server once the message is received
			// letting the client know about that
			// console.log( "the message was received by the server." );
		});

		// after completing all the logic, clear the message input
		// the user name is not likely to change
		userMessageInput.val("");
	});





	/*
	*******************************************************************************************
			GEOLOCATION CODE
	*******************************************************************************************
	*/
	// share location button
	var locationBtn = $("#share-location");
	locationBtn.click(function(e){
		e.preventDefault();
		// check if geolocation is supported
		if ( !navigator.geolocation ) {
			return alert("Geolocation Not Supported");
		}

		locationBtn.attr("disabled", "disabled");

		navigator.geolocation.getCurrentPosition(
			// success
			function(position){
				// send the user's coordinates to the server
				socket.emit("ceateLocationMsg", {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					username: displayUserName
				});
				// enable the location button again
				locationBtn.removeAttr("disabled");
			},
			// error
			function(error){
				console.log( error );
				alert("Unable to get the location");
				// enable the location button again
				locationBtn.removeAttr("disabled");
			}
		);
	});

	// listen to the geolocation data send event from the server
	socket.on("generateLocation", function(geolocation){
		// get the template script
		var template = $("#location-template").html();
		// create the rendered template
		var userLocationLink = Mustache.render(template, {
			from: geolocation.user,
			time: moment(geolocation.createdAt).format("MM/DD/YYYY h:mm a"),
			url: geolocation.url
		});
		// add the html to the message board
		messagesContainer.append(userLocationLink);
		// after adding the new message scroll to the bottom
		scrollBottom();
	});

	
	
}); } )(jQuery);
