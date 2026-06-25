import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"

/**
 * Shell layout generic: sidebar collapsible + area konten.
 * Status collapse disimpan per-storageKey, jadi preferensi admin & mahasiswa
 * (atau role lain) tidak saling timpa.
 *
 * @param {string} storageKey - kunci unik localStorage, mis. "admin_sidebar_collapsed"
 * @param {Object} logo
 * @param {Array}  navItems
 * @param {string} activeId
 * @param {Object} user
 * @param {Function} onLogout
 */
const AppLayout = ({
  storageKey,
  logo,
  navItems,
  activeId,
  user,
  onLogout,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "true"
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(collapsed))
    } catch {
      // localStorage tidak tersedia — abaikan
    }
  }, [collapsed, storageKey])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        logo={logo}
        navItems={navItems}
        activeId={activeId}
        user={user}
        onLogout={onLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <div
        className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
          collapsed ? "ml-20" : "ml-60"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default AppLayout
