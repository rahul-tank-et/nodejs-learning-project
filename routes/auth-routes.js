const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/auth-controller");

const router = express.Router();

// All routes related to authentication & authorization
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
