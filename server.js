// Import necessary modules
const express = require("express");
const app = express();
const path = require('path');
const connectDB = require("./db/databaseconnection"); // Import database connection
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Import routes
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");


// Configure view engine and static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use routes
app.use("/", authRoutes);
app.use("/", mainRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// Import the Review model
const Review = require('./models/review');

// Handle POST request to store a review
app.post('/storeReview', async (req, res) => {
    try {
        // Extract user ID from the authenticated user (assuming it's available in req.user)
        const userId = req.user._id; // Adjust this according to your authentication mechanism

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
