const LoginCard = ({ icon, title, subtitle, children }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-3xl mb-4">
            {icon}
          </div>
          <h1 className="text-2xl font-bold text-slate-800 m-0">{title}</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  </div>
)

export default LoginCard
