import MahasiswaLayout from "../layouts/MahasiswaLayout"

const SertifikatSaya = () => {
  return (
    <MahasiswaLayout>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Sertifikat Saya
      </h1>
      <p className="text-slate-500 mb-6">
        Daftar sertifikat yang sudah kamu terima.
      </p>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* TODO: render daftar sertifikat mahasiswa di sini */}
        <p className="text-slate-400 text-sm">Belum ada data.</p>
      </div>
    </MahasiswaLayout>
  )
}

export default SertifikatSaya
