const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
module.exports = router;
