export default function SubmitForm({ studentNumber, setStudentNumber, submitting, error, result, sendSuccess, onSubmit }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Submit Evaluation</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">{error}</div>
      )}
      {sendSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 font-medium">{sendSuccess}</div>
      )}

      {result && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          result.status === "PENDING" ? "bg-yellow-50 border border-yellow-200 text-yellow-700" :
          ["APPROVED", "ENROLLED", "IRREGULAR_ENROLLED"].includes(result.status) ? "bg-emerald-50 border border-emerald-200 text-emerald-700" :
          result.status === "FOR_ENROLLMENT" ? "bg-blue-50 border border-blue-200 text-blue-700" :
          result.status === "IRREGULAR" ? "bg-purple-50 border border-purple-200 text-purple-700" :
          "bg-red-50 border border-red-200 text-red-600"
        }`}>
          Evaluation submitted! Status: <strong>{result.status}</strong>
          {result.student && <span> — Student: {result.student.student_number}</span>}
          <div className="mt-2 text-xs text-zinc-400">Awaiting moderator response to send PDF</div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Student Number</label>
          <input type="text" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)}
            placeholder="e.g. 2020-0001"
            className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <button type="submit" disabled={submitting}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${submitting ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>
          {submitting ? "Submitting..." : "Submit for Evaluation"}
        </button>
      </form>
    </div>
  );
}
