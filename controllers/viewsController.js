const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

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

exports.getTour = catchAsync(async (req, res) => {
  ///1 get the data for the requested tour (included reviews and guides )
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN,
  });
});
