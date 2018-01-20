const fs = require("fs");
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
const assert = require('assert');

const insertDocument = function (db, obj, callback) {
    // Get the documents collection
    const collection = db.collection('test');
    // Insert some documents
    collection.insert(obj, function (err, result) {
        assert.equal(err, null);
        console.log("Inserteded " + JSON.stringify(obj));
        callback(result);
    });
}


const readDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('test');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

module.exports = {
    readDocuments,
    insertDocument
};