/********************************************
 * MAP HANDLER
 * 
 * Permet de gérer l'affichage de la carte
 * et de la réinitialiser au besoin.
 * 
 ********************************************/
var MapHandler = function () {
    var carteMtl = null;

    /********************************************
     * INIT MAP
     * Configure et affiche une carte sur Montréal.
     ********************************************/
    function initMap() {
        carteMtl = L.map('carteID').setView([45.521450, -73.667581], 11);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiazFuNmFyM2EiLCJhIjoiY2p4ZHJkMTJsMGg4NjNwbnV5MzY2YW5xZSJ9.yHgKm598aQo9rP7I2qLKaQ', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token'
        }).addTo(carteMtl);

        if (arret.get() != null) {
            // Configure et affiche les markers (stop et bus)
            arret.markers();
            autobus.update();
        }
    }

    /********************************************
     * RESET MAP
     * Reset la carte pour afficher les nouveaux arrêts.
     ********************************************/
    function resetMap() {
        carteMtl.off();
        carteMtl.remove();
        carteMtl = null;
        initMap();
    }

    return {
        init: function () { initMap(); },
        get: function () { return carteMtl },
        reset: function () { resetMap(); }
    }
}