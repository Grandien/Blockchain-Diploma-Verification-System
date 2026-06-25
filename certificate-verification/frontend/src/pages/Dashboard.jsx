// src/pages/Dashboard.jsx
import { useState } from "react"
import AdminLayout from "../layouts/AdminLayout"
import DashboardHeader from "../components/DashboardHeader"
import DashboardOverview from "../views/DashboardOverview"
import CertificateList from "../views/CertificateList"
import { useCertificates } from "../hooks/useCertificates"
import { useAdminUser } from "../hooks/useAdminUser"
import IssueView from "../views/IssueView"
import VerifyView from "../views/VerifyView"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useAdminUser()
  const {
    certificates,
    filtered,
    stats,
    loading,
    error,
    revoking,
    search,
    setSearch,
    fetchCertificates,
    revokeCertificate,
  } = useCertificates()

  const sharedRevoke = { onRevoke: revokeCertificate, revoking }

  const TAB_VIEWS = {
    dashboard: (
      <DashboardOverview
        stats={stats}
        certificates={certificates}
        loading={loading}
        onShowList={() => setActiveTab("list")}
        {...sharedRevoke}
      />
    ),
    issue: <IssueView/>,
    verify: <VerifyView/>,
    list: (
      <CertificateList
        filtered={filtered}
        search={search}
        setSearch={setSearch}
        error={error}
        loading={loading}
        {...sharedRevoke}
      />
    ),
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <DashboardHeader
        activeTab={activeTab}
        userName={user.nama}
        onRefresh={fetchCertificates}
      />
      {TAB_VIEWS[activeTab] ?? null}
    </AdminLayout>
  )
}

export default Dashboard