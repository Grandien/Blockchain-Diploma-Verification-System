import { useNavigate } from "react-router-dom"
import AppLayout from "../../../shared/layouts/AppLayout"
import { useAdminUser } from "../hooks/useAdminUser"

/**
 * Konfigurasi sidebar khusus admin, dipasang di atas AppLayout generic.
 */
const AdminLayout = ({ activeTab, setActiveTab, children }) => {
  const navigate = useNavigate()
  const { user, logout } = useAdminUser()

  const navItems = [
    {
      id: "dashboard",
      icon: "📊",
      label: "Dashboard",
      onClick: () => setActiveTab("dashboard"),
    },
    {
      id: "issue",
      icon: "📜",
      label: "Terbitkan",
      onClick: () => navigate("/admin/issue"),
    },
    {
      id: "list",
      icon: "📋",
      label: "Sertifikat",
      onClick: () => setActiveTab("list"),
    },
  ]

  return (
    <AppLayout
      storageKey="admin_sidebar_collapsed"
      logo={{ icon: "🎓", label: "Certify" }}
      navItems={navItems}
      activeId={activeTab}
      user={{
        name: user.nama || "Admin",
        role: "Administrator",
        avatarChar: user.nama?.[0] || "A",
      }}
      onLogout={logout}
    >
      {children}
    </AppLayout>
  )
}

export default AdminLayout
