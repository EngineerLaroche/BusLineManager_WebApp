const db = require('./db');

module.exports = (function() {
    var instance;

    function init() {
        const collection = db.get().collection("lines");

        return {
            get: async function () {
                const minDate  = new Date(Date.now() - 3600000);

                return await collection.find({
                    createdAt: { 
                        $gte: minDate  
                    }
                }).project({
                    _id: 0, 
                    createdAt: 0
                }).toArray();
            },
            save: (result) => {
                const lines = JSON.parse(result).map(line => {
                    line.createdAt = new Date();

                    return line;
                });
    
                collection.deleteMany({});
                collection.insertMany(lines);
            }
        }
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }

            return instance;
        }
    }
})();