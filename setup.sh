#!/bin/bash

echo "=================================================="
echo "  SETUP PROJECT CERTIFICATE VERIFICATION SYSTEM  "
echo "  Dual Hash Blockchain - Auto Scaffold            "
echo "=================================================="
echo ""

PROJECT="certificate-verification"

# ── Buat root folder ──────────────────────────────────
mkdir -p $PROJECT
cd $PROJECT

echo "✅ Membuat struktur folder..."

# ── BLOCKCHAIN ────────────────────────────────────────
mkdir -p blockchain/contracts
mkdir -p blockchain/scripts
mkdir -p blockchain/test

# ── BACKEND ───────────────────────────────────────────
mkdir -p backend/config
mkdir -p backend/controllers
mkdir -p backend/middleware
mkdir -p backend/models
mkdir -p backend/routes
mkdir -p backend/utils
mkdir -p backend/temp

# ── FRONTEND ──────────────────────────────────────────
mkdir -p frontend/src/assets
mkdir -p frontend/src/components
mkdir -p frontend/src/pages/admin
mkdir -p frontend/src/pages/mahasiswa
mkdir -p frontend/src/pages/verify
mkdir -p frontend/src/services
mkdir -p frontend/src/context

echo "✅ Folder selesai dibuat!"
echo ""
echo "✅ Membuat file-file dasar..."

# ══════════════════════════════════════════════════════
# BLOCKCHAIN FILES
# ══════════════════════════════════════════════════════

# hardhat.config.js
cat << 'EOF' > blockchain/hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../backend/.env" });

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
EOF

# Smart Contract
cat << 'EOF' > blockchain/contracts/CertificateVerification.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Certificate Verification dengan Dual Hash
/// @notice Sistem verifikasi ijazah menggunakan dua hash terpisah
contract CertificateVerification {

    struct Certificate {
        bytes32 fileHash;    // Hash 1 → file PDF
        bytes32 dataHash;    // Hash 2 → metadata/data mahasiswa
        address issuer;      // alamat wallet kampus
        uint256 timestamp;   // waktu penerbitan
        bool isValid;        // status sertifikat
    }

    // Mapping certId → Certificate
    mapping(string => Certificate) private certificates;

    address public owner;

    // Events
    event CertificateIssued(string certId, address issuer, uint256 timestamp);
    event CertificateRevoked(string certId, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya institusi resmi yang dapat melakukan ini");
        _;
    }

    // ─────────────────────────────────────────────────
    // 1. TERBITKAN sertifikat baru
    // ─────────────────────────────────────────────────
    function issueCertificate(
        string memory certId,
        bytes32 fileHash,
        bytes32 dataHash
    ) public onlyOwner {
        require(
            certificates[certId].timestamp == 0,
            "Sertifikat dengan ID ini sudah terdaftar"
        );
        require(fileHash != bytes32(0), "File hash tidak boleh kosong");
        require(dataHash != bytes32(0), "Data hash tidak boleh kosong");

        certificates[certId] = Certificate({
            fileHash: fileHash,
            dataHash: dataHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(certId, msg.sender, block.timestamp);
    }

    // ─────────────────────────────────────────────────
    // 2. VERIFIKASI sertifikat
    // ─────────────────────────────────────────────────
    function verifyCertificate(
        string memory certId,
        bytes32 newFileHash,
        bytes32 newDataHash
    ) public view returns (
        bool exists,
        bool isValid,
        bool fileMatch,
        bool dataMatch,
        uint256 timestamp
    ) {
        Certificate memory cert = certificates[certId];

        // Sertifikat tidak ditemukan
        if (cert.timestamp == 0) {
            return (false, false, false, false, 0);
        }

        // Bandingkan hash secara independen — BUKAN di-concat!
        return (
            true,
            cert.isValid,
            cert.fileHash == newFileHash,
            cert.dataHash == newDataHash,
            cert.timestamp
        );
    }

    // ─────────────────────────────────────────────────
    // 3. REVOKE sertifikat
    // ─────────────────────────────────────────────────
    function revokeCertificate(string memory certId) public onlyOwner {
        require(
            certificates[certId].timestamp != 0,
            "Sertifikat tidak ditemukan"
        );
        require(
            certificates[certId].isValid,
            "Sertifikat sudah direvoke sebelumnya"
        );

        certificates[certId].isValid = false;
        emit CertificateRevoked(certId, block.timestamp);
    }

    // ─────────────────────────────────────────────────
    // 4. GET INFO sertifikat
    // ─────────────────────────────────────────────────
    function getCertificateInfo(string memory certId)
        public view returns (
            address issuer,
            uint256 timestamp,
            bool isValid
        )
    {
        Certificate memory cert = certificates[certId];
        return (cert.issuer, cert.timestamp, cert.isValid);
    }
}
EOF

# Deploy script
cat << 'EOF' > blockchain/scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("Mendeploy CertificateVerification...");

  const Certificate = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );
  const certificate = await Certificate.deploy();
  await certificate.waitForDeployment();

  const address = await certificate.getAddress();
  console.log(`✅ Contract berhasil di-deploy ke: ${address}`);
  console.log(`Salin address ini ke file .env sebagai CONTRACT_ADDRESS`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
EOF

# Test file
cat << 'EOF' > blockchain/test/certificate.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateVerification", function () {
  let contract;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("CertificateVerification");
    contract = await Contract.deploy();
  });

  it("Harus bisa terbitkan sertifikat baru", async function () {
    const certId = "CERT-2024-001";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("file_pdf_content"));
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data_mahasiswa"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    const info = await contract.getCertificateInfo(certId);
    expect(info.isValid).to.equal(true);
  });

  it("Harus bisa verifikasi sertifikat valid", async function () {
    const certId = "CERT-2024-002";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("file_pdf_content"));
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data_mahasiswa"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    const result = await contract.verifyCertificate(certId, fileHash, dataHash);

    expect(result.exists).to.equal(true);
    expect(result.isValid).to.equal(true);
    expect(result.fileMatch).to.equal(true);
    expect(result.dataMatch).to.equal(true);
  });

  it("Harus deteksi file PDF dimanipulasi", async function () {
    const certId = "CERT-2024-003";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("file_asli"));
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data_mahasiswa"));
    const fakeFileHash = ethers.keccak256(ethers.toUtf8Bytes("file_palsu"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    const result = await contract.verifyCertificate(certId, fakeFileHash, dataHash);

    expect(result.fileMatch).to.equal(false);  // file dimanipulasi
    expect(result.dataMatch).to.equal(true);   // data masih asli
  });

  it("Harus deteksi data dimanipulasi", async function () {
    const certId = "CERT-2024-004";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("file_asli"));
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data_asli"));
    const fakeDataHash = ethers.keccak256(ethers.toUtf8Bytes("data_palsu"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    const result = await contract.verifyCertificate(certId, fileHash, fakeDataHash);

    expect(result.fileMatch).to.equal(true);   // file masih asli
    expect(result.dataMatch).to.equal(false);  // data dimanipulasi
  });

  it("Harus bisa revoke sertifikat", async function () {
    const certId = "CERT-2024-005";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("file"));
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    await contract.revokeCertificate(certId);

    const result = await contract.verifyCertificate(certId, fileHash, dataHash);
    expect(result.isValid).to.equal(false);
  });
});
EOF

# ══════════════════════════════════════════════════════
# BACKEND FILES
# ══════════════════════════════════════════════════════

# package.json backend
cat << 'EOF' > backend/package.json
{
  "name": "certificate-verification-backend",
  "version": "1.0.0",
  "description": "Backend sistem verifikasi ijazah dual hash blockchain",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "crypto": "^1.0.1",
    "dotenv": "^16.3.1",
    "ethers": "^6.8.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "multer": "^1.4.5-lts.1",
    "qrcode": "^1.5.3",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

# .env template
cat << 'EOF' > backend/.env.example
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/certificate_verification

# JWT
JWT_SECRET=ganti_dengan_secret_yang_panjang_dan_random
JWT_EXPIRES_IN=8h

# Blockchain
BLOCKCHAIN_RPC=http://127.0.0.1:8545
CONTRACT_ADDRESS=isi_setelah_deploy_smart_contract
PRIVATE_KEY=isi_private_key_wallet_kampus

# Untuk testnet Sepolia (opsional)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
EOF

# .env (copy dari example)
cp backend/.env.example backend/.env

# server.js
cat << 'EOF' > backend/server.js
const app = require("./app");
const connectDB = require("./config/database");
const { startCleanup } = require("./utils/cleanupTemp");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Koneksi database
connectDB();

// Auto cleanup file temp setiap 5 menit
startCleanup();

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
EOF

# app.js
cat << 'EOF' > backend/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Certificate Verification API berjalan ✅" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Terjadi kesalahan pada server" 
  });
});

module.exports = app;
EOF

# config/database.js
cat << 'EOF' > backend/config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB terhubung");
  } catch (error) {
    console.error("❌ MongoDB gagal terhubung:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
EOF

# config/blockchain.js
cat << 'EOF' > backend/config/blockchain.js
const { ethers } = require("ethers");
require("dotenv").config();

// ABI smart contract — salin dari hasil compile Hardhat
// blockchain/artifacts/contracts/CertificateVerification.sol/CertificateVerification.json
const ABI = [
  "function issueCertificate(string certId, bytes32 fileHash, bytes32 dataHash)",
  "function verifyCertificate(string certId, bytes32 newFileHash, bytes32 newDataHash) view returns (bool exists, bool isValid, bool fileMatch, bool dataMatch, uint256 timestamp)",
  "function revokeCertificate(string certId)",
  "function getCertificateInfo(string certId) view returns (address issuer, uint256 timestamp, bool isValid)",
];

let provider;
let signer;
let contract;

const connectBlockchain = () => {
  try {
    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      signer
    );
    console.log("✅ Blockchain terhubung");
    return contract;
  } catch (error) {
    console.error("❌ Blockchain gagal terhubung:", error.message);
    throw error;
  }
};

const getContract = () => {
  if (!contract) connectBlockchain();
  return contract;
};

module.exports = { connectBlockchain, getContract };
EOF

# models/User.js
cat << 'EOF' > backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

// Hash password sebelum disimpan
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Cek password
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
EOF

# models/Mahasiswa.js
cat << 'EOF' > backend/models/Mahasiswa.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mahasiswaSchema = new mongoose.Schema(
  {
    nim: { type: String, required: true, unique: true },
    nama: { type: String, required: true },
    password: { type: String, required: true },
    // password awal = tanggal lahir (DDMMYYYY)
  },
  { timestamps: true }
);

mahasiswaSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

mahasiswaSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("Mahasiswa", mahasiswaSchema);
EOF

# models/Certificate.js
cat << 'EOF' > backend/models/Certificate.js
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certId: { type: String, required: true, unique: true },
    // Data mahasiswa
    nama: { type: String, required: true },
    nim: { type: String, required: true },
    institusi: { type: String, required: true },
    programStudi: { type: String, required: true },
    tanggalLulus: { type: String, required: true }, // format: YYYY-MM-DD
    jenisSertifikat: { type: String, required: true },
    // Hash (untuk referensi — hash asli ada di blockchain)
    fileHash: { type: String, required: true },
    dataHash: { type: String, required: true },
    // Status
    isValid: { type: Boolean, default: true },
    // QR Code (base64 string)
    qrCode: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
EOF

# utils/hashHelper.js ── FILE PALING PENTING
cat << 'EOF' > backend/utils/hashHelper.js
/**
 * hashHelper.js
 * ⚠️  FILE INI TIDAK BOLEH DIUBAH SETELAH SISTEM BERJALAN
 * Mengubah file ini akan menyebabkan semua hash lama tidak cocok
 */

const crypto = require("crypto");
const fs = require("fs");

/**
 * STANDARISASI DATA
 * Memastikan data selalu dalam format yang sama sebelum di-hash
 */
const standardizeData = (data) => {
  return {
    nama: data.nama.trim().toUpperCase(),
    nim: data.nim.trim(),
    institusi: data.institusi.trim().toUpperCase(),
    programStudi: data.programStudi.trim().toUpperCase(),
    tanggalLulus: data.tanggalLulus.trim(), // format: YYYY-MM-DD
    jenisSertifikat: data.jenisSertifikat.trim().toUpperCase(),
  };
};

/**
 * SERIALISASI DATA
 * Urutan field TIDAK BOLEH berubah!
 */
const serializeData = (standardizedData) => {
  const ordered = [
    standardizedData.nama,
    standardizedData.nim,
    standardizedData.institusi,
    standardizedData.programStudi,
    standardizedData.tanggalLulus,
    standardizedData.jenisSertifikat,
  ];
  // Separator || tidak mungkin ada dalam data normal
  return ordered.join("||");
};

/**
 * HASH 1 — Hash dari file PDF (binary)
 * Input: path file PDF
 * Output: hex string SHA256
 */
const generateHash1 = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

/**
 * HASH 2 — Hash dari data/metadata mahasiswa
 * Input: object data mahasiswa
 * Output: hex string SHA256
 */
const generateHash2 = (data) => {
  const standardized = standardizeData(data);
  const serialized = serializeData(standardized);
  return crypto
    .createHash("sha256")
    .update(serialized, "utf8")
    .digest("hex");
};

/**
 * Convert hex string ke bytes32 untuk smart contract
 */
const toBytes32 = (hexString) => {
  return "0x" + hexString;
};

module.exports = {
  generateHash1,
  generateHash2,
  standardizeData,
  serializeData,
  toBytes32,
};
EOF

# utils/qrGenerator.js
cat << 'EOF' > backend/utils/qrGenerator.js
const QRCode = require("qrcode");

/**
 * Generate QR Code berisi URL verifikasi
 * QR Code → scan → langsung ke halaman verifikasi
 */
const generateQRCode = async (certId) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify?id=${certId}`;

  const qrCodeBase64 = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "H",
    type: "image/png",
    width: 300,
    margin: 2,
  });

  return qrCodeBase64;
};

module.exports = { generateQRCode };
EOF

# utils/cleanupTemp.js
cat << 'EOF' > backend/utils/cleanupTemp.js
const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "../temp");
const MAX_AGE_MINUTES = 5;

/**
 * Hapus file temp yang sudah lebih dari 5 menit
 */
const cleanupTemp = () => {
  if (!fs.existsSync(TEMP_DIR)) return;

  const files = fs.readdirSync(TEMP_DIR);
  const now = Date.now();

  files.forEach((file) => {
    if (file === ".gitkeep") return;
    const filePath = path.join(TEMP_DIR, file);
    const stats = fs.statSync(filePath);
    const ageMinutes = (now - stats.mtimeMs) / 1000 / 60;

    if (ageMinutes > MAX_AGE_MINUTES) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  File temp dihapus: ${file}`);
    }
  });
};

/**
 * Hapus file spesifik setelah diproses
 */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Jalankan cleanup secara berkala
 */
const startCleanup = () => {
  setInterval(cleanupTemp, MAX_AGE_MINUTES * 60 * 1000);
  console.log("✅ Auto cleanup file temp aktif");
};

module.exports = { cleanupTemp, deleteFile, startCleanup };
EOF

# utils/certIdGenerator.js
cat << 'EOF' > backend/utils/certIdGenerator.js
/**
 * Generate Certificate ID yang unik
 * Format: CERT-TAHUN-RANDOM
 * Contoh: CERT-2024-A1B2C3
 */
const generateCertId = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-${year}-${random}`;
};

module.exports = { generateCertId };
EOF

# middleware/auth.js
cat << 'EOF' > backend/middleware/auth.js
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
EOF

# middleware/upload.js
cat << 'EOF' > backend/middleware/upload.js
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
EOF

# middleware/validator.js
cat << 'EOF' > backend/middleware/validator.js
/**
 * Validasi data sertifikat sebelum diproses
 */
const validateCertificateData = (req, res, next) => {
  const { nama, nim, institusi, programStudi, tanggalLulus, jenisSertifikat } =
    req.body;

  const errors = [];

  if (!nama || nama.trim() === "") errors.push("Nama wajib diisi");
  if (!nim || nim.trim() === "") errors.push("NIM wajib diisi");
  if (!institusi || institusi.trim() === "") errors.push("Institusi wajib diisi");
  if (!programStudi || programStudi.trim() === "") errors.push("Program studi wajib diisi");
  if (!tanggalLulus) errors.push("Tanggal lulus wajib diisi");
  if (!jenisSertifikat) errors.push("Jenis sertifikat wajib diisi");

  // Validasi format tanggal YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (tanggalLulus && !dateRegex.test(tanggalLulus)) {
    errors.push("Format tanggal harus YYYY-MM-DD");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors,
    });
  }

  next();
};

module.exports = { validateCertificateData };
EOF

# controllers/authController.js
cat << 'EOF' > backend/controllers/authController.js
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
EOF

# controllers/adminController.js
cat << 'EOF' > backend/controllers/adminController.js
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
EOF

# controllers/verifyController.js
cat << 'EOF' > backend/controllers/verifyController.js
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
EOF

# controllers/mahasiswaController.js
cat << 'EOF' > backend/controllers/mahasiswaController.js
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
EOF

# routes/authRoutes.js
cat << 'EOF' > backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginAdmin, loginMahasiswa } = require("../controllers/authController");

router.post("/admin/login", loginAdmin);
router.post("/mahasiswa/login", loginMahasiswa);

module.exports = router;
EOF

# routes/adminRoutes.js
cat << 'EOF' > backend/routes/adminRoutes.js
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
EOF

# routes/verifyRoutes.js
cat << 'EOF' > backend/routes/verifyRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { verifyCertificate, quickVerify } = require("../controllers/verifyController");

// Tidak perlu login — publik
router.post("/", upload.single("pdf"), verifyCertificate);
router.get("/quick/:certId", quickVerify);

module.exports = router;
EOF

# routes/mahasiswaRoutes.js
cat << 'EOF' > backend/routes/mahasiswaRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getMyCertificates, getCertificateDetail } = require("../controllers/mahasiswaController");

// Mahasiswa harus login
router.use(protect);

router.get("/certificates", getMyCertificates);
router.get("/certificates/:certId", getCertificateDetail);

module.exports = router;
EOF

# temp/.gitkeep
touch backend/temp/.gitkeep

# .gitignore
cat << 'EOF' > backend/.gitignore
node_modules/
.env
temp/*.pdf
EOF

# ══════════════════════════════════════════════════════
# FRONTEND FILES (struktur dasar)
# ══════════════════════════════════════════════════════

cat << 'EOF' > frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Tambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
EOF

cat << 'EOF' > frontend/src/services/verifyService.js
import api from "./api";

export const verifyCertificate = async (certId, pdfFile, formData) => {
  const data = new FormData();
  data.append("pdf", pdfFile);
  data.append("certId", certId);
  Object.keys(formData).forEach((key) => data.append(key, formData[key]));

  const response = await api.post("/verify", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const quickVerify = async (certId) => {
  const response = await api.get(`/verify/quick/${certId}`);
  return response.data;
};
EOF

cat << 'EOF' > frontend/src/services/adminService.js
import api from "./api";

export const issueCertificate = async (pdfFile, formData) => {
  const data = new FormData();
  data.append("pdf", pdfFile);
  Object.keys(formData).forEach((key) => data.append(key, formData[key]));

  const response = await api.post("/admin/issue", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllCertificates = async () => {
  const response = await api.get("/admin/certificates");
  return response.data;
};

export const revokeCertificate = async (certId) => {
  const response = await api.put(`/admin/revoke/${certId}`);
  return response.data;
};
EOF

cat << 'EOF' > frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
EOF

# Placeholder pages
for page in "LandingPage" "LoginPage"; do
cat << EOF > frontend/src/pages/${page}.jsx
const ${page} = () => {
  return <div>${page} — TODO</div>;
};
export default ${page};
EOF
done

for page in "Dashboard" "IssueSingle" "IssueBatch" "CertificateList"; do
cat << EOF > frontend/src/pages/admin/${page}.jsx
const ${page} = () => {
  return <div>Admin: ${page} — TODO</div>;
};
export default ${page};
EOF
done

for page in "LoginMahasiswa" "DownloadPage"; do
cat << EOF > frontend/src/pages/mahasiswa/${page}.jsx
const ${page} = () => {
  return <div>Mahasiswa: ${page} — TODO</div>;
};
export default ${page};
EOF
done

for page in "VerifyPage" "ResultPage"; do
cat << EOF > frontend/src/pages/verify/${page}.jsx
const ${page} = () => {
  return <div>Verify: ${page} — TODO</div>;
};
export default ${page};
EOF
done

# README.md
cat << 'EOF' > README.md
# 🎓 Certificate Verification System — Dual Hash Blockchain

Sistem verifikasi ijazah akademik menggunakan teknologi blockchain 
dengan mekanisme **dual hash** untuk keamanan berlapis.

## Fitur Utama
- **Hash 1** → integritas file PDF ijazah
- **Hash 2** → integritas data/metadata mahasiswa
- Verifikasi publik tanpa perlu login (untuk HRD)
- QR Code pada setiap ijazah

## Teknologi
- **Blockchain**: Solidity + Hardhat + Ethereum
- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React.js

## Cara Menjalankan

### 1. Setup Blockchain
\`\`\`bash
cd blockchain
npm install
npx hardhat node          # jalankan blockchain lokal
npx hardhat run scripts/deploy.js --network localhost
\`\`\`

### 2. Setup Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env      # isi .env dengan konfigurasi
npm run dev
\`\`\`

### 3. Setup Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

## Alur Sistem
1. **Admin** upload PDF + data → dual hash → simpan ke blockchain
2. **Mahasiswa** login → lihat & download QR Code ijazah
3. **HRD** scan QR → upload PDF → verifikasi otomatis
EOF

echo ""
echo "=================================================="
echo "  ✅ SETUP SELESAI!                              "
echo "=================================================="
echo ""
echo "Struktur folder yang dibuat:"
echo ""
find . -type f | sed 's|./||' | sort
echo ""
echo "Langkah selanjutnya:"
echo ""
echo "1. cd certificate-verification/blockchain"
echo "   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox"
echo "   npx hardhat node"
echo ""
echo "2. cd ../backend"
echo "   npm install"
echo "   # Isi .env dengan konfigurasi"
echo "   npm run dev"
echo ""
echo "3. cd ../frontend"
echo "   npx create-react-app . --template cra-template"
echo "   npm start"
echo ""
echo "File yang perlu diisi logic selanjutnya:"
echo "├── backend/utils/hashHelper.js ✅ (sudah lengkap)"
echo "├── blockchain/contracts/CertificateVerification.sol ✅ (sudah lengkap)"
echo "├── backend/controllers/ ✅ (sudah ada struktur)"
echo "└── frontend/src/pages/ ⬅️  (perlu dibuat UI nya)"
