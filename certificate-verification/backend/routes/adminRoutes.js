const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { validateCertificateData } = require("../middleware/validator");
const { issueSingle, revokeCertificate, getAllCertificates } = require("../controllers/adminController");

// Semua route admin butuh login
router.use(protect, adminOnly);

router.post("/issue", upload.single("pdf"), validateCertificateData, issueSingle);
router.put("/revoke/:certId", revokeCertificate);
router.get("/certificates", getAllCertificates);

module.exports = router;
