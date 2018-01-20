const fs = require("fs");
let pe;
if (process.env.MONGO_USER) {
    pe = {
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        db_host: process.env.MONGO_HOST,
        db_port: process.env.MONGO_PORT,
        db_name: process.env.MONGO_DB_NAME
    }
} else {
    let content = fs.readFileSync("mongo-auth.json", "utf8");
    pe = JSON.parse(content);
}
const assert = require('assert');

const insertDocument = function (db, obj, callback) {
    const collection = db.collection('test');
    collection.insert(obj, function (err, result) {
        assert.equal(err, null);
        console.log("Inserteded " + JSON.stringify(obj));
        callback(result);
    });
}

const readDocuments = function (db, callback) {
    const collection = db.collection('test');
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const readOne = function (db, id, callback) {
    const collection = db.collection('test');
    collection.find({ phoneNumber: id }).toArray(function (err, doc) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(doc);
        callback(doc);
    });
}

const updateDocument = function (db, id, newObj, callback) {
    const collection = db.collection('test');
    collection.updateOne({ phoneNumber: id }
        , { $set: newObj }, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
};

const removeDocument = function (db, id, callback) {
    const collection = db.collection('test');
    // Delete document where a is 3
    collection.deleteOne({ phoneNumber: id }, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with phoneNumber = " + id);
        callback("Removed the document with phoneNumber = " + id);
    });
}

module.exports = {
    readDocuments,
    insertDocument,
    readOne,
    updateDocument,
    removeDocument
};