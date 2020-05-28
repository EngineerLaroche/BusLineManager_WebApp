const db = require("./database");

module.exports = (function () {
    var instance;

    function init() {
        const collection = db.get().collection("arrivals");

        return {
            // Recupere la ligne, la direction et le code du stop
            get: async function (line, direction, stopCode) {
                const minDate = new Date(Date.now() - 60000);
                const query = {
                    line: line,
                    direction: direction,
                    stopCode: stopCode,
                    createdAt: { $gte: minDate }
                };
                await collection.find(query)
                    .project({ _id: 0, arrivals: 1 })
                    .limit(1)
                    .toArray()
                    .then(result => {
                        if (result != null && result.length > 0) return JSON.parse(result[0].arrivals);
                        else return null;
                    });
            },
            // Sauvegarde la ligne, la direction et le code du stop
            save: (line, direction, stopCode, result) => {
                const query = {
                    line: line,
                    direction: direction,
                    stopCode: stopCode
                };

                const newValues = {
                    $set: {
                        arrivals: result,
                        createdAt: new Date()
                    }
                };
                collection.updateOne(query, newValues, { "upsert": true });
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) instance = init();
            return instance;
        }
    }
})();


