const Post = require("../models/Post");
const checkAuth = require("../util/check-auth");

// get all posts
const index = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({
      status: "success",
      message: "Posts retrieved successfully!",
      data: posts,
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
};

// get single post
const view = async (req, res) => {
  try {
    const id = req.params.post_id;
    const post = await Post.findById(id);
    if (post) {
      res.json({
        status: "success",
        message: "Post retrieved successfully!",
        data: post,
      });
    } else {
      throw new Error("Post not found!");
    }
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
};

// create new post
const create = async (req, res) => {
  try {
    const user = checkAuth(req);
    const newPost = new Post({
      body: req.body.body,
      user: user.id,
      username: user.username,
      createdAt: new Date().toISOString(),
    });
    const post = await newPost.save();
    res.json({
      status: "success",
      message: "Post created successfully!",
      data: post,
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
};

// remove single post
const remove = async (req, res) => {
  try {
    const user = checkAuth(req);
    const id = req.params.post_id;
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found!");
    }
    if (user.username === post.username){
      await post.delete();
      res.json({
        status: "success",
        message: "Post deleted successfully",
      });
    } else {
      throw new Error("Action not allowed for this user!");
    }
    // const posts = await Post.remove({ _id: id });
    
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = { index, create, remove, view };
