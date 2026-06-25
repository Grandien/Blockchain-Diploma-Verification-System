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
