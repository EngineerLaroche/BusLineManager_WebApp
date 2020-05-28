const db = require('./db');

module.exports = (function () {
    var instance;

    function init() {
        const collection = db.get().collection("bus_positions");

        return {
            get: async function (line, direction) {
                const minDate = new Date(Date.now() - 10000);
                const query = {
                    line: line,
                    direction: direction,
                    createdAt: { $gte: minDate }
                };

                return await collection.find(query)
                    .project({ _id: 0, line: 0, direction: 0 })
                    .toArray();
            },
            save: (line, direction, result) => {
                const query = {
                    line: line,
                    direction: direction
                };

                const busPositions = JSON.parse(result).map(position => {
                    position.line = line;
                    position.direction = direction;
                    position.createdAt = new Date();

                    return position;
                });

                collection.deleteMany(query);
                collection.insertMany(busPositions);
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }

            return instance;
        }
    }
})();

function dataIsExpired(dataFromDb) {
    const createdAt = new Date(dataFromDb.createdAt).getTime();
    const now = new Date().getTime();

    return now - createdAt > 10000;
}