const LoginForm = ({
  identifierLabel,
  identifierType = "text",
  identifierPlaceholder,
  identifier,
  setIdentifier,
  password,
  setPassword,
  loading,
  error,
  onSubmit,
  helperText,
}) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4">
    {error && (
      <div className="bg-red-50 border border-red-300 text-red-600 text-sm p-3 rounded-lg">
        ⚠️ {error}
      </div>
    )}

    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {identifierLabel}
      </label>
      <input
        type={identifierType}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder={identifierPlaceholder}
        autoComplete="username"
        className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
      />
      {helperText && (
        <span className="text-xs text-slate-400 mt-0.5">{helperText}</span>
      )}
    </div>

    <button
      type="submit"
      disabled={loading}
      className="mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "⏳ Memproses..." : "Masuk"}
    </button>
  </form>
)

export default LoginForm
