const express = require("express");
const router = express.Router();
const { validateUser } = require("../middleware/validateUser");

//Get create user page
router.get("/signup", (req, res) => {
  const errors = "";
  res.render("signup", { errors });
});

// Create user
router.post("/signup", validateUser, async (req, res, next) => {
  const { username, password } = req.body;
  //Sends 1 if the author checkbox is ticked and 0 if it is not.
  const author = req.body.author == "on" ? 1 : 0;

  //Store the username in all lowercase, hashed password and if the user is an author in the database
  global.db.all(
    "INSERT INTO users ('username', 'user_password', 'author') VALUES (?, ?, ?)",
    [username.toLowerCase(), password, author],
    function (err) {
      if (err) {
        next(err);
      } else {
        //redirect to login page
        res.redirect("/user/login");
      }
    }
  );
});

//Renders login page
router.get("/login", (req, res) => {
  const errors = "";
  res.render("login", { errors });
});

//Logs the user in if the username and password are correct
router.post("/login", validateUser, async (req, res, next) => {
  const { username, password } = req.body;

  global.db.all(
    "SELECT * FROM users WHERE username = ? AND user_password = ?",
    [username.toLowerCase(), password],
    function (err, users) {
      if (err) {
        next(err);
        return;
      }
      //User not found
      if (users.length == 0) {
        const errors = "Invalid Username or Password";
        res.render("login", { errors });
      } else {
        //Store the user ID, username and if they are an author in the session
        users.forEach((user) => {
          req.session.userId = user.id;
          req.session.username = username;
          req.session.author = user.author;
        });

        //Redirect based on if user is an author
        if (req.session.author == 1) {
          res.redirect("/author");
        } else {
          res.redirect("/reader");
        }
      }
    }
  );
});

//Logs the user out
router.get("/logout", (req, res, next) => {
  //Destroy express-session session
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
