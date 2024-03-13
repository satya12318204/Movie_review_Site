// Import necessary modules
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const path = require('path');
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Configure view engine and static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/userauth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define User model
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
});

// Initialize Passport
initializePassport(
  passport,
  async (email) => {
    return await User.findOne({ email: email }).exec();
  },
  async (id) => {
    return await User.findById(id).exec();
  }
);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 604800000, // 7 days in milliseconds
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));

// Routes
app.get("/", (req, res) => {
  res.render("main");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/login",
  failureFlash: true,
}));

app.post("/signup", checkNotAuthenticated, async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      req.flash('error', 'User with this email already exists');
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Error during signup:", error);
    req.flash('error', 'Error during signup, please try again later');
    res.redirect("/signup");
  }
});

app.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

app.get("/index", checkAuthenticated, (req, res) => {
  res.render("index", { name: req.user.name, email: req.user.email }); 
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup");
});

// Route to render the guest.ejs view
app.get("/guest", (req, res) => {
  res.render("guest");
});

app.get("/movie-info",checkAuthenticated, (req, res) => {
  res.render("movie-info");
});

// Route to handle guest creation
app.post("/create-guest", async (req, res) => {
  try {
    const username = generateUsername();
    const email = generateEmail(username);
    const password = generatePassword();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: username,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ username, email, password });
  } catch (error) {
    console.error("Error creating guest:", error);
    res.status(500).json({ error: "Failed to create guest credentials" });
  }
});

// Function to generate a random username
function generateUsername() {
  const usernamePrefix = "guestuser";
  const randomSuffix = Math.floor(Math.random() * 10000);
  return usernamePrefix + randomSuffix;
}

// Function to generate a random email
function generateEmail(username) {
  return `${username}@googleguest.com`;
}

// Function to generate a random password
function generatePassword() {
  // Generate a random string of characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const passwordLength = 8;
  let password = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

// Function to check if user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Function to check if user is not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
