const fs = require("fs");
const path = require("path");
const dns = require("dns");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");
const Review = require("../../models/reviewModel");
const User = require("../../models/userModel");

dns.setServers(["1.1.1.1"]);

dotenv.config({ path: "./config.env" });

const DB = process.env.CONNECTION_STRING.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD,
);

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours.json"), "utf-8"),
);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "users.json"), "utf-8"),
);

const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, "reviews.json"), "utf-8"),
);

// Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    // eslint-disable-next-line no-console
    console.log("Data successfully loaded!");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

// delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    // eslint-disable-next-line no-console
    console.log("Data successfully deleted!");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const run = async () => {
  try {
    await mongoose.connect(DB);
    // eslint-disable-next-line no-console
    console.log("DB connection successful!");

    if (process.argv[2] === "--import") {
      await importData();
    } else if (process.argv[2] === "--delete") {
      await deleteData();
    } else {
      // eslint-disable-next-line no-console
      console.log(
        "Usage: node dev-data/data/import-dev-data.js --import | --delete",
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Database operation failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
