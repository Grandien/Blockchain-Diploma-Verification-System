const jwt = require("jsonwebtoken");

/**
 * Middleware cek JWT token
 * Dipakai untuk route admin dan mahasiswa
 */
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Token tidak ditemukan.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa.",
    });
  }
};

/**
 * Middleware cek role admin
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang diizinkan.",
    });
  }
  next();
};

module.exports = { protect, adminOnly };
