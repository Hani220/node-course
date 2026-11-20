const express = require("express");

const router = express.Router();

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

router.use(authController.IsLogggedIn);

router.get("/", (req, res) => res.redirect("/overview"));

router.get("/overview", viewsController.getOverview);

router.get("/tour/:slug", viewsController.getTour);

router.get("/login", viewsController.getLoginForm);

module.exports = router;
