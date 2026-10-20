const express = require("express");

const morgan = require("morgan");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./middleware/errorController.js");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const app = express();
//Global Middlwares
//Set security http headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

//Body Parser,reading data from the body into req.body
app.use(express.json({ limit: "10Kb" }));

// Data Sanitization against NOSQL Query Injection
app.use(mongoSanitize());

// Serve static files after moving the public folder out of starter.
app.use(express.static(`${__dirname}/public`));

//Data Sanitization against xss
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

//Test Middelware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
//2) ROUTE HANDLERS
//3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
