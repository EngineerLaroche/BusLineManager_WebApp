
/* Mapping des categories de lignes */
var lineMapping = {
  "lignes-local": "local",
  "lignes-nuit": "night",
  "lignes-express": "express",
  "lignes-navettes": "dedicated",
  "lignes-or": "shuttleOr"
};

var linesElement = 
document.getElementById("lignes-toutes")
.getElementsByClassName("contenu-categorie")[0];

/* Pour toutes les lignes */
/* Incremente de 2 pour recuperer les deux directions et sauter a la prochaine ligne */
for (var i = 0; i < lines.length; i += 2) {
  var li = document.createElement("li");
  
  var direction = "(" + lines[i].direction + "-" + lines[i + 1].direction + ")";

  /* Insertion de l'information dans la liste */
  /*li.appendChild(
    document.createTextNode(
      `${lines[i].id} ${lines[i].name} ${direction}`
    )
  );*/

  
  createLineNode(li, lines, i);
  linesElement.appendChild(li);
}

/* Pour toutes lignes de chaque catégories (mapping) */
for (lineType in lineMapping) {

  lineList = lines.filter(ligne => ligne.category === lineMapping[lineType]);
  var linesElement = document
    .getElementById(lineType)
    .getElementsByClassName("contenu-categorie")[0];

  /* Pour toutes les lignes d'une categorie */
  /* Incremente de 2 pour recuperer les deux directions et sauter a la prochaine ligne */
  for (var i = 0; i < lineList.length; i += 2) {
    var li = document.createElement("li");
    var direction = "(" + lineList[i].direction + "-" + lineList[i + 1].direction + ")";
    
    /* Insertion de l'information dans la liste */
    /*li.appendChild(
      document.createTextNode(
        `${lineList[i].id} ${lineList[i].name} ${direction}`
      )
    );*/
  
    createLineNode(li, lineList, i);
    linesElement.appendChild(li);
  }
}

function createLineNode(li, lines,  i) {
  var lineNameDiv = document.createElement("div");
  lineNameDiv.id = "line-name";
  lineNameDiv.appendChild(
    document.createTextNode(
      `${lines[i].id} ${lines[i].name}`
    )
  );


  //direction gauche
  var directionLeftDiv = document.createElement("div");
  directionLeftDiv.id = "direction-left";
  var directionLeft = "(" + lines[i].direction + ")";

  var directionLeftLink = document.createElement("a");
  directionLeftLink.href = "#"

  directionLeftLink.onclick = function() {
    updateStopTitle(lines[i].id + "-" + lines[i].direction);
    fillStopInfo(lines[i].id, lines[i].direction);
    document.getElementById("contenu-droite").style.visibility = "visible";
  }

  directionLeftLink.appendChild(
    document.createTextNode(
      `${directionLeft}`
    )
  );
  directionLeftDiv.appendChild(directionLeftLink);
  
  //direction droite
  var directionRightDiv = document.createElement("div");
  directionRightDiv.id = "direction-right";
  var directionRight = "(" + lines[i+1].direction + ")";

  var directionRightLink = document.createElement("a");
  directionRightLink.href = "#"

  directionRightLink.onclick = function() {
    updateStopTitle(lines[i+1].id + "-" + lines[i+1].direction);
    fillStopInfo(lines[i+1].id, lines[i+1].direction);
    document.getElementById("contenu-droite").style.visibility = "visible";
  }
  directionRightLink.appendChild(
    document.createTextNode(
      `${directionRight}`
    )
  );
  directionRightDiv.appendChild(directionRightLink);
  

  li.appendChild(lineNameDiv);
  li.appendChild(directionLeftDiv);
  li.appendChild(directionRightDiv);
}

function updateStopTitle(title) {
  document.getElementById("info-ligne").textContent = title;
}