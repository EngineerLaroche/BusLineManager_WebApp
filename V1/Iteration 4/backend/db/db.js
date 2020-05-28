const MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
}

exports.connect = function (url, dbName, done) {
    if (state.db) return done()

    MongoClient.connect(url, { useNewUrlParser: true }, function (error, client) {
        if (error) return done(error)
        state.db = client.db(dbName);

        // Create TTL indexes
        // MongoDB runs a background thread every 60 seconds that checks the TTL indexes and deletes the documents
        state.db.collection("arrivals").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 60 });
        state.db.collection("bus_positions").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 10 });
        state.db.collection("lines").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });
        state.db.collection("stops").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });

        done()
    })
}

exports.get = function () {
    return state.db
}