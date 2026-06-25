import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API_BASE = "http://localhost:5000/api/auth"

/**
 * Hook login generik.
 * @param {Object} config
 * @param {"admin"|"mahasiswa"} config.role - dipakai untuk endpoint & redirect path
 * @param {string} config.redirectTo - path setelah login berhasil
 */
export const useLogin = ({ role, redirectTo }) => {
  const [identifier, setIdentifier] = useState("") // email (admin) atau nim (mahasiswa)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!identifier.trim() || !password) {
      setError("Mohon lengkapi semua field")
      return
    }

    try {
      
      setLoading(true)
      const payload =
        role === "admin"
          ? { email: identifier, password }
          : { nim: identifier, password }

      const { data } = await axios.post(`${API_BASE}/${role}/login`, payload)

      localStorage.setItem("token", data.token)
      const userData = role === "admin" ? data.user : data.mahasiswa
      localStorage.setItem("user", JSON.stringify(userData))

      navigate(redirectTo)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Email/NIM atau password salah"
          : "Gagal login, coba lagi")
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  }
}
