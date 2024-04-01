const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Export User model
module.exports = mongoose.model("User", userSchema);
