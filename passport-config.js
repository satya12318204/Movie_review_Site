const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "No user found with that email" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      console.log(e);
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticateUser)
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    // Assuming you have a function to find a user by ID in the database
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
