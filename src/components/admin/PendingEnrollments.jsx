import { useState } from "react";
import api from "../../services/api";
import exportToExcel from "../../utils/exportToExcel";
import ConfirmModal from "../common/ConfirmModal";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function PendingEnrollments({ enrollments, loading, onUpdate }) {
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmExport, setConfirmExport] = useState(false);

  const handleConfirm = async (id) => {
    try {
      await api.post(`/api/admin/enrollments/${id}/confirm`);
      onUpdate();
      setDetail(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/api/admin/enrollments/${id}/reject`);
      onUpdate();
      setDetail(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const openDetail = async (req) => {
    setDetail(req);
    setDetailLoading(true);
    try { await api.get(`/api/moderator/students/${req.student_id}/evaluate`); } catch (e) { /* ok */ }
    setDetailLoading(false);
  };

  const statusBadge = (overall) => {
    if (!overall) return { label: "—", cls: "bg-slate-100 text-slate-500" };
    const map = {
      qualified: { label: "Qualified", cls: "bg-emerald-100 text-emerald-700" },
      conditional: { label: "Conditional", cls: "bg-amber-100 text-amber-700" },
      disqualified: { label: "Disqualified", cls: "bg-red-100 text-red-700" },
    };
    return map[overall] || { label: overall.toUpperCase(), cls: "bg-slate-100 text-slate-500" };
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Evaluated Students</h3>
        <button onClick={() => setConfirmExport(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition">
          <SvgIcon path="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-3.5 h-3.5" />
          Export Excel
        </button>
      </div>
      {loading ? (
        <div className="text-sm text-slate-400 py-8 text-center">Loading...</div>
      ) : enrollments.length === 0 ? (
        <div className="text-sm text-slate-400 py-8 text-center">No evaluated students waiting for enrollment</div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((req) => {
            const result = req.evaluation_result ? (typeof req.evaluation_result === "string" ? JSON.parse(req.evaluation_result) : req.evaluation_result) : null;
            const badge = statusBadge(result?.overall);
            return (
              <div
                key={req.id}
                onClick={() => openDetail(req)}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{req.student_number} — {req.first_name} {req.last_name}</p>
                    <p className="text-xs text-slate-400">Year {req.year_level} &middot; Requested by: {req.requested_by_name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-blue-100 text-blue-700">For Enrollment</span>
                    <SvgIcon path="M9 5l7 7-7 7" className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="w-full max-w-lg mx-4 rounded-3xl border border-white/70 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-sm font-bold text-slate-800">Evaluated Student — Enrollment Decision</h3>
              <button onClick={() => setDetail(null)} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <SvgIcon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</p>
                    <p className="font-medium text-slate-800">{detail.student_number}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</p>
                    <p className="font-medium text-slate-800">{detail.first_name} {detail.last_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Year Level</p>
                    <p className="font-medium text-slate-800">{detail.year_level}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                    <p className="font-medium text-slate-800">{detail.student_email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requested By</p>
                    <p className="font-medium text-slate-800">{detail.requested_by_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reviewed By</p>
                    <p className="font-medium text-slate-800">{detail.reviewed_by_name || "—"}</p>
                  </div>
                </div>

                {detail.evaluation_result && (() => {
                  const r = typeof detail.evaluation_result === "string" ? JSON.parse(detail.evaluation_result) : detail.evaluation_result;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Evaluation Result</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${statusBadge(r?.overall).cls}`}>
                          {r?.overall?.toUpperCase() || "—"}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-3 text-xs text-slate-600">
                        <div>
                          <p className="text-slate-400">Failed</p>
                          <p className="font-semibold">{r?.summary?.current_failed || 0}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Retakes</p>
                          <p className="font-semibold">{r?.summary?.retake_subjects || 0}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Next Subjects</p>
                          <p className="font-semibold">{r?.summary?.next_semester_subjects || 0}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleConfirm(detail.id)}
                    className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition"
                  >
                    Confirm Enrollment
                  </button>
                  <button
                    onClick={() => handleReject(detail.id)}
                    className="flex-1 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                  >
                    Reject Enrollment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmExport && (
        <ConfirmModal
          title="Export to Excel"
          message={`Export ${enrollments.length} evaluated student(s) to Excel?`}
          confirmLabel="Export"
          confirmColor="bg-blue-600 hover:bg-blue-700"
          onConfirm={() => { setConfirmExport(false); exportToExcel(enrollments, "evaluated-students.xlsx", "Evaluated"); }}
          onCancel={() => setConfirmExport(false)}
        />
      )}
    </div>
  );
}
