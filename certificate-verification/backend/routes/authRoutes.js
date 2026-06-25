const express = require("express");
const router = express.Router();
const { loginAdmin, loginMahasiswa } = require("../controllers/authController");

router.post("/admin/login", loginAdmin);
router.post("/mahasiswa/login", loginMahasiswa);

module.exports = router;
