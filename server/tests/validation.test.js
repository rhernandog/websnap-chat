const expect = require("expect");

// get the validation methods
const { isString } = require("../utils/validation");

describe("Test is String Method", () => {
	// valid string
	it("Should return true for a real string", () => {
		const test = "Hi didly ho!!";
		expect( isString(test) ).toBeA("boolean").toBe(true);
	});
	// not a string
	it("Should return false for something that's not a string", () => {
		const test = {a:0};
		expect( isString(test) ).toBeA("boolean").toBe(false);
	});
	// invalid string
	it("Should return false for an empty string", () => {
		const test = "     ";
		expect( isString(test) ).toBeA("boolean").toBe(false);
	});
});
