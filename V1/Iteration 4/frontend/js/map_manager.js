// Variable glogale représentant une instance de la carte (map)
var mtl_map = null;

// Variable glogale représentant la première ouverture de la carte
var isFirst = true;

// Variable globale représentant l'intervalle de temps entre chaque rafraîchissement du positionnement des bus
var busPositionsInterval;

// Variable globale représentant un objet permettant d'annuler la dernière requête des positionnements des bus
var fetchBusPositionsCancellationToken;

// Variable globale contenant les marqueurs des positionnements des autobus
var busMarkers = [];

/********************************************
 * DISPLAY MAP
 *
 * Fonction qui permet d'initialiser une carte
 * avec comme point de départ la ville de
 * Montréal. C'est ici qu'on communique
 * avec l'API de MapBox.
 *
 ********************************************/
function displayMap() {
  // Initialisation de la position de depart (Montréal) de la carte
  var mtl_coord = [45.541112, -73.714154];
  mtl_map = L.map("mapid").setView(mtl_coord, 11);

  // Parametre de la carte
  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiazFuNmFyM2EiLCJhIjoiY2p4ZHJkMTJsMGg4NjNwbnV5MzY2YW5xZSJ9.yHgKm598aQo9rP7I2qLKaQ",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 20,
      id: "mapbox.streets",
      accessToken: "your.mapbox.access.token",
    }
  ).addTo(mtl_map);

  // Met en place les markers (arrets et bus) sur la carte
  if (getStops() != null) {
    setMarkers();
    setBusMarkers();

    if (busPositionsInterval != null) {
      clearInterval(busPositionsInterval);
    }

    // Mise à jour des positionnements des bus à intervalle régulier (5 sec)
    busPositionsInterval = setInterval(function () {
      setBusMarkers();
    }, 5000);
  }
}

/********************************************
 * SET MARKERS
 *
 * Fonction qui permet d'insérer et afficher
 * tous les markers (points d'arrêts) d'une
 * ligne de bus sur une carte.
 *
 ********************************************/
function setMarkers() {
  getFavorite((data) => {
    const stops = getStops();

    if (mtl_map != null && stops != null) {
      var markerArray = []; // Liste des points d'arrêts (markers)
      var marker = []; // Dictionnaire d'information du marker

      for (var i = 0; i < stops.length; i++) {
        var stopCode = stops[i].id;
        var latLng = [stops[i].lat, stops[i].lon];
        var popupContent = `<b>Code:</b> ${stops[i].id}<br/> <b>Arrêt:</b> ${stops[i].name} <br/> <b>Passages:</b>`;

        var icon = null;
        if (data[0]["favorite"].includes(stops[i].id)) {
          icon = L.icon({
            iconUrl: "images/stop-marker-favorite.png",
            iconSize: [60, 60], // size of the icon
            iconAnchor: [30, 60], // anchor of the icon
          });
        } else {
          icon = L.icon({
            iconUrl: "images/stop-marker.png",
            iconSize: [30, 30], // size of the icon
            iconAnchor: [15, 30], // anchor of the icon
          });
        }

        marker[stopCode] = L.marker(latLng, {
          icon: icon,
          maxHeight: 30
        })
          .on("popupopen", openPopup)
          .on("popupclose", closePopup)
          .bindPopup(popupContent)
          .addTo(mtl_map);

        marker[stopCode].stopInfo = {
          stopName: stops[i].name,
          stopCode: stops[i].id,
        };
        markerArray.push(marker[stopCode]);
      }
      // Ajuste la taille de la fenetre en fonction des markers
      fitMarkersToWindow(markerArray);

      // Ajoute la ligne reliant chaque Stop
      L.polyline(stops).addTo(mtl_map);

      // Arrêts entre le premier favoris et le dernier favoris
      var favoriteStopsLine = [];
      var firstIndex = null;
      var lastIndex = null;
      for (var i = 0; i < stops.length; i++) {
        if (data[0]["favorite"].includes(stops[i].id)) {
          if (firstIndex == null) {
            firstIndex = i;
          } else {
            lastIndex = i;
          }
        }
      }

      if (firstIndex != null && lastIndex != null) {
        for (var i = firstIndex; i <= lastIndex; i++) {
          favoriteStopsLine.push(stops[i]);
        }
        L.polyline(favoriteStopsLine, { color: "red" }).addTo(mtl_map);
      }
    }
  });
}

/********************************************
 * FIT MARKERS TO WINDOW
 *
 * Ajuste la taille de la carte en fonction
 * de la position géographique des markers.
 *
 ********************************************/
function fitMarkersToWindow(markerArray) {
  var grouppedMarkers = new L.featureGroup(markerArray);
  mtl_map.fitBounds(grouppedMarkers.getBounds(), { padding: L.point(20, 20) });
}

/********************************************
 * OPEN POPUP
 *
 * Lorsque l'utilisateur clique sur un marker,
 * on affiche un popup et on insère l'heure
 * des 10 prochains passages de bus pour cet
 * arrêt.
 *
 * Uniquement pour le tout premier click
 * sur un marker (lors d'une nouvelle session),
 * on attend les heures d'arrivées de celui-ci.
 * Tous les autre click sur un marker aura
 * déjà l'appel vers l'API d'initialisé.
 *
 ********************************************/
function openPopup(e) {
  // Récupère le popup en cours
  var popup = e.target.getPopup();
  var content = popup.getContent();
  var info = e.target.stopInfo;
  var tenArrivals = "";

  // Recupere l'horaire des arrivées
  fetchArrivals(info.stopName, markerLine, markerDirection, info.stopCode);
  waitFirstMarkerClick();

  // Lors du tout premier click sur un marker, s'assure d'attendre l'information des arrivées.
  function waitFirstMarkerClick() {
    if (firstMarkerClick) {
      setTimeout(function () {
        waitFirstMarkerClick();
      }, 100);
    } else {
      // Récupère les heures d'arrivées (10) du Stop sélectionné
      const arrivalTimes = getArrivalTime();

      // Regroupe les heures d'arrivée pour être mis dans le popup
      if (arrivalTimes.length > 0)
        for (var i = 0; i < 3; i++)
          tenArrivals += arrivalTimes[i] + ", " ;

      // Insere le contenu dans le popup
      popup.setContent(content + "&nbsp&nbsp" + tenArrivals);
      popup.update();
    }
  }
}

/********************************************
 * CLOSE MARKER
 *
 * Lorsque le popup est fermé, on supprime
 * son contenu sauf le titre représentant
 * le code et le nom de l'arret.
 *
 * Cette fonction évite qu'à chaque click
 * sur le marker que le contenu du popup soit
 * dupliqué.
 *
 ********************************************/
function closePopup(e) {
  var popup = e.target.getPopup();
  var content = popup.getContent();
  content = content.substring(0, content.indexOf("<br>"));
  popup.setContent(content);
}

/********************************************
 * SET BUS MARKERS
 *
 * Fonction qui permet d'insérer et afficher
 * tous les markers (bus) d'une
 * ligne de bus sur une carte.
 *
 ********************************************/
async function setBusMarkers() {
  if (mtl_map != null) {
    try {
      // Annulation de la dernière requête si celle-ci existe
      if (fetchBusPositionsCancellationToken != null) {
        fetchBusPositionsCancellationToken.cancel();
      }

      // Retrait des marqueurs précédents
      busMarkers.forEach((marker) => {
        mtl_map.removeLayer(marker);
      });

      fetchBusPositionsCancellationToken = {};
      const positions = await fetchBusPositions(
        markerLine,
        markerDirection,
        fetchBusPositionsCancellationToken
      );
      hideError();
      const stops = getStops();

      var busIcon = L.icon({
        iconUrl: "images/bus-marker.png",
        iconSize: [60, 60], // size of the icon
        iconAnchor: [30, 55], // anchor of the icon
      });

      busMarkers = [];

      for (var i = 0; i < positions.length; i++) {
        const nextStop = stops.find((stop) => {
          return stop.id == positions[i].next_stop;
        });
        const popupContent = document.createElement("b");

        if (nextStop != null) {
          popupContent.textContent = `Prochain arrêt : ${nextStop.name}`;
        } else {
          popupContent.textContent = "Aucun arrêt prochainement";
        }

        const marker = L.marker([positions[i].lat, positions[i].lon], {
          icon: busIcon,
        })
          .bindPopup(popupContent)
          .addTo(mtl_map);

        busMarkers.push(marker);
      }
    } catch (e) {
      console.error(e);
      showError("Le chargement des positions des autobus a échoué.");
    }
  }
}

/********************************************
 * INIT MAP
 *
 * Fonction qui initialise une premiere fois
 * la carte si ce n'est pas déjà fait, sinon
 * on réinitialise la carte avec les nouveaux
 * arrêts de bus selon la sélection de ligne
 * de l'utilisateur.
 *
 ********************************************/
function initMap() {
  if (isFirst) {
    displayMap();
    isFirst = false;
  } else resetMap();
}

/********************************************
 * RESET MAP
 *
 * Fonction qui réinitialise la carte pour
 * afficher les nouveaux arrêts de bus
 * sélectionnés par l'utilisateur.
 *
 ********************************************/
function resetMap() {
  mtl_map.off();
  mtl_map.remove();
  mtl_map = null;
  displayMap();
}

/********************************************
 * GET MAP
 *
 * Fonction simple qui retourne l'instance de
 * la carte. On utilise une fonction au lieux de
 * la variable globale pour éviter les mauvaises
 * utilisations de l'instance.
 *
 ********************************************/
function getMap() {
  return mtl_map;
}
