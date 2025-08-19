import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (formData) => {
    try {
      const response = await axios.post(
        "https://healthbooker-app.onrender.com/api/auth/login",
        formData
      );
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // --- KEY REDIRECTION LOGIC ---
      if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/appointments");
      }
    } catch (err) {
      throw err;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        "https://healthbooker-app.onrender.com/api/auth/signup",
        userData
      );
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // --- KEY REDIRECTION LOGIC ---
      if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/appointments");
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  const authContextValue = { token, user, login, signup, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
