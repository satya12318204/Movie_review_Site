const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get("/guest", mainController.renderGuestPage);
router.get("/movie-info", mainController.renderMovieInfoPage);
router.get("/dummy", mainController.renderDummyPage);

module.exports = router;
