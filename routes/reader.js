const express = require("express");
const router = express.Router();


//Render Home page
router.get("/", (req, res, next) => {
    global.db.all("SELECT * FROM article WHERE published = ?", [1], function (err, articles) {
        if (err) {
            next(err);
            return;
        }
        res.render("reader-home", {articles});
    })
    
});

//Render Article page
router.get("/article/:id", (req, res) => {
    const articleId = req.params.id;
    global.db.all("SELECT * FROM article WHERE id = ?", [articleId], function (err, articles) {
        if (err) {
            next(err);
            return;
        }
        res.render("reader-article", {articles});
    })
    
});




module.exports = router;