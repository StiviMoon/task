const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, authenticateToken } = require("../middleware/auth");

// Create a new user (register)
router.post("/register", authController.register);

// Login
router.post("/login", loginLimiter, authController.login);

// Logout
router.post("/logout", authController.logout);

// Verify authentication
router.get("/verify", authenticateToken, authController.verifyAuth);

// I forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
