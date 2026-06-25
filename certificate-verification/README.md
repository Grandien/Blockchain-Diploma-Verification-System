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
