const fs = require("fs");
let content = fs.readFileSync("mongo-auth.json", "utf8");
const pe = JSON.parse(content);
const assert = require('assert');

const insertDocument = function (db, obj, callback) {
    // Get the documents collection
    const collection = db.collection(pe.collection);
    // Insert some documents
    collection.insert(obj, function (err, result) {
        assert.equal(err, null);
        console.log("Inserteded " + JSON.stringify(obj));
        callback(result);
    });
}


const readDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection(pe.collection);
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