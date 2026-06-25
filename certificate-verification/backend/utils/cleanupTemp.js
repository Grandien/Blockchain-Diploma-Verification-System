const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "../temp");
const MAX_AGE_MINUTES = 5;

/**
 * Hapus file temp yang sudah lebih dari 5 menit
 */
const cleanupTemp = () => {
  if (!fs.existsSync(TEMP_DIR)) return;

  const files = fs.readdirSync(TEMP_DIR);
  const now = Date.now();

  files.forEach((file) => {
    if (file === ".gitkeep") return;
    const filePath = path.join(TEMP_DIR, file);
    const stats = fs.statSync(filePath);
    const ageMinutes = (now - stats.mtimeMs) / 1000 / 60;

    if (ageMinutes > MAX_AGE_MINUTES) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  File temp dihapus: ${file}`);
    }
  });
};

/**
 * Hapus file spesifik setelah diproses
 */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Jalankan cleanup secara berkala
 */
const startCleanup = () => {
  setInterval(cleanupTemp, MAX_AGE_MINUTES * 60 * 1000);
  console.log("✅ Auto cleanup file temp aktif");
};

module.exports = { cleanupTemp, deleteFile, startCleanup };
