const express = require("express");
const router = express.Router();
const arrivalsService = require("../services/arrivals.service");

// Recupere les arrivees
router.get("/", async (req, res) => {
    if (!req.query.line || !req.query.direction || !req.query.stopCode) {
        var error = {
            message: 'Invalid parameters',
            parameters: req.query
        };
        res.status(400).send(error);
        return;
    }

    try {
        const result = await arrivalsService.getArrivals(
            req.query.line,
            req.query.direction,
            req.query.stopCode
        )
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode).send(error);
    }
});

module.exports = router;