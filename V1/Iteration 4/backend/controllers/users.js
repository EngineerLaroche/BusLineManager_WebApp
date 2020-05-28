const express = require("express");
const router = express.Router();
const userService = require("../services/users.service");

router.get("/:id/favorite", async (req, res) => {
  try {
    const user = req.params.id;
    const result = await userService.getFavoriteStops(user);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode).send(error);
  }
});

router.post("/:id/favorite", async (req, res) => {
  try {
    const user = req.params.id;
    const stopCode = req.body.stopCode;

    if (stopCode == null) {
      res.status(400).send("stopCode is invalid");
    } else {
      const result = await userService.addFavoriteStop(user, stopCode);

      res.send(result);
    }

  } catch (error) {
    console.error(error);
    res.status(error.statusCode).send(error);
  }
});

router.delete("/:id/favorite", async (req, res) => {
  try {
    const user = req.params.id;
    const stopCode = req.body.stopCode;
    const result = await userService.removeFavoriteStop(user, stopCode);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode).send(error);
  }
});

module.exports = router;
