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

//socket.io
var io = require('socket.io').listen(server);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));

//bunyan for logging
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "MyApp"});


//use 'body-parser' middleware for post
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({
  extended: false
}));

server.listen(port, function () {
  log.info('Listening on port ' + port);
});

function processWord(word, socket){
  
}


io.on('connection', function (socket) {
  log.info('new connection.');
  // emit an event to the socket
  //socket.emit('request', data);
  // emit an event to all connected sockets
  //io.emit('broadcast', data);
  // listen to the event
  socket.on('newword', function (word) {
    log.info(word);
    processWord(word, socket);
  });
  socket.on('disconnect', function (e) {
    log.info('user disconnected.');
  })
});

/*
// use 'request' lib for simple http requests
var request = require('request');
request('http://www.google.com', function (error, response, body) {
  log.error('error:', error); // Print the error if one occurred
  log.info('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  log.info('body:', body); // Print the HTML for the Google homepage.
});
*/