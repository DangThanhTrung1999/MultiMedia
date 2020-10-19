"use strict";

var User = require("./models/user.model");

module.exports.requireAuth = function (req, res, next) {
  if (!req.cookies.userId) {
    res.redirect("/user/login");
    return;
  }
};