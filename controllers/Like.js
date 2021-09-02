const Post = require("../models/Post");
const checkAuth = require("../util/check-auth");

// like post
const like = async (req, res) => {
  try {
    const user = checkAuth(req);
    const postId = req.params.post_id;
    const post = await Post.findById(postId);
    if (post) {
      if (post.likes.find((like) => like.username === user.username)) {
        // already liked, unlike it
        post.likes = post.likes.filter(
          (like) => like.username !== user.username
        );
      } else {
        // not liked, like it
        post.likes.push({
          username: user.username,
          createdAt: new Date().toISOString(),
        });
      }
      await post.save();
      res.json({
        status: "success",
        message: "Like updated successfully",
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

module.exports = { like };
