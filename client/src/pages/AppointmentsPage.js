import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../Form.css";
import "./AppointmentsPage.css";

const AppointmentsPage = () => {
  const { token } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const config = { headers: { "x-auth-token": token } };
        const apptRes = await axios.get(
          "https://healthbooker-app.onrender.com/api/auth/login",
          config
        );
        setAppointments(apptRes.data);
        const docRes = await axios.get(
          "https://healthbooker-app.onrender.com/api/auth/login"
        );
        setDoctors(docRes.data);
      } catch (err) {
        setError("Could not fetch initial data.");
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedDoctor && selectedDate) {
        try {
          const res = await axios.get(
            `https://healthbooker-app.onrender.com/api/doctors/${selectedDoctor}/slots?date=${selectedDate}`
          );
          setAvailableSlots(res.data);
          setSelectedSlot(null);
        } catch (err) {
          setError("Could not fetch available slots.");
        }
      }
    };
    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }
    try {
      const config = { headers: { "x-auth-token": token } };
      const body = {
        doctor: selectedDoctor,
        timeSlot: selectedSlot._id,
        reason,
      };
      await axios.post(
        "https://healthbooker-app.onrender.com/api/appointments",
        body,
        config
      );
      window.location.reload();
    } catch (err) {
      setError("Could not book appointment.");
    }
  };

  return (
    <div className="appointments-page">
      <h1 className="section-title">My Appointments Dashboard</h1>
      {error && <p className="form-error">{error}</p>}

      <div className="appointments-layout">
        <div className="form-container">
          <h2 className="form-title">Book a New Appointment</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="doctor">Select Doctor</label>
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
                className="form-input"
              >
                <option value="">-- Choose a Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Select Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
            {availableSlots.length > 0 && (
              <div className="form-group">
                <label>Select Time Slot</label>
                <div className="slots-container">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot._id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`slot-button ${
                        selectedSlot?._id === slot._id ? "selected" : ""
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="reason">Reason for Appointment</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="form-input"
              ></textarea>
            </div>
            <button type="submit" className="form-button">
              Book Appointment
            </button>
          </form>
        </div>

        <div>
          <h2 className="section-title">My Scheduled Appointments</h2>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <div key={appt._id} className="appointment-card">
                  <p>
                    <strong>Doctor:</strong> {appt.doctor?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(appt.timeSlot.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {appt.timeSlot.startTime}
                  </p>
                  <p>
                    <strong>Reason:</strong> {appt.reason}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-appointments">
                You have no scheduled appointments.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
