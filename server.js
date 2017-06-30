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
  streams: [{
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
// ex. using 'request-promise' to call JSON REST API
var rp = require('request-promise');
var options = {
  uri: 'https://api.github.com/user/repos',
  qs: {
    access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
  },
  headers: {
    // spoof user-agent
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  },
  json: true // Automatically parses the JSON string in the response
};

rp(options)
  .then(function (data) {
    console.log('User has %d repos', repos.length);
  })
  .catch(function (err) {
    // API call failed...
  });
  */
