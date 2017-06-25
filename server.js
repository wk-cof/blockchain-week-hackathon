'use strict';

// express web server
// protected with helmet.js
const express = require('express');
const helmet = require('helmet');
// currently enables all cors requests
const cors = require('cors');
// use 'body-parser' middleware for post
const bodyParser = require('body-parser');
// bunyan for logging
const bunyan = require('bunyan');

const app = express();
app.use(helmet());
app.use(cors());
const port = process.env.PORT || 8000;
const server = require('http').Server(app);

// socket.io
const io = require('socket.io').listen(server);


// bunyan logger filters json log content into several places...
const log = bunyan.createLogger({
  name: 'github-loc',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'error',
      path: './logs/bunyan-error.log',
    },
    {
      level: 'debug',
      path: './logs/bunyan-debug.log',
    },
  ],
});

// serves all static files in /public
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json({
  extended: false,
}));

server.listen(port, () => {
  log.info(`Listening on port ${port}`);
});

function processWord(word, socket) {
  if (!socket) {
    log.error('Socket is undefined.');
  }
}


io.on('connection', (socket) => {
  log.info('new connection.');

// emit an event to the socket
// socket.emit('request', data);
// emit an event to all connected sockets
// io.emit('broadcast', data);
// listen to the event
  socket.on('newword', (word) => {
    log.info(word);
    processWord(word, socket);
  });
  socket.on('disconnect', (e) => {
    log.info('user disconnected.');
  });
});

/*
// use 'request' lib for simple http requests
var request = require('request');
request('http://www.google.com', function (error, response, body) {
  log.error('error:', error); // Print the error if one occurred
	// Print the response status code if a response was received
  log.info('statusCode:', response && response.statusCode);
  log.info('body:', body); // Print the HTML for the Google homepage.
});
*/
