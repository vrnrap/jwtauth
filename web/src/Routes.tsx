import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <header>
          <div>
            <Link to="/register">register</Link>
          </div>
          <div>
            <Link to="/login">login</Link>
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/" component={Register} />
          <Route exact path="/" component={Login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
