const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

router.route("/").get(userController.index);

router.route("/login").get(userController.loginPage).post(userController.login);

router
  .route("/signup")
  .get(userController.signupPage)
  .post(userController.create);

module.exports = router;
