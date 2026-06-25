// Jalankan ini sekali untuk buat admin pertama
// Buka file backend/createAdmin.js (buat dulu)

const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)

User.create({
  nama: 'Admin Kampus',
  email: 'admin@kampus.ac.id',
  password: 'admin123',
  role: 'admin'
}).then(() => {
  console.log('Admin berhasil dibuat!')
  process.exit()
})