/********************************************
 * MANAGE LINES
 * 
 * Fonction qui procède a l'insertion des lignes
 * d'autobus selon la catégorie dans le menu
 * de gauche de l'application.
 * 
 ********************************************/
function manageLines(linesMapping) {

  // Pour chaque catégories de lignes d'autobus
  for (categories in linesMapping) {

    var category = document
      .getElementById(categories)
      .getElementsByClassName("nested")[0];

    // On récupère toutes les lignes avant de procéder aux catégories du fichier JSON 
    if (category.id == "all") {

      // Récupère les deux directions avant de passer à la prochaine ligne d'autobus
      for (var i = 0; i < lines.length; i += 2) {
        var li = document.createElement("li");
        lineNode(li, lines, i);
        category.appendChild(li);
      }
    } 
    // On récupère les lignes des catégories du fichier JSON
    else {
      var busLines = lines.filter(ligne =>
        ligne.category === linesMapping[categories]
      );

      // Récupère les deux directions avant de passer à la prochaine ligne d'autobus
      for (var i = 0; i < busLines.length; i += 2) {
        var li = document.createElement("li");
        lineNode(li, busLines, i);
        category.appendChild(li);
      }
    }
  }
}

/********************************************
 * LINE NODE
 * 
 * Fonction qui associe dans un dictionnaire
 * l'information propre à une ligne et qui 
 * ensuite initialise le début du processus 
 * d'identification de la direction pour chaque 
 * lignes d'autobus.
 * 
 ********************************************/
function lineNode(li, lines, i) {
  li.appendChild(
    document.createTextNode(
      `${lines[i].id} ${lines[i].name + " : "}`
    )
  );

  // Démarre le processus d'identification des directions d'une ligne
  li.appendChild( initDirection(lines, i, "left") );
  li.appendChild( initDirection(lines, i + 1, "right") );
}

/********************************************
* INITIALISATION DIRECTION
* 
* Fonction qui Permet d'afficher les directions 
* d'une ligne d'autobus.
* 
*    Exemple: Nord-Sud  &  Est-Ouest
* 
* Démarrage de l'insertion de l'information
* dans le tableau des arrêts.
* 
********************************************/
function initDirection(lines, i, directionID) {

  var directionTag = document.createElement("div");
  directionTag.id = directionID;

  // Affiche les directions pour une ligne
  var lineDirection = " < " + lines[i].direction + " > ";
  var directionRef = document.createElement("a");

  // Style des directions d'une ligne
  directionRef.style.textDecoration = "none";
  directionRef.style.color = "lightgray";
  directionRef.href = "#";

  // Si l'utilisateur clique sur une direction quelconque d'une ligne
  directionRef.onclick = function () {

    // Affiche la ligne sélectionnée au dessus du tableau
    lineTitle(lines[i].id + " " + lines[i].name + " - " + lines[i].direction);

    // Insère l'information des arrêts de bus
    fillStopInfo(lines[i].id, directionLetter(lines[i].direction));
  }
  directionRef.appendChild(document.createTextNode(`${lineDirection}`));
  return directionTag.appendChild(directionRef);
}

/********************************************
 * LINE NAME
 * 
 * Fonction qui affiche le nom de la ligne au
 * dessus du tableau.
 * 
 ********************************************/
function lineTitle(line) {
  document.getElementById("lineTitle").textContent = line;
}

/*********************************************
 * DIRECTION LETTER
 * 
 * Fonction qui simplifie le text direction 
 * des lignes d'autobus pour obtenir une lettre.
 * 
 * Exemple: ouest --> O
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