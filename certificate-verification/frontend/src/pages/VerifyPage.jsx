// src/pages/verify/VerifyPage.jsx

import { useState, useEffect } from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

const VerifyPage = () => {
  const [searchParams] = useSearchParams()
  const idFromUrl = searchParams.get("id") || ""
  const isFromQR = !!idFromUrl

  const [certId, setCertId]         = useState(idFromUrl)
  const [pdfFile, setPdfFile]       = useState(null)
  const [nama, setNama]             = useState("")
  const [nim, setNim]               = useState("")
  const [institusi, setInstitusi]   = useState("")
  const [prodi, setProdi]           = useState("")
  const [tanggal, setTanggal]       = useState("")
  const [jenis, setJenis]           = useState("")
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState("")
  const [fetchingData, setFetchingData] = useState(false)

  // ⭐ Auto-fetch data sertifikat saat ada certId dari QR
  useEffect(() => {
    if (!idFromUrl) return

    const fetchCertData = async () => {
      try {
        setFetchingData(true)
        const { data } = await axios.get(
          `${API_URL}/api/verify/quick/${idFromUrl}`
        )

        if (data.success && data.data) {
          const cert = data.data
          // Auto-fill semua field!
          setNama(cert.nama || "")
          setNim(cert.nim || "")
          setInstitusi(cert.institusi || "")
          setProdi(cert.programStudi || "")
          setTanggal(cert.tanggalLulus || "")
          setJenis(cert.jenisSertifikat || "")
        }
      } catch (err) {
        setError("Gagal mengambil data sertifikat")
      } finally {
        setFetchingData(false)
      }
    }

    fetchCertData()
  }, [idFromUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("pdf", pdfFile)
      formData.append("certId", certId)
      formData.append("nama", nama)
      formData.append("nim", nim)
      formData.append("institusi", institusi)
      formData.append("programStudi", prodi)
      formData.append("tanggalLulus", tanggal)
      formData.append("jenisSertifikat", jenis)

      const { data } = await axios.post(
        `${API_URL}/api/verify`,
        formData
      )
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  // Field readonly kalau dari QR
  const readonlyStyle = {
    ...styles.input,
    backgroundColor: "#f1f5f9",
    cursor: "not-allowed",
    color: "#64748b"
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.title}>🎓 Verifikasi Ijazah</h1>
        <p style={styles.subtitle}>
          Masukkan data ijazah untuk memverifikasi keasliannya
        </p>

        {/* Loading fetch data */}
        {fetchingData && (
          <div style={styles.infoBox}>
            ⏳ Mengambil data sertifikat...
          </div>
        )}

        {/* Info kalau dari QR */}
        {isFromQR && !fetchingData && (
          <div style={styles.successInfoBox}>
            ✅ Data sertifikat berhasil dimuat dari QR Code.
            Silahkan upload file PDF ijazah untuk memverifikasi.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Certificate ID */}
          <div style={styles.field}>
            <label style={styles.label}>Certificate ID</label>
            <input
              style={isFromQR ? readonlyStyle : styles.input}
              placeholder="CERT-2024-XXXXXX"
              value={certId}
              onChange={e => setCertId(e.target.value)}
              readOnly={isFromQR}
            />
          </div>

          {/* Upload PDF — ini satu-satunya yang HRD isi */}
          <div style={styles.field}>
            <label style={styles.label}>
              Upload File PDF Ijazah
            </label>
            <input
              style={styles.input}
              type="file"
              accept=".pdf"
              onChange={e => setPdfFile(e.target.files[0])}
              required
            />
            {pdfFile && (
              <small style={{ color: "green" }}>
                ✅ {pdfFile.name}
              </small>
            )}
          </div>

          {/* Data Sertifikat — readonly kalau dari QR */}
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Nama Lengkap</label>
              <input
                style={isFromQR ? readonlyStyle : styles.input}
                placeholder="Budi Santoso"
                value={nama}
                onChange={e => setNama(e.target.value)}
                readOnly={isFromQR}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>NIM</label>
              <input
                style={isFromQR ? readonlyStyle : styles.input}
                placeholder="2021001"
                value={nim}
                onChange={e => setNim(e.target.value)}
                readOnly={isFromQR}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Institusi</label>
              <input
                style={isFromQR ? readonlyStyle : styles.input}
                placeholder="Universitas ABC"
                value={institusi}
                onChange={e => setInstitusi(e.target.value)}
                readOnly={isFromQR}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Program Studi</label>
              <input
                style={isFromQR ? readonlyStyle : styles.input}
                placeholder="Teknik Informatika"
                value={prodi}
                onChange={e => setProdi(e.target.value)}
                readOnly={isFromQR}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Tanggal Lulus</label>
              <input

                style={isFromQR ? readonlyStyle : styles.input}
                type={isFromQR ? "text" : "date"}
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                readOnly={isFromQR}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Jenis Sertifikat</label>
              {isFromQR ? (
                <input
                  style={readonlyStyle}
                  value={jenis}
                  readOnly
                />
              ) : (
                <select
                  style={styles.input}
                  value={jenis}
                  onChange={e => setJenis(e.target.value)}
                  required
                >
                  <option value="">Pilih jenis...</option>
                  <option value="Ijazah">Ijazah</option>
                  <option value="Sertifikat">Sertifikat</option>
                  <option value="Transkrip">Transkrip</option>
                </select>
              )}
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>⚠️ {error}</div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading || fetchingData ? 0.7 : 1,
              cursor: loading || fetchingData ? "not-allowed" : "pointer"
            }}
            disabled={loading || fetchingData}
          >
            {loading ? "⏳ Memverifikasi..." : "🔍 Verifikasi Sekarang"}
          </button>

        </form>

        {result && <ResultCard result={result} />}

      </div>
    </div>
  )
}

// ── Komponen Hasil ─────────────────────────────────
const ResultCard = ({ result }) => {

  const statusConfig = {
    VALID: {
      bg: "#f0fdf4",
      border: "#16a34a",
      icon: "✅",
      title: "IJAZAH VALID",
      color: "#16a34a"
    },
    FILE_TAMPERED: {
      bg: "#fef2f2",
      border: "#dc2626",
      icon: "❌",
      title: "FILE PDF DIMANIPULASI",
      color: "#dc2626"
    },
    DATA_TAMPERED: {
      bg: "#fef2f2",
      border: "#dc2626",
      icon: "❌",
      title: "DATA DIMANIPULASI",
      color: "#dc2626"
    },
    BOTH_TAMPERED: {
      bg: "#fef2f2",
      border: "#dc2626",
      icon: "❌",
      title: "FILE DAN DATA DIMANIPULASI",
      color: "#dc2626"
    },
    REVOKED: {
      bg: "#fff7ed",
      border: "#ea580c",
      icon: "🚫",
      title: "SERTIFIKAT DICABUT",
      color: "#ea580c"
    },
    NOT_FOUND: {
      bg: "#f8fafc",
      border: "#64748b",
      icon: "🔍",
      title: "SERTIFIKAT TIDAK DITEMUKAN",
      color: "#64748b"
    }
  }

  const config = statusConfig[result.status] || statusConfig.NOT_FOUND

  return (
    <div style={{
      ...styles.resultCard,
      backgroundColor: config.bg,
      borderColor: config.border
    }}>

      {/* Status Utama */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "3rem" }}>{config.icon}</div>
        <h2 style={{ color: config.color, margin: "0.5rem 0" }}>
          {config.title}
        </h2>
        <p style={{ color: "#64748b" }}>{result.message}</p>
      </div>

      {/* Detail Hash Check */}
      {result.detail && result.detail.exists && (
        <div style={styles.hashDetail}>
          <h3 style={{ marginBottom: "1rem" }}>Detail Pemeriksaan:</h3>

          <div style={styles.hashRow}>
            <span>Integritas File PDF:</span>
            <span style={{
              color: result.detail.fileMatch ? "#16a34a" : "#dc2626",
              fontWeight: "bold"
            }}>
              {result.detail.fileMatch ? "✅ Asli" : "❌ Dimanipulasi"}
            </span>
          </div>

          <div style={styles.hashRow}>
            <span>Integritas Data:</span>
            <span style={{
              color: result.detail.dataMatch ? "#16a34a" : "#dc2626",
              fontWeight: "bold"
            }}>
              {result.detail.dataMatch ? "✅ Asli" : "❌ Dimanipulasi"}
            </span>
          </div>

          <div style={styles.hashRow}>
            <span>Status Sertifikat:</span>
            <span style={{
              color: result.detail.isValid ? "#16a34a" : "#dc2626",
              fontWeight: "bold"
            }}>
              {result.detail.isValid ? "✅ Berlaku" : "❌ Dicabut"}
            </span>
          </div>

          {result.detail.issuedAt && (
            <div style={styles.hashRow}>
              <span>Diterbitkan:</span>
              <span>
                {new Date(result.detail.issuedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Data Sertifikat */}
      {result.detail?.data && (
        <div style={styles.certData}>
          <h3 style={{ marginBottom: "1rem" }}>Data Sertifikat Terdaftar:</h3>
          {Object.entries({
            "Nama": result.detail.data.nama,
            "NIM": result.detail.data.nim,
            "Institusi": result.detail.data.institusi,
            "Program Studi": result.detail.data.programStudi,
            "Tanggal Lulus": result.detail.data.tanggalLulus,
            "Jenis": result.detail.data.jenisSertifikat,
          }).map(([key, val]) => (
            <div key={key} style={styles.hashRow}>
              <span style={{ color: "#64748b" }}>{key}:</span>
              <span style={{ fontWeight: "500" }}>{val}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

// ── Styles ─────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "2rem 1rem",
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: "0.5rem",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "2rem",
  },
  infoBox: {
    backgroundColor: "#eff6ff",
    border: "1px solid #93c5fd",
    color: "#1e40af",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  successInfoBox: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    color: "#166534",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    marginBottom: "1rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "0.6rem 0.8rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.85rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "1rem",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    padding: "0.75rem",
    borderRadius: "8px",
    marginTop: "1rem",
  },
  resultCard: {
    marginTop: "2rem",
    padding: "2rem",
    borderRadius: "12px",
    border: "2px solid",
  },
  hashDetail: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  hashRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f1f5f9",
  },
  certData: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
  }
}

export default VerifyPage
