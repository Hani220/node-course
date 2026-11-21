const express = require("express");

const router = express.Router();

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

router.get("/", (req, res) => res.redirect("/overview"));

router.get(
  "/overview",
  authController.IsLogggedIn,
  viewsController.getOverview,
);

router.get("/tour/:slug", authController.IsLogggedIn, viewsController.getTour);

router.get("/login", authController.IsLogggedIn, viewsController.getLoginForm);
router.get("/me", authController.protect, viewsController.getAccount);

module.exports = router;
