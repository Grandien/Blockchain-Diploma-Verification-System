import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import MahasiswaLogin from "./pages/MahasiswaLogin";
import IssuePage from "./pages/IssuePage";
import VerifyPage from "./pages/VerifyPage";
import SertifikatSaya from "./features/mahasiswa/pages/SertifikatSaya";

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/mahasiswa/login" element={<MahasiswaLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/issue" element={<IssuePage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/mahasiswa/sertifikat" element={<SertifikatSaya />} />
    </Routes>
  );
}

export default App;