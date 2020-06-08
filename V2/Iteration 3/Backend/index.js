
// HTTP
var http = require("http");
if (!http) process.exit(1);

// Pour utiliser les variables de l'environnement
require("dotenv").config(); 
const backend = process.env.BACKEND;
const port = process.env.PORT;

// App Express
const express = require("express");
const app = express();
if (!app) process.exit(1);

// Types de requetes acceptées
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", null);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Constantes qui pointent vers les fichiers de contrôles
const arrivals = require("./controleurs/arrivals");
const bus_positions = require("./controleurs/busPosition");
const lines = require("./controleurs/lines");
const stops = require("./controleurs/stops");
const users = require("./controleurs/users");

app.get("/", (req, res) => { res.send("Le backend est en cours d'exécution") });
app.use(express.json())
app.use("/arrivals", arrivals);
app.use("/busPosition", bus_positions);
app.use("/lines", lines);
app.use("/stops", stops);
app.use("/users", users);

// Base de donnees (MongoDB)
const database = require('./database/database');
database.connect(process.env.DB, process.env.DBNAME, (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  } else app.listen(port, () => { console.log(`Écoute sur le port ${port}`); });
});