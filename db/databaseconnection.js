require("dotenv/config");
const mongoose = require("mongoose");

const url = process.env.MONGO_URL || "mongodb+srv://perisettyraja:XluW8uY5lSR7cIl0@fsdmoviereview.g7kgtac.mongodb.net/movieReviewDB";
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
