const Review = require("../models/review");
const User = require("../models/User");
const ChineseWall = require('../ChineseWall');
const chineseWall = new ChineseWall();
exports.renderAdminPortalPage = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
  
        // Fetch all reviews from the database
        const reviews = await Review.find();
  
        const document = 'admin';
        chineseWall.checkAccess(req.user.username, document);

        // Render the superuser portal page with users and reviews
        res.render("admin", { users, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  };
  
  exports.adminlogout = async (req, res) => {
    try {
      await res.clearCookie("adminjwt"),res.clearCookie("jwt");
      res.redirect("/");
    } catch (error) {
      console.error("Error clearing cookie:", error);
      res.status(500).json({ message: "Error logging out" });
    }
  };
  