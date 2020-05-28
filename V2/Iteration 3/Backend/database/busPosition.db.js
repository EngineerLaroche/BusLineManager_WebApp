const db = require('./database');

module.exports = (function () {
    var instance;

    function init() {
        const collection = db.get().collection("busPosition");

        return {
            // Recupere la ligne et la direction du bus
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
            // Sauvegarde la ligne et la direction du bus
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
            if (!instance) instance = init();
            return instance;
        }
    }
})();