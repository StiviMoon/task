const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { loginLimiter, authenticateToken } = require("../middleware/auth");

// Create a new user
router.post("/register", authController.register);

// Login
router.post("/login", loginLimiter, authController.login);

// Logout
router.post("/logout", authController.logout);

// Verify authentication
router.get("/verify", authenticateToken, authController.verifyAuth);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
