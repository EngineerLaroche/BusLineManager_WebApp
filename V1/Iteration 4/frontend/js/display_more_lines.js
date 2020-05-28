
/* Indique le nombre de lignes a ajouter ou retirer de l'affichage d'une categorie (menu) */
var showQty = function(){ return 4; }

/* Toutes les lignes */
$(function () {
    $('button.more').click(function () { /* Afficher plus de lignes */
        $('#list_all li:hidden').slice(0, showQty()).show();
    });
    $('button.less').click(function () { /* Afficher moins de lignes */
        var size = $('#list_all li:visible').length;
        if (size - showQty() >= showQty())
            $('#list_all li:visible').slice(size - showQty(), size).hide();
    });
});

/* Lignes local */
$(function () {
    $('button.more').click(function () { /* Afficher plus de lignes */
        $('#list_local li:hidden').slice(0, showQty()).show();
    });  
    $('button.less').click(function () { /* Afficher moins de lignes */
         var size = $('#list_local li:visible').length;
         if (size - showQty() >= showQty()) 
            $('#list_local li:visible').slice(size - showQty(), size).hide();
    });
});

/* Lignes nuits */
$(function () {
    $('button.more').click(function () { /* Afficher plus de lignes */
        $('#list_night li:hidden').slice(0, showQty()).show();
    });   
    $('button.less').click(function () { /* Afficher moins de lignes */
        var size = $('#list_night li:visible').length;
        if (size - showQty() >= showQty())
            $('#list_night li:visible').slice(size - showQty(), size).hide();
    });
});

/* Lignes express */
$(function () {
    $('button.more').click(function () { /* Afficher plus de lignes */
        $('#list_express li:hidden').slice(0, showQty()).show();
    });
    $('button.less').click(function () { /* Afficher moins de lignes */
        var size = $('#list_express li:visible').length;
        if (size - showQty() >= showQty())
            $('#list_express li:visible').slice(size - showQty(), size).hide();
    });
});

/* Lignes navettes */
$(function () {
    $('button.more').click(function () { /* Afficher plus de lignes */
        $('#list_navette li:hidden').slice(0, showQty()).show();
    });  
    $('button.less').click(function () { /* Afficher moins de lignes */
        var size = $('#list_navette li:visible').length;
        if (size - showQty() >= showQty())
            $('#list_navette li:visible').slice(size - showQty(), size).hide();
    });
});

/* Lignes navettes Or */
$(function () {
    $('button.more').click(function () { /* Afficher plus de lignes */
        $('#list_navetteOr li:hidden').slice(0, showQty()).show();
    });
    $('button.less').click(function () { /* Afficher moins de lignes */
        var size = $('#list_navetteOr li:visible').length;
        if (size - showQty() >= showQty())
            $('#list_navetteOr li:visible').slice(size - showQty(), size).hide();
    });
});