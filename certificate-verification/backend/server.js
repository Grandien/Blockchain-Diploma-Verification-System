const app = require("./app");
const connectDB = require("./config/database");
const { startCleanup } = require("./utils/cleanupTemp");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Koneksi database
connectDB();

// Auto cleanup file temp setiap 5 menit
startCleanup();

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
