import { Link } from "react-router-dom"
import LoginCard from "../components/LoginCard"
import LoginForm from "../components/LoginForm"
import { useLogin } from "../hooks/useLogin"

const AdminLogin = () => {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin({ role: "admin", redirectTo: "/admin/dashboard" })

  return (
    <LoginCard
      icon="🎓"
      title="Admin Login"
      subtitle="Masuk ke panel administrasi CertVerify"
    >
      <LoginForm
        identifierLabel="Email"
        identifierType="email"
        identifierPlaceholder="admin@kampus.ac.id"
        identifier={identifier}
        setIdentifier={setIdentifier}
        password={password}
        setPassword={setPassword}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />

      <p className="text-center text-sm text-slate-500 mt-6">
        Login sebagai mahasiswa?{" "}
        <Link to="/mahasiswa/login" className="text-indigo-600 font-medium">
          Klik di sini
        </Link>
      </p>
    </LoginCard>
  )
}

export default AdminLogin
