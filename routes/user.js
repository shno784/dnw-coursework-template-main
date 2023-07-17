
/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require('assert');
const Auth = require("../lib/auth");

//Get create user page
router.get("/signup", (req, res) => {
    res.render("signup");
});


// Create user
router.post("/signup", async (req, res, next) => {
    const {username, password} = req.body;
    //Sends 1 if the author checkbox is ticked and 0 if it is not.
    const author = req.body.author == 'on' ? 1: 0;
    console.log(author)
    const hashedPassword = await Auth.hashPassword(password);

    global.db.all("INSERT INTO users (username, password_hash, author) VALUES (?, ?, ?)",
        [username, hashedPassword, author], function (err) {
            if (err) {
                next(err)
            }else {
                res.send("Success!");
            }
    });
    
});


//Get login page
router.get("/login", (req, res) => {
    res.render("login");
});


//Log user in
router.post("/login", async (req, res, next) => {
    const {username, password} = req.body;
    
    try {
        //Get user Password 
        const db_pass = await getUserPassword(username);

        const pass = db_pass[0].password_hash
    
        //Use argon2, to check if the password matches the hashed one in the database
        const isMatch = await Auth.checkPassword(pass, password);
  
        if (!isMatch) {
            throw(error);
        }

        req.session.isLoggedIn = true;
        req.session.user = db_pass[0].id;
        res.redirect("/author");
    } catch (error) {
        console.log(error)
        res.send("User or Password Incorrect!")
    }
    
});


// Function to fetch the hashed password from the database based on the username
function getUserPassword(username) {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, password_hash FROM users WHERE username = ?', [username], (err, password) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(password);
      });
    });
  }


module.exports = router;
