import { Navigate, Outlet } from "react-router";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const token = Cookies.get("token");
  const claim = JSON.parse(localStorage.getItem("claim")); 

  return token && claim ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
