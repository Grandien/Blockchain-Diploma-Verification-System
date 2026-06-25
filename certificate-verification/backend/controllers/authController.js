const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Mahasiswa = require("../models/Mahasiswa");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const token = generateToken({ id: user._id, role: "admin" });

    res.json({
      success: true,
      token,
      user: { nama: user.nama, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Mahasiswa
const loginMahasiswa = async (req, res) => {
  try {
    const { nim, password } = req.body;

    const mahasiswa = await Mahasiswa.findOne({ nim });
    if (!mahasiswa || !(await mahasiswa.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "NIM atau password salah",
      });
    }

    const token = generateToken({ id: mahasiswa._id, nim: mahasiswa.nim, role: "mahasiswa" });

    res.json({
      success: true,
      token,
      mahasiswa: { nama: mahasiswa.nama, nim: mahasiswa.nim },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginAdmin, loginMahasiswa };
