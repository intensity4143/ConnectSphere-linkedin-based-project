const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostsByUser,
} = require("../controllers/postController");

const {authMiddleware} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createPost);              
router.get("/", getAllPosts);                    
router.get("/user/:userId", getPostsByUser);     

module.exports = router;
