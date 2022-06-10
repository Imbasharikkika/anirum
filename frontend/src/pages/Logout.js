import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  return <button onClick={logout}>Logout</button>;
};

export default Logout;
