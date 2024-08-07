require("dotenv/config");
const mongoose = require("mongoose");

const url = "mongodb://0.0.0.0:27017/movieReviewDB";
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
