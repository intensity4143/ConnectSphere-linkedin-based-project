const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  updateBio,
  getUserById,
  getCurrentUser
} = require("../controllers/userController");

const { authMiddleware } = require("../middleware/authMiddleware");

// public routes
router.post("/register", signUp);
router.post("/login", login);

// protected routes
router.get("/users/:id", authMiddleware, getUserById);
router.get("/myProfile", authMiddleware, getCurrentUser);
router.put("/updateBio", authMiddleware, updateBio);

module.exports = router;
