const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/therapists", require("./routes/therapistRoutes"));
app.use("/api/slots", require("./routes/slotRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

// Simple health endpoint
app.get("/api/health", (req, res) => {
  const state = require("mongoose").connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.json({
    ok: true,
    dbState: states[state] || state,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server only if not in test environment
if (require.main === module && process.env.NODE_ENV !== "test") {
  // Connect to database
  dbConnection
    .connect()
    .then(() => {
      const PORT = process.env.PORT || 5003;
      app.listen(PORT, () => {
        console.log(
          `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
        );
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
}

module.exports = app;
