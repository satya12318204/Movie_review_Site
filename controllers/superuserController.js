const Review = require("../models/review");
const User = require("../models/User");


exports.renderSuperUserPortalPage = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
  
        // Fetch all reviews from the database
        const reviews = await Review.find();
  
        // Check if the user has the superuser role
        if (req.user.role !== 'superuser') {
            return res.status(403).send("Access Denied");
        }
  
        // Render the superuser portal page with users and reviews
        res.render("superuser", { users, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  };
