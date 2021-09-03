import React, { useState } from "react";
import { Button, Comment, Form, Header } from "semantic-ui-react";
import moment from "moment";

import apiBaseUrl from "../../config";
import useHttp from "../../hooks/use-http";

const Comments = (props) => {
  const postId = props.postId;

  const url = `${apiBaseUrl}/posts/${postId}/comments`;

  const [values, setValues] = useState({
    body: "",
  });

  const { sendRequest: createComment, error, isLoading } = useHttp();

  const handleResponse = (response) => {
    props.onCreateSuccess();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.body.trim() !== "") {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const body = values;
      createComment({ url, headers, body, method: "POST" }, handleResponse);
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <Comment.Group>
      <Header as="h3" dividing>
        Comments
      </Header>

      {props.comments && props.comments.length > 0
        ? props.comments.map((comment) => {
            return (
              <Comment key={comment._id}>
                {/* <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' /> */}
                <Comment.Content>
                  <Comment.Author as="a">{comment.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>{moment(comment.createdAt).fromNow()}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            );
          })
        : "No comments yet!"}

      <Form onSubmit={handleSubmit} reply>
        <Form.TextArea
          placeholder="Add a comment!"
          name="body"
          value={values.body}
          onChange={handleChange}
        />
        {error && !isLoading ? error : ""}
        {!error && isLoading ? (
          <Button
            content="Loading"
            labelPosition="left"
            icon="loading"
            color="violet"
          />
        ) : (
          ""
        )}

        {!error && !isLoading ? (
          <Button
            type="submit"
            content="Add Comment"
            labelPosition="left"
            icon="comments"
            color="violet"
          />
        ) : (
          ""
        )}
      </Form>
    </Comment.Group>
  );
};

export default Comments;
