// user.js
const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'superuser', 'normaluser', 'guest'], default: 'normaluser' } // Add role field
});

// Export User model

module.exports = mongoose.model("User", userSchema);
