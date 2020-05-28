var interval;

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
	fillArrivalsInfo(stop)

	// Met a jour les arrivees du stop aux 5 secondes.
	interval = setInterval(function () { fillArrivalsInfo(stop) }, 5000);
}

/********************************************
 * FILL ARRIVALS INFO
 * 
 * Fonction qui recupere et affiche
 * les arrivees pour un stop sélectionné.
 * La fonction est appelée aux 5 secondes.
 * 
 ********************************************/
function fillArrivalsInfo(stop) {

	// Affiche l'heure de la derniere mise a jour
	displayLastUpdate();

	// ? 
	var oldTable = document.getElementById("arretTable");
	if (oldTable) oldTable.parentNode.removeChild(oldTable);

	var table = document.createElement("table");
	table.setAttribute("id", "arretTable");
	var trTitle = document.createElement("tr");
	var thTitle = document.createElement("th");

	// Affiche le nom du stop sélectionné
	var textTHTitle = document.createTextNode("Prochains passages pour l'arrêt : " + stop);
	trTitle.appendChild(thTitle);
	thTitle.appendChild(textTHTitle);
	table.appendChild(trTitle);

	var today = new Date();
	var day = '0' + today.getDate();
	var tomorrow = '0' + (today.getDate() + 1);
	var month = '0' + today.getMonth();
	var year = today.getFullYear();

	var hourDate = today.getHours();

	var total = 0;
	var pastMidnight = 0;
	var pastMidnightTest = 0;
	var boolAfterMinight = 0;
	var lastHour;

	for (var j = 0; j < arrivals[stop].length; j++) {
		var hour = arrivals[stop][j].substring(0, 2);
		if ((lastHour > hour) || pastMidnightTest == 1) {
			if (hourDate <= hour) {
				boolAfterMinight = 1;
			}
			pastMidnightTest = 1;
		}
		lastHour = hour;
	}
	if (boolAfterMinight == 1) {
		today.setDate(today.getDate() + 1);
	}

	for (var i = 0; i < arrivals[stop].length; i++) {
		var date;
		var hour = arrivals[stop][i].substring(0, 2);
		var minute = arrivals[stop][i].substring(2, 4);

		date = new Date(year, month.slice(-2), tomorrow.slice(-2), hour, minute);
		var hour = ('0' + date.getHours()).slice(-2);
		var minute = ('0' + date.getMinutes()).slice(-2);

		if ((lastHour > hour) || pastMidnight == 1) {
			// Formatage de l'heure des arrivees a afficher
			date = new Date(year, month.slice(-2), tomorrow.slice(-2), hour, minute);
			pastMidnight = 1;
		} else var date = new Date(year, month.slice(-2), day.slice(-2), hour, minute);

		lastHour = hour;

		// Insertion des heures d'arrivées dans le tableau 
		if (date >= today && total < 10) {
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			var textTD = document.createTextNode(hour + 'h' + minute);
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
	// Insere le tableau des arrivees
	document.getElementById("arrivals").appendChild(table);
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