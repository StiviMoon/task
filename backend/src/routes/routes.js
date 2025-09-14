const express = require("express");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes.js");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();


router.use("/auth", userRoutes);

// Then implement the protected routes here. ( by Auth.js )
router.use("/tasks", authenticateToken ,taskRoutes);


module.exports = router;

