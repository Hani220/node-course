const mongoose = require("mongoose");
//review -rating - createdAt-tourRef -userRef  => parent
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: ["a Review cannot be empty !."],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function () {
  // this.populate({
  //   path: "user",
  //   select: "name photo",
  // }).populate({
  //   path: "tour",
  //   select: "name",
  // });
  this.populate({
    path: "user",
    select: "name photo",
  });
});

reviewSchema.statics.clacAverageRatings = async function (tourId) {
  console.log(tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].nRating,
      ratingsQuantity: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.clacAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function () {
  this.review = await this.model.findOne(this.getQuery());
});

reviewSchema.post(/^findOneAnd/, async function () {
  //  this.review = await this.findOne(); does not work here ,cuz query already has been executed
  await this.model.clacAverageRatings(this.review.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
