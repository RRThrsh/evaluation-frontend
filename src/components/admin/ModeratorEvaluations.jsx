import { useEffect, useState } from "react";
import api from "../../services/api";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function ModeratorEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/api/admin/evaluations?limit=100")
      .then((data) => setEvaluations(data.data ?? []))
      .catch((err) => showToast(err.message))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => {
    if (s === "PENDING") return "text-amber-600 bg-amber-50";
    if (s === "FOR_ENROLLMENT" || s === "IRREGULAR") return "text-blue-600 bg-blue-50";
    if (s === "ENROLLED" || s === "IRREGULAR_ENROLLED") return "text-emerald-600 bg-emerald-50";
    if (s === "REJECTED") return "text-red-600 bg-red-50";
    return "text-slate-600 bg-slate-100";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Moderator Evaluations</h2>
        <p className="text-sm text-slate-500 mt-1">Review all evaluation decisions made by moderators</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Student</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Moderator</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : evaluations.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-400">No evaluations found</td></tr>
            ) : evaluations.map((ev) => (
              <>
                <tr key={ev.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{ev.first_name} {ev.last_name}</p>
                    <p className="text-xs text-slate-400">{ev.student_number}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-slate-800">{ev.moderator_name}</p>
                    <p className="text-xs text-slate-400">{ev.moderator_email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${statusColor(ev.status)}`}>{ev.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400">{new Date(ev.created_at).toLocaleDateString()}</td>
                </tr>
                {expanded === ev.id && ev.evaluation_result && (
                  <tr key={`${ev.id}-detail`} className="bg-slate-50/70">
                    <td colSpan={4} className="px-5 py-4">
                      <pre className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto max-h-60">
                        {JSON.stringify(ev.evaluation_result, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-red-500`}>{toast.msg}</div>
      )}
    </div>
  );
}
