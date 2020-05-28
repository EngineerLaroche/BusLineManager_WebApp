const request = require('request');

/********************************************
 * FETCH FROM CACHE IF POSSIBLE
 *
 * Récupération des données à partir de la base de données ou à partir 
 * de l'API si les données ne peuvent pas être récupérées à partir de
 * la base de données
 * 
 * @param {string} url Lien utilisé pour la requête à l'API 
 * @param {Object} options Objet contenant les fonctions optionnelles
 * suivantes :
 * 
 * fetchFromDb : Fonction appelée lorsque les données doivent être
 *               récupérée à partir de la BD
 * 
 * saveToDb : Fonction appelée après une requête réussie à l'API afin 
 *              de sauvegarder les données dans la BD
 * 
 * onSuccess : Fonction appelée après une requête réussie à l'API et la
 *              sauvegarde dans la BD (si saveToDb est définie)
 * 
 * onFailure : Fonction appelée en cas d'échec de la requête vers l'API
 *
 ********************************************/
module.exports.fetchFromCacheIfPossible = function (url, options) {
    if (options.fetchFromDb) {
        options.fetchFromDb().then(function (dataFromDb) {
            if (dataFromDb == null || dataFromDb.length == 0) {
                console.log("Fetching data from API at: " + url);

                fetchFromApi(url, options);
            } else {
                if (options.onSuccess) {
                    options.onSuccess(dataFromDb);
                }
            }
        });
    } else {
        fetchFromApi(url, options);
    }
}

function fetchFromApi(url, options) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (options.saveToDb) {
                options.saveToDb(body);
            }

            if (options.onSuccess) {
                options.onSuccess(body);
            }
        } else {
            console.log(url);
            console.log(error);

            if (options.onFailure) {
                options.onFailure(response, error);
            }
        }
    });
}

/********************************************
 * REDIRECT
 *
 * @param {Response} res Réponse à la requête
 * @param {string} url Lien utilisé pour la requête à l'API 
 *
 ********************************************/
module.exports.redirect = function (res, url) {
    const options = {
        onSuccess: (body) => res.send(body),
        onFailure: (response, error) => {
            console.log(url);
            console.log(error);
            const statusCode = response != null ? response.statusCode : 500;

            res.status(statusCode).send(error);
        }
    };

    module.exports.fetchFromCacheIfPossible(url, options);
}
