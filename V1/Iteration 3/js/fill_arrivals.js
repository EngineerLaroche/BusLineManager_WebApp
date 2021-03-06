
// Variable globale qui représente l'intervalle de temps pour les heures d'arrivées
var arrivalsInterval;

// Liste globale qui garde en memoire les heures d'arrivees pour un arret specifique
var arrivalTime = [];

// Lors du tout premier click sur un marker, permet d'attendre l'information des arrivées.
var firstMarkerClick = true;

/********************************************
 * LOAD ARRIVALS
 * 
 * Fonction qui permet de charger les passages 
 * à partir de la cache ou du serveur selon
 * l'arrêt choisi par l'utilisateur. Met à
 * jour les données à tous les 10 secondes.
 * 
 ********************************************/
function loadArrivals(stopName, line, direction, stopCode) {
    if (arrivalsInterval != null)
        clearInterval(arrivalsInterval);

    // Recupere les arrivees de bus de l'API 
    fetchArrivals(stopName, line, direction, stopCode);

    // Met a jour les arrivees de bus a tous les 10 secondes
    arrivalsInterval = setInterval(function () {
        fetchArrivals(stopName, line, direction, stopCode);
    }, 10000);
}

/********************************************
 * FETCH ARRIVALS (API)
 * 
 * Fonction qui permet de recuperer les passages 
 * de bus de l'API avec un 'parser' JSON
 * selon l'arrêt choisi par l'utilisateur,
 * on appel l'API pour récupérer l'horaire des
 * passages de bus.
 * 
 ********************************************/
function fetchArrivals(stopName, line, direction, stopCode) {
    const url = 'https://teaching-api.juliengs.ca/gti525/STMArrivals.py?apikey=gti525test&route=' + line + '&direction=' + direction + '&stopCode=' + stopCode;
    const arrivalsElement = document.getElementById("arrivals");

    // Si l'url a déjà été mis en cache
    if (cache.contains(url)) {
        createAndShowArrivals(cache.get(url), stopName);
    } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const arrivals = JSON.parse(xhr.responseText);

                    // Mise en cache
                    cache.put(url, arrivals);
                    hideError([arrivalsElement]);
                    createAndShowArrivals(arrivals, stopName);
                } else {
                    showError("Le chargement des passages a échoué.", [arrivalsElement]);
                    console.error(xhr);
                }
            }
        };
        xhr.timeout = defaultTimeout;
        xhr.ontimeout = function() {
            showError("Le chargement des passages n'a pu aboutir dans le délai imparti.", [arrivalsElement]);
        }
        xhr.open("GET", url, true);
        xhr.send();
    }
}

/********************************************
 * CREATE AND SHOW ARRIVALS
 * 
 * Fonction  qui sert à créer des passages
 * et à les afficher. Met à jour les données 
 * à toutes les 10 secondes.
 * 
 ********************************************/
function createAndShowArrivals(arrivals, stopName) {
    const arrivalObjects = arrivals.map(arrivalValue => {
        return new Arrival(arrivalValue);
    });

    // Affiche l'horaire des arrivees du bus dans un tableau
    showTenNextArrivals(arrivalObjects, stopName);
    displayRefreshTime();
}

/********************************************
 * REMOVE CHILDREN
 * 
 * Fonction qui permet d'afficher les heures
 * des prochains passages dans un tableau.
 * 
 ********************************************/
function showTenNextArrivals(arrivalObjects, stopName) {

    const arrivalsTable = document.getElementById("arrivals");
    const arrivalsTableBody = arrivalsTable.getElementsByTagName("tbody")[0];
    const tenNextArrivals = getTenNextArrivals(arrivalObjects);
    const legend = document.getElementById("legende-passage");

    // Vide la liste des anciennes heures d'arrivées
    arrivalTime = [];

    // S'il y a des arrivés de bus de prévu
    if (tenNextArrivals.length > 0) {
        setNoArrivalErrorVisibility(false, arrivalsTable);
        document.getElementById("arrival-stop-name").innerHTML = stopName + " (" + stopId + ")";;
        removeChildren(arrivalsTableBody);

        // Boucle qui insère les heures de prochains passages dans le tableau 
        tenNextArrivals.forEach(arrivalObj => {
            const td = document.createElement("td");
            const tr = document.createElement("tr");

            if (arrivalObj.isRealTime()) {
                tr.classList.add("temps-reel");
                legend.style.display = "block";
            }
            
            // Insere les heures d'arrivees (markers de la Carte)
            arrivalTime.push(arrivalObj.displayValue());
            console.log("ARRIVALS");

            td.textContent = arrivalObj.displayValue();
            tr.appendChild(td);
            arrivalsTableBody.appendChild(tr);
        });
    } else {
        setNoArrivalErrorVisibility(true, arrivalsTable);
        legend.style.display = "none";

        // Insere un message concernant les heures d'arrivées (markers de la Carte)
        arrivalTime.push("Aucuns passages prévus");
    }
    firstMarkerClick = false;
}

/********************************************
 * GET 10 NEXT ARRIVALS 
 * 
 * Fonction qui récupère les 10 prochains 
 * passages de bus en fonction du temps.
 * 
 ********************************************/
function getTenNextArrivals(arrivalsOjects) {

    // Récupère l'heure actuelle dans le format hhmm
    const currentTime = getFormattedCurrentTime();

    // Met en ordre les heures de passages.
    const sortedArrivals = arrivalsOjects.sort(
        function (arrival1, arrival2) {
            return arrival1.hhmmFormattedValue - arrival2.hhmmFormattedValue;
        });

    var startIndex = sortedArrivals.findIndex(arrival => {
        return arrival.hhmmFormattedValue > currentTime
    });

    // Aucun index de passage trouvé, car il est trop tard
    if (startIndex == -1) startIndex = 0;

    const endIndex = startIndex + 10;
    const extra = sortedArrivals.length - endIndex;

    if (extra < 0){
        return sortedArrivals.slice(startIndex, sortedArrivals.length).
            concat(sortedArrivals.slice(0, Math.min(Math.abs(extra), startIndex)));
    } else {
        return sortedArrivals.slice(startIndex, endIndex);
    }
}

/********************************************
 * GET FORMATTED CURRENT TIME
 * 
 * Fonction qui reformat l'heure actuelle
 * pour être affichée dans le tableau des
 * prochains passages.
 * 
 ********************************************/
function getFormattedCurrentTime() {
    const currentDate = new Date();
    var currentHours = currentDate.getHours();
    var currentMinutes = currentDate.getMinutes();
    return formatTimeValueTwoDigits(currentHours) + formatTimeValueTwoDigits(currentMinutes)
}

/********************************************
 * REMOVE CHILDREN
 * 
 * Fonction qui retire l'heure de passage
 * lorsque le bus est arrivé.
 * 
 ********************************************/
function removeChildren(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
}

/********************************************
 * SET NO ARRIVALS ERROR VISIBILITY
 * 
 * Fonction qui permet de cacher ou non
 * les heures de passage selon l'étiniraire
 * du bus.
 * 
 ********************************************/
function setNoArrivalErrorVisibility(visible, arrivalsTable) {
    const errorNode = document.getElementById("arrivals-empty-error");
    errorNode.style.display = visible ? "block" : "none";
    arrivalsTable.style.display = visible ? "none" : "table";
}

/********************************************
 * DISPLAY REFRESH TIME
 * 
 * Fonction qui affiche la date et heure
 * actuelle. Cette fonction est appelee a 
 * toute les 10 sec, en meme temps que le
 * tableau de l'horaire qui est maintenu 
 * a jours.
 * 
 ********************************************/
function displayRefreshTime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    document.getElementById("refresh-time").innerHTML = "Dernière mise à jour :  " + date + ' , ' + time;
}

/********************************************
 * GET ARRIVAL TIME
 * 
 * Fonction simple qui retourne la liste des
 * arrivées de bus d'un stop^en particulier. 
 * On utilise une fonction au lieux de la 
 * variable globale pour éviter les mauvaises
 * utilisations de l'objet (liste). 
 * 
 ********************************************/
function getArrivalTime(){
    return arrivalTime;
}
