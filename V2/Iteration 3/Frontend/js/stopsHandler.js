var favorisStops = {};
var idfav = 0;

var StopsHandler = function () {
  var arrets = null;
  var line = null;
  var favoriStopList = null;

  /********************************************
   * REQUEST STOPS (API)
   * Recupere de l'API les stops de la STM
   ********************************************/
  function requestStops(route, direction) {
    var url = constructURL(stopUrl, route, direction);

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
            stopError(
              xhr,
              reject,
              "Stop STM - Requête impossible (code: " + xhr.status + ") !"
            );
          }
        };

        xhr.ontimeout = function () {
          stopError(
            xhr,
            reject,
            "Stop STM - Requête expirée après: " + xhr.timeout + " ms"
          );
        };

        xhr.onerror = function () {
          if (xhr.readyState == 4) {
            lineError(
              xhr,
              reject,
              "Stop STM - Requête a générée une erreur !\n Veuillez vérifier le url utilisé ou vos paramêtre utilisé."
            );
          } else {
            lineError(
              xhr,
              reject,
              "Stop STM - Requête a générée une erreur !\n Veuillez vérifier votre connexion internet."
            );
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
   * REQUEST FAVORI (API)
   * Recupere de l'API les favori d'un user
   ********************************************/
  function requestFavori() {

    return new Promise(function (resolve, reject) {
      // Verifie si la requete est dans la cache
      let xhr = new XMLHttpRequest();
      xhr.open("GET", userUrl);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          answer = resolve(JSON.parse(xhr.response));
        } else {
          stopError(
            xhr,
            reject,
            "Favori STM - Requête impossible (code: " + xhr.status + ") !"
          );
        }
      };
      xhr.ontimeout = function () {
        stopError(
          xhr,
          reject,
          "Favori STM - Requête expirée après: " + xhr.timeout + " ms"
        );
      };
      xhr.onerror = function () {
        if (xhr.readyState == 4) {
          stopError(
            xhr,
            reject,
            "Favori STM - Requête a générée une erreur !\n Veuillez vérifier le url utilisé ou vos paramêtre utilisé."
          );
        } else {
          stopError(
            xhr,
            reject,
            "Favori STM - Requête a générée une erreur !\n Veuillez vérifier votre connexion internet."
          );
        }
      };
      xhr.onabort = function () {
        stopError(xhr, reject, "Favori STM - Requête annulée !");
      };
      xhr.timeout = 10000;
      xhr.send();
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
          arrivals.init(
            line.id + "-" + directionLetter(line.direction) + "-" + stop.id
          );
          document.getElementById("arrivals").scrollIntoView();
        };

        // Bouton de stop favoris
        const stopFavorisTag = document.createElement("td");
        const favorisButton = document.createElement("button");
        stopFavorisTag.className = "column";
        favorisButton.textContent = "Favoris";

        // Affiche les passages du Stop lorsqu'on appui sur le bouton des favoris
        favorisButton.onclick = function () {
          makeFavorite(
            stop.name,
            stop.id,
            line.id,
            directionLetter(line.direction),
            this
          );
          initfavoris();
        };

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

        // Met les boutons qui sont liés et mis en favoris d'une autre couleur
        getFavorite((data) => {
          if (data.length > 0) {
            // Verifie si le StopCode est actruellement en favoris
            if (
              data[0]["favorite"].includes(
                line.id + "-" + directionLetter(line.direction) + "-" + stop.id
              )
            ) {
              setFavoriteStyle(favorisButton);
            }
          }
        });
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
    // Liste des markers et contenu du marker
    var stopMarkers = [],
      markerContent = [];

    for (var i = 0; i < arrets.length; i++) {
      var stopCode = arrets[i].id;
      var latLng = [arrets[i].lat, arrets[i].lon];
      var popupContent = `<b>${arrets[i].id} ${arrets[i].name}</b>`;
      var stop =
        this.line.id +
        "-" +
        directionLetter(this.line.direction) +
        "-" +
        arrets[i].id;

      // Parametres du marker
      markerContent[stopCode] = L.marker(latLng)
        //.on('popupopen', openStopPopup)
        //.on('popupclose', closeStopPopup)
        .bindPopup(stop)
        .on("click", function () {
          var code =
            this.stopInfo.stopLine +
            "-" +
            this.stopInfo.stopLetter +
            "-" +
            this.stopInfo.stopCode;
          (async () => {
            var arrivalTable = await arrivals.getTable(code, 0);
            this._popup.setContent(arrivalTable);
            this._popup.update();
          })();
        })
        .addTo(carte.get());

      markerContent[stopCode].stopInfo = {
        stopName: arrets[i].name,
        stopCode: arrets[i].id,
        stopLine: this.line.id,
        stopLetter: directionLetter(this.line.direction),
      };
      stopMarkers.push(markerContent[stopCode]);
    }
    // Ajuste la vue de la carte en fonction des markers
    var markerNode = new L.featureGroup(stopMarkers);
    carte.get().fitBounds(markerNode.getBounds(), { padding: L.point(20, 20) });

    // Insertion d'une ligne bleu entre chaque markers
    L.polyline(arrets).addTo(carte.get());
  }

  /********************************************
   * INIT FAVORI STOP MARKERS
   * Associe un marker pour chaque stop.
   * Affiche le contenu du stop avec un popup.
   ********************************************/
  async function initFavoriStopMarkers() {
    // Liste des markers et contenu du marker
    var stopMarkers = [],
      markerContent = [];
    const favori = await requestFavori();
    const favoriStop = favori[0].favorite;
    var customBusIcon = L.icon({
      iconUrl: "style/img/bus_favori_marker.png",
      iconSize: [60, 60],
      iconAnchor: [30, 60],
    });

    // Pour tous les bus recupéré de l'API
    for (var j = 0; j < favoriStop.length; j++) {
      splitFavorite = favoriStop[j].split("-");
      favoriStopList = await requestStops(splitFavorite[0], splitFavorite[1]);

      for (var i = 0; i < favoriStopList.length; i++) {
        var stopCode = favoriStopList[i].id;
        var latLng = [favoriStopList[i].lat, favoriStopList[i].lon];
        var popupContent = `<b>${favoriStopList[i].id} ${favoriStopList[i].name}</b>`;
        var stop =
          splitFavorite[0] +
          "-" +
          splitFavorite[1] +
          "-" +
          favoriStopList[i].id;
        if (favoriStop.includes(stop)) {
          // Parametres du marker
          markerContent[stopCode] = L.marker(latLng, { icon: customBusIcon })
            //.on('popupopen', openStopPopup)
            //.on('popupclose', closeStopPopup)
            .bindPopup(stop)
            .on("click", function () {
              var code =
                this.stopInfo.stopLine +
                "-" +
                this.stopInfo.stopLetter +
                "-" +
                this.stopInfo.stopCode;
              (async () => {
                var arrivalTable = await arrivals.getTable(code, 0);
                this._popup.setContent(arrivalTable);
                this._popup.update();
              })();
            })
            .addTo(carte.get());

          markerContent[stopCode].stopInfo = {
            stopName: favoriStopList[i].name,
            stopCode: favoriStopList[i].id,
            stopLine: splitFavorite[0],
            stopLetter: splitFavorite[1],
          };
          stopMarkers.push(markerContent[stopCode]);
        }
      }
      // Ajuste la vue de la carte en fonction des markers
      var markerNode = new L.featureGroup(stopMarkers);
      //carte.get().fitBounds(markerNode.getBounds(), { padding: L.point(20, 20) });

      // Insertion d'une ligne bleu entre chaque markers
      L.polyline(favoriStopList).addTo(carte.get()).setStyle({ color: "red" });
    }
  }

  /********************************************
   * OPEN STOP POPUP
   *
   ********************************************/
  function openStopPopup(code) {}

  /********************************************
   * CLOSE STOP POPUP
   *
   ********************************************/
  function closeStopPopup(e) {}

  return {
    init: function (line) {
      initStops(line);
    },
    get: function () {
      return arrets;
    },
    markers: function () {
      initStopMarkers();
    },
    markerFavori: function () {
      initFavoriStopMarkers();
    },
  };
};

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

/*********************************************
 * Make favorite
 *
 * Fonction qui retourne rends un arret un favoris
 * ainsi que ses heures d'arrivées.
 *
 *********************************************/
function makeFavorite(
  stopName,
  stopCode,
  lineId,
  lineDirection,
  favoriteButton
) {
  getFavorite((data) => {
    // Gere l'ajout du premier favoris
    if (data.length == 0) {
      addFavorite(lineId, lineDirection, stopCode);
      setFavoriteStyle(favoriteButton);
      setFavoriteDictionary(stopName, stopCode, lineId, lineDirection);
    }
    // Si l'utilisateur n'a pas deja 10 favoris et que le bouton favoris n'a jamais été sélectionné
    else if (
      data[0]["favorite"].length < 10 &&
      !data[0]["favorite"].includes(
        lineId + "-" + lineDirection + "-" + stopCode
      )
    ) {
      // Insere dans la DB un stop favoris
      addFavorite(lineId, lineDirection, stopCode);
      setFavoriteStyle(favoriteButton);
      setFavoriteDictionary(stopName, stopCode, lineId, lineDirection);
    }

    // Si le bouton indique que le stop a deja été mis en favoris
    else if (
      data[0]["favorite"].includes(
        lineId + "-" + lineDirection + "-" + stopCode
      )
    ) {
      // Retire de la DB un stop favoris
      removeFavorite(lineId, lineDirection, stopCode);
      setNormalStyle(favoriteButton);
      delete favorisStops[stopCode];
    }
    // Si l'utilisateur a atteint le maximum de favoris (10)
    else {
      errorMesage(
        "Impossible de faire l'ajout vous avez atteint le maximum de favoris 10)."
      );
    }
  });
}

/*********************************************
 * ADD FAVORITE
 *********************************************/
function addFavorite(lineId, lineDirection, stopCode) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8000/users/gti525test/favorite");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      getFavorite((data) => {
        console.log(xhr.responseText);
      });
    }
  };
  xhr.onerror = function () {
    errorMesage(
      "Une erreur s'est produite. Veuillez vérifier votre connexion."
    );
    console.error(xhr);
  };
  xhr.send(
    JSON.stringify({ stopCode: lineId + "-" + lineDirection + "-" + stopCode })
  );
}

/*********************************************
 * GET FAVORITE
 *********************************************/
function getFavorite(callBack) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", userUrl);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(xhr.responseText);
      callBack(data);
    }
  };
  xhr.onerror = function () {
    errorMesage(
      "Une erreur s'est produite. Veuillez vérifier votre connexion."
    );
    console.error(xhr);
  };
  xhr.send();
}

/*********************************************
 * REMOVE FAVORITE
 *********************************************/
function removeFavorite(lineId, lineDirection, stopCode) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8000/users/gti525test/favorite");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      getFavorite((data) => {
        console.log(xhr.responseText);
      });
    }
  };
  xhr.onerror = function () {
    errorMesage(
      "Une erreur s'est produite. Veuillez vérifier votre connexion."
    );
    console.error(xhr);
  };
  xhr.send(
    JSON.stringify({ stopCode: lineId + "-" + lineDirection + "-" + stopCode })
  );
}

/********************************************
 *Button Style Modified
 ********************************************/
function setFavoriteStyle(button) {
  button.style.color = "white";
  button.style.backgroundColor = "rgb(" + 0 + "," + 159 + "," + 227 + ")";
}

/********************************************
 *Button Style Normal
 ********************************************/
function setNormalStyle(button) {
  button.style.color = "black";
  button.style.backgroundColor = "rgb(" + 221 + "," + 221 + "," + 221 + ")";
}

/*********************************************
 *Popup Invalid
 *********************************************/
function errorMesage(message) {
  // Recupere le snackbar du DIV
  var x = document.getElementById("invalidMessage");
  x.innerHTML = message;
  x.hidden = false;

  // On efface apres 5 sec
  setTimeout(function () {
    x.hidden = true;
  }, 3000);
}

/********************************************
 * GET STOPS
 ********************************************/
function getStops() {
  return stopsInfo;
}

/********************************************
 * GET FAVORITE STOP
 *
 ********************************************/
function getFavoriteStop() {
  return favorisStops;
}

/********************************************
 * SET FAVORITE DICTIONARY
 ********************************************/
function setFavoriteDictionary(stopName, stopCode, lineId, lineDirection) {
  favorisStops[idfav] = [stopName, stopCode, lineId, lineDirection];
  idfav++;
}

/********************************************
 * IS EMPTY
 *
 * Fonction qui verifie si le dictionnaire
 * composé de l'info des favoris n'est pas
 * vide. Techniquement, c'est une fonction
 * temporaire.
 *
 ********************************************/
function isEmpty(myObject) {
  for (var key in myObject) {
    if (myObject.hasOwnProperty(key)) return false;
  }
  return true;
}
/********************************************
 *Init favoris
 ********************************************/
async function initfavoris() {
  idfav = 0;
  getFavorite(setDataFavoris);
  // Recupere l'info (tags) HTML
  const favorisTable = document.getElementById("favoris");
  const oldFavorisTable = favorisTable.getElementsByTagName("tbody")[0];
  const newFavorisTable = document.createElement("tbody");
  for (var key in favorisStops) {
    const stopName = favorisStops[key][0];
    const stopCode = favorisStops[key][1];
    const lineId = favorisStops[key][2];
    const lineDirection = favorisStops[key][3];
    const line = lineId + lineDirection;

    // Stop line
    const stopLineTag = document.createElement("td");
    stopLineTag.className = "column";
    stopLineTag.textContent = line;

    // Stop name
    const stopNameTag = document.createElement("td");
    stopNameTag.className = "column";
    stopNameTag.textContent = stopName;

    // Stop ID
    const stopIDTag = document.createElement("td");
    stopIDTag.className = "column";
    stopIDTag.textContent = stopCode;

    // Bouton arrivées pour un stop
    const arrivalRefTag = document.createElement("td");
    const arrivalButton = document.createElement("button");
    arrivalRefTag.className = "column";
    arrivalButton.textContent = "Prochains passages";

    // Affiche les passages du Stop lorsqu'on appui sur le bouton des arrivées
    arrivalButton.onclick = function () {
      arrivals.initFavori(lineId + "-" + lineDirection + "-" + stopCode);
      document.getElementById("arrivals").scrollIntoView();
    };

    // Bouton de stop favoris
    const stopFavorisTag = document.createElement("td");
    const favorisButton = document.createElement("button");
    stopFavorisTag.className = "column";
    favorisButton.textContent = "Favoris";
    setFavoriteStyle(favorisButton);

    // Affiche les passages du Stop lorsqu'on appui sur le bouton des favoris
    favorisButton.onclick = function () {
      makeFavorite(stopName, stopCode, lineId, lineDirection, this);
      initfavoris();
    };

    // Insertion du bouton des arrivées et des favoris
    arrivalRefTag.appendChild(arrivalButton);
    stopFavorisTag.appendChild(favorisButton);

    // Insertion de l'information d'un stop sur une ligne tu tableau
    var favElement = document.createElement("tr");
    favElement.appendChild(stopLineTag);
    favElement.appendChild(stopNameTag);
    favElement.appendChild(stopIDTag);
    favElement.appendChild(arrivalRefTag);
    favElement.appendChild(stopFavorisTag);
    newFavorisTable.appendChild(favElement);
  }

  favorisTable.removeChild(oldFavorisTable);
  favorisTable.appendChild(newFavorisTable);
}

/********************************************
*Fonctionne qui rajoute chaque favoris dans
 le dictionnaire de favoris 
********************************************/
async function setDataFavoris(data) {
  for (var i = 0; i < data[0].favorite.length; i++) {
    var str = data[0].favorite[i];
    splitData = str.split("-");
    var lineId = splitData[0];
    var lineDirection = splitData[1];
    var stopCode = splitData[2];

    var stopName = "pasDansLaBD";

    setFavoriteDictionary(stopName, stopCode, lineId, lineDirection);
  }
}
