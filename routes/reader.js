const express = require("express");
const router = express.Router();
const requireLogin = require("../lib/requireLogin");

//Render Home page
router.get("/", (req, res, next) => {
  global.db.all(
    "SELECT * FROM article WHERE published = ?",
    [1],
    function (err, articles) {
      if (err) {
        next(err);
        return;
      }
      res.render("reader-home", { articles });
    }
  );
});

//Render Article page
router.get("/article/:id", (req, res, next) => {
  const articleId = req.params.id;
  global.db.all(
    "SELECT * FROM article WHERE id = ?",
    [articleId],
    function (err, articles) {
      if (err) {
        next(err);
        return;
      }
      global.db.all(
        "SELECT COUNT(*) FROM likes WHERE article_id = ?",
        [articleId],
        function (err, likes) {
          if (err) {
            next(err);
            return;
          }
          const count = likes[0]["COUNT(*)"];

          global.db.all(
            "SELECT * FROM comments WHERE article_id = ?",
            [articleId],
            function (err, comments) {
              if (err) {
                next(err);
                return;
              }
              res.render("reader-article", { articles, count, comments });
            }
          );
        }
      );
    }
  );
});

router.post("/like/:id", requireLogin, (req, res, next) => {
  const articleId = req.params.id;

  global.db.all(
    "SELECT * FROM likes WHERE article_id = ? AND user_id = ?",
    [articleId, req.session.userId],
    function (err, like) {
      if (err) {
        next(err);
        return;
      }
      //If the like is not found, put it into the db, if it is there, remove it
      if (like.length == 0) {
        global.db.all(
          "INSERT INTO likes (user_id, article_id) VALUES (?, ?) ",
          [req.session.userId, articleId],
          function (err) {
            if (err) {
              next(err);
              return;
            }
          }
        );
      } else {
        global.db.all(
          "DELETE FROM likes WHERE user_id = ?",
          [req.session.userId],
          function (err) {
            if (err) {
              next(err);
              return;
            }
          }
        );
      }
      res.redirect(`/reader/article/${articleId}`);
    }
  );
});

router.post("/comment/:id", requireLogin, (req, res, next) => {
  const articleId = req.params.id;
  const { body } = req.body;
  const currentTime = new Date().toLocaleString();

  console.log(req.session.username);
  const data = [
    req.session.userId,
    articleId,
    currentTime,
    req.session.username,
    body,
  ];
  global.db.all(
    "INSERT INTO comments (user_id, article_id, date_created, username, body) VALUES (?, ?, ?, ?, ?)",
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
