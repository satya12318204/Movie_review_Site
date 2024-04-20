const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
router.get("/", mainController.renderMainPage);
router.get("/guest", mainController.renderGuestPage);
router.get("/dummy", mainController.renderDummyPage);

module.exports = router;
