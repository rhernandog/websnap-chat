// get expect
const expect = require("expect");

// get the users class methods
const { Users } = require("./../utils/users");

// Users methods block
describe("Users Class Test", () => {
	// create dummy seed data for the tests
	let seedUsers;
	
	// create an instance of the users class with some data before the test runs
	beforeEach( () => {
		seedUsers = new Users();
		seedUsers.users = [
			{ id: "1", name: "Homer Jay", room: "Simpsons" },
			{ id: "2", name: "Ned Flanders", room: "Flanderinos" },
			{ id: "3", name: "El Barto", room: "Simpsons" }
		];
	}); // before each

	// add new user test
	it("Should add a new user", () => {
		// users array
		const testUsers = new Users();
		// store the user data for the test
		const userData = {
			id: "123abc",
			name: "Homer Jay",
			room: "Simpsons"
		};
		// create a new user
		const myUser = testUsers.addUser( userData.id, userData.name, userData.room );
		// assertions for the class instance
		expect(testUsers.users).toBeA("array").toEqual([userData]);
		expect(testUsers.users.length).toBe(1);
		// assertions for the created user
		expect(myUser).toBeA("object");
		expect(myUser.id).toBe(userData.id);
		expect(myUser.name).toBe(userData.name);
		expect(myUser.room).toBe(userData.room);
	});
	// get a list of the users in a room
	it("Should return the users in a specific room", () => {
		const testUsers = seedUsers.getUsersList("Simpsons");
		// test users should be an array with two elements
		expect(testUsers).toBeA("array");
		expect(testUsers.length).toBe(2);
	});

	// look for a single user
	it("Should return a single user by a specific id", () =>{
		// create a test user
		const testUser = seedUsers.getUser("1");
		// assertions
		expect(testUser).toBeA("object");
		expect(testUser.name).toBe("Homer Jay");
	});
	// it should not return a user for a wrong id
	it("Should not return a user for a wrong id", () => {
		const resultUser = seedUsers.getUser("5");
		expect(resultUser).toBe(undefined);
	});

	// remove a single user
	it("Should remove a user for the pass id", () => {
		const removedUser = seedUsers.removeUser("1");
		expect(removedUser).toBeA("object");
		expect(removedUser.id).toBe("1");
		expect( seedUsers.users.length ).toBe(2);
	});
	// dont remove a user if id is wrong
	it("Should not remove any user for a bad ID", () => {
		const removedUser = seedUsers.removeUser("10");
		// assertions
		expect(removedUser).toBe(undefined);
		expect( seedUsers.users.length ).toBe(3);
	});
});
