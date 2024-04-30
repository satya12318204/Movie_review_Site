const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
  name: String, // Enforce uniqueness for the name field
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'superuser', 'normaluser', 'guest'], default: 'normaluser' } 
});

// Export User model
module.exports = mongoose.model("User", userSchema);
