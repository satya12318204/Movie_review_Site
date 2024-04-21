const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const verifyToken = require("../middleware/authMiddleware");
router.get("/", mainController.renderMainPage);
router.get("/dummy", mainController.renderDummyPage);
module.exports = router;




