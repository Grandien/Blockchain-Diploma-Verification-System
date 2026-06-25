const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getMyCertificates, getCertificateDetail } = require("../controllers/mahasiswaController");

// Mahasiswa harus login
router.use(protect);

router.get("/certificates", getMyCertificates);
router.get("/certificates/:certId", getCertificateDetail);

module.exports = router;
