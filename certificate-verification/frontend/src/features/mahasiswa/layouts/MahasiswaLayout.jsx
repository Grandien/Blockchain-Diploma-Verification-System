import { useNavigate, useLocation } from "react-router-dom"
import AppLayout from "../../../shared/layouts/AppLayout"
import { useMahasiswaUser } from "../hooks/useMahasiswaUser"

/**
 * Konfigurasi sidebar khusus mahasiswa, dipasang di atas AppLayout generic.
 * Pola ini yang dipakai tiap kali mau menambah sidebar di area/role baru.
 */
const MahasiswaLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useMahasiswaUser()

  const navItems = [
    {
      id: "sertifikat",
      icon: "📜",
      label: "Sertifikat Saya",
      onClick: () => navigate("/mahasiswa/sertifikat"),
    },
    {
      id: "profil",
      icon: "👤",
      label: "Profil",
      onClick: () => navigate("/mahasiswa/profil"),
    },
  ]

  // activeId ditentukan dari path saat ini, bukan state lokal
  const activeId = navItems.find((item) =>
    location.pathname.startsWith(`/mahasiswa/${item.id}`)
  )?.id

  return (
    <AppLayout
      storageKey="mahasiswa_sidebar_collapsed"
      logo={{ icon: "🧑‍🎓", label: "CertVerify" }}
      navItems={navItems}
      activeId={activeId}
      user={{
        name: user.nama || "Mahasiswa",
        role: user.nim || "Mahasiswa",
        avatarChar: user.nama?.[0] || "M",
      }}
      onLogout={logout}
    >
      {children}
    </AppLayout>
  )
}

export default MahasiswaLayout
