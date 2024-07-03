const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-code", authenticate, authController.verifyCode);
router.post("/new-user", authenticate, authorize(["admin"]), authController.adminRegister);  // Make sure adminRegister is defined
router.post("/set-password", authController.setPassword);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
