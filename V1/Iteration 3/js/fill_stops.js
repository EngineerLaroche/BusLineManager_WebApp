
// Variable global gardant en memoire les stops d'une ligne en particulier
var stopsInfo = null;
var markerLine = null;
var markerDirection = null;

/********************************************
 * LOAD STOPS (API)
 * 
 * Fonction qui permet de recuperer les stops 
 * de bus de l'API avec un 'parser' JSON.
 * Selon la direction choisi par l'utilisateur,
 * on appel l'API avec des parametres URL
 * differents.
 * 
 ********************************************/
function loadStops(line, direction) {
  const url = 'https://teaching-api.juliengs.ca/gti525/STMStops.py?apikey=gti525test&route=' + line + '&direction=' + direction;
  const tabsElement = document.getElementsByClassName("tabs")[0];
  const stopsElement = document.getElementById("arrets");

  // Si l'url a déjà été mis en cache
  if (cache.contains(url)) {
    fillStopInfo(cache.get(url), line, direction);
  } else {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE)
        if (xhr.status === 200) {
          const stops = JSON.parse(xhr.responseText);

          // Mise en cache
          cache.put(url, stops);
          hideError([tabsElement, stopsElement]);
          fillStopInfo(stops, line, direction);
        } else {
          showError("Le chargement des arrêts pour la ligne " + line + " a échoué.", [tabsElement, stopsElement]);
          console.error(xhr);
        }
    };
    xhr.timeout = defaultTimeout;
    xhr.ontimeout = function() {
      showError("Le chargement des arrêts pour la ligne " + line + " n'a pu aboutir dans le délai imparti.", [tabsElement, stopsElement]);
    }
    xhr.open("GET", url, true);
    xhr.send();
  }
}

/*********************************************
 * FILL STOP INFO
 * 
 * Fonction qui organise la base de la structure 
 * de données du tableau des informatiosn d'arrêts 
 * de bus.
 * 
 *********************************************/
function fillStopInfo(stops, lineNumber, directionLetter) {

  // Make the stops (array) a global variable
  stopsInfo = stops;

  // Création d'un ID simplifié de la ligne
  var stopId = lineNumber + "-" + directionLetter;

  const table = document.getElementById("arrets");
  const oldBody = table.getElementsByTagName("tbody")[0];
  const newBody = document.createElement("tbody");

  // Appel la fonction qui insere les arrets de bus dans un tableau.
  insertStops(stops, newBody, stopId);
  table.removeChild(oldBody);
  table.appendChild(newBody);
  markerLine = lineNumber;
  markerDirection = directionLetter;

  // Si l'utilisateur clique sur une nouvelle ligne, on réinitialise la carte
  if(getMap() != null && stops != null)
    resetMap();
}

/*********************************************
 * INSERT STOPS
 * 
 * Fonction qui insère les arrêts dans le
 * tableau selon la direction choisi par
 * l'utilisateur.
 * 
 *********************************************/
function insertStops(stops, newBody, stopId) {

  for (const stop of stops) {
    if (stop.accessible) {

      // Recupere l'élément HTML du tableau
      var newStopElement = document.createElement("tr");

      // Le nom de l'arret
      const stopNameTd = document.createElement("td");
      stopNameTd.className = "text-left";
      stopNameTd.textContent = stop.name;

      // Le numero de code representant l'arret
      const stopIdTd = document.createElement("td");
      stopIdTd.className = "text-left";
      stopIdTd.textContent = stop.id;

      // Bouton pour afficher les prochains passages
      const stopLink = document.createElement("button");
      stopLink.textContent = "Prochains passages";
      stopLink.style.width = '175px';

      const stopLinkTd = document.createElement("td");
      stopLinkTd.className = "text-left";

      // Lorsque l'utilisateur clique les prochains passages, l'horaire est affichée
      stopLink.onclick = function () {
        const stopName = stop.name;
        const stopLineNumberDirection = stopId.split('-');
        const lineNumber = stopLineNumberDirection[0];
        const directionLetter = stopLineNumberDirection[1];
        const stopCode = stop.id;

        // Met a jour l'horaire (tableau) des prochains arrivés du bus en appelant l'API
        loadArrivals(stopName, lineNumber, directionLetter, stopCode);
        document.getElementById("arrivals").scrollIntoView();
      };
      stopLinkTd.appendChild(stopLink);

      // Bouton favoris (non implémenté)
      const stopFavoriteTd = document.createElement("td");
      stopFavoriteTd.className = "text-left";
      stopFavoriteTd.textContent = "+";

      newStopElement.appendChild(stopNameTd);
      newStopElement.appendChild(stopIdTd);
      newStopElement.appendChild(stopLinkTd);
      newStopElement.appendChild(stopFavoriteTd);

      newBody.appendChild(newStopElement);
    }
  }
}

/********************************************
 * GET STOPS
 * 
 * Fonction simple qui retourne la liste des
 * information des arrêts de bus d'un ligne. 
 * On utilise une fonction au lieux de la 
 * variable globale pour éviter les mauvaises
 * utilisations de l'objet (liste). 
 * 
 ********************************************/
function getStops() {
  return stopsInfo;
}