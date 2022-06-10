import { useState, useEffect, createContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  token: null,
});

const LOGIN_URL = "http://localhost:1337/api/auth/local";

export function AppWithAuth({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  function login(user) {
    Axios.post(LOGIN_URL, {
      identifier: user.email,
      password: user.password,
    })
      .then((res) => {
        console.log(res.data);
        // console.log("Well done!");
        // console.log("User profile", res.data.user);
        // console.log("User token", res.data.jwt);

        setToken(res.data.jwt);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.jwt);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate(`/`);
      })
      .catch((error) => {
        // Handle error.
        console.log("An error occurred:", error.response);
      });
  }

  function signup() {}

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(`/`);
    window.location.reload();
  }

  const isAuth = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, login, signup, logout, isAuth }}
    >
      <div>{children}</div>
    </AuthContext.Provider>
  );
}
