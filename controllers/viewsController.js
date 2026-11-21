const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res) => {
  //1- Get tour data from the collection
  const tours = await Tour.find();
  //2- Biuld template
  //3- Render that template using the tour data from 1
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  ///1 get the data for the requested tour (included reviews and guides )
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  if (!tour) {
    return next(new AppError("There Is No Tour With That Name!"));
  }
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your Account",
  });
};
