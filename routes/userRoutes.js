const express = require("express");
const userController = require("../controllers/userController.js");
const authController = require("../controllers/authController.js");

const Router = express.Router();

Router.post("/signUp", authController.signUp);
Router.post("/login", authController.login);

Router.post("/forgotPassword", authController.forgotPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);

Router.use(authController.protect);

Router.route("/")
  .get(userController.getAllUsers)
  .post(authController.restrictTo("admin"), userController.createUser);

Router.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
