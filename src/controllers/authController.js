const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const AppError = require("../utils/appError");

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  removePasswordFromOutput(user);

  res.status(statusCode).json({
    data: {
      token,
      user
    },
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const removePasswordFromOutput = (user) => user.password = undefined;

exports.signup = async (req, res, next) => {
  const user = await userService.create({
    ...req.body,

    // ...req.body is a short way to do this (Spread operator)
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm,
    // isSeller: req.body.isSeller
  });

  if (!user) {
    throw new AppError(422, "The request was well-formed but unable to be followed due to semantic errors.", "Try again later!");
  };

  res.status(204).send();
};

exports.login = async (req, res, next) => {
  // 1) Check if email and password exist
  if (!isValidLoginRequest(req.body)) {
    throw new AppError(400, "The request contains malformed data in parameters.", "Please provide email and password!");
  };

  const { email, password } = req.body;

  // 2) Check if the user exists && password is correct
  const user = await userService.findByEmailWithPassword(email);

  if (!(await isUserValidated(user, password))) {
    throw new AppError(401, "Incorrect email or password!", "");
  };

  // 3) If everything ok, send token and user data to client
  createSendToken(user, 200, res);
};

const isValidLoginRequest = (requestBody) => {
  const { email, password } = requestBody;
  return email && password;
};

const isUserValidated = async (user, password) => { 
  return user && await user.correctPassword(password, user.password);
};

exports.protect = async (req, res, next) => {
  // 1) Getting token from request headers and check if it's there
  const token = getTokenFromHeaders(req.headers);

  if (!token) {
    throw new AppError(401, "Unauthorized.", "Authentication credentials are missing or invalid.");
  };

  // 2) Verification token
  const decodedToken = await decodeToken(token);

  // 3) Check if user exists
  const currentUser = await userService.findById(decodedToken.id);
  if (!currentUser) {
    throw new AppError(401, "Unauthorized.", "Authentication credentials are missing or invalid.");
  };

  // GRANT ACCESS TO PROTECTED ROUTE
  next();
};

const getTokenFromHeaders = (headers) => {
  if (headers.authorization && headers.authorization.startsWith('Bearer')) {
    return headers.authorization.split(" ")[1];
  }
  return null;
};

const decodeToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};
