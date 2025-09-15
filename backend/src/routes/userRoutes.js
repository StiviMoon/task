const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, authenticateToken } = require("../middleware/auth");

// Create a new user
router.post("/register", authController.register);

// Login
router.post("/login", loginLimiter, authController.login);

// Log out
router.post("/logout", authController.logout);

// Check authentication
router.get("/verify", authenticateToken, authController.verifyAuth);

// I forgot my password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
