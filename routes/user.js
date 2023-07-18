/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const Auth = require("../lib/auth");

//Get create user page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Create user
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  //Sends 1 if the author checkbox is ticked and 0 if it is not.
  const author = req.body.author == "on" ? 1 : 0;

  const hashedPassword = await Auth.hashPassword(password);

  global.db.all(
    "INSERT INTO users (username, password_hash, author) VALUES (?, ?, ?)",
    [username, hashedPassword, author],
    function (err) {
      if (err) {
        next(err);
      } else {
        res.redirect("/user/login");
      }
    }
  );
});

//Get login page
router.get("/login", (req, res) => {
  const message = "";
  res.render("login", { message });
});

//Log user in
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    //Get user Password
    const db_info = await getUserPassword(username);
    const pass = db_info[0].password_hash;
    //Use argon2, to check if the password matches the hashed one in the database
    const isMatch = await Auth.checkPassword(pass, password);

    if (!isMatch) {
      throw err;
    }

    //Store the user ID and if they are an author in the session
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
    const message = "Invalid Username or Password";
    res.render("login", { message });
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/login");
    }
  });
});

// Function to fetch the hashed password from the database based on the username
function getUserPassword(username) {
  return new Promise((resolve, reject) => {
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
