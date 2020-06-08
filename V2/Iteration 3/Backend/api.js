// On peut optimiser ?
const request = require('request');

 /********************************************
 * Récupère à partir de la cache
 * 
 * On appel cette fonction lorsqu'on veut 
 * récupérer les données de la base de données.
 * 
 ********************************************/
module.exports.fetchCache = function (url, options) {
    if (options.fetchDB) {
        // Appel la fonction lorsque les donnees doivent etre recupérées de la BD
        options.fetchDB().then(function (dataFromDb) {
            if (dataFromDb == null || dataFromDb.length == 0) {
                console.log("Récupération des données de l'API : " + url);
                fetchAPI(url, options);
            } else {
            	// Appel la fonction lorsque la requete a l'API est réussie et la sauvegarde dans la BD 
                if (options.onSuccess) options.onSuccess(dataFromDb);
            }
        });
    } else fetchAPI(url, options);
}

 /********************************************
 * Récupère à partir de l'API
 * 
 * On appel cette fonction lorsqu'on veut 
 * récupérer les données de l'API.
 * 
 ********************************************/
function fetchAPI(url, options) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        	// Appel la fonction lorsque la requete a l'API est réussie 
            if (options.saveToDb) options.saveToDb(body);
            // Appel la fonction lorsque la requete a l'API est réussie et la sauvegarde dans la BD
            if (options.onSuccess) options.onSuccess(body);
        } else {
            console.log("URL : " + url + "   ERROR : " + error);
            // Appelé en cas d'échec de la requête vers l'API
            if (options.onFailure) options.onFailure(response, error);
        }
    });
}

/********************************************
 * Rediriger
 *
 * @param {Response} res : Réponse à la requête
 * @param {string} url :   Lien utilisé pour la requête à l'API 
 *
 ********************************************/
module.exports.redirect = function (res, url) {
    const options = {
    	// Appel la fonction lorsque la requete a l'API est réussie et la sauvegarde dans la BD
        onSuccess: (body) => res.send(body),
        // Appelé en cas d'échec de la requête vers l'API
        onFailure: (response, error) => {
            console.log(url);
            console.log(error);
            const code = response != null ? response.code : 500;
            res.status(code).send(error);
        }
    };
    module.exports.fetchCache(url, options);
}
