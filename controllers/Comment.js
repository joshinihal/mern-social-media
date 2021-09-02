const Post = require("../models/Post");
const checkAuth = require("../util/check-auth");

// create new comment
const create = async (req, res) => {
  try {
    const user = checkAuth(req);
    const postId = req.params.post_id;
    const body = req.body.body;
    if (!body) {
      throw new Error("Comment cannot be empty!");
    }
    const post = await Post.findById(postId);
    if (post) {
      post.comments.unshift({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      res.json({
        status: "success",
        message: "Comment added successfully",
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

// remove single comment
const remove = async (req, res) => {
  try {
    const user = checkAuth(req);
    const postId = req.params.post_id;
    const commentId = req.params.comment_id;
    const post = await Post.findById(postId);
    if (post) {
      const commentIndex = post.comments.findIndex(
        (comment) => comment.id === commentId
      );
      if (commentIndex === -1) {
        throw new Error("Comment not found!");
      }
      if (post.comments[commentIndex].username === user.username) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        res.json({
          status: "success",
          message: "Comment deleted successfully",
          data: post,
        });
      } else {
        throw new Error("Action not allowed for this user!");
      }
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

module.exports = { create, remove };
