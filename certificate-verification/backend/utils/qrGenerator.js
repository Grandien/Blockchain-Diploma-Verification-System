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
