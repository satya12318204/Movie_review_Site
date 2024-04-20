// Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieName: {
    type: String,
    required: true
  },
  reviewText: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Review", reviewSchema);
