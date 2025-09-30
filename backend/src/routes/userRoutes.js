const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, authenticateToken } = require("../middleware/auth");

// Create a new user
router.post("/register", authController.register);

// Log in
router.post("/login", loginLimiter, authController.login);

// Log out
router.post("/logout", authController.logout);

// Verify authentication
router.get("/verify", authenticateToken, authController.verifyAuth);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

// Get user profile
router.get("/profile", authenticateToken, authController.getUserProfile);

// Update user profile
router.put("/profile", authenticateToken, authController.updateUserProfile);

// Delete ( soft ) user account
router.delete("/profile", authenticateToken, authController.deleteAccount);

module.exports = router;
