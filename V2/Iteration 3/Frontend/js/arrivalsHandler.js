
var ArrivalsHandler = function () {
	var interval;
	var answer;

	  /********************************************
	   * REQUEST ARRIVALS (API)
	   * Recupere de l'API les stops de la STM
	   ********************************************/
	  function requestStops(route, direction, stopCode) {
		  
		var url = constructURL(arrivalUrl, route, direction, stopCode);
		
		return new Promise(function (resolve, reject) {

			// Verifie si la requete est dans la cache
			let xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onload = function () {
			  if (xhr.status >= 200 && xhr.status < 300) {
				answer = resolve(JSON.parse(xhr.response));
			  } else {
				stopError(xhr, reject, "Arrival STM - Requête impossible (code: " + xhr.status + ") !");
			  }
			};
			xhr.ontimeout = function () {
			  stopError(xhr, reject, "Arrival STM - Requête expirée après: " + xhr.timeout + " ms");
			}
			xhr.onerror = function () {
				  if(xhr.readyState == 4){
					lineError(xhr, reject, "Arrival STM - Requête a générée une erreur !\n Veuillez vérifier le url utilisé ou vos paramêtre utilisé.");
				  }else{
					lineError(xhr, reject, "Arrival STM - Requête a générée une erreur !\n Veuillez vérifier votre connexion internet.");
				  }
			};
			xhr.onabort = function () {
			  stopError(xhr, reject, "Arrival STM - Requête annulée !");
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
	  
	/********************************************
	 * UPDATE ARRIVALS
	 * 
	 * Met à jour les arrivées du stop sélectionné
	 * à tous les 5 secondes. Si l'utilisateur 
	 * sélectionne un autre stop, on réinitialise
	 * la fonction d'interval.
	 * 
	 ********************************************/
	function updateArrivals(stop) {

		// Retire l'interval si l'utilisateur sélectionne un autre stop
		if (interval != null) clearInterval(interval);
		// Affiche les arrivees du stop.
		var table = fillArrivalsInfo(stop, 1);
		

		// Met a jour les arrivees du stop aux 5 secondes.
		interval = setInterval(function () { fillArrivalsInfo(stop,1) }, 10000);
	}
	  
	/********************************************
	 * UPDATE ARRIVALS FAVORIE
	 * 
	 * Met à jour les arrivées du stop sélectionné
	 * à tous les 5 secondes. Si l'utilisateur 
	 * sélectionne un autre stop, on réinitialise
	 * la fonction d'interval.
	 * 
	 ********************************************/
	function updateArrivalsFavori(stop) {

		// Retire l'interval si l'utilisateur sélectionne un autre stop
		if (interval != null) clearInterval(interval);
		// Affiche les arrivees du stop.
		var table = fillArrivalsFavorieInfo(stop, 1);
		

		// Met a jour les arrivees du stop aux 5 secondes.
		interval = setInterval(function () { fillArrivalsFavorieInfo(stop,1) }, 10000);
	}

	/********************************************
	 * FILL ARRIVALS INFO
	 * 
	 * Fonction qui recupere et affiche
	 * les arrivees pour un stop sélectionné.
	 * La fonction est appelée aux 5 secondes.
	 * 
	 ********************************************/
	async function fillArrivalsInfo(stop, arrivals) {
		
		var res = stop.split("-");
		
		var arrivalsAPI = await requestStops(res[0], res[1], res[2]);
		
		// Affiche l'heure de la derniere mise a jour
		displayLastUpdate();

		var oldTable = document.getElementById("arretTable");
		if (oldTable) oldTable.parentNode.removeChild(oldTable);

		var table = document.createElement("table");
		if (arrivals == 1) {
			table.setAttribute("id", "arretTable");
		}else{
			table.setAttribute("id", "arretTableMap");
		}
		var trTitle = document.createElement("tr");
		var thTitle = document.createElement("th");

		// Affiche le nom du stop sélectionné
		var textTHTitle = document.createTextNode("Prochains passages pour l'arrêt : " + stop);
		trTitle.appendChild(thTitle);
		thTitle.appendChild(textTHTitle);
		table.appendChild(trTitle);

		var total = 0;
		var upcoming = 0;
		var hour;
		var minute;
		
		for (var i = 0; i < arrivalsAPI.length; i++) {
			upcoming = 0;
			if(arrivalsAPI[i].length > 2){
				hour = arrivalsAPI[i].substring(0, 2);
				minute = arrivalsAPI[i].substring(2, 4);
			}else{
				minute = arrivalsAPI[i].substring(0, 2);
				upcoming = 1;
			}

			if (total < 10) {
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				if(upcoming == 1){
					var textTD = document.createTextNode(minute + ' min');
					td.setAttribute("id", "upcomingArret");
				}else{
					var textTD = document.createTextNode(hour + 'h' + minute);
				}
				td.appendChild(textTD);
				tr.appendChild(td);
				table.appendChild(tr);
				total++;
			}
		}

		// S'il n'y a aucuns prochains passages de prévus.
		if (total == 0) {
			var aucunPassageText = document.createTextNode(" Il ne reste aucun passage pour aujourd'hui ");
			var trPassage = document.createElement("tr");
			var tdPassage = document.createElement("td");
			trPassage.appendChild(tdPassage);
			tdPassage.appendChild(aucunPassageText);
			table.appendChild(trPassage);
		}
		
		if (arrivals == 1) {
			displayResult(table);
		}
		
		return table;
	}

	/********************************************
	 * FILL ARRIVALS INFO
	 * 
	 * Fonction qui recupere et affiche
	 * les arrivees pour un stop sélectionné.
	 * La fonction est appelée aux 5 secondes.
	 * 
	 ********************************************/
	async function fillArrivalsFavorieInfo(stop, arrivals) {
		
		var res = stop.split("-");
		
		var arrivalsAPI = await requestStops(res[0], res[1], res[2]);
		
		// Affiche l'heure de la derniere mise a jour
		displayLastUpdate();

		var oldTable = document.getElementById("arretTable");
		if (oldTable) oldTable.parentNode.removeChild(oldTable);

		var table = document.createElement("table");
		if (arrivals == 1) {
			table.setAttribute("id", "arretTable");
		}else{
			table.setAttribute("id", "arretTableMap");
		}
		var trTitle = document.createElement("tr");
		var thTitle = document.createElement("th");

		// Affiche le nom du stop sélectionné
		var textTHTitle = document.createTextNode("Prochains passages pour l'arrêt : " + stop);
		trTitle.appendChild(thTitle);
		thTitle.appendChild(textTHTitle);
		table.appendChild(trTitle);

		var total = 0;
		var upcoming = 0;
		var hour;
		var minute;
		
		for (var i = 0; i < arrivalsAPI.length; i++) {
			upcoming = 0;
			if(arrivalsAPI[i].length > 2){
				hour = arrivalsAPI[i].substring(0, 2);
				minute = arrivalsAPI[i].substring(2, 4);
			}else{
				minute = arrivalsAPI[i].substring(0, 2);
				upcoming = 1;
			}

			if (total < 10) {
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				if(upcoming == 1){
					var textTD = document.createTextNode(minute + ' min');
					td.setAttribute("id", "upcomingArret");
				}else{
					var textTD = document.createTextNode(hour + 'h' + minute);
				}
				td.appendChild(textTD);
				tr.appendChild(td);
				table.appendChild(tr);
				total++;
			}
		}

		// S'il n'y a aucuns prochains passages de prévus.
		if (total == 0) {
			var aucunPassageText = document.createTextNode(" Il ne reste aucun passage pour aujourd'hui ");
			var trPassage = document.createElement("tr");
			var tdPassage = document.createElement("td");
			trPassage.appendChild(tdPassage);
			tdPassage.appendChild(aucunPassageText);
			table.appendChild(trPassage);
		}
		
		if (arrivals == 1) {
			displayResultFavori(table);
		}
		
		return table;
	}

	function displayResult(table){
		
		// Insere le tableau des arrivees
		document.getElementById("arrivals").appendChild(table);
		
	}

	function displayResultFavori(table){
		
		// Insere le tableau des arrivees
		document.getElementById("favorisArrivals").appendChild(table);
		
	}


	/********************************************
	 * DISPLAY LAST UPDATE
	 * 
	 * Fonction qui affiche la date et heure
	 * de la derniere mise a jour des arrivees
	 * d'un stop choisi.
	 * 
	 ********************************************/
	function displayLastUpdate() {
		var today = new Date();
		var seconde = today.getSeconds();
		var minute = today.getMinutes();
		var heure = today.getHours();

		// Pour afficher par exemple: '03' seconde au lieux de '3' secondes
		if (seconde < 10) seconde = "0" + seconde;
		if (minute < 10) minute = "0" + minute;
		if (heure < 10) heure = "0" + heure;

		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		var time = heure + "h" + minute + ":" + seconde;
		document.getElementById("lastUpdate").innerHTML = "Dernière mise à jour :  " + date + ' à ' + time;
	}
	
	
  return {
    init: function (stop) { updateArrivals(stop); },
	requestStops: function (route, direction, stopCode) { return requestStops(route, direction, stopCode); },
    initFavori: function (stop) { updateArrivalsFavori(stop); },
    getTable: function (stop, arrivals) { return fillArrivalsInfo(stop, arrivals); }
  }
}	