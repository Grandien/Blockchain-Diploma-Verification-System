// src/pages/LandingPage.jsx

import {
  ShieldCheck,
  QrCode,
  BadgeCheck,
  Search,
  ScanLine,
  CheckCircle2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"



const LandingPage = () => {
  const navigate = useNavigate()
  return (
    
      <div className="bg-slate-50">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-medium">
                Sistem Verifikasi Sertifikat Digital
              </span>

              <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900">
                Verifikasi Sertifikat
                <span className="text-blue-600"> Lebih Cepat</span>,
                Aman, dan Terpercaya
              </h1>

              <p className="mt-6 text-lg text-slate-600 leading-8">
                Pastikan setiap sertifikat yang diterbitkan memiliki keaslian
                yang dapat diverifikasi menggunakan QR Code secara instan.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
              <button
      onClick={() => navigate("/verify")}
      className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
    >
      Verifikasi Sekarang
    </button>
              </div>
            </div>

            <div>
              <div className="rounded-3xl bg-white shadow-xl p-10">

                <div className="flex items-center gap-4 border rounded-2xl p-4">
                  <QrCode className="text-blue-600" size={42} />
                  <div>
                    <h3 className="font-bold">QR Code Verification</h3>
                    <p className="text-slate-500 text-sm">
                      Scan untuk memverifikasi sertifikat.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 border rounded-2xl p-4">
                  <BadgeCheck className="text-green-600" size={42} />
                  <div>
                    <h3 className="font-bold">Data Valid</h3>
                    <p className="text-slate-500 text-sm">
                      Sertifikat cocok dengan data pada sistem.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 border rounded-2xl p-4">
                  <ShieldCheck className="text-indigo-600" size={42} />
                  <div>
                    <h3 className="font-bold">Keamanan Tinggi</h3>
                    <p className="text-slate-500 text-sm">
                      Menjamin integritas dan keaslian sertifikat.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* STATS */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

            <div className="text-center">
              <h2 className="text-4xl font-bold text-blue-600">10+</h2>
              <p className="mt-2 text-slate-500">
                Sertifikat Diterbitkan
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold text-blue-600">99.9%</h2>
              <p className="mt-2 text-slate-500">
                Tingkat Akurasi
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold text-blue-600">24/7</h2>
              <p className="mt-2 text-slate-500">
                Verifikasi Online
              </p>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-6xl mx-auto px-6 py-24">

          <h2 className="text-4xl font-bold text-center">
            Cara Kerja
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-16">

            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <Search className="mx-auto text-blue-600" size={42} />
              <h3 className="font-bold mt-6">
                Cari Sertifikat
              </h3>
              <p className="text-slate-500 mt-3">
                Masukkan nomor sertifikat atau buka halaman verifikasi.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <ScanLine className="mx-auto text-blue-600" size={42} />
              <h3 className="font-bold mt-6">
                Scan QR Code
              </h3>
              <p className="text-slate-500 mt-3">
                QR Code akan mengarah ke data sertifikat yang tersimpan.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <CheckCircle2 className="mx-auto text-blue-600" size={42} />
              <h3 className="font-bold mt-6">
                Data Diverifikasi
              </h3>
              <p className="text-slate-500 mt-3">
                Sistem memastikan keaslian sertifikat secara otomatis.
              </p>
            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="bg-blue-600 py-20">
          <div className="max-w-5xl mx-auto px-6 text-center text-white">

            <h2 className="text-4xl font-bold">
              Siap Memverifikasi Sertifikat?
            </h2>

            <p className="mt-4 text-blue-100 text-lg">
              Lakukan verifikasi sertifikat digital dengan cepat dan aman.
            </p>

            <button onClick={() => navigate("/verify")} className="mt-8 rounded-xl bg-white text-blue-600 px-8 py-3 font-semibold hover:bg-slate-100 transition">
              Mulai Verifikasi
            </button>

          </div>
        </section>

      </div>
    
  )
}

export default LandingPage