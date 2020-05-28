var http = require("http");
if (!http) process.exit(1);
const express = require("express");
const app = express();
if (!app) process.exit(1);
const db = require('./db/db');
const arrivals = require("./controllers/arrivals");
const bus_positions = require("./controllers/bus_positions");
const lines = require("./controllers/lines");
const stops = require("./controllers/stops");
const users = require("./controllers/users");

require("dotenv").config(); // to use environment variables
const backend = process.env.BACKEND;
const port = process.env.PORT;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", null);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  res.send("Bienvenue!")
});

app.use(express.json())
app.use("/arrivals", arrivals);
app.use("/bus_positions", bus_positions);
app.use("/lines", lines);
app.use("/stops", stops);
app.use("/users", users);

db.connect(process.env.DB, process.env.DBNAME, (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Listening on port ${port} 🐷`);
    });
  }
});