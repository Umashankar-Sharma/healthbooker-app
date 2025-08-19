const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    // <-- This field is essential
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },
});

module.exports = mongoose.model("User", UserSchema);
