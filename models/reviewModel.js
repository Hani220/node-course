const mongoose = require("mongoose");
//review -rating - createdAt-tourRef -userRef  => parent

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    rquired: ["a Review cannot be empty !."],
  },
  rating: {
    type: Number,
    default: [],
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tours: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
  ],
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  ],

  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Review = mongoose.Model("Review", reviewSchema);
module.exports = Review;
