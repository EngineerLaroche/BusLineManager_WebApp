/********************************************
 * WINDOW ON LOAD
 * 
 * Initialise l'état des boutons du menu et
 * appels les fonctions de gestion des lignes
 * d'autobus.
 * 
 ********************************************/
window.onload = function () {

  // Recupere les ID des boutons (categories) du menu de gauche
  var all = document.getElementById("all");
  var local = document.getElementById("local");
  var night = document.getElementById("night");
  var express = document.getElementById("express");
  var navette = document.getElementById("dedicated");
  var navetteOr = document.getElementById("shuttleOr");

  // Pré-Initialise les boutons du menu pour éviter la nécessité de devoir cliquer 
  // une premiere fois pour l'initialiser et une deuxieme fois pour afficher les lignes.
  all.style.display = "none";
  local.style.display = "none";
  night.style.display = "none";
  express.style.display = "none";
  navette.style.display = "none";
  navetteOr.style.display = "none";

  // Le mapping des categories de ligne d'autobus associés aux boutons du menu.
  var linesMapping = {
    "allLines": "all",
    "localLines": "local",
    "nightLines": "night",
    "expressLines": "express",
    "dedicatedLines": "dedicated",
    "shuttleOrLines": "shuttleOr"
  };

  // Demarre l'insertion des lignes d'autobus 
  manageLines(linesMapping);

  // Demarre l'affichage dynamique des lignes d'autobus du menu
  displayToggle();

}