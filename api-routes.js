const router = require("express").Router();
const postController = require("./controllers/Post");
const userController = require("./controllers/User");
const commentController = require("./controllers/Comment");
const likeController = require("./controllers/Like");

router.get("/", (req, res) => {
  res.json({
    status: "200 OK",
    message: "Welcome!",
  });
});

router.route("/posts").get(postController.index).post(postController.create);

router.route("/posts/:post_id").get(postController.view).delete(postController.remove);

router.route("/posts/:post_id/comments").post(commentController.create);

router.route("/posts/:post_id/likes").post(likeController.like);

router.route("/posts/:post_id/comments/:comment_id").delete(commentController.remove);

router.route("/users").get(userController.index).post(userController.create);

router.route("/auth").post(userController.auth);


module.exports = router;
