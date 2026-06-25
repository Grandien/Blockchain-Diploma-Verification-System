import StatsGrid from "../components/StatsGrid"
import QuickActions from "../components/QuickActions"
import CertTable from "../components/CertTable"
import { LoadingState } from "../components/StatusStates"

const DashboardOverview = ({
  stats,
  certificates,
  loading,
  onRevoke,
  revoking,
  onShowList,
}) => (
  <div>
    <StatsGrid stats={stats} />
    <QuickActions onShowList={onShowList} />

    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 mt-0">
        Sertifikat Terbaru
      </h2>
      {loading ? (
        <LoadingState />
      ) : (
        <CertTable
          data={certificates.slice(0, 5)}
          onRevoke={onRevoke}
          revoking={revoking}
        />
      )}
    </div>
  </div>
)

export default DashboardOverview
