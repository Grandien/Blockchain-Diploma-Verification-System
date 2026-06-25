const STAT_CONFIG = [
  {
    key: "total",
    label: "Total Sertifikat",
    icon: "📜",
    color: "text-indigo-600",
    bg: "bg-violet-100",
  },
  {
    key: "valid",
    label: "Sertifikat Valid",
    icon: "✅",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    key: "revoked",
    label: "Sertifikat Direvoke",
    icon: "🚫",
    color: "text-red-600",
    bg: "bg-red-100",
  },
]

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-3 gap-6 mb-8">
    {STAT_CONFIG.map((stat) => (
      <div
        key={stat.key}
        className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm"
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg}`}
        >
          {stat.icon}
        </div>
        <div>
          <div className={`text-3xl font-bold ${stat.color}`}>
            {stats[stat.key]}
          </div>
          <div className="text-slate-500 text-sm">{stat.label}</div>
        </div>
      </div>
    ))}
  </div>
)

export default StatsGrid
