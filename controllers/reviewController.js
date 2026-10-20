const Review = require("../models/reviewModel.js");
const APIFeatures = require("../utils/ApiFeatures.js");
const catchAsync = require("../utils/catchAsync.js");
// const AppError = require("../utils/appError.js");

exports.getAllReviews = catchAsync(async (req, res) => {
  //execute query
  const reviews = await Review.find();
  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.createReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = catchAsync(async (req, res) => {
  // implementation
});
