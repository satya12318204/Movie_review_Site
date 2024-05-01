const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

async function verifyAdminToken(req, res, next) {
    try {
      if (req.cookies.adminjwt) {
        const token = req.cookies.adminjwt;
        jwt.verify(token, "your_admin_secret_key", async (err, decodedToken) => {
          if (err) {
            console.error(err);
            res.redirect("/login");
          } else {
            console.log("Decoded admin token:", decodedToken);
  
            const { userId } = decodedToken;
            req.user = await User.findOne({ _id: userId }); // Await the result
            next();
          }
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  

  module.exports = verifyAdminToken;