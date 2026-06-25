import { useNavigate } from "react-router-dom"

/**
 * Hook untuk mengambil data mahasiswa yang sedang login dan fungsi logout.
 */
export const useMahasiswaUser = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/mahasiswa/login")
  }

  return { user, logout }
}
