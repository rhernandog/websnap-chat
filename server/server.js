// get the path module
const path = require("path");

// get express
const express = require("express");

// store the path to the public folder
const publicPath = path.join( __dirname, "../public" );

// create the express apap
const app = express();

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
/* app.get("/", (req, res) => {
	res.send("alo alo vecinillo");
}); */
app.use( "/", express.static(publicPath) );





// init the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

module.exports = { app };
