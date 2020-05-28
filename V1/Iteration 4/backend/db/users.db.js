const db = require("./db");

module.exports = (function() {
  var instance;

  function init() {
    const collection = db.get().collection("users");

    return {
      get: async function(userId) {
        const query = {
          userId: userId,
        };
        return await collection
          .find(query)
          .project({ _id: 0 })
          .toArray();
      },
      createUser: async function(userId) {
        return await collection.insertOne({ userId: userId, favorite: [] });
      },
      // Add Favorite
      addFavoriteStop: async function(userId, stopCode) {
        
        // verifies if the user exists and creates it if not
        const user = await this.get(userId);
        if (user.length === 0) {
          await this.createUser(userId);
        }

        return await collection.updateOne(
          { userId },
          { $push: { favorite: stopCode } },
        );
      },
      // Remove Favorite
      removeFavoriteStop: async function(userId, stopCode) {
        return await collection.updateOne(
          { userId },
          { $pull: { favorite: stopCode } },
        );
      },
    };
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = init();
      }

      return instance;
    },
  };
})();
