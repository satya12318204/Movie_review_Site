// Import necessary modules
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./db/databaseconnection"); // Import database connection
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Import ChineseWall
const ChineseWall = require("./ChineseWall");
const chineseWall = new ChineseWall();

// Import routes
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");
const superuserRoutes = require("./routes/superuserRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Configure view engine and static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const User = require("./models/User"); // Import the User model

// Middleware to set user role based on authentication
const setUserRole = async (req, res, next) => {
  try {
    // Assuming you have a user object with role information after authentication
    // Replace this with your actual authentication logic
    const user = req.user; // Assuming req.user contains user information after authentication

    if (!user) {
      // If user is not authenticated, set role as 'guest' or any default role
      req.userRole = "guest";
    } else {
      // Fetch the user from the database to get the role
      const userFromDB = await User.findById(user.id); // Assuming user.id contains the user's ID
      if (!userFromDB) {
        req.userRole = "guest"; // Set default role if user not found
      } else {
        req.userRole = userFromDB.role; // Set the user's role from the user object fetched from the database
      }
    }
    next();
  } catch (error) {
    console.error(error);
    // Handle errors appropriately, e.g., by sending an error response
    res.status(500).json({ message: "Server error" });
  }
};

// Chinese Wall Middleware
app.use(setUserRole);

// Use Chinese Wall for specific routes based on roles
app.use("/admin", chineseWall.middleware(["admin"]));
app.use("/superuser", chineseWall.middleware(["superuser"]));

// Use routes
app.use("/", authRoutes);
app.use("/", mainRoutes);
app.use("/", superuserRoutes);
app.use("/", adminRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
