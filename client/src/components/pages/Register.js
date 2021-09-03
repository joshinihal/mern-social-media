import { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";

import classes from "./Register.module.css";
import useHttp from "../../hooks/use-http";
import { AuthContext } from "../../context/auth";

function Register(props) {
  const apiBaseUrl = process.env.REACT_APP_APIBASEURL;
  const url = `${apiBaseUrl}/users`;
  const context = useContext(AuthContext);
  const { sendRequest: registerUser, error, isLoading } = useHttp();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    registerUser({ url, headers, body, method: "POST" }, handleResponse);
  };

  return (
    <div>
      <Form className={classes["form-container"]} onSubmit={handleSubmit}>
        <h2>Register</h2>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={handleChange}
          type="text"
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
          onChange={handleChange}
          type="email"
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={handleChange}
          type="password"
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={values.confirmPassword}
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

export default Register;
