// server/models/TimeSlot.js
const mongoose = require("mongoose");
const TimeSlotSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g., "09:00"
  isBooked: { type: Boolean, default: false },
});
module.exports = mongoose.model("TimeSlot", TimeSlotSchema);
