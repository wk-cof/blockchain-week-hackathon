/* dbManager - wrapper over node-mongodb driver */
'use strict';
const fs=require("fs");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbManager = () => {

  // Connection
  // const pe = process.env ;
  let content=fs.readFileSync("mongo-auth.json", "utf8");
  const pe = JSON.parse(content);
  // use a cloud-hosted mongo db, such as mlab.com
  const url = `mongodb://${pe.user}:${pe.password}@${pe.db_host}:${pe.db_port}/${pe.db_name}`;
  let db = null;
  let collection = null;
  const adminDb = null;


  let insert = (obj) => {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function(err, client) {
        if(err) {
          return reject(err);
        }
        console.log("Connected to server");
        try {
          const db = client.db(pe.db_name);
          insertDocument(db, obj, function() {
            client.close();
            resolve();
          });
        } catch(err) {
          reject(err);
        }
      });
    });
  };

  const readDocuments = function(db, callback) {
      // Get the documents collection
      const collection = db.collection(pe.collection);
      // Find some documents
      collection.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          console.log("Found the following records");
          console.log(docs)
          callback(docs);
      });
  }

  const readAll = () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, function(err, client) {
        if(err) {
          return reject(err);
        }
        console.log("Connected to server");
        try {
          const db = client.db(pe.db_name);
          readDocuments(db, function(response) {
            client.close();
            resolve(response);
          });
        } catch(err) {
          reject(err);
        }
      });
    });
  };

  const insertDocument = function(db, obj, callback) {
    // Get the documents collection
    const collection = db.collection(pe.collection);
    // Insert some documents
    collection.insert(obj, function(err, result) {
      assert.equal(err, null);
      console.log("Inserteded " + JSON.stringify(obj));
      callback(result);
    });
  }

  return {
    insert,
    readAll
  };
};

module.exports = dbManager;
