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
