const fs = require("fs");
const path = require("path");
const dns = require("dns");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");

dns.setServers(["1.1.1.1"]);

dotenv.config({ path: "./config.env" });

const DB = process.env.CONNECTION_STRING.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD,
);

mongoose.connect(DB).then(() => {
  // eslint-disable-next-line no-console
  console.log("DB connection successful!");
});

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours-simple.json"), "utf-8"),
);

// Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
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
    // eslint-disable-next-line no-console
    console.log("Data successfully deleted!");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  // eslint-disable-next-line no-console
  console.log(
    "Usage: node dev-data/data/import-dev-data.js --import | --delete",
  );
}
