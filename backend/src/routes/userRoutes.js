const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");


// Edit Profile
router.put("/me", authenticateToken, userController.editProfile);    

// Get Profile
router.get("/me", authenticateToken, userController.getProfile);

module.exports = router;
