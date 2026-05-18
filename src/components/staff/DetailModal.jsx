import EvaluationReport from "./EvaluationReport";

export default function DetailModal({ evalData, onClose, onSendPdf, sendingPdf }) {
  if (!evalData) return null;

  const statusColor = {
    APPROVED: "text-emerald-600", ENROLLED: "text-emerald-600", IRREGULAR_ENROLLED: "text-emerald-600",
    REJECTED: "text-red-600",
    FOR_ENROLLMENT: "text-blue-600",
    IRREGULAR: "text-purple-600",
    PENDING: "text-yellow-600",
  }[evalData.status] || "text-yellow-600";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Evaluation Details</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500">✕</button>
        </div>

        <div className="space-y-2 text-sm text-slate-700 mb-4">
          <p><strong>Student:</strong> {evalData.student_number || "N/A"}</p>
          <p><strong>Year Level:</strong> {evalData.year_level ?? "—"}</p>
          <p><strong>Reason:</strong> {evalData.reason}</p>
          <p><strong>Submitted:</strong> {new Date(evalData.created_at).toLocaleString()}</p>
          <p><strong>Status: </strong><span className={`font-bold uppercase ${statusColor}`}>{evalData.status}</span></p>
          {evalData.reviewed_by_name && <p><strong>Reviewed By:</strong> {evalData.reviewed_by_name}</p>}
        </div>

        {evalData.evaluation_result && (
          <>
            <hr className="my-4" />
            <h3 className="font-bold text-sm text-slate-700 mb-3 uppercase">Evaluation Report</h3>
            <EvaluationReport evalData={
              typeof evalData.evaluation_result === "string" ? JSON.parse(evalData.evaluation_result) : evalData.evaluation_result
            } />
          </>
        )}

        <div className="mt-6 space-y-2">
          {["FOR_ENROLLMENT", "ENROLLED", "IRREGULAR", "IRREGULAR_ENROLLED", "REJECTED"].includes(evalData.status) && (
            <button onClick={onSendPdf} disabled={sendingPdf}
              className="mt-2 w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50">
              {sendingPdf ? "Sending..." : "Send PDF to Student Email"}
            </button>
          )}
          {["PENDING", "APPROVED"].includes(evalData.status) && (
            <div className="w-full py-2 rounded-lg text-sm text-center text-zinc-400 bg-zinc-50 border">Awaiting moderator response</div>
          )}
          <button onClick={onClose} className="w-full py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
