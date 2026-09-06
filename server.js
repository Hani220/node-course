const dns = require("dns");

dns.setServers(["1.1.1.1"]);

const dotenv = require("dotenv");
const mongoose = require("mongoose");
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
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app running on port ${port}....`);
});
