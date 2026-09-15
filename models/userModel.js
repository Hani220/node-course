const mongoose = require("mongoose");
const validator = require("validator");

const usrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: ["Please provide a password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: ["Please confirm yout password!"],
  },
});

const User = mongoose.model("User", usrSchema);

module.exports = User;
