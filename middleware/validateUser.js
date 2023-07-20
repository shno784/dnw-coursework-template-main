const { body, validationResult } = require("express-validator");

//Ensure that the user cannot do certain things
const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username must contain only letters and numbers"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6, max: 15 })
    .withMessage("Password must be 6 to 15 characters"),

  //Send an error message if there is an error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signup", { errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUser };
