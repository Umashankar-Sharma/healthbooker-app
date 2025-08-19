import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const HomePage = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to HealthBooker</h1>
      <p>Your Health, Our Priority.</p>
      <div style={{ marginTop: "20px" }}>
        <Link
          to="/login"
          style={{ margin: "0 10px", textDecoration: "underline" }}
        >
          Login
        </Link>
        <Link
          to="/signup"
          style={{ margin: "0 10px", textDecoration: "underline" }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
