const express = require("express");
const router = express.Router();
const superuserController = require("../controllers/superuserController");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User"); // Corrected import statement
const Review = require('../models/review');
const jwt = require('jsonwebtoken');


router.get('/users/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


// Import User model

// Define route handler for changing user role
router.post("/change_role", async (req, res) => {
    const { userId, role } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Update user's role
      user.role = role;
      await user.save();
  
      // Return success response
      res.status(200).json({ message: "User role updated successfully.", user });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while updating user role." });
    }
  });
  

  

router.delete('/reviews/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;
  
    try {
      // Find the review by its ID and delete it
      const deletedReview = await Review.findByIdAndDelete(reviewId);
  
      if (deletedReview) {
        // If review is found and deleted successfully
        res.status(200).json({ message: 'Review deleted successfully' });
      } else {
        // If review with the given ID is not found
        res.status(404).json({ error: 'Review not found' });
      }
    } catch (error) {
      // If an error occurs during deletion
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get("/superuser", verifyToken, superuserController.renderSuperUserPortalPage);

  module.exports = router;
