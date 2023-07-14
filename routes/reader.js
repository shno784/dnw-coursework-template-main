const express = require("express");
const router = express.Router();
const assert = require('assert');


//Render Home page
router.get("/", (req, res) => {
    res.render("reader-home");
});

//Render Article page
router.get("/article", (req, res) => {
    res.render("reader-article");
});




module.exports = router;