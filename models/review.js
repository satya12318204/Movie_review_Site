// Review.js
const mongoose = require("mongoose");
const User = require("./User.js");
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieName: {
    type: String, // Assuming movie name is a string
    required: true
  },
  reviewText: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Review", reviewSchema);
