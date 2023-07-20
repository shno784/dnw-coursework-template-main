const { body, validationResult } = require('express-validator');

//Ensure that the user cannot do certain things
const validateBlog = [
    body('title').trim().notEmpty().withMessage("Title cannot be empty!")
        .matches(/^[A-Za-z]+$/).withMessage("Title must be Letter only!"),

    body('subtitle').trim().notEmpty().withMessage("Subtitle cannot be empty!")
    .matches(/^[A-Za-z]+$/).withMessage("Subtitle must be Letter only!"),

    body('username').trim().notEmpty().withMessage("Name cannot be empty!")
    .matches(/^[A-Za-z]+$/).withMessage("Name must be Letter only!"), 

  //Send an error message if there is an error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('author-settings-page', {errors: errors.array() });
    }
    next();
  }
]

module.exports = { validateBlog };