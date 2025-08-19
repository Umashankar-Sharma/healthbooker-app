import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    // If the user is not logged in (no token), redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is logged in, show the page they were trying to access
  return children;
};

export default ProtectedRoute;
