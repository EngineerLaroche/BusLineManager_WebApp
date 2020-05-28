/********************************************
 * LINES HANDLER
 *
 * Fonction qui permet de gérer la récupération
 * des lignes de bus de la STM.
 *
 ********************************************/
var LinesHandler = function () {
  var _ligne = null;

  // Les categories de ligne associés aux boutons (ID) du menu.
  var linesMapping = {
    allLines: "all",
    localLines: "local",
    nightLines: "night",
    expressLines: "express",
    dedicatedLines: "dedicated",
    shuttleOrLines: "shuttleOr",
  };

  /********************************************
   * REQUEST LINES (API)
   * Recupere de l'API les lignes de la STM
   ********************************************/
  function requestLines() {
    var url = lineUrl;

    return new Promise(function (resolve, reject) {
      // Verifie si la requete est dans la cache
      if (!(sessionStorage.getItem(url) == null)) {
        resolve(JSON.parse(sessionStorage.getItem(url)));
      } else {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        console.log(xhr);

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            const answer = JSON.parse(xhr.response);
            resolve(answer);
            sessionStorage.setItem(url, JSON.stringify(answer)); // Ajout dans la cache
          } else {
            lineError(
              xhr,
              reject,
              "Lignes STM - Requête impossible (code: " + xhr.status + ") !"
            );
          }
        };

        xhr.ontimeout = function () {
          lineError(
            xhr,
            reject,
            "Lignes STM - Requête expirée après: " + xhr.timeout + " ms"
          );
        };

        xhr.onerror = function () {
          if (xhr.readyState == 4) {
            lineError(
              xhr,
              reject,
              "Lignes STM - Requête a générée une erreur !\n Veuillez vérifier le url utilisé ou vos paramêtre utilisé."
            );
          } else {
            lineError(
              xhr,
              reject,
              "Lignes STM - Requête a générée une erreur !\n Veuillez vérifier votre connexion internet."
            );
          }
        };

        xhr.onabort = function () {
          lineError(xhr, reject, "Lignes STM - Requête annulée !");
        };

        xhr.timeout = 10000;
        xhr.send();
      }
    });
  }

  /********************************************
   * LINE ERROR
   * Rejète la requete vers l'API en cas d'erreur.
   * Affiche un message d'erreur à l'utilisateur.
   ********************************************/
  function lineError(xhr, reject, msg) {
    alert(msg);
    reject({
      status: this.status,
      statusText: xhr.statusText,
    });
  }

  /********************************************
   * INIT LINES
   * Insère les lignes de la STM dans le menu.
   * Les lignes sont séparées selon la catégorie.
   ********************************************/
  async function initLines() {
    // Recupere les lignes de l'API
    const lignes = await requestLines();

    // Pour chaque catégories de lignes d'autobus
    for (categories in linesMapping) {
      var category = document
        .getElementsByClassName(categories)[0]
        .getElementsByClassName("nested")[0];

      // On récupère toutes les lignes avant de procéder aux catégories
      if (category.id == "all") {
        // Récupère les deux directions avant de passer à la prochaine ligne d'autobus
        for (var i = 0; i < lignes.length; i += 2) {
          var li = document.createElement("li");
          lineNode(li, lignes, i);
          category.appendChild(li);
        }
      } else {
        // On récupère les lignes des catégories
        var busLines = lignes.filter(
          (line) => line.category === linesMapping[categories]
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
   * Associe une ligne à ses deux directions
   ********************************************/
  function lineNode(li, lines, i) {
    li.appendChild(
      document.createTextNode(`${lines[i].id} ${lines[i].name + " : "}`)
    );
    // Démarre le processus d'identification des directions d'une ligne
    li.appendChild(initDirection(lines[i], "left"));
    li.appendChild(initDirection(lines[i + 1], "right"));
  }

  /********************************************
   * INITIALISATION DIRECTION
   * Affiche les 2 directions d'une ligne dans le menu.
   * Au click d'une ligne, on affiche les arrêts dans un tableau
   ********************************************/
  function initDirection(line, directionSide) {
    var directionTag = document.createElement("div");
    directionTag.id = directionSide;

    // Affiche les directions pour une ligne
    var lineDirection = " < " + line.direction + " > ";
    var directionRef = document.createElement("a");

    // Style des directions d'une ligne
    directionRef.style.textDecoration = "none";
    directionRef.style.color = "lightgray";
    directionRef.href = "#";

    // Si l'utilisateur clique sur une direction quelconque d'une ligne
    directionRef.onclick = function () {
      // Affiche la ligne sélectionnée et demarre la recuperation des arrets
      document.getElementById("info-ligne").textContent =
        line.id + " " + line.name + " - " + line.direction;
      _ligne = line;
      arret.init(line);
    };
    directionRef.appendChild(document.createTextNode(`${lineDirection}`));
    return directionTag.appendChild(directionRef);
  }

  return {
    init: function () {
      initLines();
    },
    get: function () {
      return _ligne;
    },
  };
};
