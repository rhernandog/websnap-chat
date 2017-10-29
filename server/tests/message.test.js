// get expect
const expect = require("expect");

// get the generate message method
const { generateMessage, sendLocationData } = require("./../utils/message");

// set up a test message

const from = "elbarto@simpsons.com";
const text = "ay caramba, don't have a cow!!";


/* GENERATE MESSAGE DESCRIBE BLOCK */
describe("Generate Message Method", function() {
	// return a messago object 
	it("Should return a message object", () => {
		const userMsg = generateMessage(from, text);

		expect(userMsg).toBeA("object");
		expect(userMsg).toInclude({ from, text });
		// expect(userMsg.from).toBe(testMsg.from);
		// expect(userMsg.text).toBe(testMsg.text);
		expect(userMsg.createdAt).toBeA("number");
	});
});

/* GENERATE LOCATION DESCRIBE BLOCK */
describe("Generate Location Link", () => {
	it("Should return a location object", () => {
		// lat and long for the location test
		const lat = "-22.333333";
		const lng = "-54.569875";
		// create a location object
		const userLocation = sendLocationData("Homer Jay", lat, lng);
		expect(userLocation).toBeA("object");
		expect(userLocation.user).toBeA("string").toBe("Homer Jay");
		expect(userLocation.url).toInclude([lat, lng]).toBe(`https://www.google.com/maps?q=${lat},${lng}`);
		expect(userLocation.createdAt).toBeA("number");
	});
});
