import { Link } from "react-router-dom"
import LoginCard from "../components/LoginCard"
import LoginForm from "../components/LoginForm"
import { useLogin } from "../hooks/useLogin"

const MahasiswaLogin = () => {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin({ role: "mahasiswa", redirectTo: "/mahasiswa/sertifikat" })

  return (
    <LoginCard
      icon="🧑‍🎓"
      title="Login Mahasiswa"
      subtitle="Masuk untuk melihat sertifikat kamu"
    >
      <LoginForm
        identifierLabel="NIM"
        identifierType="text"
        identifierPlaceholder="Masukkan NIM"
        identifier={identifier}
        setIdentifier={setIdentifier}
        password={password}
        setPassword={setPassword}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        helperText="Password awal adalah tanggal lahir (DDMMYYYY)"
      />

      <p className="text-center text-sm text-slate-500 mt-6">
        Login sebagai admin?{" "}
        <Link to="/admin/login" className="text-indigo-600 font-medium">
          Klik di sini
        </Link>
      </p>
    </LoginCard>
  )
}

export default MahasiswaLogin
