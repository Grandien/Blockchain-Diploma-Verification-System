const TABLE_HEADERS = [
  "Cert ID",
  "Nama",
  "NIM",
  "Program Studi",
  "Tanggal Lulus",
  "Status",
  "QR",
  "Aksi",
]

const CertTable = ({ data, onRevoke, revoking }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
      <thead>
        <tr className="bg-slate-800">
          {TABLE_HEADERS.map((h) => (
            <th
              key={h}
              className="p-4 text-white text-left text-sm font-semibold whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((cert, i) => (
          <tr
            key={cert.certId}
            className={`border-b border-slate-100 ${
              i % 2 === 0 ? "bg-white" : "bg-slate-50"
            }`}
          >
            <td className="p-3.5 px-4 text-sm text-slate-700 whitespace-nowrap">
              <code className="bg-slate-100 px-2 py-0.5 rounded text-xs text-indigo-600">
                {cert.certId}
              </code>
            </td>
            <td className="p-3.5 px-4 text-sm text-slate-700 whitespace-nowrap">
              {cert.nama}
            </td>
            <td className="p-3.5 px-4 text-sm text-slate-700 whitespace-nowrap">
              {cert.nim}
            </td>
            <td className="p-3.5 px-4 text-sm text-slate-700 whitespace-nowrap">
              {cert.programStudi}
            </td>
            <td className="p-3.5 px-4 text-sm text-slate-700 whitespace-nowrap">
              {cert.tanggalLulus}
            </td>
            <td className="p-3.5 px-4 text-sm whitespace-nowrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  cert.isValid
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {cert.isValid ? "✅ Valid" : "🚫 Direvoke"}
              </span>
            </td>
            <td className="p-3.5 px-4 text-sm whitespace-nowrap">
              {cert.qrCode && (
                <a
                  href={cert.qrCode}
                  download={`QR-${cert.certId}.png`}
                  className="inline-block px-2.5 py-1 bg-indigo-600 text-white rounded-md no-underline text-xs hover:bg-indigo-700 transition-colors"
                >
                  ⬇️ QR
                </a>
              )}
            </td>
            <td className="p-3.5 px-4 text-sm whitespace-nowrap">
              {cert.isValid && (
                <button
                  className="px-3 py-1 bg-red-600 text-white border-none rounded-md cursor-pointer text-xs hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => onRevoke(cert.certId)}
                  disabled={revoking === cert.certId}
                >
                  {revoking === cert.certId ? "⏳" : "🚫 Revoke"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default CertTable
