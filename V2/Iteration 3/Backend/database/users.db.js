const db = require("./database");

module.exports = (function () {
  var instance;

  function init() {
    const collection = db.get().collection("users");

    return {
      // Recupere l'ID du User
      get: async function (userId) {
        const query = {
          userId: userId,
        };
        return await collection
          .find(query)
          .project({ _id: 0 })
          .toArray();
      },
      // Creation du User
      createUser: async function (userId) {
        return await collection.insertOne({ userId: userId, favorite: [] });
      },
      // Ajout du stop favoris
      addFavoriteStop: async function (userId, stopCode) {

        // Valide l'existence du User
        const user = await this.get(userId);
        if (user.length === 0) await this.createUser(userId);

        return await collection.updateOne(
          { userId },
          { $push: { favorite: stopCode } },
        );
      },
      // Retirer le stop favoris
      removeFavoriteStop: async function (userId, stopCode) {
        return await collection.updateOne(
          { userId },
          { $pull: { favorite: stopCode } },
        );
      },
    };
  }

  return {
    getInstance: function () {
      if (!instance) instance = init();
      return instance;
    },
  };
})();
