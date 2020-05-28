require("dotenv").config();
const backend = process.env.BACKEND;
const apiKey = process.env.APIKEY;
const api = require("../api.js");
const db = require("../db/stops.db");

module.exports.getStops = async (line, direction) => {
    const url = `${backend}/STMStops.py?apikey=${apiKey}&route=${line}&direction=${direction}`;

    return new Promise((resolve, reject) => {
        api.fetchFromCacheIfPossible(url, {
            fetchFromDb: () => { 
                return db.getInstance().get(line, direction); 
            },
            saveToDb: (result) => { 
                db.getInstance().save(line, direction, result); 
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