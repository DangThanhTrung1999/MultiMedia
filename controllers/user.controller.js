const User = require("../models/user.model");

const index = async (req, res, next) => {
  let users = await User.find({});
  return res.status(200).json({ users });
};

const create = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    return res.redirect("/user/login");
  } catch (error) {
    next(error);
  }
};

const loginPage = async (req, res, next) => {
  res.render("login");
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user) {
    return res.redirect("/user/login");
  }
  if (password === user.password) {
    req.session.name = user.name;
    res.cookie("userId", user.id);
    res.cookie("name", user.name);
    return res.redirect("/home");
  } else {
    return res.redirect("/user/login");
  }
};

const signupPage = async (req, res, next) => {
  res.render("signup");
};

module.exports = {
  index,
  create,
  loginPage,
  login,
  signupPage,
};
