import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext/AuthProvider";
const UseAuth = () => {
  const authInfo = useContext(AuthContext);

  if (!authInfo) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authInfo;
};

export default UseAuth;
