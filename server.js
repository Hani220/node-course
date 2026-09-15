const dns = require("dns");

dns.setServers(["1.1.1.1"]);

const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  process.exit(1);
});

const app = require("./app.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.CONNECTION_STRING.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD,
);

mongoose.connect(DB).then(() => {
  // eslint-disable-next-line no-console
  console.log("DB connection successful!");
});

// 4) START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app running on port ${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting Down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
