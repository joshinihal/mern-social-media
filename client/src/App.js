import { BrowserRouter, Route } from "react-router-dom";

import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import SinglePost from "./components/pages/SinglePost";
import MenuBar from "./components/ui/MenuBar";

function App() {
  return (
    <AuthProvider>
      <Container>
        <BrowserRouter>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:post_id" component={SinglePost} />
        </BrowserRouter>
      </Container>
    </AuthProvider>
  );
}

export default App;
