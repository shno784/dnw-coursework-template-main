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

//User is able to edit the blog's title, subtitle and name
//Takes these as req.body, updates the correct blog that the user is using and redirects them to the author page.
router.post("/edit", (req, res, next) => {
    const {title, subtitle, username} = req.body;

    console.log(title, subtitle, username)
    
    global.db.get("UPDATE blog SET title = ?, subtitle = ?, blog_username = ? WHERE id = ?",
                    [title, subtitle, username, 1],
                    function (err) {
                        if (err) {
                            console.log(err);
                            next(err);
                            return;
                        } 
                        global.db.all("SELECT * FROM blog", function (err, blogs) {
                            if (err) {
                                console.log(err)
                                next(err);
                                return;
                            }
                            res.redirect("/author");
                        })                  
                        
                    })
})

//Render edits page
router.get("/edit", (req, res) => {
    res.render("author-edit-article-page");
});



module.exports = router;