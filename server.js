// Import necessary modules
const express = require("express");
const app = express();
const path = require('path');
const connectDB = require("./db/databaseconnection"); // Import database connection
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Import routes
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");


// Configure view engine and static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use routes
app.use("/", authRoutes);
app.use("/", mainRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
