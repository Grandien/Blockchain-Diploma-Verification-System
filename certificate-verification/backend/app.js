const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin tidak diizinkan oleh CORS"));
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Certificate Verification API berjalan ✅" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Terjadi kesalahan pada server" 
  });
});

module.exports = app;
