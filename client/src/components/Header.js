import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  // Get both token and the user object from the context
  const { token, user, logout } = useContext(AuthContext);

  return (
    <header className="main-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          HealthBooker
        </Link>
        <nav>
          {token && user ? ( // Check for both token and user
            <>
              {/* --- THIS IS THE KEY LOGIC --- */}
              {user.role === "doctor" ? (
                <Link to="/doctor/dashboard" className="nav-link">
                  Doctor Dashboard
                </Link>
              ) : (
                <Link to="/appointments" className="nav-link">
                  My Appointments
                </Link>
              )}
              <button onClick={logout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-button">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
