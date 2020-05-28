const express = require("express");
const router = express.Router();
require("dotenv").config();
const backend = process.env.BACKEND;
const apiKey = process.env.APIKEY;
const api = require("../api.js");
const stopsService = require("../services/stops.service");

router.get("/", async (req, res) => {
    if (!req.query.line || !req.query.direction) {
        var error = {
            message: 'Invalid parameters',
            parameters: req.query
        };

        res.status(400).send(error);

        return;
    }

    try {
        const result = await stopsService.getStops(req.query.line, req.query.direction);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode).send(error);
    }
});

module.exports = router;