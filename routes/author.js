const express = require("express");
const router = express.Router();
const requireLogin = require("../lib/requireLogin");
const requireAuthor = require("../lib/requireAuthor");

//Render Home page, it shows the blog title, subtitle, author name, it also shows articles which can be deleted, published, edited.
router.get("/", requireLogin, requireAuthor, (req, res, next) => {
  //Placeholder, will have to change based on user
  global.db.all(
    "SELECT * FROM blog WHERE user_id = ?",
    [req.session.userId],
    function (err, blogs) {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      global.db.all("SELECT * FROM article WHERE user_id = ?",[req.session.userId] ,function (err, articles) {
        if (err) {
          console.log(err);
          next(err);
          return;
        }
        res.render("author-home-page", { blogs, articles });
      });
    }
  );
});

//Render settings page
router.get("/settings", requireLogin, requireAuthor, (req, res) => {
  global.db.all(
    "SELECT * FROM blog WHERE user_id = ?",
    [req.session.userId],
    function (err, blogs) {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      res.render("author-settings-page", { blogs });
    }
  );
});

//User is able to edit the blog's title, subtitle and name
//Takes these as req.body, updates the correct blog that the user is using and redirects them to the author page.
router.post("/edit", requireLogin, requireAuthor, (req, res, next) => {
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
      res.redirect("/author");
    }
  );
});

//Render edits page
router.get("/edit", requireLogin, requireAuthor, (req, res) => {
  res.render("author-edit-article-page");
});

//Get create article page
router.get("/create-article", (req, res) => {
    res.render("author-create-article"); 
})

//Create an article and store in db
router.post("/create-article", (req, res, next) => {
    const {title, subtitle, body} = req.body;
    const currentTime = new Date().toLocaleString();
    global.db.get("INSERT INTO article (title, subtitle, body, date_created, user_id, published) VALUES (?, ?, ?, ?, ?, ?)", [title, subtitle, body, currentTime, req.session.userId, 0], function (err) {
        if (err) {
            next(err);
            return;
        }
        res.redirect("/author")
    })
})

//get edit article page 
router.get("/edit-article/:id", (req, res) => {
    const articleId = req.params.id
    global.db.all("SELECT * FROM article WHERE id = ?", [articleId], function (err, articles) {
        if(err) {
            next(err);
            return;
        }
        res.render("author-edit-article", {articles}); 
    })
    
})

router.post("/edit-article/:id", (req, res, next) => {
  const articleId = req.params.id
  const {title, subtitle, body} = req.body;
  const currentTime = new Date().toLocaleString();
  global.db.all("UPDATE article SET title = ?, subtitle = ?, body = ?, last_modified = ? WHERE id = ?", [title, subtitle, body, currentTime, articleId], function (err) {
    if(err) {
      next(err);
      return;
    }
    res.redirect("/author")
  })
})

router.post("/delete-article/:id", (req, res, next) => {
  const articleId = req.params.id;

  global.db.all("DELETE FROM article WHERE id = ?", [articleId], function (err) {
    if(err) {
      next(err);
      return;
    }
    res.redirect("/author")
  })
})

router.post("/publish-article/:id", (req, res, next) => {
  const articleId = req.params.id;
  const currentTime = new Date().toLocaleString();
  global.db.all("UPDATE article SET published = ?, publication_date = ? WHERE id = ?", [1, currentTime, articleId], function (err) {
    if (err) {
      console.log(err)
      next(err);
      return;
    }
    res.redirect("/author")
  })
})

module.exports = router;
