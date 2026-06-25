import SearchBox from "../components/SearchBox"
import CertTable from "../components/CertTable"
import { LoadingState, EmptyState, ErrorBox } from "../components/StatusStates"

const CertificateList = ({
  filtered,
  search,
  setSearch,
  error,
  loading,
  onRevoke,
  revoking,
}) => (
  <div>
    <SearchBox
      search={search}
      setSearch={setSearch}
      resultCount={filtered.length}
    />

    {error && <ErrorBox message={error} />}

    {loading ? (
      <LoadingState />
    ) : filtered.length === 0 ? (
      <EmptyState />
    ) : (
      <CertTable data={filtered} onRevoke={onRevoke} revoking={revoking} />
    )}
  </div>
)

export default CertificateList
