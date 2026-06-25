export const LoadingState = () => (
  <div className="text-center p-12 text-slate-500">⏳ Memuat data...</div>
)

export const EmptyState = () => (
  <div className="text-center p-12 text-slate-500 flex flex-col items-center gap-4">
    <div className="text-5xl">📭</div>
    <div>Tidak ada sertifikat ditemukan</div>
  </div>
)

export const ErrorBox = ({ message }) => (
  <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-lg mb-4">
    ⚠️ {message}
  </div>
)
