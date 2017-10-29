// get the path module
const path = require("path");
// get the http module
const http = require("http");

// get express
const express = require("express");
// get socket.io
const socketio = require("socket.io");
// get moment to format the time
const moment = require("moment");

// store the path to the public folder
const publicPath = path.join( __dirname, "../public" );

// get the create msg method
const { generateMessage, sendLocationData } = require("./utils/message");
// get the string validator
const { isString } = require("./utils/validation.js");
// get the users class
const { Users } = require("./utils/users");
// create the express apap
const app = express();
// create the http server to work with socketio
const server = http.createServer( app );
// create the websocket server instance
const io = socketio( server, {forceNew: true} );
// create an instance of the users class
const chatUsers = new Users();

// set the node environment
const env = process.env.NODE_ENV || "development";
// set the port and DB path depending on the working environment
if ( env === "development" ) {
	// set the development port
	process.env.PORT = 3000;
	// set the route to the DB
} else if ( env === "test" ) {
	// set the environment port
	process.env.PORT = 3000;
	// set the route to the DB
}

// set the app port, whether is defined in this file or in the working environment
const port = process.env.PORT;




/*
*******************************************************************************************
		HOME ROUTE
*******************************************************************************************
*/
app.use( "/", express.static(publicPath) );





/*
*******************************************************************************************
		SOCKET IO METHODS
*******************************************************************************************
*/
// connection listener
io.on("connection", socket => {
	// set the join event listener
	socket.on("join", (params, callback) => {
		
		// check if the params are not strings
		if ( !isString(params.displayName) || !isString(params.chatRoom) ) {
			// either the name or the room are not strings
			return callback("Name and room name are required");
		}
		// the name and room are valid, join the chat room
		socket.join(params.chatRoom);

		// after the user has joined add it to the users instance
		// first remove any user with that particular id
		chatUsers.removeUser(socket.id);
		chatUsers.addUser(socket.id, params.displayName, params.chatRoom);
		// emit the event to update the users list to all the users in the room
		// including the one that just joined. get the list of all the online
		// users in the room.
		io.to(params.chatRoom).emit("updateUsersList", chatUsers.getUsersList(params.chatRoom));

		// once the user has joined the room, send the greet message.
		// emit welcome msg to the user in this socket
		socket.emit("clientMsg", generateMessage("AdminBot", `Welcome to our application ${params.displayName}!!!`));
		/* when a user connects to the server send a message to the 
		 * other users indicating that the user connected. Also send
		 * a greeting message only to the user.
		*/
		// inform the users in other sockets that a new user has joined the app
		socket.broadcast.to(params.chatRoom).emit("clientMsg", generateMessage("AdminBot", `User ${params.displayName}, has joined the chatroom.`));
		// use the callback but with no arguments, that means there are no errors.
		callback();
	}); // socket join

	// check for the socket (user) for disconnection
	socket.on("disconnect", () => {
		// the remove user method returns the user object with the chat room
		// the user was connected to.
		const removedUser = chatUsers.removeUser(socket.id);
		// check if the user is defined or not. the user is undefined when the login
		// info is not correct and the server returns the user to the login page
		if( !removedUser ) { return; }
		// with the user info send the updated list to the other online users
		io.to( removedUser.room ).emit("updateUsersList", chatUsers.getUsersList(removedUser.room));
		// now inform the other users that this user left the room
		io.to(removedUser.room).emit("clientMsg", generateMessage("AdminBot", `${removedUser.name} has left the building!!!`));
	}); // socket disconnect listener

	// listen to the geolocation event
	socket.on("ceateLocationMsg", location => {
		// store the user sending the location
		const targetUser = chatUsers.getUser(socket.id);
		if ( targetUser !== undefined ) {
			// emit the location message to the users connected to the room
			io
				// target the specific room
				.to( targetUser.room )
				// send the message
				.emit( "generateLocation", sendLocationData(location.username, location.lat, location.lng) );
		}
	});

	// listen to a new user message
	socket.on("clientMsg", msg => {
		// store the user to access it through the function
		const targetUser = chatUsers.getUser(socket.id);
		// first check that the user exists on the users list
		// the get user method should return a user object
		// also check that the message is not emtpy or invalid
		if (targetUser !== undefined && isString(msg.text) ) {
			io
				// emit this to the specific room
				.to( targetUser.room )
				// create a new message for the room with the data sent by the user
				.emit( "clientMsg", generateMessage(msg.from, msg.text) );
		}
	});

}); // io connection listener





// init the server
server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

module.exports = { app };
