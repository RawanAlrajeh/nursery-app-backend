const express = require("express");
const router = express.Router();
const babysitterController = require("../controllers/babysitterController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.post(
  "/nurseries/:nurseryId/babysitters",
  authenticate,
  authorize(["nursery", "admin"]),
  babysitterController.createBabysitter
);

module.exports = router;
