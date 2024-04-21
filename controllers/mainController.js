const Review = require("../models/review");

exports.renderSuperUserPortalPage = async (req, res) => {
    try {
        // Check if the user has the superuser role
        if (req.user.role !== 'superuser') {
            return res.status(403).send("Access Denied");
        }

        // Fetch all reviews from the database
        const reviews = await Review.find();

        // Render the superuser portal page with reviews
        res.render("superuser", { reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

exports.renderGuestPage = (req, res) => {
  res.render("guest");
};

exports.renderDummyPage = (req, res) => {
  res.render("dummy");
};

exports.renderMainPage = (req, res) => {
  res.render("main");
};
