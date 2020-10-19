const User = require("./models/user.model");

module.exports.requireAuth = (req, res, next) => {
  if (!req.cookies.userId) {
    res.redirect("/user/login");
    return;
  }
};
