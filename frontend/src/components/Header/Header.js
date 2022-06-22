import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { isAuth, user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  return (
    <div className="box_header">
      <Link as={Link} to="/">
        <img className="logo" src={require("./ANIRUM.png")} />
      </Link>

      <div className="cotainer_header">
        {/* <Link as={Link} to="/">Home</Link> */}

        {isAuth && (
            <div className="item_header">{user?.username}</div>
        )}
        {isAuth && (
            <a className="item_header logout" onClick={logout}>Выход</a>
        )}

        {!isAuth && (
          <Link as={Link} to="/login" className="item_header">
            Вход
          </Link>
        )}
        {!isAuth && (
          <Link as={Link} to="/signup" className="item_header">
            Регистрация
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
