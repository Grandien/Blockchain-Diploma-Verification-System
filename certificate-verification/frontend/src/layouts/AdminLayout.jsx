import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"

const STORAGE_KEY = "admin_sidebar_collapsed"

/**
 * Shell layout untuk halaman-halaman admin: sidebar tetap (collapsible) + area konten scrollable.
 * Status collapse disimpan di localStorage agar tetap konsisten antar reload/navigasi.
 */
const AdminLayout = ({ activeTab, setActiveTab, children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true"
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // localStorage tidak tersedia (mis. private mode) — abaikan saja
    }
  }, [collapsed])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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

export default AdminLayout
