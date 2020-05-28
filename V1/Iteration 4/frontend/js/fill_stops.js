
// Variable global gardant en memoire les stops d'une ligne en particulier
var stopsInfo = null;
var markerLine = null;
var markerDirection = null;

// Dictionnaire qui garde l'arret des passages favoris pour les notifications
var arretsFavoris = {};
var arrivalsIsClicked = false;

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
  const url = `http://localhost:8000/stops?line=${line}&direction=${direction}`;
  const tabsElement = document.getElementsByClassName("tabs")[0];
  const stopsElement = document.getElementById("arrets");

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE)
      if (xhr.status === 200) {
        const stops = JSON.parse(xhr.responseText);

        hideError([tabsElement, stopsElement]);
        fillStopInfo(stops, line, direction);
      } else {
        showError("Le chargement des arrêts pour la ligne " + line + " a échoué.", [tabsElement, stopsElement]);
        console.error(xhr);
      }
  };
  xhr.timeout = defaultTimeout;
  xhr.ontimeout = function () {
    showError("Le chargement des arrêts pour la ligne " + line + " n'a pu aboutir dans le délai imparti.", [tabsElement, stopsElement]);
  }
  xhr.open("GET", url, true);
  xhr.send();
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
  if (getMap() != null && stops != null)
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

      // Le code de 5 chiffres du stop
      const stopCode = stop.id;

      // Separe l'ID pour obtenir le numero de ligne et la lettre de direction
      const stopLineNumberDirection = stopId.split('-');

      // Le numero de code representant l'arret
      const stopIdTd = document.createElement("td");
      stopIdTd.className = "text-left";
      stopIdTd.textContent = stopCode;

      // Lien (bouton) des prochains passages
      const stopLinkTd = getArrivalLink(stop, stopLineNumberDirection, stopCode);

      // Lien (bouton) favoris
      const favoriteLinkTd = getFavoriteLink(stop, stopLineNumberDirection, stopCode, stopId);

      // Insertion des éléments dans la ligne du tableau
      newStopElement.appendChild(stopNameTd);
      newStopElement.appendChild(stopIdTd);
      newStopElement.appendChild(stopLinkTd);
      newStopElement.appendChild(favoriteLinkTd);

      // Insertion de la ligne au tableau
      newBody.appendChild(newStopElement);
    }
  }
}

/*********************************************
 * GET ARRIVALS LINK
 * 
 * Fonction qui retourne le bouton configuré
 * pour afficher l'horaire des arrivées de bus
 * un un Stop donné.
 * 
 *********************************************/
function getArrivalLink(stop, stopLineNumberDirection, stopCode) {

  // Bouton pour afficher les prochains passages
  const stopButton = document.createElement("button");
  stopButton.textContent = "Prochains passages";
  stopButton.style.width = '175px';

  // Lorsque l'utilisateur clique sur les prochains passages
  stopButton.onclick = function () {
    arrivalsIsClicked = true;

    // Appel l'API et affiche l'horaire (à jour) des prochains arrivés du bus 
    loadArrivals(stop.name, stopLineNumberDirection[0], stopLineNumberDirection[1], stopCode);
    document.getElementById("arrivals").scrollIntoView();
  };

  // Initialise l'insertion du bouton des prochains passages dans le tableau
  const stopLinkTd = document.createElement("td");
  stopLinkTd.className = "text-left";
  stopLinkTd.appendChild(stopButton);

  return stopLinkTd
}

/*********************************************
 * GET FAVORITE LINK
 * 
 * Fonction qui retourne le bouton configuré
 * pour mettre en favoris un Stop ainsi que
 * ses heures d'arrivées.
 * 
 *********************************************/
function getFavoriteLink(stop, stopLineNumberDirection, stopCode, stopId) {

  // Bouton 'favoris' pour sauvegarder les info d'un Stop en particulier
  const favoriteButton = document.createElement("button");
  favoriteButton.textContent = "Favoris";
  favoriteButton.style.width = '90px';
  favoriteButton.id = stopCode;

  // Pour garder en memoire le style original du bouton
  var defaultStyle;

  // Met les boutons qui sont liés et mis en favoris d'une autre couleur
  getFavorite(data => {
    if (data.length > 0) {
      // Verifie si le StopCode est actruellement en favoris
      if (data[0]["favorite"].includes(favoriteButton.id)) {
        setFavoriteStyle(favoriteButton);
        setFavoriteDictionary(stop, stopId, stopLineNumberDirection, favoriteButton.id);
      }
    }
  });

  // Lorsque l'utilisateur clique sur le bouton favoris
  favoriteButton.onclick = function () {
    arrivalsIsClicked = false;
    getFavorite(data => {

      // Gere l'ajout du premier favoris 
      if (data.length == 0) {
        addFavorite(this.id);
        setFavoriteStyle(this);
      }
      // Si l'utilisateur n'a pas deja 10 favoris et que le bouton favoris n'a jamais été sélectionné
      else if (data[0]["favorite"].length < 10 && !data[0]["favorite"].includes(this.id)) {

        // Insere dans la DB un stop favoris
        addFavorite(this.id);
        setFavoriteStyle(this);
        setFavoriteDictionary(stop, stopId, stopLineNumberDirection, this.id);

        // Met a jour et ajoute l'horaire des prochains arrivés du Stop favoris
        loadArrivals(stop.name, stopLineNumberDirection[0], stopLineNumberDirection[1], this.id);
        document.getElementById("favoris").scrollIntoView();
      }
      // Si le bouton indique que le stop a deja été mis en favoris
      else if (data[0]["favorite"].includes(this.id)) {

        // Retire de la DB un stop favoris
        removeFavorite(this.id);
        delete arretsFavoris[this.id];

        // Remet le style par defaut
        this.style = defaultStyle;
        this.style.width = '90px';
      }
      // Si l'utilisateur a atteint le maximum de favoris (10)
      else {
        invalidSnackbar("Impossible d'ajouter le passage en favoris. Veuillez en retirer un (10 / 10).");
      }
    });
  }

  // Initialise l'insertion du bouton favoris dans le tableau
  const favoriteLinkTd = document.createElement("td");
  favoriteLinkTd.className = "text-left";
  favoriteLinkTd.appendChild(favoriteButton);

  return favoriteLinkTd;
}

/*********************************************
 * ADD FAVORITE
 * 
 * Permet l'ajout d'un arret Stop en favoris
 * dans la DB avec une confirmation (snackbar)
 * et si une erreur se produit, on affiche un 
 * snackbar en rouge avec le message d'erreur.
 * 
 *********************************************/
function addFavorite(stopCode) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8000/users/01AM30750/favorite");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      getFavorite(data => {
        console.log(xhr.responseText);
        validSnackbar("Mise en favoris des passages réussi. ( " + data[0]["favorite"].length + " / 10 )");
      });
    }
  }
  xhr.onerror = function () {
    invalidSnackbar("Une erreur s'est produite. Veuillez vérifier votre connexion.");
    console.error(xhr);
  }
  xhr.send(JSON.stringify({ stopCode: stopCode }));
}

/*********************************************
 * GET FAVORITE
 * 
 * Permet de recuperer les Stop en favoris de
 * la DB et si une erreur se produit, on affiche 
 * un snackbar en rouge avec le message d'erreur.
 * 
 *********************************************/
function getFavorite(callBack) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8000/users/01AM30750/favorite");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(xhr.responseText);
      callBack(data);
    }
  }
  xhr.onerror = function () {
    invalidSnackbar("Une erreur s'est produite. Veuillez vérifier votre connexion.");
    console.error(xhr);
  }
  xhr.send();
}

/*********************************************
 * REMOVE FAVORITE
 * 
 * Permet le retrait d'un arret Stop des favoris
 * dans la DB avec une confirmation (snackbar)
 * et si une erreur se produit, on affiche un 
 * snackbar en rouge avec le message d'erreur.
 * 
 *********************************************/
function removeFavorite(stopCode) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8000/users/01AM30750/favorite");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      getFavorite(data => {
        console.log(xhr.responseText);
        validSnackbar("Retrait du favoris réussi. ( " + data[0]["favorite"].length + " / 10 )");
      });
    }
  }
  xhr.onerror = function () {
    invalidSnackbar("Une erreur s'est produite. Veuillez vérifier votre connexion.");
    console.error(xhr);
  }
  xhr.send(JSON.stringify({ stopCode: stopCode }));
}

/********************************************
 * SET FAVORITE DICTIONARY
 * 
 * Fonction temporaire qui supporte le systreme
 * de notifications. Sera eventuellement retiré
 * par un fonction qui sera implémenté dans le 
 * backend. Ici on rempli un dictionnaire des
 * avec des informations des favoris sélectionnés
 * par l'utilisateur.
 * 
 ********************************************/
function setFavoriteDictionary(stop, stopId, numberAndDirection, id) {
  if (!(id in arretsFavoris)) {
    arretsFavoris[id] = [
      stop.name,
      stopId.split('-'),
      numberAndDirection[0],
      numberAndDirection[1],
      id
    ];
  }
}

/********************************************
 * CHANGE BUTTON STYLE
 * 
 * Fonction qui change le style du bouton 
 * 'favoris' lorsqu'il est sélectionné
 * pour montrer à l'utilisateur quel Stop a
 * été mis en favoris.
 * 
 ********************************************/
function setFavoriteStyle(button) {
  button.style.color = 'white';
  button.style.backgroundColor = "rgb(" + 0 + "," + 159 + "," + 227 + ")";
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

/********************************************
 * GET FAVORITE STOP
 * 
 * Fonction simple qui retourne le dictionnaire
 * qui contient l'information sur les Stops mis
 * en favoris.
 * 
 ********************************************/
function getFavoriteStop() {
  return arretsFavoris;
}