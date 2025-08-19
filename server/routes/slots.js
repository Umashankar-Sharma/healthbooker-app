const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TimeSlot = require("../models/TimeSlot");
const User = require("../models/User");

// @route   POST /api/slots
// @desc    Doctor creates new available time slots
// @access  Private (for doctors)
router.post("/", auth, async (req, res) => {
  // Check if the user is a doctor
  const user = await User.findById(req.user.id);
  if (user.role !== "doctor") {
    return res.status(403).json({ msg: "Access denied. Not a doctor." });
  }

  const { date, startTimes } = req.body; // Expect a date and an array of times, e.g., ["09:00", "10:00"]

  try {
    const slots = startTimes.map((time) => ({
      doctor: req.user.id,
      date,
      startTime: time,
    }));

    await TimeSlot.insertMany(slots);
    res.json({ msg: "Time slots created successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- NEW CODE ADDED BELOW ---

// @route   GET /api/slots/me
// @desc    Get all time slots for the logged-in doctor
// @access  Private (for doctors)
router.get("/me", auth, async (req, res) => {
  try {
    // Find all time slots that belong to the currently logged-in user (doctor)
    const slots = await TimeSlot.find({ doctor: req.user.id }).sort({
      date: 1,
    });
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
