import { useState, useEffect, useCallback, useMemo } from "react";
import { AlertTriangle, Clock, User, FileText, Search, CheckCircle, X } from "lucide-react";
import api from "../../services/api";
import Pagination from "../common/Pagination";
import { toPHString } from "../../utils/date";

const PAGE_SIZE = 10;

const SNAPSHOT_CONFIG = {
  evaluator_submit: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50", label: "Evaluator Submit" },
  admin_pre_enroll: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Admin Pre-Enroll" },
};

function SnapshotTypeBadge({ type }) {
  const cfg = SNAPSHOT_CONFIG[type] || { icon: FileText, color: "text-slate-600", bg: "bg-slate-100", label: type || "Unknown" };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      <Icon size={12} />{cfg.label}
    </span>
  );
}

function getEvalResult(raw) {
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

function getSnapshotData(evalResult) {
  if (!evalResult) return null;
  // New nested format: data is under a type key
  if (evalResult.admin_pre_enroll) return evalResult.admin_pre_enroll;
  if (evalResult.evaluator_submit) return evalResult.evaluator_submit;
  // Legacy format: snapshot_type is at root level
  return evalResult;
}

function getSnapshotType(evalResult) {
  if (!evalResult) return "unknown";
  if (evalResult.admin_pre_enroll) return "admin_pre_enroll";
  if (evalResult.evaluator_submit) return "evaluator_submit";
  return evalResult.snapshot_type || "unknown";
}

function SnapshotDetailModal({ snapshot, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!snapshot) return null;

  const evalResult = getEvalResult(snapshot.evaluation_result);
  const snapType = getSnapshotType(evalResult);
  const snapData = getSnapshotData(evalResult);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-3xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{snapshot.student_name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">#{snapshot.student_number}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Snapshot Type</p>
            <SnapshotTypeBadge type={snapType} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Overall</p>
            <p className="text-slate-700 font-semibold">{snapData?.overall || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Course</p>
            <p className="text-slate-700">{snapshot.course_name || "\u2014"} {snapshot.course_code ? `(${snapshot.course_code})` : ""}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Requested By</p>
            <p className="text-slate-700">{snapshot.requested_by_name || "Unknown"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Reviewed By</p>
            <p className="text-slate-700">{snapshot.reviewed_by_name || "\u2014"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Snapshot Date</p>
            <p className="text-slate-700">{toPHString(snapshot.updated_at)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Next Sem Subjects</p>
            <p className="text-slate-700">{snapData?.next_semester_subjects?.length || 0}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Gap Fillers</p>
            <p className="text-slate-700">{snapData?.gap_fillers?.length || 0}</p>
          </div>
          {snapData?.raw_student_subjects && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Raw Subjects (Snapshot)</p>
              <p className="text-slate-700">{snapData.raw_student_subjects.length} records</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Status</p>
            <p className="text-slate-700">{snapshot.status}</p>
          </div>
        </div>

        {snapData?.recommendations?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Recommendations</p>
            <ul className="space-y-1">
              {snapData.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">{r}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Possible Subjects ({snapData?.next_semester_subjects?.length || 0})</p>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Code</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Subject</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Prereq</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Retake</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(snapData?.next_semester_subjects || []).map((subj, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1.5 font-mono text-slate-700">{subj.subject_code}</td>
                    <td className="px-3 py-1.5 text-slate-700 truncate max-w-[220px]">{subj.subject_name}</td>
                    <td className="px-3 py-1.5 text-slate-500">{subj.prerequisite || "\u2014"}</td>
                    <td className="px-3 py-1.5">{subj.is_retake ? <span className="text-amber-600 font-medium">Yes</span> : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {snapData?.gap_fillers?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Gap Fillers ({snapData.gap_fillers.length})</p>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2 text-left font-medium text-slate-500">Code</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-500">Subject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {snapData.gap_fillers.map((gf, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5 font-mono text-slate-700">{gf.subject_code}</td>
                      <td className="px-3 py-1.5 text-slate-700">{gf.subject_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {snapData?.raw_student_subjects && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Raw Student Grades (at snapshot time)</p>
            <pre className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200 overflow-x-auto max-h-52">
              {JSON.stringify(snapData.raw_student_subjects, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Snapshots() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/snapshots", { params: { limit: 1000 } });
      const data = res.data || {};
      setSnapshots(data.snapshots || []);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => { setPage(1); }, [search, courseFilter]);

  const courses = useMemo(() => {
    const map = {};
    snapshots.forEach((s) => {
      if (s.course_name && s.course_code) map[s.course_code] = s.course_name;
    });
    return Object.entries(map).sort((a, b) => a[1].localeCompare(b[1]));
  }, [snapshots]);

  const filtered = useMemo(() =>
    snapshots.filter((s) => {
      if (courseFilter && s.course_code !== courseFilter) return false;
      if (search && !`${s.student_name || ""} ${s.student_number || ""} ${s.requested_by_name || ""} ${s.reviewed_by_name || ""} ${s.course_name || ""} ${s.course_code || ""}`
          .toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }), [snapshots, search, courseFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 pb-6">
        <h2 className="text-lg font-bold text-slate-900">Evaluation Snapshots</h2>
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-4"><div className="w-10 h-10 bg-slate-200 rounded-full" /><div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 rounded w-1/3" /><div className="h-3 bg-slate-100 rounded w-2/3" /></div></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Evaluation Snapshots</h2>
        <p className="text-sm text-slate-400">{filtered.length} total</p>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, evaluator, course..."
              className="input-field w-full text-sm pl-9"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="">All Courses</option>
            {courses.map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
          </select>


        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
          <AlertTriangle size={14} />{error}
        </div>
      )}

      <div className="space-y-3">
        {paginated.map((s) => {
          const evalResult = getEvalResult(s.evaluation_result);
          const snapType = getSnapshotType(evalResult);

          return (
            <div
              key={s.id}
              className="card overflow-hidden transition-all cursor-pointer hover:shadow-md"
              onClick={() => setSelectedSnapshot(s)}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-full shrink-0 ${SNAPSHOT_CONFIG[snapType]?.bg || "bg-slate-100"} ${SNAPSHOT_CONFIG[snapType]?.color || "text-slate-600"}`}>
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-slate-800">{s.student_name}</span>
                      <span className="text-xs font-mono text-slate-400">#{s.student_number}</span>
                      <SnapshotTypeBadge type={snapType} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      {s.course_name && <span>{s.course_name} ({s.course_code})</span>}
                      <span className="flex items-center gap-1"><User size={12} />{s.requested_by_name || "Unknown"}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{toPHString(s.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {paginated.length === 0 && !loading && (
          <div className="card p-12 text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No snapshots found.</p>
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {selectedSnapshot && (
        <SnapshotDetailModal snapshot={selectedSnapshot} onClose={() => setSelectedSnapshot(null)} />
      )}
    </div>
  );
}
