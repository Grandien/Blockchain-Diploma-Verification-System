import { useState, useEffect, useCallback, useMemo } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API_BASE = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/admin`

/**
 * Hook untuk mengelola data sertifikat: fetch, revoke, search/filter, dan statistik.
 */
export const useCertificates = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [revoking, setRevoking] = useState(null)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("token")
      const { data } = await axios.get(`${API_BASE}/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCertificates(data.data)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/admin/login")
        return
      }
      setError("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const revokeCertificate = useCallback(
    async (certId) => {
      try {
        setRevoking(certId)
        const token = localStorage.getItem("token")
        await axios.put(
          `${API_BASE}/revoke/${certId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        await fetchCertificates()
        return true
      } catch (err) {
        alert("Gagal merevoke sertifikat")
        return false
      } finally {
        setRevoking(null)
      }
    },
    [fetchCertificates]
  )

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  const filtered = useMemo(
    () =>
      certificates.filter(
        (c) =>
          c.nama?.toLowerCase().includes(search.toLowerCase()) ||
          c.nim?.toLowerCase().includes(search.toLowerCase()) ||
          c.certId?.toLowerCase().includes(search.toLowerCase())
      ),
    [certificates, search]
  )

  const stats = useMemo(
    () => ({
      total: certificates.length,
      valid: certificates.filter((c) => c.isValid).length,
      revoked: certificates.filter((c) => !c.isValid).length,
    }),
    [certificates]
  )

  return {
    certificates,
    filtered,
    stats,
    loading,
    error,
    revoking,
    search,
    setSearch,
    fetchCertificates,
    revokeCertificate,
  }
}
