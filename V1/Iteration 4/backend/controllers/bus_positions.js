const express = require("express");
const router = express.Router();
const busPositionsService = require("../services/bus_positions.service");

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
        const result = await busPositionsService.getBusPositions(req.query.line, req.query.direction);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode).send(error);
    }
});

module.exports = router;