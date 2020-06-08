/********************************************
 * LOAD LINES (API)
 *
 * Fonction qui permet de recuperer les lignes
 * de bus de l'API avec un 'parser' JSON.
 *
 ********************************************/
function loadLines(success, error) {
  const url = `http://localhost:8000/lines`;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE)
      if (xhr.status === 200 && success) {
        const response = JSON.parse(xhr.responseText);

        hideError();
        success(response);
      } else if (error) {
        showError("Le chargement des lignes a échoué.");
        error(xhr);
      }
  };
  xhr.timeout = defaultTimeout;
  xhr.ontimeout = function () {
    showError("Le chargement des lignes n'a pu aboutir dans le délai imparti.");
  };
  xhr.open("GET", url, true);
  xhr.send();
}

/********************************************
 * GET MAP
 *
 * Fonction qui retourne le Mapping des
 * categories de lignes de bus.
 *
 ********************************************/
function getLineMapping() {
  return {
    "lignes-local": "local",
    "lignes-nuit": "night",
    "lignes-express": "express",
    "lignes-navettes": "dedicated",
    "lignes-or": "shuttleOr",
  };
}

/********************************************
 * INSERT LINES
 *
 * Fonction qui gère l'insertion des lignes
 * de bus selon la catégorie.
 *
 ********************************************/
function insertLines(lines) {
  var linesElement = document
    .getElementById("lignes-toutes")
    .getElementsByClassName("contenu-categorie")[0];

  /* Pour toutes les lignes */
  /* Incremente de 2 pour recuperer les deux directions et sauter a la prochaine ligne */
  for (var i = 0; i < lines.length; i += 2) {
    var li = document.createElement("li");
    createLineNode(li, lines, i);
    linesElement.appendChild(li);
  }

  /* Pour toutes lignes de chaque catégories (mapping) */
  for (lineType in getLineMapping()) {
    lineList = lines.filter(
      (ligne) => ligne.category === getLineMapping()[lineType]
    );
    var linesElement = document
      .getElementById(lineType)
      .getElementsByClassName("contenu-categorie")[0];

    /* Pour toutes les lignes d'une categorie */
    /* Incremente de 2 pour recuperer les deux directions et sauter a la prochaine ligne */
    for (var i = 0; i < lineList.length; i += 2) {
      var li = document.createElement("li");
      createLineNode(li, lineList, i);
      linesElement.appendChild(li);
    }
  }
  createLineNode(li, lines, i);
}

/********************************************
 * CREATE LINE NODE
 *
 * Fonction qui crée les noeuds des lignes
 * pour regrouper leurs directions.
 * (ex: nord-sud)
 *
 ********************************************/
function createLineNode(li, lines, index) {
  var lineNameDiv = document.createElement("div");
  lineNameDiv.id = "line-name";
  lineNameDiv.appendChild(
    document.createTextNode(`${lines[index].id} ${lines[index].name + " : "}`)
  );

  // Affiche les directions Gauche et Droite d'une ligne dans le menu
  directionLeftDiv = getDirection(lines[index], "direction-left");
  directionRightDiv = getDirection(lines[index + 1], "direction-right");

  li.appendChild(lineNameDiv);
  li.appendChild(document.createTextNode('<\u00A0'));
  li.appendChild(directionLeftDiv);
  li.appendChild(document.createTextNode('\u00A0 | \u00A0'));
  li.appendChild(directionRightDiv);
  li.appendChild(document.createTextNode('\u00A0>'));
  
}

/********************************************
 * GET DIRECTION
 *
 * Fonction qui retourne la direction gauche
 * ou droite d'une ligne de bus selon l'ID
 * de la direction reçu en paramètre.
 *
 * Permet d'afficher les directions d'une
 * ligne affichée dans une catégorie du menu.
 *
 *    Ex: Sud/Ouest  ou  Nord/Est
 *
 * Fait appel à la fonction fillStopInfo() et
 * lui envoie les paramètres nécessaire
 * pour afficher les arrêts de bus de cette
 * ligne dans un tableau.
 *
 ********************************************/
function getDirection(line, directionID) {
  
  var directionLink = document.createElement("a");
  directionLink.style.textDecoration = "none";
  directionLink.href = "#";

  // Lorsque l'utilisateur clique sur la direction
  directionLink.onclick = function () {
    
    // Met a jour le titre avec la ligne et direction sélectionnée
    updateStopTitle(line);

    // Appel la fonction qui communique avec l'API pour recuperer les arrêts de bus.
    loadStops(line.id, normalizeDirection(line.direction));
    document.getElementById("contenu-droite").style.visibility = "visible";
    document.getElementById("favoris-contenu-droite").style.visibility =
      "visible";
  };

  // Affiche la direction (lien) dans le Menu
  directionLink.appendChild(document.createTextNode(`${line.direction}`));

  var directionDiv = document.createElement("div");
  directionDiv.id = directionID;
  return directionDiv.appendChild(directionLink);
}

/********************************************
 * UPDATE STOP TITLE
 *
 * Fonction qui met a jour le titre de la
 * ligne (direction) sélectionnée.
 *
 ********************************************/
function updateStopTitle(line) {
  var title = line.id + " " + line.name + " - " + line.direction
  document.getElementById("info-ligne").textContent = title;
}

/*********************************************
 * NORMALIZE DIRECTION
 *
 * Fonction qui normalise/simplifie le text
 * de la direction des lignes de bus.
 *
 * Ex: Sud --> S  ou  Ouest --> O
 *
 *********************************************/
function normalizeDirection(directionLetter) {
  var direction;
  switch (directionLetter.toLowerCase()) {
    case "sud":
      direction = "S";
      break;
    case "nord":
      direction = "N";
      break;
    case "est":
      direction = "E";
      break;
    case "ouest":
      direction = "W";
      break;
  }
  return direction;
}
