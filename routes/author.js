const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const requireAuthor = require("../middleware/requireAuthor");

//Renders Author homepage, shows blog title, subtitle and name. 
// Also shows article information
router.get("/", requireLogin, requireAuthor, (req, res, next) => {
  //Get blog from database that belongs to the logged in user.
  global.db.all(
    "SELECT * FROM blog WHERE user_id = ?",
    [req.session.userId],
    function (err, blogs) {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      //Get all articles from database that belongs to the logged in user
      global.db.all(
        "SELECT * FROM article WHERE user_id = ?",
        [req.session.userId],
        function (err, articles) {
          if (err) {
            console.log(err);
            next(err);
            return;
          }
          //Renders the author homepage while sending the data retrieved from the database
          res.render("author-home-page", { blogs, articles });
        }
      );
    }
  );
});

/* 
Renders the Author settings page, shows the blog title, subtitle and name that can be edited by the user.
*/
router.get("/settings", requireLogin, requireAuthor, (req, res) => {
  //Get blog from database that belongs to the logged in user
  global.db.all(
    "SELECT * FROM blog WHERE user_id = ?",
    [req.session.userId],
    function (err, blogs) {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      // Renders the author settings page with the blog info of the logged in user
      res.render("author-settings-page", { blogs });
    }
  );
});

//User is able to edit the blog's title, subtitle and name
//Takes these as req.body, updates the correct blog that the user is using and redirects them to the author page.
router.post("/edit" ,requireLogin, requireAuthor, (req, res, next) => {
  const { title, subtitle, username } = req.body;

  //Inserts a new blog into the database if it does not exist, if it exists, update it.
  global.db.get(
    "INSERT OR REPLACE INTO blog (title, subtitle, blog_username, user_id) VALUES (?, ?, ?, ?)",
    [title, subtitle, username, req.session.userId],
    function (err) {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      //Redirect to author home page
      res.redirect("/author");
    }
  );
});

//Renders create-article page for author
router.get("/create-article", (req, res) => {
  res.render("author-create-article");
});

//Author can create an article, takes the title, subtitle, body and 
//the current time to be put into the database
router.post("/create-article",(req, res, next) => {
  const { title, subtitle, body } = req.body;
  const currentTime = new Date().toLocaleString();
  //Insert a new article into the article database
  global.db.get(
    "INSERT INTO article (title, subtitle, body, date_created, user_id, published) VALUES (?, ?, ?, ?, ?, ?)",
    [title, subtitle, body, currentTime, req.session.userId, 0],
    function (err) {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/author");
    }
  );
});

//Get the edit article page, populate the fields with the article to be edited
router.get("/edit-article/:id", (req, res) => {
  const articleId = req.params.id;
  //Search the database for the article that matches the id
  global.db.all(
    "SELECT * FROM article WHERE id = ?",
    [articleId],
    function (err, articles) {
      if (err) {
        next(err);
        return;
      }
      //Renders the page with the correct article to be edited
      res.render("author-edit-article", { articles });
    }
  );
});
//Updates the article that was edited by the author
router.post("/edit-article/:id", (req, res, next) => {
  const articleId = req.params.id;
  const { title, subtitle, body } = req.body;
  const currentTime = new Date().toLocaleString();
  //Update the article with the correct ID and store it in the database.
  global.db.all(
    "UPDATE article SET title = ?, subtitle = ?, body = ?, last_modified = ? WHERE id = ?",
    [title, subtitle, body, currentTime, articleId],
    function (err) {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/author");
    }
  );
});

//Deletes an article
router.post("/delete-article/:id", (req, res, next) => {
  const articleId = req.params.id;
  //Find and delete the article from the database that matches the ID.
  global.db.all(
    "DELETE FROM article WHERE id = ?",
    [articleId],
    function (err) {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/author");
    }
  );
});

//Change the article from being Draft to Published
router.post("/publish-article/:id", (req, res, next) => {
  const articleId = req.params.id;
  const currentTime = new Date().toLocaleString();
  //Updates the published field in the article with the correct ID to published and add the time that it was published.
  global.db.all(
    "UPDATE article SET published = ?, publication_date = ? WHERE id = ?",
    [1, currentTime, articleId],
    function (err) {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      res.redirect("/author");
    }
  );
});

module.exports = router;
