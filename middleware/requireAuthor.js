module.exports = function requireLogin(req, res, next) {
  if (req.session.author == 1) {
    //User is Logged in.
    next();
  } else {
    //User is not an author, redirect them to reader page
    res.redirect("/reader");
  }
};
