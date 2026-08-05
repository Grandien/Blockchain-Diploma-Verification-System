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
