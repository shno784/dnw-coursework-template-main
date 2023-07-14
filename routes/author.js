const express = require("express");
const router = express.Router();
const assert = require("assert");


//Render Home page, it shows the blog title, subtitle, author name, it also shows articles which can be deleted, published, edited.
router.get("/", (req, res, next) => {
    //Placeholder, will have to change based on user
    global.db.all("SELECT * FROM blog", function (err, blogs) {
        if (err) {
            console.log(err);
            next(err);
            return;
        };

        global.db.all("SELECT * FROM article", function (err, articles) {
            if (err) {
                console.log(err);
                next(err);
                return;
            };
            res.render("author-home-page", {blogs, articles});
        })
    })

    
    
});

//Render settings page
router.get("/settings", (req, res) => {

    global.db.all("SELECT * FROM blog", function (err, blogs) {
        if (err) {
            console.log(err);
            next(err);
            return;
        };
        res.render("author-settings-page", {blogs});
    })

});

router.post("/edit", (req, res, next) => {
    const {title, subtitle, username} = req.body;

    console.log(title, subtitle, username)

    global.db.get("INSERT INTO blog (title, subtitle, username) VALUES (?, ?, ?",
                    [title, subtitle, username],
                    function (err) {
                        if (err) {
                            console.log(err);
                            next(err);
                            return;
                        } else {
                            // res.render("author-settings-page", {blogs});
                        }
                    })
})

//Render edits page
router.get("/edit", (req, res) => {
    res.render("author-edit-article-page");
});



module.exports = router;