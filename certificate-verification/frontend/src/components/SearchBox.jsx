const SearchBox = ({ search, setSearch, resultCount }) => (
  <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
    <input
      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400"
      placeholder="🔍 Cari nama, NIM, atau Certificate ID..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <span className="text-slate-500 text-sm whitespace-nowrap">
      {resultCount} sertifikat ditemukan
    </span>
  </div>
)

export default SearchBox
