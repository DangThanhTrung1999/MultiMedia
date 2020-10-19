"use strict";

var User = require("../models/user.model");

var index = function index(req, res, next) {
  var users;
  return regeneratorRuntime.async(function index$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.find({}));

        case 2:
          users = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            users: users
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

var create = function create(req, res, next) {
  var newUser;
  return regeneratorRuntime.async(function create$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          newUser = new User(req.body);
          _context2.next = 4;
          return regeneratorRuntime.awrap(newUser.save());

        case 4:
          return _context2.abrupt("return", res.redirect("/user/login"));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var loginPage = function loginPage(req, res, next) {
  return regeneratorRuntime.async(function loginPage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.render("login");

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var login = function login(req, res, next) {
  var _req$body, email, password, user;

  return regeneratorRuntime.async(function login$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 3:
          user = _context4.sent;

          if (user) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.redirect("/user/login"));

        case 6:
          if (!(password === user.password)) {
            _context4.next = 12;
            break;
          }

          req.session.name = user.name;
          res.cookie("userId", user.id);
          return _context4.abrupt("return", res.redirect("/home"));

        case 12:
          return _context4.abrupt("return", res.redirect("/user/login"));

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var signupPage = function signupPage(req, res, next) {
  return regeneratorRuntime.async(function signupPage$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.render("signup");

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  index: index,
  create: create,
  loginPage: loginPage,
  login: login,
  signupPage: signupPage
};