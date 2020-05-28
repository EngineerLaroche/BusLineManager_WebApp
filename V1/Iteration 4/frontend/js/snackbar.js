
/*********************************************
 * SNACKBAR INVALID
 * 
 * Permet d'afficher un snackbar (popup) sur le
 * haut de l'ecran pour avertir l'utilisateur
 * que la mise en favoris du passage n'a pas
 * été réussi. L'utilisateur ne peut avoir plus
 * de 10 passages mis en favoris.
 * 
 *********************************************/
function invalidSnackbar(message) {

    // Recupere le snackbar du DIV
    var x = document.getElementById("snackbarInvalid");
    x.innerHTML = message;
    x.className = "show";

    // Apres 4 secondes, on retire le snackbar
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
  }

/*********************************************
 * SNACKBAR VALID
 * 
 * Permet d'afficher un snackbar (popup) sur le
 * haut de l'ecran pour avertir l'utilisateur
 * que la mise en favoris du passage est réussi.
 * 
 *********************************************/
  function validSnackbar(message) {

    // Recupere le snackbar du DIV
    var x = document.getElementById("snackbarValid");
    x.innerHTML = message;
    x.className = "show";

    // Apres 2 secondes, on retire le snackbar
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
  }