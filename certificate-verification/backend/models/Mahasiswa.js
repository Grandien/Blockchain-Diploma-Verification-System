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
