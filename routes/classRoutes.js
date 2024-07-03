const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.post(
  "/nurseries/:nurseryId/classes",
  authenticate,
  authorize(["nursery", "admin"]),
  classController.createClass
);

module.exports = router;
