import { useContext, useState, useEffect } from "react";
import { Card, Icon, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth";
import classes from "./PostCard.module.css";
import apiBaseUrl from "../../config";
import useHttp from "../../hooks/use-http";

const PostCard = (props) => {
  const url = `${apiBaseUrl}/posts/${props.id}/likes`;

  const [hasLiked, setHasLiked] = useState(false);
  const context = useContext(AuthContext);

  const { sendRequest: likePost } = useHttp();

  useEffect(() => {
    if (
      context.user &&
      props.likes.findIndex(
        (like) => like.username === context.user.username
      ) !== -1
    ) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [context.user, props.likes]);

  const handleResponse = (response) => {
    props.onLikeSuccess();
  };

  const handleLike = () => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    likePost({ url, headers, method: "POST" }, handleResponse);
  };

  return (
    <div>
      <Card className={classes["card"]}>
        <Card.Content>
          <Card.Header>
            {" "}
            <Icon name="user outline" /> {props.username}
          </Card.Header>
          <Card.Description
            as={Link}
            to={`/posts/${props.id}`}
            className={classes["description"]}
          >
            {props.body}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <span>
            {context.user ? (
              hasLiked ? (
                <Button onClick={handleLike} className="ui basic button">
                  {" "}
                  <Icon
                    className={classes["reaction"]}
                    name="like"
                    color="red"
                  />{" "}
                  {props.likes.length}
                </Button>
              ) : (
                <Button onClick={handleLike} className="ui basic button">
                  {" "}
                  <Icon className={classes["reaction"]} name="like" />
                  {props.likes.length}
                </Button>
              )
            ) : (
              <Button as={Link} to={`/login`} className="ui basic button">
                {" "}
                <Icon className={classes["reaction"]} name="like" />
                {props.likes.length}
              </Button>
            )}
          </span>
          <span className={classes["reaction-div"]}>
            <Button
              className="ui basic button"
              as={Link}
              to={`/posts/${props.id}`}
            >
              <Icon className={classes["reaction"]} name="comments" />
              {props.comments.length}
            </Button>
          </span>
          <span className={classes["date"]}>
            {moment(props.date).fromNow()}
          </span>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PostCard;
