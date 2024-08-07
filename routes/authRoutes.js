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


router.get("/tv-show-info", verifyToken, async (req, res) => {
    try {
        // Get user ID from the decoded JWT token
        const userId = req.user.id;

        // Fetch user details from the database based on the ID
        const user = await User.findById(userId); // Corrected variable name to avoid conflict with imported module

        // Render the index page with the user's details
        res.render("tv-shows-info", { name: user.name, email: user.email });
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

router.delete('/reviews/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;

    // Extract the JWT token from cookies
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    let userId, userRole;
    try {
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, 'your_secret_key');
        userId = decoded.userId; // Extract userId from the decoded token

        // Fetch user details from the database based on the ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        userRole = user.role; // Extract user role
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            // If review with the given ID is not found
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if the userId matches the userId associated with the review or if the user is an admin or superuser
        if (review.userId.toString() === userId || userRole === 'admin' || userRole === 'superuser') {
            await Review.findByIdAndDelete(reviewId);
            // Review deleted successfully
            return res.status(200).json({ message: 'Review deleted successfully' });
        } else {
            // Unauthorized to delete this review
            return res.status(403).json({ error: 'Unauthorized to delete this review' });
        }
    } catch (error) {
        // Handle errors during deletion
        console.error('Error deleting review:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);


module.exports = router;
