// src/pages/mahasiswa/SertifikatPage.jsx
import { useState, useEffect } from "react"
import axios from "axios"
import MahasiswaLayout from "../layouts/MahasiswaLayout"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

const MyCertificate = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const { data } = await axios.get(
        `${API_URL}/api/mahasiswa/certificates`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCertificates(data.data)
    } catch (err) {
      setError("Gagal memuat sertifikat")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MahasiswaLayout>
      <div className="p-6 max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Sertifikat Saya
          </h1>
          <p className="text-slate-500 mt-1">
            Daftar sertifikat yang sudah kamu terima dari institusi.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-slate-500">
              <div className="text-4xl mb-3">⏳</div>
              <p>Memuat data sertifikat...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 
                          rounded-xl p-4 mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Kosong */}
        {!loading && !error && certificates.length === 0 && (
          <EmptyState />
        )}

        {/* Grid Sertifikat */}
        {!loading && certificates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map(cert => (
              <CertCard key={cert.certId} cert={cert} />
            ))}
          </div>
        )}

      </div>
    </MahasiswaLayout>
  )
}

// ── Empty State ────────────────────────────────────
const EmptyState = () => (
  <div className="bg-white rounded-2xl border border-slate-200 
                  shadow-sm p-12 text-center">
    <div className="text-5xl mb-4">📭</div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">
      Belum ada sertifikat
    </h3>
    <p className="text-slate-500 text-sm max-w-xs mx-auto">
      Sertifikat akan muncul di sini setelah diterbitkan 
      oleh institusi kamu.
    </p>
  </div>
)

// ── Card Sertifikat ────────────────────────────────
const CertCard = ({ cert }) => {
  const [showQR, setShowQR] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 
                    shadow-sm overflow-hidden hover:shadow-md 
                    transition-shadow duration-200">

      {/* Card Header */}
      <div className="bg-slate-50 border-b border-slate-100 
                      px-5 py-3 flex items-center justify-between">
        {/* Status */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full
          ${cert.isValid 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-600"
          }`}>
          {cert.isValid ? "✅ Valid" : "🚫 Direvoke"}
        </span>

        {/* Cert ID */}
        <span className="text-xs font-mono text-indigo-600 
                         bg-indigo-50 px-2 py-1 rounded-lg">
          {cert.certId}
        </span>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4 space-y-3">
        <InfoRow label="Jenis Sertifikat" value={cert.jenisSertifikat} />
        <InfoRow label="Tanggal Lulus"    value={cert.tanggalLulus} />
        <InfoRow
          label="Diterbitkan"
          value={new Date(cert.createdAt).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
          })}
        />
      </div>

      {/* Card Footer — QR Code */}
      {cert.qrCode && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">

          {/* Toggle QR */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full py-2.5 rounded-xl text-sm font-medium
                       bg-indigo-600 text-white hover:bg-indigo-700
                       transition-colors duration-200"
          >
            {showQR ? "🙈 Sembunyikan QR Code" : "📱 Tampilkan QR Code"}
          </button>

          {/* QR Code Box */}
          {showQR && (
            <div className="mt-4 flex flex-col items-center gap-3
                            bg-slate-50 rounded-xl p-4 border border-slate-200">
              <img
                src={cert.qrCode}
                alt="QR Code"
                className="w-44 h-44 rounded-xl border-2 border-slate-200"
              />
              <p className="text-xs text-slate-500 text-center">
                Tunjukkan QR Code ini ke HRD untuk verifikasi ijazah kamu
              </p>
              <a
                href={cert.qrCode}
                download={`QR-${cert.certId}.png`}
                className="flex items-center gap-2 px-4 py-2 
                           bg-green-600 text-white text-sm font-medium 
                           rounded-xl hover:bg-green-700 
                           transition-colors duration-200"
                
              >
              ⬇️ Download QR Code
              </a>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

// ── Info Row ───────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-800">{value}</span>
  </div>
)

export default MyCertificate
