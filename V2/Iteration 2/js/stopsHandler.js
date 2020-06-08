var StopsHandler = function () {
  var arrets = null;
  var line = null;

  /********************************************
   * REQUEST STOPS (API)
   * Recupere de l'API les stops de la STM
   ********************************************/
  function requestStops(route, direction) {
	  
	var url = constructURL(stopUrl,route,direction);
	
    return new Promise(function (resolve, reject) {

      // Verifie si la requete est dans la cache
      if (!(sessionStorage.getItem(url) == null)) {
          resolve(JSON.parse(sessionStorage.getItem(url)));
      } else {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            const answer = JSON.parse(xhr.response);
            resolve(answer);
            sessionStorage.setItem(url, JSON.stringify(answer)); // Ajout dans la cache
          } else {
            stopError(xhr, reject, "Stop STM - Requête impossible (code: " + xhr.status + ") !");
          }
        };
        xhr.ontimeout = function () {
          stopError(xhr, reject, "Stop STM - Requête expirée après: " + xhr.timeout + " ms");
        }
        xhr.onerror = function () {
		  if(xhr.readyState == 4){
			lineError(xhr, reject, "Stop STM - Requête a générée une erreur !\n Veuillez vérifier le url utilisé ou vos paramêtre utilisé.");
		  }else{
			lineError(xhr, reject, "Stop STM - Requête a générée une erreur !\n Veuillez vérifier votre connexion internet.");
		  }
        };
        xhr.onabort = function () {
          stopError(xhr, reject, "Stop STM - Requête annulée !");
        };
        xhr.timeout = 10000;
        xhr.send();
      }
    });
  }

  /********************************************
  * STOP ERROR
  * Rejète la requete vers l'API en cas d'erreur.
  * Affiche un message d'erreur à l'utilisateur. 
  ********************************************/
  function stopError(xhr, reject, msg) {
    alert(msg);
    reject({
      status: this.status,
      statusText: xhr.statusText,
    });
  }

  /*********************************************
   * INIT STOPS
   * 
   * Affiche les arrets d'une ligne dans un tableau.
   * Bouton pour afficher les passages d'un arret.
   *********************************************/
  async function initStops(line) {
	this.line = line;
	
    // Recupere les lignes de l'API
    arrets = await requestStops(line.id, directionLetter(line.direction));

    // Recupere l'info (tags) HTML
    const stopTable = document.getElementById("arrets");
    const oldStopTable = stopTable.getElementsByTagName("tbody")[0];
    const newStopTable = document.createElement("tbody");

    for (const stop of arrets) {
      if (stop.accessible) {

        // Stop name
        const stopNameTag = document.createElement("td");
        stopNameTag.className = "column";
        stopNameTag.textContent = stop.name;

        // Stop ID
        const stopIDTag = document.createElement("td");
        stopIDTag.className = "column";
        stopIDTag.textContent = stop.id;

        // Bouton arrivées pour un stop
        const arrivalRefTag = document.createElement("td");
        const arrivalButton = document.createElement("button");
        arrivalRefTag.className = "column";
        arrivalButton.textContent = "Prochains passages";

        // Affiche les passages du Stop lorsqu'on appui sur le bouton des arrivées
        arrivalButton.onclick = function () {
          arrivals.init(line.id + "-" + directionLetter(line.direction) + "-" + stop.id);
          document.getElementById("arrivals").scrollIntoView();
        };

        // Bouton de stop favoris
        const stopFavorisTag = document.createElement("td");
        const favorisButton = document.createElement("button");
        stopFavorisTag.className = "column";
        favorisButton.textContent = "Favoris";

        // Insertion du bouton des arrivées et des favoris
        arrivalRefTag.appendChild(arrivalButton);
        stopFavorisTag.appendChild(favorisButton);

        // Insertion de l'information d'un stop sur une ligne tu tableau
        var stopElement = document.createElement("tr");
        stopElement.appendChild(stopNameTag);
        stopElement.appendChild(stopIDTag);
        stopElement.appendChild(arrivalRefTag);
        stopElement.appendChild(stopFavorisTag);
        newStopTable.appendChild(stopElement);
      }
    }
    stopTable.removeChild(oldStopTable);
    stopTable.appendChild(newStopTable);

    // Si l'utilisateur clique sur un Stop, on réinitialise la carte
    if (arrets != null) carte.reset();
  }

  /********************************************
   * INIT STOP MARKERS
   * Associe un marker pour chaque stop.
   * Affiche le contenu du stop avec un popup.
   ********************************************/
  function initStopMarkers() {
	  console.log(this.line);
    // Liste des markers et contenu du marker
    var stopMarkers = [], markerContent = [];

    for (var i = 0; i < arrets.length; i++) {

      var stopCode = arrets[i].id;
      var latLng = [arrets[i].lat, arrets[i].lon];
      var popupContent = `<b>${arrets[i].id} ${arrets[i].name}</b>`;
	  var stop = this.line.id+'-'+directionLetter(this.line.direction)+'-'+arrets[i].id;

      // Parametres du marker
      markerContent[stopCode] = L.marker(latLng)
        //.on('popupopen', openStopPopup)
        //.on('popupclose', closeStopPopup)
        .bindPopup(stop)
		.on('click', function() {
			var code = this.stopInfo.stopLine+'-'+this.stopInfo.stopLetter+'-'+this.stopInfo.stopCode;
			(async () => {
					var arrivalTable = await arrivals.getTable(code,0)
					console.log(arrivalTable);
					this._popup.setContent(arrivalTable);
					this._popup.update();
				})()
		})
        .addTo(carte.get());
		
      markerContent[stopCode].stopInfo = {
        stopName: arrets[i].name,
        stopCode: arrets[i].id,
		stopLine: this.line.id,
		stopLetter: directionLetter(this.line.direction)
      }
      stopMarkers.push(markerContent[stopCode]);
    }
    // Ajuste la vue de la carte en fonction des markers
    var markerNode = new L.featureGroup(stopMarkers);
    carte.get().fitBounds(markerNode.getBounds(), { padding: L.point(20, 20) });

    // Insertion d'une ligne bleu entre chaque markers
    L.polyline(arrets).addTo(carte.get());
  }

  /********************************************
   * OPEN STOP POPUP
   * 
   ********************************************/
  function openStopPopup(code) {
  }

  /********************************************
   * CLOSE STOP POPUP
   * 
   ********************************************/
  function closeStopPopup(e) {

  }

  return {
    init: function (line) { initStops(line); },
    get: function () { return arrets; },
    markers: function() { initStopMarkers(); }
  }
}

/*********************************************
 * DIRECTION LETTER
 * 
 * Fonction qui simplifie le text direction 
 * des lignes d'autobus pour obtenir une lettre.
 * 
 * Exemple: Nord --> N
 * 
 *********************************************/
function directionLetter(directionWord) {
  var directionLetter;
  switch (directionWord.toLowerCase()) {
    case "est":
      directionLetter = "E";
      break;
    case "ouest":
      directionLetter = "W";
      break;
    case "sud":
      directionLetter = "S";
      break;
    case "nord":
      directionLetter = "N";
      break;
  }
  return directionLetter;
}
