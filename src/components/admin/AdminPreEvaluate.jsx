import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, X, Eye, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";

function statusBadge(status) {
  const map = {
    PENDING: { label: "Pending", cls: "badge badge-yellow" },
    APPROVED: { label: "Pass", cls: "badge badge-green" },
    REJECTED: { label: "Fail", cls: "badge badge-red" },
  };
  return map[status] || { label: status || "\u2014", cls: "badge badge-gray" };
}

function SubjectTable({ title, subjects, columns, badgeFn }) {
  if (!subjects || subjects.length === 0) return null;
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        <span className="text-xs text-slate-400 ml-2">({subjects.length})</span>
      </div>
      <table className="w-full text-left text-xs">
        <thead className="table-header">
          <tr>
            {columns.map((col) => <th key={col.key} className="px-5 py-3">{col.label}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subjects.map((s, i) => (
            <tr key={s.id ?? s.subject_code ?? i} className="table-row">
              {columns.map((col) => (
                <td key={col.key} className="table-cell">
                  {col.render ? col.render(s) : s[col.key] ?? "\u2014"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EvalModal({ request, onClose, onPreEnroll }) {
  const overlayRef = useRef(null);
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preEnrolling, setPreEnrolling] = useState(false);

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
        console.error("Preview fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [request.student_id]);

  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const currentColumns = [
    { key: "subject_code", label: "Code" },
    { key: "subject_name", label: "Subject" },
    { key: "status", label: "Status", render: (s) => <span className={statusBadge(s.status).cls}>{statusBadge(s.status).label}</span> },
    { key: "grade", label: "Grade" },
  ];

  const nextColumns = [
    { key: "subject_code", label: "Code" },
    { key: "subject_name", label: "Subject" },
    { key: "prerequisite", label: "Prereq", render: (s) => {
      if (s.prerequisite) {
        const badge = s.prereq_failed ? "badge badge-red" : s.prereq_met ? "badge badge-green" : "badge badge-yellow";
        const label = s.prereq_failed ? "FAILED" : s.prereq_met ? "OK" : "PENDING";
        return <span className={`${badge}`}>{s.prerequisite} ({label})</span>;
      }
      return <span className="text-slate-300">\u2014</span>;
    }},
    { key: "is_retake", label: "", render: (s) => s.is_retake ? <span className="text-xs font-bold text-amber-600 uppercase">[RETAKE]</span> : s.is_gap_filler ? <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Gap</span> : null },
  ];

  const overallBadge = (overall) => {
    if (overall === "qualified") return <span className="badge badge-green text-sm px-3 py-1">Qualified</span>;
    if (overall === "conditional") return <span className="badge badge-yellow text-sm px-3 py-1">Conditional</span>;
    return <span className="badge badge-red text-sm px-3 py-1">Disqualified</span>;
  };

  return (
    <div ref={overlayRef} onClick={handleOverlay} className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Evaluation Preview</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="card p-5">
            <div className="flex items-start justify-between">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
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
                <div>
                  <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Evaluated by</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{request.evaluator_name || "N/A"}</p>
                </div>
              </div>
              <div className="text-right">
                {evalData && overallBadge(evalData.overall)}
                {evalData?.has_pending_request && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    ⚠ Pending request already exists{evalData.pending_requested_by ? ` (by ${evalData.pending_requested_by})` : ""}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="inline-block w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : evalData ? (
            <>
              <SubjectTable title="Current Semester Subjects" subjects={evalData.current_semester_subjects} columns={currentColumns} />
              <SubjectTable title={`Possible Subjects (Next Semester)`} subjects={evalData.next_semester_subjects || []} columns={nextColumns} />
              {evalData.gap_fillers?.length > 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                  {evalData.gap_fillers.length} gap filler subject(s) included in Possible Subjects table above.
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {evalData.recommendations?.map((r, i) => (
                    <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      {r.includes("FAILED") || r.includes("disqualified") ? <AlertCircle size={12} className="text-red-400 mt-0.5 shrink-0" /> :
                       r.includes("conditional") ? <AlertCircle size={12} className="text-amber-400 mt-0.5 shrink-0" /> :
                       <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />}
                      {r}
                    </p>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
                  <button
                    onClick={async () => { setPreEnrolling(true); await onPreEnroll(request.id); setPreEnrolling(false); onClose(); }}
                    disabled={preEnrolling}
                    className="btn btn-primary btn-sm">
                    {preEnrolling ? "..." : "Recommend to Pre-Enrolled"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-10 text-center text-sm text-slate-400">Failed to load evaluation data.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPreEvaluate() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRequests = useCallback(async (pg) => {
    setLoading(true);
    setError("");
    try {
      const params = { page: pg, limit: 20, status: "PENDING" };
      if (search.trim()) params.search = search.trim();
      const res = await api.get("/api/admin/evaluations", { params });
      setRequests(res.data.requests);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchRequests(1); }, [fetchRequests]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    fetchRequests(p);
  };

  const handlePreEnroll = async (id) => {
    try {
      await api.patch(`/api/admin/evaluations/${id}/pre-enroll`);
      fetchRequests(page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-sm text-slate-700 shrink-0">
            Pending Evaluations {!loading && <span className="text-slate-400 font-normal">({total})</span>}
          </h3>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search student or evaluator..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-xs" />
            </div>
          </div>
          {loading && (
            <span className="inline-block w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Student No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Evaluator</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((row) => (
                <tr key={row.id} onClick={() => setModal(row)} className="transition hover:bg-primary-50/40 cursor-pointer">
                  <td className="px-6 py-4 text-slate-700 font-mono">{row.student_number}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{row.first_name} {row.last_name}</td>
                  <td className="px-6 py-4 text-slate-700">{row.course_name || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600">{row.evaluator_name || "N/A"}</td>
                  <td className="px-6 py-4 text-right"><Eye size={16} className="text-slate-400 inline-block" /></td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No pending evaluations.</td></tr>
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

      {modal && <EvalModal request={modal} onClose={() => setModal(null)} onPreEnroll={handlePreEnroll} />}
    </div>
  );
}
