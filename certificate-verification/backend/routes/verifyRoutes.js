const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { verifyCertificate, quickVerify } = require("../controllers/verifyController");

// Tidak perlu login — publik
router.post("/", upload.single("pdf"), verifyCertificate);
router.get("/quick/:certId", quickVerify);

module.exports = router;
