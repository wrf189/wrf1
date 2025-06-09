import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../utils/constantApi";

const useVerifyOnRouteChange = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip verification on login page to prevent redirect loops
    if (location.pathname === "/auth/login") {
      return;
    }

    const token = Cookies.get("token");
    const claim = localStorage.getItem("claim");

    if (!token || !claim) {
      // Only redirect if not already on login page
      navigate("/auth/login");
      return;
    }

    const verifyToken = async () => {
      try {
        // Fix the axios.get call - third parameter should be config object
        const verifyResponse = await axios.get(`${API_URL}/auth/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (verifyResponse.status !== 200) {
          localStorage.removeItem("claim");
          Cookies.remove("token");
          navigate("/auth/login");
          return;
        }

        // Fix the typo in localStorage key
        const userData = verifyResponse.data.user;
        localStorage.setItem("claim", JSON.stringify(userData));
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("claim");
        Cookies.remove("token");
        navigate("/auth/login");
      }
    };

    verifyToken();
  }, [location.pathname, navigate]);
};

export default useVerifyOnRouteChange;