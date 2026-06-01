import { useEffect, useState } from "react";
import api from "../../services/api";
import { toPHDate } from "../../utils/date";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function EvaluatorEvaluations() {
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

  const markRead = async (id) => {
    try {
      await api.patch(`/api/admin/evaluations/${id}/read`);
      setEvaluations((prev) => prev.map((e) => (e.id === id ? { ...e, staff_viewed_at: new Date().toISOString() } : e)));
    } catch {
      // silent
    }
  };

  const handleExpand = (ev) => {
    const id = ev.id;
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      if (!ev.staff_viewed_at) markRead(id);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Evaluator Evaluations</h2>
        <p className="text-sm text-slate-500 mt-1">Review all evaluation decisions made by evaluators</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-6 px-2 py-3.5"></th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Student</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Evaluator</th>
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
                <tr key={ev.id} className={`hover:bg-slate-50/50 cursor-pointer ${!ev.staff_viewed_at ? "bg-amber-50/40" : ""}`} onClick={() => handleExpand(ev)}>
                  <td className="px-2 py-3 text-center">
                    {!ev.staff_viewed_at && <span className="inline-block w-2 h-2 rounded-full bg-red-500" />}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{ev.first_name} {ev.last_name}</p>
                    <p className="text-xs text-slate-400">{ev.student_number}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-slate-800">{ev.evaluator_name}</p>
                    <p className="text-xs text-slate-400">{ev.evaluator_email}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400">{toPHDate(ev.created_at)}</td>
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
