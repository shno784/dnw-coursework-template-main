const express = require("express");
const router = express.Router();
const assert = require('assert');


//Render Home page
router.get("/", (req, res) => {
    res.render("author-home-page");
});

//Render settings page
router.get("/settings", (req, res) => {
    res.render("author-settings-page");
});

//Render edits page
router.get("/edit", (req, res) => {
    res.render("author-edit-article-page");
});



module.exports = router;