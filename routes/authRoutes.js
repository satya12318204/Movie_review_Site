const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User"); // Corrected import statement
const Review = require('../models/review');
const jwt = require('jsonwebtoken');

const mongoose = require("mongoose");

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

router.get("/index", verifyToken, async (req, res) => {
    try {
        // Get user ID from the decoded JWT token
        const userId = req.user._id;

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

// Route to fetch reviews based on movie name
router.get("/movie-reviews", async (req, res) => {
    try {
        const movieName = req.query.movieName;
        const reviews = await Review.find({ movieName }).populate('userId', 'name'); // Populate user details with only the 'name' field

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ '_id': userId });
        res.json(user); // Send the entire user object
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/storeReview', verifyToken, async (req, res) => {
    try {
        // Extract user ID from the authenticated user
        const userId = req.user.id;

        // Extract movie title and review text from the request body
        const { movieTitle, reviewText } = req.body;

        // Create a new review instance
        const review = new Review({
            userId,
            movieName: movieTitle,
            reviewText
        });

        // Save the review to the database
        await review.save();

        // Send a success response
        res.status(200).json({ message: 'Review submitted successfully!' });
    } catch (error) {
        // Handle errors
        console.error('Error storing review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);


module.exports = router;
