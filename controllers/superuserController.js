const ChineseWall = require('../ChineseWall');
const Review = require("../models/review");
const User = require("../models/User");

const chineseWall = new ChineseWall();



exports.renderSuperUserPortalPage = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
  
        // Fetch all reviews from the database
        const reviews = await Review.find();
  
        // Check access based on user role and document
        const document = 'superuser';
        chineseWall.checkAccess(req.user.role, document);

        // Render the superuser portal page with users and reviews
        res.render("superuser", { users, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

exports.superlogout = async (req, res) => {
    try {
      await res.clearCookie("superjwt"), res.clearCookie("jwt");
      res.redirect("/");
    } catch (error) {
      console.error("Error clearing cookie:", error);
      res.status(500).json({ message: "Error logging out" });
    }
};
