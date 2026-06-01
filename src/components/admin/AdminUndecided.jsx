import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Send, Trash2 } from "lucide-react";
import { usePermissions } from "../../context/PermissionContext";
import api from "../../services/api";
import { toPHDate } from "../../utils/date";

function SubjectTable({ title, subjects, columns, emptyMsg }) {
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
            {subjects.map((s, i) => (
              <tr key={s.id ?? i} className="transition hover:bg-primary-50/40">
                {columns.map((col) => (
                  <td key={col.key} className={`px-6 py-3 text-slate-700 truncate ${col.align === "right" ? "text-right" : ""}`}>
                    {col.render ? col.render(s) : s[col.key] ?? "\u2014"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatNote(raw) {
  const txt = raw.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  const prereqMatch = txt.match(/Prerequisite "(.+?)" for "(.+?)" is FAILED/);
  if (prereqMatch) return `${prereqMatch[2]} requires ${prereqMatch[1]} \u2014 must retake first`;
  const awaitMatch = txt.match(/(\d+) currently enrolled subject/);
  if (awaitMatch) return `${awaitMatch[1]} subject(s) still awaiting grading`;
  return txt;
}

function UndecidedModal({ request, onClose, onPreEnroll }) {
  const overlayRef = useRef(null);
  const rawResult = request.evaluation_result || {};
  const snapshot = rawResult.evaluator_submit || rawResult;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const nextColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "20%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "50%" },
    { key: "prerequisite", label: "Prereq", width: "15%", render: (s) => s.prerequisite ? s.prerequisite : "\u2014" },
    { key: "units", label: "Units", align: "right", width: "15%" },
  ], []);

  const nextSubjects = snapshot.next_semester_subjects || [];

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }} className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Undecided Evaluation</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="card p-5">
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
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Evaluator</span>
                <p className="font-semibold text-slate-800 mt-0.5">{request.evaluator_name || "N/A"}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Submitted</span>
                <p className="font-semibold text-slate-800 mt-0.5">{toPHDate(request.created_at)}</p>
              </div>
              {snapshot.undecided && (
              <div>
                <span className="text-amber-500 text-xs uppercase tracking-wide font-medium">Marked as</span>
                <p className="font-semibold text-amber-600 mt-0.5">Undecided</p>
              </div>
              )}
            </div>
          </div>

          {nextSubjects.length > 0 ? (
            <SubjectTable title="Next Semester Subjects" subjects={nextSubjects} columns={nextColumns} />
          ) : (
            <div className="card p-8 text-center text-slate-400 text-sm">No next semester subjects.</div>
          )}

          {snapshot.current_enrolled_subjects?.length > 0 && (
            <SubjectTable
              title="Current Enrolled Subjects"
              subjects={snapshot.current_enrolled_subjects}
              columns={[
                { key: "subject_code", label: "Code", width: "20%", className: "whitespace-nowrap" },
                { key: "subject_name", label: "Subject", width: "50%" },
                { key: "grade", label: "Grade", width: "15%" },
                { key: "units", label: "Units", align: "right", width: "15%" },
              ]}
            />
          )}

          {snapshot.gap_fillers?.length > 0 && (
            <SubjectTable
              title="Gap Fillers"
              subjects={snapshot.gap_fillers}
              columns={nextColumns}
            />
          )}

          {snapshot.special_class_subjects?.length > 0 && (
            <SubjectTable
              title="Special Class Subjects"
              subjects={snapshot.special_class_subjects}
              columns={nextColumns}
            />
          )}

          {snapshot.remaining_failed_subjects?.length > 0 && (
            <SubjectTable
              title="Failed Subjects"
              subjects={snapshot.remaining_failed_subjects}
              columns={[
                { key: "subject_code", label: "Code", width: "20%", className: "whitespace-nowrap" },
                { key: "subject_name", label: "Subject", width: "50%" },
                { key: "grade", label: "Grade", width: "15%" },
                { key: "units", label: "Units", align: "right", width: "15%" },
              ]}
            />
          )}

          {snapshot.recommendations?.length > 0 && (
            <div className="card p-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Evaluation Notes</h4>
              <div className="space-y-1">
                {snapshot.recommendations.map((r, i) => {
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

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => { onPreEnroll(request); onClose(); }}
              className="btn btn-primary btn-sm gap-1.5"
            >
              <Send size={14} /> Pre-Enroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUndecided() {
  const deleteOverlayRef = useRef(null);
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const timerRef = useRef(null);
  const { can } = usePermissions();

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (modal) setModal(null);
        else if (confirmDelete) setConfirmDelete(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, confirmDelete]);

  const fetchRequests = useCallback(async (pg) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/evaluations", { params: { page: pg, limit: 20, status: "UNDECIDED" } });
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

  const handlePreEnroll = async (request) => {
    try {
      await api.patch(`/api/admin/evaluations/${request.id}/pre-enroll`);
      fetchRequests(page);
    } catch (err) {
      setError(err.message || "Failed to pre-enroll");
    }
  };

  const executeDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/api/admin/evaluations/${id}`);
      fetchRequests(page);
    } catch (err) {
      setError(err.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const scheduleDelete = (id, name) => {
    let remaining = 3;
    setPendingDelete({ id, name, remaining });
    timerRef.current = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        setPendingDelete((prev) => prev ? { ...prev, remaining } : null);
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
        const targetId = id;
        setPendingDelete(null);
        executeDelete(targetId);
      }
    }, 1000);
  };

  const undoDelete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPendingDelete(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-700">
            Undecided Evaluations {!loading && <span className="text-slate-400 font-normal">({total})</span>}
          </h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Submitted</th>
                {can("enrolled-students.manage") && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((row) => (
                <tr key={row.id} onClick={() => setModal(row)} className="transition hover:bg-primary-50/40 cursor-pointer">
                  <td className="px-6 py-4 text-slate-700 font-mono">{row.student_number}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{row.first_name} {row.last_name}</td>
                  <td className="px-6 py-4 text-slate-700">{row.course_name || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-700">{row.evaluator_name || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-700">{toPHDate(row.created_at)}</td>
                  {can("enrolled-students.manage") && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); handlePreEnroll(row); }} className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors text-slate-400 hover:text-emerald-600 mr-1" title="Pre-Enroll">
                      <Send size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ ...row, step: 1 }); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                  )}
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No undecided evaluations.</td></tr>
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

      {confirmDelete?.step === 1 && (
        <div ref={deleteOverlayRef} onClick={(e) => { if (e.target === deleteOverlayRef.current && !deleting) setConfirmDelete(null); }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-2">Delete Undecided Evaluation</h3>
            <p className="text-sm text-slate-600 mb-5">
              Remove <span className="font-semibold">{confirmDelete.first_name} {confirmDelete.last_name}</span> from undecided evaluations?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="btn btn-ghost btn-sm">Cancel</button>
              <button onClick={() => setConfirmDelete({ ...confirmDelete, step: 2 })} className="btn btn-primary btn-sm">Continue</button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete?.step === 2 && (
        <div ref={deleteOverlayRef} onClick={(e) => { if (e.target === deleteOverlayRef.current && !deleting) setConfirmDelete(null); }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-2">Confirm Delete</h3>
            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to permanently delete <span className="font-semibold">{confirmDelete.first_name} {confirmDelete.last_name}</span>'s evaluation?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} disabled={deleting} className="btn btn-ghost btn-sm">Cancel</button>
              <button onClick={() => { const { id, first_name, last_name } = confirmDelete; setConfirmDelete(null); scheduleDelete(id, `${first_name} ${last_name}`); }} disabled={deleting} className="btn btn-danger btn-sm">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && <UndecidedModal request={modal} onClose={() => setModal(null)} onPreEnroll={handlePreEnroll} />}

      {pendingDelete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm">
          <span>Deleting <strong>{pendingDelete.name}</strong>... <span className="text-slate-400">({pendingDelete.remaining}s)</span></span>
          <button onClick={undoDelete} className="btn bg-white text-slate-900 hover:bg-slate-200 btn-sm font-semibold px-3">Undo</button>
        </div>
      )}
    </div>
  );
}
