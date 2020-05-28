const express = require("express");
const router = express.Router();
const linesService = require("../services/lines.service");

router.get("/", async (req, res) => {
    try {
        const result = await linesService.getLines();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode).send(error);
    }
});

module.exports = router;