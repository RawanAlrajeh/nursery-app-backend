const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get(
  "/",
  authenticate,
  authorize(["admin", "nursery"]),
  userController.getMothers
);

module.exports = router;
