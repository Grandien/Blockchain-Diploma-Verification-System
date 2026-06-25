// src/pages/issue/IssuePage.jsx
import { useState } from "react"
import axios from "axios"

const IssuePage = () => {

  const [pdfFile, setPdfFile]     = useState(null)
  const [nama, setNama]           = useState("")
  const [nim, setNim]             = useState("")
  const [institusi, setInstitusi] = useState("")
  const [prodi, setProdi]         = useState("")
  const [tanggal, setTanggal]     = useState("")
  const [jenis, setJenis]         = useState("Ijazah")
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState("")
  const [result, setResult]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    // Validasi file
    if (!pdfFile) {
      setError("File PDF wajib diupload!")
      setLoading(false)
      return
    }

    // Validasi ukuran file max 5MB
    if (pdfFile.size > 5 * 1024 * 1024) {
      setError("File terlalu besar! Maksimal 5MB")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("pdf", pdfFile)
      formData.append("nama", nama)
      formData.append("nim", nim)
      formData.append("institusi", institusi)
      formData.append("programStudi", prodi)
      formData.append("tanggalLulus", tanggal)
      formData.append("jenisSertifikat", jenis)

      // ⭐ TAMBAH TOKEN JWT DI HEADER!
      const token = localStorage.getItem("token")

      const { data } = await axios.post(
        "http://localhost:5000/api/admin/issue",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // Content-Type tidak perlu diset manual
            // axios otomatis set multipart/form-data
          }
        }
      )

      setResult(data)

      // Reset form setelah berhasil
      setPdfFile(null)
      setNama("")
      setNim("")
      setInstitusi("")
      setProdi("")
      setTanggal("")
      setJenis("Ijazah")

    } catch (err) {
      // Handle error spesifik
      if (err.response?.status === 401) {
        setError("Sesi login habis. Silahkan login ulang.")
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.title}>🎓 Terbitkan Sertifikat</h1>
        <p style={styles.subtitle}>Masukkan data sertifikat.</p>

        {/* HASIL BERHASIL */}
        {result && (
          <div style={styles.successBox}>
            <h3>✅ Sertifikat Berhasil Diterbitkan!</h3>

            <div style={styles.hashRow}>
              <span>Certificate ID:</span>
              <strong>{result.data?.certId}</strong>
            </div>

            <div style={styles.hashRow}>
              <span>Nama:</span>
              <span>{result.data?.nama}</span>
            </div>

            <div style={styles.hashRow}>
              <span>NIM:</span>
              <span>{result.data?.nim}</span>
            </div>

            {/* QR Code */}
            {result.data?.qrCode && (
              <div style={styles.qrSection}>
                <p style={styles.qrCaption}>
                  QR Code untuk ditempel di ijazah:
                </p>
                <img
                  src={result.data.qrCode}
                  alt="QR Code"
                  style={styles.qrImage}
                />
                <a
                  href={result.data.qrCode}
                  download={`QR-${result.data.certId}.png`}
                  style={styles.downloadBtn}
                >
                  ⬇️ Download QR Code
                </a>
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              style={styles.resetBtn}
            >
              + Terbitkan Sertifikat Lain
            </button>
          </div>
        )}

        {/* FORM — sembunyikan kalau sudah ada hasil */}
        {!result && (
          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.field}>
              <label style={styles.label}>Upload File PDF Ijazah</label>
              <input
                style={styles.input}
                type="file"
                accept=".pdf"
                onChange={e => setPdfFile(e.target.files[0])}
                required
              />
              {pdfFile && (
                <small style={{ color: "green" }}>
                  ✅ {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                </small>
              )}
            </div>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Nama Lengkap</label>
                <input
                  style={styles.input}
                  placeholder="Budi Santoso"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>NIM</label>
                <input
                  style={styles.input}
                  placeholder="2021001"
                  value={nim}
                  onChange={e => setNim(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Institusi</label>
                <input
                  style={styles.input}
                  placeholder="Universitas ABC"
                  value={institusi}
                  onChange={e => setInstitusi(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Program Studi</label>
                <input
                  style={styles.input}
                  placeholder="Teknik Informatika"
                  value={prodi}
                  onChange={e => setProdi(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Tanggal Lulus</label>
                <input
                  style={styles.input}
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Jenis Sertifikat</label>
                <select
                  style={styles.input}
                  value={jenis}
                  onChange={e => setJenis(e.target.value)}
                  required
                >
                  <option value="Ijazah">Ijazah</option>
                  <option value="Sertifikat">Sertifikat</option>
                  <option value="Transkrip">Transkrip</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              disabled={loading}
            >
              {loading ? "⏳ Memproses..." : "📜 Terbitkan Sertifikat"}
            </button>

          </form>
        )}

      </div>
    </div>
  )
}

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
  successBox: {
    backgroundColor: "#f0fdf4",
    border: "2px solid #16a34a",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  hashRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #dcfce7",
  },
  qrSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #dcfce7",
  },
  qrCaption: {
    margin: "0 0 0.75rem",
    fontWeight: "600",
    textAlign: "center",
  },
  qrImage: {
    width: "200px",
    height: "200px",
    display: "block",
  },
  downloadBtn: {
    display: "inline-block",
    marginTop: "0.75rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#16a34a",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
  },
  resetBtn: {
    width: "100%",
    marginTop: "1rem",
    padding: "0.75rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
  }
}

export default IssuePage