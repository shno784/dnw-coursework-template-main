const { body } = require("express-validator");

//Ensure that the user cannot do certain things
const validateBlog = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty!")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Title must be Letter only!"),

  body("subtitle")
    .trim()
    .notEmpty()
    .withMessage("Subtitle cannot be empty!")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Subtitle must be Letter only!"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty!")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must be Letter only!"),
];

module.exports = { validateBlog };
