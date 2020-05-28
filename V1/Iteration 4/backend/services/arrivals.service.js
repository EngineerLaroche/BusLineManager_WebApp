require("dotenv").config();
const backend = process.env.BACKEND;
const apiKey = process.env.APIKEY;
const api = require("../api.js");
const db = require("../db/arrivals.db");

module.exports.getArrivals = async (line, direction, stopCode) => {
    const url = `${backend}/STMArrivals.py?apikey=${apiKey}&route=${line}&direction=${direction}&stopCode=${stopCode}`;

    return new Promise((resolve, reject) => {
        api.fetchFromCacheIfPossible(url, {
            fetchFromDb: () => { 
                return db.getInstance().get(line, direction, stopCode); 
            },
            saveToDb: (result) => { 
                db.getInstance().save(line, direction, stopCode, result); 
            },
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