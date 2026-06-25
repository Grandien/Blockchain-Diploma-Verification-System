const TAB_TITLES = {
  dashboard: "Dashboard",
  issue: "Terbitkan Sertifikat",
  verify: "Verifikasi Ijazah",
  list: "Daftar Sertifikat",
}

const DashboardHeader = ({ activeTab, userName, onRefresh }) => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-slate-800 m-0">
        {TAB_TITLES[activeTab]}
      </h1>
      <p className="text-slate-500 mt-1 mb-0 text-sm">
        Selamat datang, {userName || "Admin"}
      </p>
    </div>
    <button
      onClick={onRefresh}
      className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
    >
      🔄 Refresh
    </button>
  </div>
)

export default DashboardHeader
