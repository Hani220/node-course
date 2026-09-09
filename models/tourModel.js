const slugify = require("slugify");
const mongoose = require("mongoose");
const validator = require("validator");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxLength: [40, "A Tour must less than or equal 40 characters"],
      minLength: [10, "A Tour must have more than or equal 10 Characters"],
      // validate: [validator.isAlpha, "Tour Name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a Goup  Size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Dificulty is either : easy,medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating mist be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount Price ({VALUE}) should be below regular Price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a Cover Image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
tourSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});
// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre("save", function () {
//   // eslint-disable-next-line no-console
//   console.log("Will save document...");
// });
// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.post("save", function (doc) {
//   // eslint-disable-next-line no-console
//   console.log(doc);
// });
//Query Middelware
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

tourSchema.post(/^find/, function (docs) {
  console.log(`query took!${Date.now() - this.start} in milliseconds`);
});

//ِAGGREGATION MIDDELWARE
tourSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
