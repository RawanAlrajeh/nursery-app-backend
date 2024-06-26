const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-code", authenticate, authController.verifyCode);
router.post(
  "/new-user",
  authenticate,
  authorize(["admin"]),
  adminController.adminRegister
);
router.post("/set-password", adminController.setPassword);

// Example of protected route
router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.send("Admin content");
});

module.exports = router;
