const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, "The request contains malformed data in parameters.", message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(400, "The request contains malformed data in parameters.", message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data, ${errors.join(". ")}`;

  return new AppError(400, "The request contains malformed data in parameters.", message);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    code: err.statusCode,
    status: err.status,
    error: err,
    message: err.message,
    details: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details
    });

  // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR!", err);

    // 2) Send generic message
    res.status(500).json({
      code: err.code,
      message: "Something went very wrong!",
      details: "There was a problem processing your request. Please try again later."
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
