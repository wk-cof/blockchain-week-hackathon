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


  let insert = () => {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function(err, client) {
        if(err) {
          return reject(err);
        }
        console.log("Connected successfully to server");

        const db = client.db(pe.db_name);
        insertDocuments(db, function() {
          client.close();
          resolve();
        });
      });
    });
  };

  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection(pe.collection);
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
  }

  return {
    insert
  };
};

module.exports = dbManager;
