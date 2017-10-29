// the users class
class Users {

	constructor(){
		// set he users array
		this.users = [];
	}

	/**
	 * Method to add an user	
	 * @param {string} id the user id
	 * @param {string} name the user name
	 * @param {string} room the room name where the user joined
	 * @returns user
	 * @private
	*/
	addUser (id, name, room) {
		// create a user object
		const user = { id, name, room };
		// add the user to the users array
		this.users.push( user );
		// return the new user
		return user;
	}


	/**
	 * Method to get the users from a pecific room
	 * @param {string} room the room name
	 * @public
	*/
	getUsersList (room) {
		// create an array with all the 
		const roomUsers = this.users.filter( user => user.room === room );
		// now we only need the users names, not the rest of the information
		const usersNames = roomUsers.map( user => user.name);
		return usersNames;
	} // get users list


	/**
	 * Method to find a single user by ID.	
	 * @param {string} id the user id
	 * @returns {object} resultUser
	 * @public
	*/
	getUser (id) {
		// find a user 
		const resultUser = this.users.filter( user => user.id === id);
		// return the first element of the array
		return resultUser[0];
	}

	
	/**
	 * Method to remove a user from the array
	 * @param {string} id the id of the user to be removed
	 * @returns {object} removedUser
	 * @public
	*/
	removeUser (id) {
		// get the user for that particular id
		const resultUser = this.users.filter( user => user.id === id);
		// now create an array without the user with the pass id
		this.users = this.users.filter( user => user.id !== id);
		// return the removed user
		return resultUser[0];
	}

} // users class

module.exports = { Users };
