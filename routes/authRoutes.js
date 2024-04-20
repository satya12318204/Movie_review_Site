const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User"); // Corrected import statement

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

router.get("/index", verifyToken, async (req, res) => {
    try {
        // Get user ID from the decoded JWT token
        const userId = req.user.id;

        // Fetch user details from the database based on the ID
        const user = await User.findById(userId); // Corrected variable name to avoid conflict with imported module

        // Render the index page with the user's details
        res.render("index", { name: user.name, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/movie-info", verifyToken, async (req, res) => {
    try {
        // Get user ID from the decoded JWT token
        const userId = req.user.id;

        // Fetch user details from the database based on the ID
        const user = await User.findById(userId); // Corrected variable name to avoid conflict with imported module

        // Render the index page with the user's details
        res.render("movie-info", { name: user.name, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});




router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);


module.exports = router;
