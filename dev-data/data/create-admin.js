const dns = require("dns");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../../models/userModel");

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

// Bootstrap the first admin user.
// Run with: node dev-data/data/create-admin.js
const createAdmin = async () => {
  try {
    const admin = await User.create({
      name: process.env.ADMIN_NAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@gmail.com",
      password: process.env.ADMIN_PASSWORD || "pass1234",
      passwordConfirm: process.env.ADMIN_PASSWORD || "pass1234",
      role: "admin",
    });

    // eslint-disable-next-line no-console
    console.log(`Admin created: ${admin.email} (role: ${admin.role})`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  process.exit();
};

createAdmin();
