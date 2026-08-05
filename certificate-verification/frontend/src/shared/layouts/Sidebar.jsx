/**
 * Sidebar generic yang bisa dipakai untuk role apa pun (admin, mahasiswa, dll).
 * Semua konten (logo, menu, info user) dikirim lewat props, bukan hardcode.
 *
 * @param {Object} logo - { icon, label }
 * @param {Array}  navItems - [{ id, icon, label, onClick }]
 * @param {string} activeId - id nav item yang sedang aktif
 * @param {Object} user - { name, role, avatarChar }
 * @param {Function} onLogout
 * @param {boolean} collapsed
 * @param {Function} onToggleCollapse
 */
const Sidebar = ({
  logo,
  navItems = [],
  activeId,
  user,
  onLogout,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-slate-800 flex flex-col p-4 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Logo + toggle */}
      <div
        className={`flex items-center mb-8 ${
          collapsed ? "justify-center" : "justify-between pl-2"
        }`}
      >
        {!collapsed && (
          <div className="text-white text-xl font-bold whitespace-nowrap overflow-hidden">
            {logo?.icon} {logo?.label}
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            title={collapsed ? item.label : undefined}
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-colors ${
              collapsed ? "justify-center px-0" : ""
            } ${
              activeId === item.id
                ? "bg-indigo-600 text-white"
                : "bg-transparent text-slate-400 hover:bg-slate-700"
            }`}
            onClick={item.onClick}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            )}

            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="border-t border-slate-700 pt-4">
        <div
          className={`flex items-center gap-3 mb-3 text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0">
            {user?.avatarChar || "U"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-semibold text-sm whitespace-nowrap">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-slate-400 whitespace-nowrap">
                {user?.role || ""}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white border-none rounded-lg cursor-pointer text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
