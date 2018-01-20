/* dbManager - wrapper over node-mongodb driver */
'use strict';
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const mongoFuncs = require('./mongo-funcs');
const dbManager = () => {

  // Connection
  // const pe = process.env ;
  let content = fs.readFileSync("mongo-auth.json", "utf8");
  const pe = JSON.parse(content);
  // use a cloud-hosted mongo db, such as mlab.com
  const url = `mongodb://${pe.user}:${pe.password}@${pe.db_host}:${pe.db_port}/${pe.db_name}`;
  let db = null;
  let collection = null;
  const adminDb = null;


  let insert = (obj) => {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, client) {
        if (err) {
          return reject(err);
        }
        console.log("Connected to server");
        try {
          const db = client.db(pe.db_name);
          mongoFuncs.insertDocument(db, obj, function () {
            client.close();
            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  const readAll = () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, function (err, client) {
        if (err) {
          return reject(err);
        }
        console.log("Connected to server");
        try {
          const db = client.db(pe.db_name);
          mongoFuncs.readDocuments(db, function (response) {
            client.close();
            resolve(response);
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  return {
    insert,
    readAll
  };
};

module.exports = dbManager;
