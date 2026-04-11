const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authcontroller");

// Routes
router.post("/signup", signup);
router.post("/login", login);
const { getProfile } = require("../controllers/authcontroller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/profile", getProfile);

module.exports = router;
