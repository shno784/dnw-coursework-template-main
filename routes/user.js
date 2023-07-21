const express = require("express");
const router = express.Router();
const Auth = require("../middleware/auth");
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

  //Hash the password
  const hashedPassword = await Auth.hashPassword(password);

  //Store the username in all lowercase, hashed password and if the user is an author in the database
  global.db.all(
    "INSERT INTO users (username, password_hash, author) VALUES (?, ?, ?)",
    [username.toLowerCase(), hashedPassword, author],
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

  try {
    //Get user Password
    const db_info = await getUserPassword(username.toLowerCase());
    const pass = db_info[0].password_hash;
    //Use argon2, to check if the password matches the hashed one in the database
    const isMatch = await Auth.checkPassword(pass, password);
    //Throw error if the password does not match
    if (!isMatch) {
      throw err;
    }

    //Store the user ID, username and if they are an author in the session
    req.session.userId = db_info[0].id;
    req.session.username = username;
    req.session.author = db_info[0].author;

    //Redirect based on if user is an author
    if (req.session.author == 1) {
      res.redirect("/author");
    } else {
      res.redirect("/reader");
    }
  } catch (error) {
    const errors = "Invalid Username or Password";
    res.render("login", { errors });
  }
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

// Function to fetch the hashed password from the database based on the username
function getUserPassword(username) {
  return new Promise((resolve, reject) => {
    //Search the database for if the username exists
    db.all(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, password) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(password);
      }
    );
  });
}

module.exports = router;
