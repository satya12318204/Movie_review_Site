const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const maxAge = 3 * 24 * 60 * 60;

// Function to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, "your_secret_key", {
    expiresIn: maxAge,
  });
};

// Handle signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = createToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // Redirect to login page after successful registration
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/index");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Handle logout
exports.logout = async (req, res) => {
  try {
    await res.clearCookie("jwt");
    res.redirect("/");
  } catch (error) {
    console.error("Error clearing cookie:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

