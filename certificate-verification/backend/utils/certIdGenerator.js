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
