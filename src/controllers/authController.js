const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    data: {
      token,
      user
    },
  });
};

exports.signup = async (req, res, next) => {
  await User.create({
    ...req.body,

    // ...req.body is a short way to do this
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm,
    // isSeller: req.body.isSeller
  });

  res.status(201).json({
    status: "success",
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    throw new AppError(400, "The request contains malformed data in parameters.", "Please provide email and password!");
  }

  // 2) Check if the user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError(401, "Incorrect email or password!", "");
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError(401, "Unauthorized.", "Authentication credentials are missing or invalid.");
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError(401, "Unauthorized.", "Authentication credentials are missing or invalid.");
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  next();
};