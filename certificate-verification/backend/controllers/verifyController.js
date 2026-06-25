const Certificate = require("../models/Certificate");
const { generateHash1, generateHash2, toBytes32 } = require("../utils/hashHelper");
const { deleteFile } = require("../utils/cleanupTemp");
const { getContract } = require("../config/blockchain");

/**
 * Verifikasi sertifikat menggunakan dual hash
 * Dipanggil oleh HRD — tidak perlu login
 */
const verifyCertificate = async (req, res) => {
  const filePath = req.file?.path;

  try {
    const { certId, nama, nim, institusi, programStudi, tanggalLulus, jenisSertifikat } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File PDF wajib diupload" });
    }

    // ── GENERATE HASH BARU ─────────────────────────
    const newHash1 = generateHash1(filePath);
    const newHash2 = generateHash2({
      nama, nim, institusi, programStudi, tanggalLulus, jenisSertifikat,
    });

    // ── CEK KE BLOCKCHAIN ──────────────────────────
    const contract = getContract();
    const result = await contract.verifyCertificate(
      certId,
      toBytes32(newHash1),
      toBytes32(newHash2)
    );

    // ── HAPUS FILE TEMP ────────────────────────────
    deleteFile(filePath);

    // Sertifikat tidak ditemukan di blockchain
    if (!result.exists) {
      return res.json({
        success: true,
        status: "NOT_FOUND",
        message: "Sertifikat tidak ditemukan di blockchain",
        detail: {
          exists: false,
          isValid: false,
          fileMatch: false,
          dataMatch: false,
        },
      });
    }

    // Sertifikat direvoke
    if (!result.isValid) {
      return res.json({
        success: true,
        status: "REVOKED",
        message: "Sertifikat telah dicabut oleh institusi",
        detail: {
          exists: true,
          isValid: false,
          fileMatch: result.fileMatch,
          dataMatch: result.dataMatch,
          issuedAt: new Date(Number(result.timestamp) * 1000),
        },
      });
    }

    // Tentukan status berdasarkan hasil dual hash
    let status, message;

    if (result.fileMatch && result.dataMatch) {
      status = "VALID";
      message = "✅ Sertifikat VALID — file dan data asli";
    } else if (!result.fileMatch && result.dataMatch) {
      status = "FILE_TAMPERED";
      message = "❌ File PDF telah dimanipulasi";
    } else if (result.fileMatch && !result.dataMatch) {
      status = "DATA_TAMPERED";
      message = "❌ Data sertifikat telah dimanipulasi";
    } else {
      status = "BOTH_TAMPERED";
      message = "❌ File PDF dan data keduanya telah dimanipulasi";
    }

    // Ambil data dari MongoDB untuk ditampilkan
    const certData = await Certificate.findOne({ certId });

    res.json({
      success: true,
      status,
      message,
      detail: {
        exists: true,
        isValid: result.isValid,
        fileMatch: result.fileMatch,
        dataMatch: result.dataMatch,
        issuedAt: new Date(Number(result.timestamp) * 1000),
        data: certData ? {
          nama: certData.nama,
          nim: certData.nim,
          institusi: certData.institusi,
          programStudi: certData.programStudi,
          tanggalLulus: certData.tanggalLulus,
          jenisSertifikat: certData.jenisSertifikat,
        } : null,
      },
    });
  } catch (error) {
    deleteFile(filePath);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verifikasi cepat via Certificate ID saja (tanpa upload PDF)
 * Untuk cek status dan data — tanpa cek file
 */
const quickVerify = async (req, res) => {
  try {
    const { certId } = req.params;
    const certData = await Certificate.findOne({ certId });

    if (!certData) {
      return res.json({
        success: true,
        status: "NOT_FOUND",
        message: "Sertifikat tidak ditemukan",
      });
    }

    res.json({
      success: true,
      status: certData.isValid ? "REGISTERED" : "REVOKED",
      message: certData.isValid
        ? "Sertifikat terdaftar di sistem"
        : "Sertifikat telah dicabut",
      data: {
        certId: certData.certId,
        nama: certData.nama,
        nim: certData.nim,
        institusi: certData.institusi,
        programStudi: certData.programStudi,
        tanggalLulus: certData.tanggalLulus,
        jenisSertifikat: certData.jenisSertifikat,
        isValid: certData.isValid,
        issuedAt: certData.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { verifyCertificate, quickVerify };
