
/********************************************
 * TABS MANAGER (JQuery)
 * 
 * Fonction qui permet de gérer les songlets
 * et afficher le contenu selon la sélection
 * de l'utilisateur.
 * 
 * Lors de la selection de l'onglet Carte,
 * on initialise l'affichage de la Carte.
 * 
 ********************************************/
jQuery(document).ready(function () {
	jQuery('.tabs .tab-links a').on('click', function (e) {
		var currentAttrValue = jQuery(this).attr('href');

		// Affiche ou cache les onglets 
		jQuery('.tabs ' + currentAttrValue).show().siblings().hide();

		// Modifie l'onglet actuel pour etre actif
		jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
		e.preventDefault();

		// On s'assure que la Map est initialisée lorsque l'onglet Carte est sélectionné
		initMap();
	});
});