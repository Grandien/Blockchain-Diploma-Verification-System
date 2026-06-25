import { useNavigate } from "react-router-dom"

/**
 * Hook untuk mengambil data user yang sedang login dan fungsi logout.
 */
export const useAdminUser = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/admin/login")
  }

  return { user, logout }
}
