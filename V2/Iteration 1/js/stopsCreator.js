/*********************************************
 * FILL STOP INFO
 * 
 * Fonction utilisé pour structurer et afficher
 * les arrivées de l'arrêt choisi dans un tableau.
 * 
 *********************************************/
function fillStopInfo(lineID, direction) {

    var stopId = lineID + "-" + direction
    var stopsInfo = stops[stopId];

    // Recupere l'info (tags) HTML
    const stopTable = document.getElementById("stops");
    const oldStopTable = stopTable.getElementsByTagName("tbody")[0];
    const newStopTable = document.createElement("tbody");
    
    for (const stop of stopsInfo) {
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

        // Lorsque l'utilisateur appui sur le bouton des arrivées
        arrivalButton.onclick = function () {
          const lineNumber = stopId.split('-');
          const lineID = lineNumber[0];
          const directionID = lineNumber[1];
          const stopID = stop.id;

          // Demarre le processus d'affichage des passages d'autobus pour ce stop
          updateArrivals(lineID + "-" + directionID + "-" + stopID);
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
  }