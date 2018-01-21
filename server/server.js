'use strict';

const Promise = require('bluebird');
// custom logger
const log = require('./logger.js');
const express = require('express');
const bodyParser = require('body-parser');
const dbManager = require('./dbManager');
const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;
const processKeywords = require('./process-keywords');

const app = express();
const port = process.env.PORT || 8000;
const server = require('http').Server(app);

app.use(require('helmet')()); // use helmet
app.use(require('cors')()); // enable CORS
// serves all static files in /public
app.use(express.static(`${__dirname}/../public`));

const fs = require("fs");
let accountSid;
let authToken;

if (process.env.ACCOUNT_SID) {
  accountSid = process.env.ACCOUNT_SID;
  authToken = process.env.AUTH_TOKEN
} else {
  let content = fs.readFileSync("twilio-auth.json", "utf8");
  const twilioLoginInfo = JSON.parse(content);
  accountSid = twilioLoginInfo.accountSid;
  authToken = twilioLoginInfo.authToken;
}

const incorrectUsage = 'Sorry, we do not recognise that message.' +
  'To borrow money send BORROW and AMOUNT, INTEREST RATE, DAYS UNTIL DUE, LENDER MOBILE NUMBER';
const twilioNumber = '+442033895302';
//---------------------------------------------------------------------------
// start server
let dbInstance = dbManager();
  server.listen(port, () => {
    log.info(`Listening on port ${port}`);
  });

app.use(bodyParser());

const sendTwilioMessage = (messageBody, fromNumber, toNumber) => {
  let client = new twilio(accountSid, authToken);
  return client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: toNumber
  });
};

const registerInBlockchain = () => {
  return Promise.resolve();
}

app.get('/api/test', (req, res) => {
  dbInstance.update('+447827345680', {'foo': 'bar'})
    .then(() => {
      res.send('message sent');
    })
    .catch(err => {
      res.status(400);
      res.send(err);
    });
});

app.post('/api/twilio-request', (req, res) => {
  const twiml = new MessagingResponse();
  processMessage(req.body.Body, req.body.From)
    .then(responseMessage => {
      twiml.message(responseMessage);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    })
    .catch(err => {
      twiml.message(JSON.stringify(err));
      res.writeHead(400, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    });
});

const processMessage = (message, phoneNumber) => {
  message = message.toLowerCase();
  if (message.match(/^borrow.*/i)) {
    return processKeywords.processBorrow(dbInstance, message, phoneNumber);
  } else if (message.match(/^yes/i)) {
    return processKeywords.processYes(dbInstance, phoneNumber, twilioNumber, sendTwilioMessage);
  } else if (message.match(/^no/i)) {
    return processKeywords.processNo(dbInstance, phoneNumber);
  } else {
    return Promise.resolve(incorrectUsage);
  }
};
