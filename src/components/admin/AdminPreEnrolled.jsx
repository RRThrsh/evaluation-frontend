import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Trash2, Download } from "lucide-react";
import { usePermissions } from "../../context/PermissionContext";
import * as XLSX from "xlsx";
import api from "../../services/api";

function SubjectTable({ title, subjects, columns, emptyMsg, rowClassName }) {
  if (!subjects || subjects.length === 0) return null;
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="font-semibold text-sm text-slate-700">
          {title} <span className="text-slate-400 font-normal">({subjects.length})</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined} className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide ${col.align === "right" ? "text-right" : ""} ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subjects.map((s, i) => {
              const extra = typeof rowClassName === "function" ? rowClassName(s) : "";
              return (
                <tr key={s.id ?? i} className={`transition hover:bg-primary-50/40 ${extra}`}>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-3 text-slate-700 truncate ${col.align === "right" ? "text-right" : ""}`}>
                      {col.render ? col.render(s) : s[col.key] ?? "\u2014"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatNote(raw) {
  const txt = raw.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  // Prereq failed: Prerequisite "X" for "Y" is FAILED — student must retake "X" first
  const prereqMatch = txt.match(/Prerequisite "(.+?)" for "(.+?)" is FAILED/);
  if (prereqMatch) return `${prereqMatch[2]} requires ${prereqMatch[1]} — must retake first`;
  // Awaiting grading
  const awaitMatch = txt.match(/(\d+) currently enrolled subject/);
  if (awaitMatch) return `${awaitMatch[1]} subject(s) still awaiting grading`;
  return txt;
}

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
        const res = await api.get(`/api/admin/evaluations/${request.id}/pre-enrolled-data`);
        setEvalData(res.data);
      } catch (err) {
        console.error("Failed to load pre-enrolled data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [request.id]);

  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const nextColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "20%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "50%" },
    { key: "prerequisite", label: "Prereq", width: "15%", render: (s) => s.prerequisite ? s.prerequisite : "\u2014" },
    { key: "units", label: "Units", align: "right", width: "15%" },
  ], []);

  const subjects = (evalData?.subjects || []).filter((s) => !s.prereq_failed);

  return (
    <div ref={overlayRef} onClick={handleOverlay} className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
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
              {subjects.length > 0 ? (
                <SubjectTable title="Possible Subjects (Next Semester)" subjects={subjects} columns={nextColumns} />
              ) : (
                <div className="card p-8 text-center text-slate-400 text-sm">No possible subjects available.</div>
              )}

              {evalData.is_graduating_candidate && evalData.graduation && !evalData.graduation.can_graduate && evalData.graduation.blocking_subjects?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-700">Cannot Graduate</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Student has {evalData.graduation.blocking_subjects.length} failed subject(s) with no retake path.
                      Must repeat 4th year to retake: {evalData.graduation.blocking_subjects.map((s) => s.subject_code).join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {evalData.recommendations?.length > 0 && (
                <div className="card p-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Evaluation Notes</h4>
                  <div className="space-y-1">
                    {evalData.recommendations.map((r, i) => {
                      const text = formatNote(r);
                      return (
                        <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                          {text.includes("FAILED") || text.includes("disqualified") || text.includes("Disqualified") || text.includes("retake") ? <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" /> :
                           text.includes("conditional") || text.includes("Conditional") || text.includes("awaiting") ? <AlertTriangle size={12} className="text-amber-400 mt-0.5 shrink-0" /> :
                           <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />}
                          {text}
                        </p>
                      );
                    })}
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
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmExport, setConfirmExport] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [modal, setModal] = useState(null);
  const { can } = usePermissions();

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get("/api/admin/evaluations", { params: { limit: 99999, status: "PRE_ENROLLED" } });
      const data = (res.data.requests || []).map((r) => ({
        "School Year": r.school_year || "",
        Semester: r.semester ? `Sem ${r.semester}` : "",
        "Student No.": r.student_number,
        Name: `${r.first_name} ${r.last_name}`.trim(),
        Course: r.course_name || "",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pre-Enrolled");
      XLSX.writeFile(wb, "pre-enrolled-students.xlsx");
    } catch (err) {
      setError(err.message || "Export failed");
    } finally {
      setExporting(false);
      setConfirmExport(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/evaluations/${confirmDelete.id}`);
      setConfirmDelete(null);
      fetchRequests(page);
    } catch (err) {
      setError(err.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-700">
            Pre-Enrolled Students {!loading && <span className="text-slate-400 font-normal">({total})</span>}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setConfirmExport(true)} disabled={loading || requests.length === 0} className="btn btn-ghost btn-sm gap-1.5">
              <Download size={14} /> Export
            </button>
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            )}
          </div>
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
                {can("enrolled-students.manage") && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>}
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
                  {can("enrolled-students.manage") && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(row); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                  )}
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

      {confirmExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !exporting && setConfirmExport(false)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-2">Export Pre-Enrolled</h3>
            <p className="text-sm text-slate-600 mb-5">
              Export <span className="font-semibold">{total}</span> pre-enrolled student{total !== 1 ? "s" : ""} to Excel?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmExport(false)} disabled={exporting} className="btn btn-ghost btn-sm">Cancel</button>
              <button onClick={handleExport} disabled={exporting} className="btn btn-primary btn-sm">
                {exporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !deleting && setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-2">Delete Pre-Enrolled</h3>
            <p className="text-sm text-slate-600 mb-5">
              Remove <span className="font-semibold">{confirmDelete.first_name} {confirmDelete.last_name}</span> from pre-enrolled list?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} disabled={deleting} className="btn btn-ghost btn-sm">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="btn btn-danger btn-sm">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && <PreEnrolledModal request={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
