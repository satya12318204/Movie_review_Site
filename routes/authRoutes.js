const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User"); 

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

router.get("/index", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("userId: " + userId);
        const user = await User.findById(userId); 
        res.render("index", { name: user.name, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
module.exports = router;
