const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const verifyToken = require("../middleware/authMiddleware");
router.get("/", mainController.renderMainPage);
router.get("/guest", mainController.renderGuestPage);
router.get("/dummy", mainController.renderDummyPage);
router.get("/superuser", verifyToken, mainController.renderSuperUserPortalPage);
module.exports = router;




