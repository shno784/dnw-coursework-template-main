module.exports = function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    //User is Logged in.
    next();
  } else {
    const errors = "Please Login to continue";
    //User is not logged in, redirect them to login page with message
    res.render("login", { errors });
  }
};
