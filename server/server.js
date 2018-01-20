'use strict';

const Promise = require('bluebird');
// custom logger
const log = require('./logger.js');
const express = require('express');
const bodyParser = require('body-parser');
const dbManager = require('./dbManager');
const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;


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
}

app.get('/api/test', (req, res) => {
  sendTwilioMessage('helloWorld', twilioNumber, '+447827345680')
    .then(() => {
      res.send('message sent');
    })
    .catch(err => {
      res.status(400);
      res.send(err);
    });
})

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
    // BORROW\s+\d+,\s*\d+\s*,\s*\d+\s*,\s*\d+
    let matches = message.match(/^borrow\s+(\d+),\s*(\d+)\s*,\s*(\d+)\s*,\s*(\+?\d+)/i);
    if (matches.length < 5) {
      return Promise.resolve('Enter the BORROW and AMOUNT, INTEREST RATE, DAYS UNTIL DUE, LENDER MOBILE NUMBER');
    }
    let borrowObj = {
      phoneNumber,
      action: 'borrow',
      amount: parseInt(matches[1]),
      interestRate: parseInt(matches[2]),
      daysUntilDue: parseInt(matches[3]),
      lenderNumber: matches[4]
    };
    return dbInstance.insert(borrowObj)
      .then(() => {
        const returnAmount = Math.floor(borrowObj.amount * (1 + borrowObj.interestRate/100 * borrowObj.daysUntilDue / 365) * 100) / 100;

        return `You want to borrow ${borrowObj.amount} with ${borrowObj.interestRate}% interest due in ${borrowObj.daysUntilDue} days.` +
          `A total of ${returnAmount} will be due. Is that correct? YES or NO`;
      });
  } else if (message.match(/^yes/i)) {
    return dbInstance.read(phoneNumber)
      .then(actionObjList => {
        if (!actionObjList) {
          return incorrectUsage;
        }
        let actionObj = actionObjList[0];
        switch (actionObj.action) {
          case 'borrow':
            return dbInstance.remove(actionObj.phoneNumber)
              .then(() => {
                sendTwilioMessage('Hi lender', twilioNumber, actionObj.lenderNumber)
                  .then(() => {
                    return 'Thank you, the lender is notified';
                  });
              });
          default:
            return incorrectUsage;
        }
      });
  } else {
    return Promise.resolve(incorrectUsage);
  }
};


// app.get('/api/records', (req, res) => {
//   dbInstance.remove('+447469455030')
//     .then(result => {
//       res.send(result);
//     })
//     .catch(err => {
//       res.status(400);
//       res.send(err);
//     });
//   });

// app.post('/api/records', (req, res) => {
//   dbInstance.insert(req.body)
//     .then(() => {
//       res.send('successfully inserted');
//     })
//     .catch(err => {
//       res.status(400);
//       res.send(err);
//     });
// });

// // POST /login gets urlencoded bodies
// app.post('/login', urlencodedParser, (req, res) => {
//   if (!req.body) {
//     return res.sendStatus(400);
//   }
//   res.send(`welcome, ${req.body.username}`);
// });

// // POST /api/users gets JSON bodies
// app.post('/api/users', jsonParser, (req, res) => {
//   if (!req.body) {
//     return res.sendStatus(400);
//   }
//   // create user in req.body
// });


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
