import { useEffect, useState, useCallback, useContext } from "react";
import { Item, Grid, Button, Icon } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import apiBaseUrl from "../../config";
import useHttp from "../../hooks/use-http";
import Comments from "../ui/Comments";
import { AuthContext } from "../../context/auth";
import classes from "./SinglePost.module.css";

const SinglePost = (props) => {
  const postId = props.match.params.post_id;
  const url = `${apiBaseUrl}/posts/${postId}`;
  const [post, setPost] = useState({});
  const [hasLiked, setHasLiked] = useState(false);
  const context = useContext(AuthContext);

  const { sendRequest: fetchPostData, error, isLoading } = useHttp();

  const { sendRequest: likePost } = useHttp();

  const transformPost = useCallback((singlePost) => {
    setPost(singlePost.data);
  }, []);

  useEffect(() => {
    fetchPostData({ url }, transformPost);
  }, [fetchPostData, url, transformPost]);

  useEffect(() => {
    if (
      context.user &&
      post.likes &&
      post.likes.findIndex(
        (like) => like.username === context.user.username
      ) !== -1
    ) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [context.user, post.likes]);

  const handleLike = () => {
    const likeApiUrl = `${apiBaseUrl}/posts/${postId}/likes`;
    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    likePost({ url: likeApiUrl, headers, method: "POST" }, handleLikeSuccess);
  };

  const handleCommentSuccess = () => {
    fetchPostData({ url }, transformPost);
  };

  const handleLikeSuccess = () => {
    fetchPostData({ url }, transformPost);
  };

  return (
    <div className={classes["outer-container"]}>
      <h2>Read post</h2>
      {!error && isLoading ? <div>Loading...</div> : ""}
      {error && !isLoading ? <div>Error</div> : ""}
      {!error && !isLoading ? (
        <Grid>
          <Grid.Column width={4}>
            <Grid.Column className={classes["reactions-container"]}>
              {context.user ? (
                hasLiked ? (
                  <Button onClick={handleLike} className="ui basic button">
                    {" "}
                    <Icon
                      className={classes["reaction"]}
                      name="like"
                      color="red"
                    />{" "}
                    {post.likes && post.likes.length}
                  </Button>
                ) : (
                  <Button onClick={handleLike} className="ui basic button">
                    {" "}
                    <Icon className={classes["reaction"]} name="like" />
                    {post.likes && post.likes.length}
                  </Button>
                )
              ) : (
                <Button as={Link} to={`/login`} className="ui basic button">
                  {" "}
                  <Icon className={classes["reaction"]} name="like" />
                  {post.likes && post.likes.length}
                </Button>
              )}

              <Button className="ui basic button">
                <Icon className={classes["reaction"]} name="comments" />
                {post.likes && post.comments.length}
              </Button>
            </Grid.Column>
          </Grid.Column>
          <Grid.Column width={9}>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Header>{post.username}</Item.Header>
                  <Item.Meta>
                    <span className="price">
                      {moment(post.createdAt).fromNow()}
                    </span>
                  </Item.Meta>
                  <Item.Description className={classes["post-body"]}>
                    {post.body}
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
        </Grid>
      ) : (
        ""
      )}
      <Comments
        onCreateSuccess={handleCommentSuccess}
        postId={post._id}
        comments={post.comments}
      ></Comments>
    </div>
  );
};

export default SinglePost;
