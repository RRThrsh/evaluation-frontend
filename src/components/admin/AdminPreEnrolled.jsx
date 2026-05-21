import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { X, Eye, ChevronLeft, ChevronRight } from "lucide-react";

import api from "../../services/api";

const semesterNames = { 1: "1st Semester", 2: "2nd Semester" };

function PreEnrolledModal({ request, onClose }) {
  const overlayRef = useRef(null);
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/evaluator/students/${request.student_id}/evaluate`);
        setEvalData(res.data);
      } catch (err) {
        console.error("Pre-Enrolled eval fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [request.student_id]);

  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const nextColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "15%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "45%" },
                    { key: "prerequisite", label: "Prereq", width: "25%", render: (s) => {
                      if (s.prerequisite) {
                        const badge = s.prereq_failed ? "badge badge-red" : s.prereq_met ? "badge badge-green" : "badge badge-yellow";
                        const label = s.prereq_failed ? "FAILED" : s.prereq_met ? "OK" : "PENDING";
                        return <span className={`${badge}`}>{s.prerequisite} ({label})</span>;
                      }
                      return <span className="text-slate-300">{s.prerequisite}</span>;
                    }},
                    { key: "type", label: "", width: "15%", render: (s) => s.is_gap_filler ? <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Gap</span> : s.is_retake ? <span className="text-xs font-bold text-amber-600 uppercase">[RETAKE]</span> : null },
  ], []);

  const nextYear = request.current_semester === 2 ? (request.year_level || 1) + 1 : (request.year_level || 1);
  const nextSem = request.current_semester === 2 ? 1 : 2;

  return (
    <div ref={overlayRef} onClick={handleOverlay} className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Pre-Enrolled Student</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="card p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">School Year</span>
                <p className="font-semibold text-slate-800 mt-0.5">{request.school_year || "N/A"}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Semester</span>
                <p className="font-semibold text-slate-800 mt-0.5">{request.semester ? `Sem ${request.semester}` : "N/A"}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Student No.</span>
                <p className="font-semibold text-slate-800 mt-0.5">{request.student_number}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Student Name</span>
                <p className="font-semibold text-slate-800 mt-0.5">{request.first_name} {request.last_name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Course</span>
                <p className="font-semibold text-slate-800 mt-0.5">{request.course_name || "N/A"}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="inline-block w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : evalData ? (
            <>
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100">
                  <h3 className="font-semibold text-sm text-slate-700">
                    Possible Subjects (Y{nextYear} - {semesterNames[nextSem]})
                    <span className="text-slate-400 font-normal ml-1">({(evalData?.next_semester_subjects || []).length})</span>
                  </h3>
                </div>
                {(evalData.next_semester_subjects || []).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          {nextColumns.map((col) => (
                            <th key={col.key} style={col.width ? { width: col.width } : undefined} className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide ${col.align === "right" ? "text-right" : ""} ${col.className || ""}`}>
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {(evalData.next_semester_subjects || []).map((s, i) => (
                          <tr key={s.id ?? i} className={`transition hover:bg-primary-50/40 ${s.is_gap_filler ? "bg-amber-50/50" : ""}`}>
                            {nextColumns.map((col) => (
                              <td key={col.key} className={`px-6 py-3 text-slate-700 truncate ${col.align === "right" ? "text-right" : ""}`}>
                                {col.render ? col.render(s) : s[col.key] ?? "\u2014"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No possible subjects available.</div>
                )}
              </div>

              {evalData.remaining_failed_subjects?.length > 0 && (
                <div className="card overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100">
                    <h3 className="font-semibold text-sm text-slate-700">
                      Failed Subjects
                      <span className="text-slate-400 font-normal ml-1">({evalData.remaining_failed_subjects.length})</span>
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Code</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Prereq For</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {evalData.remaining_failed_subjects.map((fs) => {
                          const blocked = evalData.prerequisite_checks?.filter((p) => p.prerequisite_id === fs.subject_id) || [];
                          return (
                            <tr key={fs.id} className="hover:bg-red-50/40">
                              <td className="px-6 py-3 text-slate-700 font-mono text-xs">{fs.subject_code}</td>
                              <td className="px-6 py-3 text-slate-700">{fs.subject_name}</td>
                              <td className="px-6 py-3"><span className="text-red-600 font-medium">{fs.grade || "INC"}</span></td>
                              <td className="px-6 py-3 text-slate-500 text-xs">
                                {blocked.length > 0 ? blocked.map((b) => b.subject_code).join(", ") : "\u2014"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {evalData.recommendations?.length > 0 && (
                <div className="card p-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Evaluation Notes</h4>
                  <div className="space-y-1">
                    {evalData.recommendations.map((r, i) => (
                      <p key={i} className="text-xs text-slate-600">{r}</p>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-10 text-center text-sm text-slate-400">Failed to load evaluation data.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPreEnrolled() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);

  const fetchRequests = useCallback(async (pg) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/evaluations", { params: { page: pg, limit: 20, status: "PRE_ENROLLED" } });
      setRequests(res.data.requests);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(1); }, [fetchRequests]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    fetchRequests(p);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-700">
            Pre-Enrolled Students {!loading && <span className="text-slate-400 font-normal">({total})</span>}
          </h3>
          {loading && (
            <span className="inline-block w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">School Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Student No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Course</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((row) => (
                <tr key={row.id} onClick={() => setModal(row)} className="transition hover:bg-primary-50/40 cursor-pointer">
                  <td className="px-6 py-4 text-slate-700">{row.school_year || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-700">{row.semester ? `Sem ${row.semester}` : "N/A"}</td>
                  <td className="px-6 py-4 text-slate-700 font-mono">{row.student_number}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{row.first_name} {row.last_name}</td>
                  <td className="px-6 py-4 text-slate-700">{row.course_name || "N/A"}</td>
                  <td className="px-6 py-4 text-right"><Eye size={16} className="text-slate-400 inline-block" /></td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No pre-enrolled students.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-slate-300 text-xs">...</span>}
                  <button onClick={() => goToPage(p)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-primary-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}>{p}</button>
                </span>
              ))}
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">{error}</div>
      )}

      {modal && <PreEnrolledModal request={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
