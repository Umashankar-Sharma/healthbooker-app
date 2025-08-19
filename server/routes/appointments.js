const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/TimeSlot"); // Import TimeSlot model
const User = require("../models/User");

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post("/", auth, async (req, res) => {
  const { doctor, timeSlot, reason } = req.body;
  try {
    // Create the new appointment document
    const newAppointment = new Appointment({
      patient: req.user.id, // Get patient ID from the auth middleware token
      doctor,
      timeSlot,
      reason,
    });
    const appointment = await newAppointment.save();

    // Mark the time slot as booked
    await TimeSlot.findByIdAndUpdate(timeSlot, { isBooked: true });

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments for a patient
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name") // Populate doctor's name
      .populate("timeSlot", "date startTime") // Populate time slot details
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
