require("dotenv/config");
const mongoose = require("mongoose");

// const url = process.env.MONGO_URL || "mongodb+srv://perisettyraja:5w1MG5cUNbbrSAzz@moviereviewcluster.nu5ah.mongodb.net/movieReviewDB";
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
