'use strict';

const Promise = require('bluebird');
// custom logger
const log = require('./logger.js');
const express = require('express');
const bodyParser = require('body-parser');
const dbManager = require('./dbManager');
// const logger = require('./logger');

const app = express();
const port = process.env.PORT || 8000;
const server = require('http').Server(app);

app.use(require('helmet')()); // use helmet
app.use(require('cors')()); // enable CORS
// serves all static files in /public
app.use(express.static(`${__dirname}/../public`));

// start server
let dbInstance = dbManager();
  server.listen(port, () => {
    log.info(`Listening on port ${port}`);
  });

// 'body-parser' middleware for POST
// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

app.get('/api/records', (req, res) => {
  dbInstance.readAll()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400);
      res.send(err);
    });
  });

app.post('/api/records', (req, res) => {
  // if (!req.body) {
  //   return res.sendStatus(400);
  // }
  dbInstance.insert({yo: 'man'})
    .then(() => {
      res.send('successfully inserted');
    })
    .catch(err => {
      res.status(400);
      res.send(err);
    });
});



// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  res.send(`welcome, ${req.body.username}`);
});

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  // create user in req.body
});


// ex. using 'node-fetch' to call JSON REST API
/*
const fetch = require('node-fetch');
// for all options see https://github.com/bitinn/node-fetch#options
const url = 'https://api.github.com/users/cktang88/repos';
const options = {
  method: 'GET',
  headers: {
    // spoof user-agent
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  }
};

fetch(url, options)
  .then(res => {
    // meta
    console.log(res.ok);
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.headers.raw());
    console.log(res.headers.get('content-type'));
    return res.json();
  })
  .then(json => {
    console.log(`User has ${json.length} repos`);
  })
  .catch(err => {
    // API call failed...
    log.error(err);
  });
*/
