
/********************************************
 * WINDOW ON LOAD
 * 
 * Initialise la récupération des lignes de
 * bus de l'API.
 * 
 * Initialise l'état de l'affichage des
 * catégories de lignes de bus. 
 * 
 ********************************************/
window.onload = function () {

    // Initialise la récupération des lignes de bus
    loadLines(function (lines) { insertLines(lines) },
              function (xhr) { console.error(xhr); });

    // Initialise les boutons du menu (catégories lignes)
    setDisplayLineState();
}