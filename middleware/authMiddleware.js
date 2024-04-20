
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = verifyToken;

