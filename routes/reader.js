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
router.get("/article/:id", (req, res, next) => {
    const articleId = req.params.id;
    global.db.all("SELECT * FROM article WHERE id = ?", [articleId], function (err, articles) {
        if (err) {
            next(err);
            return;
        }
        res.render("reader-article", {articles});
    })
    
});


router.post("/like/:id", (req, res, next) => {
    const articleId = req.params.id;
    
    global.db.all("SELECT likes FROM article WHERE id = ?", [articleId], function (err, like) {
        if (err) {
            next(err);
            return;
        }

        const likes = like.likes || 0;

        if (likes > 0) {
            console.log("Already liked")
        } else {
            global.db.all("UPDATE article SET likes = likes + 1 WHERE user_id = ?", [articleId], function (err) {
                if (err) {
                    next(err);
                    return;
                }
            })
            res.redirect(`/reader/article/${articleId}`)
        }
    })
})

module.exports = router;