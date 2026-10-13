const express = require("express");
const tourController = require("../controllers/tourController.js");
const authController = require("../controllers/authController.js");

const router = express.Router();
router
  .route("/top-5-cheap")
  .get(tourController.ailasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
// router.param('id', tourContrller.checkID);
router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

module.exports = router;
