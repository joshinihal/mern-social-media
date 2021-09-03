import { useState } from "react";
import { Form, Button } from "semantic-ui-react";

import classes from "./PostForm.module.css";
import apiBaseUrl from "../../config";
import useHttp from "../../hooks/use-http";

const PostForm = (props) => {
  const url = `${apiBaseUrl}/posts`;

  const [values, setValues] = useState({
    body: "",
  });

  const { sendRequest: createPost, error, isLoading } = useHttp();

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
      createPost({ url, headers, body, method: "POST" }, handleResponse);
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <Form className={classes["form-container"]} onSubmit={handleSubmit}>
        <h2>Create a Post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="What's on your mind ?..."
            name="body"
            value={values.body}
            onChange={handleChange}
            type="text"
          />
        </Form.Field>
        {error && !isLoading ? (
          <div className={classes["error"]}>{`Error: ${error}`}</div>
        ) : (
          ""
        )}
        {isLoading ? <Button color="violet">Loading...</Button> : ""}
        {!isLoading ? (
          <Button type="submit" color="violet">
            Submit
          </Button>
        ) : (
          ""
        )}
      </Form>
    </div>
  );
};

export default PostForm;
