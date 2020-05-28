const db = require("../db/users.db");

const getFavoriteStops = async userId => {
  const url = `${userId}/favoriteStops`;

  return new Promise((resolve, reject) => {
    try {
      const favorites = db.getInstance().get(userId);

      resolve(favorites);
    } catch(error) {
      reject(error)
    }
  });
};

const addFavoriteStop = async (userId, stopCode) => {
  return new Promise((resolve, reject) => {
    db.getInstance()
      .addFavoriteStop(userId, stopCode)
      .then(
        res => {
          resolve({
            statusCode: 200,
            message: userId + " added stop (" + stopCode + ") to favorite",
          });
        },
        error =>
          reject({
            statusCode: response != null ? response.statusCode : 500,
            error: error,
          }),
      )
      .catch(err =>
        reject({
          statusCode: response != null ? response.statusCode : 500,
          error: err,
        }),
      );
  });
};

const removeFavoriteStop = async (userId, stopCode) => {
  return new Promise((resolve, reject) => {
    db.getInstance()
      .removeFavoriteStop(userId, stopCode)
      .then(
        res => {
          resolve({
            statusCode: 200,
            message: userId + "removed stop (" + stopCode + ") from favorite",
          });
        },
        error =>
          reject({
            statusCode: response != null ? response.statusCode : 500,
            error: error,
          }),
      )
      .catch(err =>
        reject({
          statusCode: response != null ? response.statusCode : 500,
          error: err,
        }),
      );
  });
};

module.exports = { getFavoriteStops, addFavoriteStop, removeFavoriteStop };