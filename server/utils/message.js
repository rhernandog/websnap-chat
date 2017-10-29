// get moment
const moment = require("moment");

const generateMessage = (from, text) => {
	return {
		from, text,
		createdAt: moment().valueOf()
	};
};

// generate location url object
const sendLocationData = ( user, lat, lng ) => {
	return {
		user,
		url: `https://www.google.com/maps?q=${lat},${lng}`,
		createdAt: moment().valueOf()
	};
};

module.exports = { generateMessage, sendLocationData };
