const Certificate = require("../models/Certificate");
const Mahasiswa = require("../models/Mahasiswa");
const { generateHash1, generateHash2, toBytes32 } = require("../utils/hashHelper");
const { generateQRCode } = require("../utils/qrGenerator");
const { generateCertId } = require("../utils/certIdGenerator");
const { deleteFile } = require("../utils/cleanupTemp");
const { getContract } = require("../config/blockchain");

/**
 * Terbitkan sertifikat — satu per satu
 */
const issueSingle = async (req, res) => {
  const filePath = req.file?.path;

  try {
    const { nama, nim, institusi, programStudi, tanggalLulus, jenisSertifikat } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File PDF wajib diupload" });
    }

    // Generate Certificate ID unik
    const certId = generateCertId();

    // ── GENERATE DUAL HASH ──────────────────────────
    const hash1 = generateHash1(filePath);     // Hash file PDF
    const hash2 = generateHash2({              // Hash data mahasiswa
      nama, nim, institusi, programStudi, tanggalLulus, jenisSertifikat,
    });

    // ── SIMPAN KE BLOCKCHAIN ───────────────────────
    const contract = getContract();
    const tx = await contract.issueCertificate(
      certId,
      toBytes32(hash1),
      toBytes32(hash2)
    );
    await tx.wait(); // tunggu konfirmasi

    // ── GENERATE QR CODE ───────────────────────────
    const qrCode = await generateQRCode(certId);

    // ── SIMPAN KE MONGODB ──────────────────────────
    const certificate = await Certificate.create({
      certId, nama, nim, institusi, programStudi,
      tanggalLulus, jenisSertifikat,
      fileHash: hash1, dataHash: hash2, qrCode,
    });

    // ── Buat akun mahasiswa kalau belum ada ────────
    const existingMahasiswa = await Mahasiswa.findOne({ nim });
    if (!existingMahasiswa) {
      // Password awal = tanggal lahir (dari tanggalLulus sementara)
      // Nanti bisa diubah mahasiswa sendiri
      await Mahasiswa.create({
        nim,
        nama,
        password: tanggalLulus.replace(/-/g, ""), // YYYYMMDD
      });
    }

    // ── HAPUS FILE TEMP ────────────────────────────
    deleteFile(filePath);

    res.status(201).json({
      success: true,
      message: "Sertifikat berhasil diterbitkan",
      data: {
        certId,
        nama,
        nim,
        qrCode,
        txHash: tx.hash,
      },
    });
  } catch (error) {
    deleteFile(filePath);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Revoke sertifikat
 */
const revokeCertificate = async (req, res) => {
  try {
    const { certId } = req.params;

    const contract = getContract();
    const tx = await contract.revokeCertificate(certId);
    await tx.wait();

    await Certificate.findOneAndUpdate({ certId }, { isValid: false });

    res.json({
      success: true,
      message: `Sertifikat ${certId} berhasil direvoke`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Daftar semua sertifikat
 */
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { issueSingle, revokeCertificate, getAllCertificates };
