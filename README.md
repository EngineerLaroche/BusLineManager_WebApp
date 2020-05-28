# INFORMATION

Institution: Ecole de Technologie Superieure (ETS)<br/>
Created by: Alexandre Laroche<br/>
Date: 2019


# OBJECTIFS

PORTAIL WEB prototype qui permet aux utilisateurs de consulter rapidement l'ensemble des horaires et circuits de bus, de personnaliser l'information affichée et de suivre en temps réel le déplacement des bus sur une carte géographique.


# FONCTIONNALITÉS

- Menu de navigation dynamique<br/>
- Afficher les circuits catégorisés<br/>
- Retrait des circuits inactifs<br/>
- Afficher les directions d'un circuit<br/>
- Liste des arrêts d'un circuit<br/>
- Liste des prochains passages

- Traçage d'un circuit sur une carte <br/>
- Afficher les arrêts sur une carte<br/>
- Afficher les bus sur une carte<br/>
- Mise à l'échelle de la carte<br/>
- Gestion des Popups de la carte

- Ajouter en favoris certains arrêts<br/>
- Fournir les données en temps réel<br/>
- Notifications (arrivées imminentes)<br/>
- Mise en mémoire cache des requêtes


# TECHNOLOGIES

## Frontend
JavaScript, HTML 5, CSS 3, CloudFlare, Leaflet et jQuery

## Backend
Node.js, Express.js, Dotenv, Ajax et Json


# PRÉ-REQUIS

Installez MongoDB :

	https://medium.com/@LondonAppBrewery/how-to-download-install-mongodb-on-windows-4ee4b3493514

Installez Node.js (V-12.7.0) :

	https://nodejs.org/en/download/

Installez NPM (V-6.10.0) :   

	https://www.npmjs.com/get-npm

Pour vérifier les versions de votre Node.js et npm, ouvrez l'Invite de Commande Windows:

	node -v
	npm -v

Assurez vous d'avoir le fichier '.env' dans le backend avec des informations similaires:

		PORT = 8000
		BACKEND = https://teaching-api.juliengs.ca/gti525
		DB = mongodb://localhost:27017/labogti350
		DBNAME = labogti350
		APIKEY = 01AM30750

# TROUBLESHOOT

Pour mettre à jour NPM, ouvrez un terminal PowerShell (admin) et entrez:

	Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force
	npm install -g npm-windows-upgrade
	npm-windows-upgrade


# DÉMARRER PORTAIL WEB

1- Ouvrez l'Invite de Commande Windows dans le dossier 'backend' du projet (V1 Iteration4 ou V2 Iteration3) <br/>
2- Entrez et exécutez :

	npm install
	npm update
	npm start

3- Ouvrez un navigateur web pour accéder au portail


# LICENCE

Copyright 2018 Alexandre Laroche.<br/>
All rights reserved.