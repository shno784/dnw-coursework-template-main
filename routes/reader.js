const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");

// Renders reader homepage, uses the username to show the logged in user
// and shows articles that were published by publication date
router.get("/", (req, res, next) => {
  const username = req.session.username;

  //Show all blogs
  global.db.all("SELECT * FROM blog", function (err, blogs) {
    if (err) {
      next(err);
      return;
    }
    res.render("reader-home", { blogs, username });
  });
});

router.get("/blog/:id", (req, res, next) => {
  const blogId = req.params.id;

  //Gets all published articles in ascending order by publication date
  global.db.all(
    "SELECT * FROM article WHERE published = ? AND blog_id = ? ORDER BY publication_date ASC",
    [1, blogId],
    function (err, articles) {
      if (err) {
        next(err);
        return;
      }
      global.db.all(
        "SELECT * FROM blog WHERE id = ?",
        [blogId],
        function (err, blogs) {
          if (err) {
            next(err);
            return;
          }
          res.render("reader-blog", { articles, blogs });
        }
      );
    }
  );
});

//Renders the article page that the user wants to read
router.get("/article/:id", (req, res, next) => {
  const articleId = req.params.id;
  //Gets all articles from the database which matches the params
  global.db.all(
    "SELECT * FROM article WHERE id = ?",
    [articleId],
    function (err, articles) {
      if (err) {
        next(err);
        return;
      }
      //Gets the amount of likes for the specific article
      global.db.all(
        "SELECT like_number FROM article WHERE id = ?",
        [articleId],
        function (err, likes) {
          if (err) {
            next(err);
            return;
          }
          //Gets all comments for the specific article
          global.db.all(
            "SELECT * FROM comments WHERE article_id = ? ORDER BY date_created DESC",
            [articleId],
            function (err, comments) {
              if (err) {
                next(err);
                return;
              }
              res.render("reader-article", { articles, likes, comments });
            }
          );
        }
      );
    }
  );
});

// When a user likes or unlikes an article, this will update the number
// of likes that article has
router.post("/like/:id", requireLogin, (req, res, next) => {
  const articleId = req.params.id;
  //Searches the database for if the user already liked the article
  global.db.all(
    "SELECT * FROM likes WHERE article_id = ? AND user_id = ?",
    [articleId, req.session.userId],
    function (err, like) {
      if (err) {
        next(err);
        return;
      }
      //If the like is not found, put it into the database
      if (like.length == 0) {
        global.db.all(
          "INSERT INTO likes ('user_id', 'article_id') VALUES (?, ?) ",
          [req.session.userId, articleId],
          function (err) {
            if (err) {
              next(err);
              return;
            }
          }
        );
      } else {
        //If the like is found, delete it from the database
        global.db.all(
          "DELETE FROM likes WHERE article_id = ? AND user_id = ?",
          [articleId, req.session.userId],
          function (err) {
            if (err) {
              next(err);
              return;
            }
          }
        );
      }
      //After inserting or deleting the like, update the number of likes in the article table
      global.db.all(
        "UPDATE article SET like_number = (SELECT COUNT(*) FROM likes WHERE article_id = ? AND user_id = ?) WHERE id = ?",
        [articleId, req.session.userId, articleId],
        function (err) {
          if (err) {
            next(err);
            return;
          }
        }
      );
      //Refresh the same article page
      res.redirect(`/reader/article/${articleId}`);
    }
  );
});

// Adds a comment to an article when a user comments on one
router.post("/comment/:id", requireLogin, (req, res, next) => {
  const articleId = req.params.id;
  const { body } = req.body;
  const currentTime = new Date().toLocaleString();

  const data = [
    req.session.userId,
    articleId,
    currentTime,
    req.session.username,
    body,
  ];
  //Adds the comment to the article
  global.db.all(
    "INSERT INTO comments ('user_id', 'article_id', 'date_created', 'username', 'body') VALUES (?, ?, ?, ?, ?)",
    data,
    function (err) {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`/reader/article/${articleId}`);
    }
  );
});

module.exports = router;
