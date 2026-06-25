const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./temp/");
  },
  filename: (req, file, cb) => {
    cb(null, `temp_${Date.now()}_${Math.random().toString(36).substring(2)}.pdf`);
  },
});

const fileFilter = (req, file, cb) => {
  // Hanya terima file PDF
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Hanya file PDF yang diizinkan!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;
