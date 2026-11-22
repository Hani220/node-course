const path = require("path");
const express = require("express");

const morgan = require("morgan");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./middleware/errorController.js");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const viewRouter = require("./routes/viewRoutes.js");

const app = express();

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

//Global Middlwares
// Serve static files after moving the public folder out of starter.
app.use(express.static(path.join(__dirname, "public")));

//Set security http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://api.mapbox.com"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://api.mapbox.com",
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "connect-src": ["'self'", "https://*.mapbox.com"],
        "img-src": ["'self'", "data:", "blob:", "https://*.mapbox.com"],
        "worker-src": ["'self'", "blob:"],
      },
    },
  }),
);

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
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);
app.use(cookieParser());
// Data Sanitization against NOSQL Query Injection
app.use(mongoSanitize());

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
  console.log(req.cookies);

  next();
});
//2) ROUTE HANDLERS
//3) ROUTES

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
