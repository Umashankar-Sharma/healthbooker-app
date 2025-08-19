const express = require("express");
const router = express.Router();
const User = require("../models/User");
const TimeSlot = require("../models/TimeSlot");

// @route   GET /api/doctors
// @desc    Get all users with the 'doctor' role
// @access  Public
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/doctors/:id/slots
// @desc    Get available slots for a specific doctor on a specific date
// @access  Public
router.get("/:id/slots", async (req, res) => {
  try {
    const { date } = req.query; // Get date from query parameter, e.g., ?date=2025-08-20
    if (!date) {
      return res.status(400).json({ msg: "Date is required" });
    }

    // Find slots for the given doctor and date that are not yet booked
    const slots = await TimeSlot.find({
      doctor: req.params.id,
      date: new Date(date),
      isBooked: false,
    });

    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
