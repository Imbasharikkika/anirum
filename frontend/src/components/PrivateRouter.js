import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export function PrivateRoute({ element: Component, ...rest }) {
  const { isAuth } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
