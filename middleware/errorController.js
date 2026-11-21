const AppError = require("../utils/appError.js");

const handleCastErrorDB = (err) => {
  const message = `${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue || {})[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please login again!", 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    //rendered Website
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something Went Wrong!",
      msg: err.message,
      statusCode: err.statusCode,
    });
  }
};

const sendErrorProduction = (err, req, res) => {
  //operational,trusted error : send message to the client
  if (err.isOperational) {
    if (req.originalUrl.startsWith("/api")) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(err.statusCode).render("error", {
        title: "Something Went Wrong!",
        msg: err.message,
        statusCode: err.statusCode,
      });
    }
    //programming or other unknown error : dont leak error details to the client
  } else {
    //1)log the error
    process.stderr.write(`ERROR ${err.stack || err.message || err}\n`);
    if (req.originalUrl.startsWith("/api")) {
      res.status(500).json({
        status: "error",
        message: "somthing went wrong",
      });
    } else {
      res.status(500).render("error", {
        title: "Something Went Wrong!",
        msg: "Sorry, something went wrong. Please try again later.",
        statusCode: 500,
      });
    }
  }
};

const errorController = (err, req, res, next) => {
  // Keep the four-argument signature so Express recognizes this as error middleware.
  void next;

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }

    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(err);
    }

    if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    }

    if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorProduction(error, req, res);
  }
};
module.exports = errorController;
