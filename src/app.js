const express = require("express");
require('express-async-errors');
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const globalErrorHandler = require("./middlewares/globalErrorHandler");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const dogRouter = require("./routes/dogRoutes");

const app = express();

// swagger doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json - to make req.body work properly and not return undefined
app.use(bodyParser.json());

// Set security HTTP Header
app.use(helmet());

// Development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API - 100 requests per hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// ROUTES
app.use("/api/v1", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dogs", dogRouter);

// Global Error handling middleware
app.use(globalErrorHandler);

// Send General 404 response if URL is not found
app.all('*', function(req, res){
  res.status(404).send({
    code: "ERR-404",
    message: "That's an error.",
    details: "This resource is not available. Check the URL."
  });
});

module.exports = app;
