
// Variables au support de la fermeture d'ouglets qui sont restés ouverts.
var isOpen = false;
var previousID;

// Permet d'afficher ou cacher les lignes d'une categorie en particulier
function toggle(id) {
  var lines = document.getElementById(id);
  lines.parentElement.className += " active";

  // Si un onglet etait deja ouvert, on le ferme avec l'id gardé en mémoire.
  if (isOpen && lines.style.display == "none") {
	const previous = document.getElementById(previousID);
	previous.style.display = "none";
	previous.parentElement.classList.remove("active");
        isOpen = false;
        previousID = id;  
  } else previousID = id;

  // Si l'onglet selectionné est fermé, on l'ouvre.
  if (lines.style.display === "none") {
        lines.style.display = "block";
        isOpen = true;
  } else {
	lines.style.display = "none";
	lines.parentElement.classList.remove("active");
  }
};

window.onload = function () {
  var all = document.getElementById("list_all");
  var local = document.getElementById("list_local");
  var night = document.getElementById("list_night");
  var express = document.getElementById("list_express");
  var navette = document.getElementById("list_navette");
  var navetteOr = document.getElementById("list_navetteOr");
  all.style.display = "none";
  local.style.display = "none";
  night.style.display = "none";
  express.style.display = "none";
  navette.style.display = "none";
  navetteOr.style.display = "none";
}
