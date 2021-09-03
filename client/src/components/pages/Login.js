import { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";

import classes from "./Login.module.css";
import useHttp from "../../hooks/use-http";
import { AuthContext } from "../../context/auth";

function Login(props) {
  const apiBaseUrl = process.env.REACT_APP_APIBASEURL;
  const url = `${apiBaseUrl}/auth`;
  const context = useContext(AuthContext);
  const { sendRequest: loginUser, error, isLoading } = useHttp();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleResponse = (response) => {
    context.login(response.data);
    props.history.push("/");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const body = values;
    loginUser({ url, headers, body, method: "POST" }, handleResponse);
  };

  return (
    <div>
      <Form className={classes["form-container"]} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={handleChange}
          type="text"
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={handleChange}
          type="password"
        />

        {error && !isLoading ? (
          <div className={classes["error"]}>{`Error: ${error}`}</div>
        ) : (
          ""
        )}
        {isLoading ? <Button color="violet">Loading...</Button> : ""}
        {!isLoading ? (
          <Button type="submit" color="violet">
            Register
          </Button>
        ) : (
          ""
        )}
      </Form>
    </div>
  );
}

export default Login;
