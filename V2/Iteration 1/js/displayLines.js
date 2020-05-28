var categoryIsOpen = false;
var previousCategoryID;

/********************************************
 * CLICK MANAGEMENT
 * 
 * Permet d'ajouter à tous les boutons du 
 * menu gauche un 'listener' pour qu'ils
 * réagissent au clic de la souris. Fonction
 * surtout orienté sur le design du 'caret'.
 * 
 ********************************************/
function displayToggle() {

    var toggler = document.getElementsByClassName("caret");
    for (var i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            removeClassFromOtherActive(this);
            this.classList.toggle("caret-down");
        });
    }
}

/********************************************
 * REMOVE CLASS FROM OTHER ACTIVE
 * 
 * Permet de retire la class caret-down ou 
 * active des autres element actif du code. 
 * 
 ********************************************/
function removeClassFromOtherActive(elementActive) {
    var element = document.getElementsByClassName("caret-down");
    var listOpen = document.getElementsByClassName("active");
    categoryIsOpen = elementActive.parentElement.querySelector(".nested").classList.toggle("active");

    for (i = 0; i < element.length; i++) {
        if (elementActive != element[i]) {
            element[i].classList.toggle("caret-down");
        }
    }
    for (i = 0; i < listOpen.length; i++) {
        if (categoryIsOpen != listOpen[i]) {
            listOpen[i].classList.toggle("active");
        }
    }
}

/********************************************
 * MANAGE TOGGLE
 * 
 * Permet de cacher les lignes d'une categorie 
 * lorsque l'utilisateur décide de clicker sur
 * une autre catégorie. En d'autres mots,
 * toujours garder au maximum une catégorie
 * de lignes ouverte. 
 * 
 ********************************************/
function manageToggle(id) {
    var category = document.getElementById(id);

    // Si un bouton (categorie) est ouvert, on garde son id en mémoire et on le ferme.
    if (categoryIsOpen && category.style.display == "none") {
        hideContent(document.getElementById(previousCategoryID))
        previousCategoryID = id;
    } else previousCategoryID = id;

    // Si le bouton (categorie) est fermé, il peut alors être ouvert.
    if (category.style.display === "none") {
        category.style.display = "block";
    } else hideContent(category);
}

/********************************************
 * HIDE CONTENT
 * 
 * Reçcoit en parametre un objet a cacher.
 * On cesse l'affichage de l'objet.
 * 
 ********************************************/
function hideContent(object) {
    object.style.display = "none";
    object.parentElement.classList.remove("active");
}