const Post = require("../model/PostModel");
const User = require("../model/UserModel");

// ------------ Create New Post -----------------
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Post cannot be empty",
      });
    }

    const newPost = await Post.create({
      content,
      author: req.user.id,
    });

    await newPost.populate("author", "name email");
    
    res.status(201).json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("Error while creating post:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating post",
    });
  }
};

// ------------ Get All Posts (Feed) --------------
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name") // get name of the author
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error while fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching posts",
    });
  }
};

// ------------ Get Posts by User ID --------------
exports.getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 })
    .populate("author", "name");;
    console.log(posts)

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching user's posts",
    });
  }
};
