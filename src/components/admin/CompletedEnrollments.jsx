import { useEffect, useState } from "react";
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

const statusConfig = {
  ENROLLED: { label: "Enrolled", cls: "bg-emerald-100 text-emerald-700" },
  IRREGULAR_ENROLLED: { label: "Irregular Enrolled", cls: "bg-purple-100 text-purple-700" },
};

function parseEvaluation(evalResult) {
  if (!evalResult) return null;
  return typeof evalResult === "string" ? JSON.parse(evalResult) : evalResult;
}

export default function CompletedEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [confirmExport, setConfirmExport] = useState(false);

  useEffect(() => {
    api.get("/api/admin/enrollments/completed")
      .then((d) => setEnrollments(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const overallBadge = (overall) => {
    const map = {
      qualified: "bg-emerald-100 text-emerald-700",
      conditional: "bg-amber-100 text-amber-700",
      disqualified: "bg-red-100 text-red-700",
    };
    return map[overall] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pre Enroll</h2>
          <p className="text-sm text-slate-500 mt-1">Students who have been evaluated and enrolled</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">{enrollments.length} pre-enrolled</span>
          <button onClick={() => setConfirmExport(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <SvgIcon path="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M3 21h18M3 10h18M3 16h18" className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-400">No pre-enrolled students yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => {
            const result = parseEvaluation(e.evaluation_result);
            const status = statusConfig[e.status] || { label: e.status, cls: "bg-slate-100 text-slate-600" };
            return (
              <div
                key={e.id}
                onClick={() => setDetail(detail?.id === e.id ? null : e)}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{e.first_name} {e.last_name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${status.cls}`}>{status.label}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span>{e.student_number}</span>
                      <span>Year {e.year_level}</span>
                      <span>{e.course_code}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {result && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${overallBadge(result.overall)}`}>
                        {result.overall}
                      </span>
                    )}
                    <SvgIcon path={detail?.id === e.id ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                {detail?.id === e.id && (
                  <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50 rounded-b-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                        <p className="font-medium text-slate-700">{e.student_email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course</p>
                        <p className="font-medium text-slate-700">{e.course_name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requested By</p>
                        <p className="font-medium text-slate-700">{e.requested_by_name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reviewed By</p>
                        <p className="font-medium text-slate-700">{e.reviewed_by_name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrolled Date</p>
                        <p className="font-medium text-slate-700">{new Date(e.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {result && (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Evaluation Result</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                          <div>
                            <p className="text-slate-400">Overall</p>
                            <p className={`font-bold uppercase ${result.overall === "qualified" ? "text-emerald-600" : result.overall === "conditional" ? "text-amber-600" : "text-red-600"}`}>
                              {result.overall || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">Current Failed</p>
                            <p className="font-semibold">{result.summary?.current_failed || 0}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Retakes</p>
                            <p className="font-semibold">{result.summary?.retake_subjects || 0}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Next Subjects</p>
                            <p className="font-semibold">{result.summary?.next_semester_subjects || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {confirmExport && (
        <ConfirmModal
          title="Export to Excel"
          message={`Export ${enrollments.length} pre-enrolled student(s) to Excel?`}
          confirmLabel="Export"
          confirmColor="bg-blue-600 hover:bg-blue-700"
          onConfirm={() => { setConfirmExport(false); exportToExcel(enrollments, "pre-enrolled-students.xlsx", "PreEnroll"); }}
          onCancel={() => setConfirmExport(false)}
        />
      )}
    </div>
  );
}
