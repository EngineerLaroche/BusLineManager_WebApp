
// On peut optimiser ?
const MongoClient = require('mongodb').MongoClient;
var state = { database: null }

 /********************************************
 * Connexion DB
 * 
 * Gestion du client MongoDB et des index TTL
 * 
 ********************************************/
exports.connect = function (url, databaseName, done) {
    if (state.database) return done()

    MongoClient.connect(url, { useNewUrlParser: true }, function (error, client) {
        // Attrape les erreurs
        if (error) return done(error)
        // Creation des index TTL. MongoDB execute un thread aux 60 sec. Il verifie les index TTL et supprime les documents
        state.database = client.db(databaseName);
        state.database.collection("arrivals").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 60 });
        state.database.collection("bus_positions").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 10 });
        state.database.collection("lines").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });
        state.database.collection("stops").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });
        state.database.collection("users").createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });
        done()
    })
}

exports.get = function () { return state.database }