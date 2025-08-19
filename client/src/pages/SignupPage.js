import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Form.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isDoctor: false,
  });
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext); // Get the signup function from context

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.isDoctor ? "doctor" : "patient",
    };
    try {
      await signup(userData); // Use the signup function from context
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred during signup.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create an Account</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div
          className="form-group"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <input
            type="checkbox"
            name="isDoctor"
            id="isDoctor"
            checked={formData.isDoctor}
            onChange={handleChange}
            style={{ marginRight: "10px" }}
          />
          <label htmlFor="isDoctor">Register as a doctor</label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-button">
          Sign Up
        </button>
      </form>
      <p className="form-switch">
        Already have an account?{" "}
        <Link to="/login" className="form-link">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
