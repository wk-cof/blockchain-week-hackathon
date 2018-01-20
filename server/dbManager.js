/* dbManager - wrapper over node-mongodb driver */
'use strict';
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const mongoFuncs = require('./mongo-funcs');
const dbManager = () => {

  // Connection
  // const pe = process.env ;
  let pe;
  if (process.env.MONGO_USER) {
    pe = {
      user: process.env.MONGO_USER ,
      password: process.env.MONGO_PASSWORD ,
      db_host: process.env.MONGO_HOST ,
      db_port: process.env.MONGO_PORT ,
      db_name: process.env.MONGO_DB_NAME
    }
  } else {
    let content = fs.readFileSync("mongo-auth.json", "utf8");
    pe = JSON.parse(content);
  }


  // use a cloud-hosted mongo db, such as mlab.com
  const url = `mongodb://${pe.user}:${pe.password}@${pe.db_host}:${pe.db_port}/${pe.db_name}`;
  let db = null;
  let collection = null;
  const adminDb = null;

  let doAction = (funcToCall, args) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, function (err, client) {
        if (err) {
          return reject(err);
        }
        console.log("Connected to server");
        try {
          const db = client.db(pe.db_name);
          let newArgs = [db, ...args];
          funcToCall(...newArgs, (response) => {
            client.close();
            resolve(response);
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  let insert = (obj) => {
    return doAction(mongoFuncs.insertDocument, [obj]);
  };

  const readAll = () => {
    return doAction(mongoFuncs.readDocuments, []);
  };

  const read = (id) => {
    return doAction(mongoFuncs.readOne, [id]);
  };

  const update = (id, newObj) => {
    return doAction(mongoFuncs.updateDocument, [id, newObj]);
  };

  const remove = (id) => {
    return doAction(mongoFuncs.removeDocument, [id]);
  }

  return {
    insert,
    readAll,
    read,
    update,
    remove
  };
};

module.exports = dbManager;
