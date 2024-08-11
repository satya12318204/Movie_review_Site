const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
    name: String,
    address: String,
    image: String
  });
  
  module.exports = mongoose.model("Theater", theaterSchema);