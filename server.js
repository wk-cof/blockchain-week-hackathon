'use strict'
//express web server
//protected with helmet.js
var express = require('express');
var helmet = require('helmet');
var app = express();
app.use(helmet());
//currently enables all cors requests
var cors = require('cors');
app.use(cors());
var port = process.env.PORT || 8000;
var server = require('http').Server(app);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));


//use 'body-parser' middleware for post
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({
  extended: false
}));

server.listen(port, function () {
  console.log('Listening on port ' + port);
});



/*
// use 'request' lib for simple http requests
var request = require('request');
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
*/