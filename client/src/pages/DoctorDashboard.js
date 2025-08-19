import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../Form.css"; // Re-use our form styles

const DoctorDashboard = () => {
  const { token } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [times, setTimes] = useState([]);
  const [error, setError] = useState("");

  // The fetchSlots function is now defined inside useEffect
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get(
          "https://healthbooker-app.onrender.com/api/slots/me",
          config
        );
        setSlots(res.data);
      } catch (err) {
        setError("Could not fetch time slots.");
      }
    };

    if (token) {
      fetchSlots();
    }
  }, [token]);

  const handleTimeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTimes([...times, value]);
    } else {
      setTimes(times.filter((time) => time !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (times.length === 0) {
      setError("Please select at least one time slot.");
      return;
    }
    setError("");
    try {
      const config = { headers: { "x-auth-token": token } };
      const body = { date, startTimes: times };
      await axios.post(
        "https://healthbooker-app.onrender.com/api/slots",
        body,
        config
      );

      // After creating new slots, we need to fetch the updated list again
      const res = await axios.get(
        "https://healthbooker-app.onrender.com/api/slots/me",
        config
      );
      setSlots(res.data);

      setTimes([]); // Clear selected times after submission
    } catch (err) {
      setError("Could not create slots. Please try again.");
    }
  };

  const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  return (
    <div style={{ paddingTop: "2rem" }}>
      <h1 className="form-title">Doctor Dashboard</h1>

      <div className="form-container">
        <h2 className="form-title" style={{ fontSize: "1.25rem" }}>
          Add Available Slots
        </h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="date">Select Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Select Time Slots</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
              }}
            >
              {availableTimes.map((time) => (
                <label
                  key={time}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    value={time}
                    onChange={handleTimeChange}
                    checked={times.includes(time)}
                    style={{ marginRight: "5px" }}
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="form-button">
            Add Slots
          </button>
        </form>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 className="form-title">My Schedule</h2>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <div
              key={slot._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "5px",
                borderRadius: "5px",
                backgroundColor: slot.isBooked ? "#f8d7da" : "#d4edda",
              }}
            >
              <p>
                <strong>Date:</strong>{" "}
                {new Date(slot.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {slot.startTime}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {slot.isBooked ? "Booked" : "Available"}
              </p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            You have not created any time slots.
          </p>
        )}
      </div>
      {error && (
        <p
          className="form-error"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default DoctorDashboard;
