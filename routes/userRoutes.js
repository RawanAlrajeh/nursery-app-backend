const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/", authenticate, authorize(["admin"]), userController.getAllUsers);
router.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  userController.getUserById
);

module.exports = router;
