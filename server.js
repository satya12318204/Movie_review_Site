// Import necessary modules
const express = require("express");
const app = express();
const path = require('path');
const connectDB = require("./db/databaseconnection"); // Import database connection
const jwt = require("jsonwebtoken"); // Import JWT for token generation and verification
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

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    jwt.verify(token, "your_secret_key", (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.redirect("/login");
      } else {
        console.log("Decoded token:", decodedToken);
        req.user = decodedToken; // Set the decoded user information in the request object
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
}

// Protected route example
app.get("/index", verifyToken, (req, res) => {
  res.render("index", { name: req.user.name, email: req.user.email });
});

app.get("/", (req, res) => {
  res.render("main");
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
