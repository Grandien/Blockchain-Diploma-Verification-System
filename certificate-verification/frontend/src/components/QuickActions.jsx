import { useNavigate } from "react-router-dom"

const QuickActions = ({ onShowList }) => {
  const navigate = useNavigate()

  const actions = [
    {
      icon: "📜",
      title: "Terbitkan Sertifikat",
      desc: "Tambah sertifikat baru ke blockchain",
      onClick: () => navigate("/admin/issue"),
    },
    {
      icon: "📋",
      title: "Lihat Semua",
      desc: "Kelola semua sertifikat",
      onClick: onShowList,
    },
    {
      icon: "🔍",
      title: "Verifikasi",
      desc: "Cek keaslian sertifikat",
      onClick: () => navigate("/verify"),
    },
  ]

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-0">
        Quick Actions
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 p-6 bg-slate-50 border-2 border-slate-200 rounded-xl cursor-pointer text-center hover:border-indigo-400 hover:bg-violet-50 transition-colors"
          >
            <span className="text-3xl">{action.icon}</span>
            <span className="font-semibold">{action.title}</span>
            <span className="text-sm text-slate-500">{action.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
