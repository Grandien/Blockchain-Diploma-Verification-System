// src/components/Sidebar.jsx
import { useNavigate } from "react-router-dom"
import { useAdminUser } from "../hooks/useAdminUser"

const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard"  },
  { id: "issue",     icon: "📜", label: "Terbitkan"  },
  { id: "verify",    icon: "🛡️", label: "Verifikasi" },
  { id: "list",      icon: "📋", label: "Sertifikat" },
]

const Sidebar = ({ activeTab, setActiveTab, collapsed, onToggleCollapse }) => {
  const navigate = useNavigate()
  const { user, logout } = useAdminUser()

  const handleNavClick = (item) => {
    if (item.path) {
      navigate(item.path)
    } else {
      setActiveTab(item.id)
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-800 flex flex-col
        transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto
        ${collapsed ? "w-20 p-3" : "w-60 p-4"}`}
    >
      {/* Logo + toggle */}
      <div
        className={`flex items-center mb-6 shrink-0 ${
          collapsed ? "flex-col gap-2" : "justify-between pl-2"
        }`}
      >
        <span
          className={`text-white font-bold whitespace-nowrap ${
            collapsed ? "text-2xl leading-none" : "text-xl"
          }`}
          title="Certify"
        >
          {collapsed ? "🎓" : "🎓 Certify"}
        </span>

        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          className="w-9 h-9 flex items-center justify-center rounded-lg
            text-slate-200 hover:bg-slate-700 hover:text-white transition-colors shrink-0
            text-lg font-bold leading-none"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeTab === item.id}
            collapsed={collapsed}
            onClick={() => handleNavClick(item)}
          />
        ))}
      </nav>

      {/* User info & logout */}
      <UserSection user={user} collapsed={collapsed} onLogout={logout} />
    </aside>
  )
}

const NavItem = ({ item, active, collapsed, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={collapsed ? item.label : undefined}
    aria-label={item.label}
    className={`group relative flex items-center rounded-lg text-sm transition-colors
      ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"}
      ${
        active
          ? "bg-indigo-600 text-white"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
  >
    <span className="text-xl leading-none shrink-0" aria-hidden="true">
      {item.icon}
    </span>

    {!collapsed && (
      <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
    )}

    {collapsed && (
      <span
        className="pointer-events-none absolute left-full ml-2 px-2 py-1
          rounded-md bg-slate-900 text-white text-xs whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity z-50"
      >
        {item.label}
      </span>
    )}
  </button>
)

const UserSection = ({ user, collapsed, onLogout }) => (
  <div className="border-t border-slate-700 pt-4 shrink-0">
    <div className={`flex items-center mb-3 ${collapsed ? "justify-center" : "gap-3"}`}>
      <div
        className="w-9 h-9 rounded-full bg-indigo-600 flex items-center
          justify-center font-bold text-white shrink-0"
      >
        {user.nama?.[0]?.toUpperCase() || "A"}
      </div>

      {!collapsed && (
        <div className="overflow-hidden min-w-0">
          <div className="font-semibold text-sm text-white whitespace-nowrap">
            {user.nama || "Admin"}
          </div>
          <div className="text-xs text-slate-400">Administrator</div>
        </div>
      )}
    </div>

    <button
      type="button"
      onClick={onLogout}
      title={collapsed ? "Logout" : undefined}
      aria-label="Logout"
      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white
        rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
    >
      <span className="text-base leading-none" aria-hidden="true">🚪</span>
      {!collapsed && <span>Logout</span>}
    </button>
  </div>
)

export default Sidebar
