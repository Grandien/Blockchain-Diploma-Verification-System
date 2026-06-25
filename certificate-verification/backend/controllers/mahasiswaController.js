const Certificate = require("../models/Certificate");

/**
 * Mahasiswa lihat daftar ijazahnya
 */
const getMyCertificates = async (req, res) => {
  try {
    const { nim } = req.user;
    const certificates = await Certificate.find({ nim });

    res.json({
      success: true,
      data: certificates.map((c) => ({
        certId: c.certId,
        jenisSertifikat: c.jenisSertifikat,
        tanggalLulus: c.tanggalLulus,
        isValid: c.isValid,
        qrCode: c.qrCode,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mahasiswa download info sertifikat
 * (file PDF tidak disimpan — hanya data dan QR Code)
 */
const getCertificateDetail = async (req, res) => {
  try {
    const { certId } = req.params;
    const { nim } = req.user;

    const cert = await Certificate.findOne({ certId, nim });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: "Sertifikat tidak ditemukan atau bukan milik Anda",
      });
    }

    res.json({
      success: true,
      data: {
        certId: cert.certId,
        nama: cert.nama,
        nim: cert.nim,
        institusi: cert.institusi,
        programStudi: cert.programStudi,
        tanggalLulus: cert.tanggalLulus,
        jenisSertifikat: cert.jenisSertifikat,
        isValid: cert.isValid,
        qrCode: cert.qrCode,
        issuedAt: cert.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyCertificates, getCertificateDetail };
