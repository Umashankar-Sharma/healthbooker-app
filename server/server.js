require("dotenv").config(); // This must be at the very top
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
// app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// --- API Routes ---
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/auth", require("./routes/auth")); // <-- Add this line
app.use("/api/slots", require("./routes/slots"));
app.use("/api/doctors", require("./routes/doctors"));
