require("dotenv").config();
const backend = process.env.BACKEND;
const apiKey = process.env.APIKEY;
const api = require("../api.js");
const db = require("../database/lines.db");

module.exports.getLines = async () => {
    const url = `${backend}/STMLines.py?apikey=${apiKey}`;

    return new Promise((resolve, reject) => {
        api.fetchCache(url, {
            fetchDB: () => { return db.getInstance().get(); },
            saveToDb: (result) => { db.getInstance().save(result); },
            onSuccess: (result) => { resolve(result) },
            onFailure: (response, error) => {
                reject({
                    statusCode: response != null ? response.statusCode : 500,
                    error: error
                })
            }
        });
    });
}