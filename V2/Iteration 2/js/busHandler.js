/********************************************
 * BUS HANDLER 
 *
 * Fonction qui permet de recuperer la position 
 * des bus de la STM pour une ligne donnée et 
 * de les afficher sur une carte.
 *
 ********************************************/
var BusHandler = function () {

    var busMarkers = [];
    var busIntervalID = null;

    /********************************************
    * REQUEST BUS (API)
    * Recupere de l'API les bus de la STM
    ********************************************/
    function requestBus(route, direction) {
		
		var url = constructURL(busUrl, route, direction);
	
        return new Promise(function (resolve, reject) {

            // Verifie si la requete est dans la cache
           /* if (!(sessionStorage.getItem(url) == null)) {
        	resolve(JSON.parse(sessionStorage.getItem(url)));
            } else {*/
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const answer = JSON.parse(xhr.response);
                        resolve(answer);
               //         sessionStorage.setItem(url, JSON.stringify(answer)); // Ajout dans la cache
                    } else {
                        busError(xhr, reject, "Position des bus - Requête impossible (code: " + xhr.status + ") !");
                    }
                };
                xhr.ontimeout = function () {
                    busError(xhr, reject, "Position des bus - Requête expirée après: " + xhr.timeout + " ms");
                }
                xhr.onerror = function () {
				  if(xhr.readyState == 4){
					lineError(xhr, reject, "Position des bus - Requête a générée une erreur !\n Veuillez vérifier le url utilisé ou vos paramêtre utilisé.");
				  }else{
					lineError(xhr, reject, "Position des bus - Requête a générée une erreur !\n Veuillez vérifier votre connexion internet.");
				  }
                };
                xhr.onabort = function () {
                    busError(xhr, reject, "Position des bus - Requête annulée !");
                };
                xhr.timeout = 10000;
                xhr.send();
            //}
        });
    }

    /********************************************
     * BUS ERROR
     * Rejète la requete vers l'API en cas d'erreur.
     * Affiche un message d'erreur à l'utilisateur. 
     ********************************************/
    function busError(xhr, reject, msg) {
        alert(msg);
        reject({
            status: this.status,
            statusText: xhr.statusText,
        });
    }

    /********************************************
     * UPDATE BUS MARKERS
     * Met a jour la position des bus aux 10 secondes.
     ********************************************/
    function updateBusMarkers() {
        // Pour afficher immediatement la position des bus
        initBusMarkers();
        // Si un Interval est en cours, on le retire
        if (busIntervalID != null) clearInterval(busIntervalID);
        // Mise a jour periodique de la position des bus
        busIntervalID = setInterval(function () { initBusMarkers(); }, 10000);
    }

    /********************************************
     * INIT BUS MARKERS
     * Insere et affiche les markers d'une ligne.
     ********************************************/
    async function initBusMarkers() {

        // Retire les anciens markers et vide la liste pour la prochaine utilisation
        busMarkers.forEach(marker => { carte.get().removeLayer(marker); });
        busMarkers = [];

        // Recupere la position des bus en appelant l'API
        const busList = await requestBus(ligne.get().id, directionLetter(ligne.get().direction));

        // Parametres de l'icône du bus 
        var busIcon = L.icon({
            iconUrl: "style/img/bus_marker.png",
            iconSize: [60, 60],
            iconAnchor: [30, 60],
        });

        // Pour tous les bus recupéré de l'API
        for (var i = 0; i < busList.length; i++) {

            // Recupere le prochain arret du bus
            const prochainArret = arret.get().find(stop => {
                return stop.id == busList[i].next_stop;
            });

            // Affiche le prochain arret du bus dans son popup
            const busPopup = document.createElement("b");
            if (prochainArret != null)
                busPopup.textContent = `Prochain arrêt : ${prochainArret.name}`;
            else busPopup.textContent = "Aucun prochain arrêt";

            // Associe le contenu du bus à son marker
            const marker = L.marker([busList[i].lat, busList[i].lon], { icon: busIcon })
                .bindPopup(busPopup)
                .addTo(carte.get());
            busMarkers.push(marker);
        }
    }

    return{
        update: function(){ updateBusMarkers(); }
    }
}
