import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Clock, User, FileText, Search, Send, CheckCircle } from "lucide-react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 10;

const SNAPSHOT_CONFIG = {
  evaluator_submit: { icon: Send, color: "text-blue-600", bg: "bg-blue-50", label: "Evaluator Submit" },
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

export default function Snapshots() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: PAGE_SIZE };
      if (filterType) params.type = filterType;
      const res = await api.get("/api/admin/snapshots", { params });
      const data = res.data || {};
      setSnapshots(data.snapshots || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, filterType]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => { setPage(1); }, [filterType]);

  const filtered = snapshots.filter((s) =>
    !search ||
    `${s.student_name || ""} ${s.student_number || ""} ${s.requested_by_name || ""} ${s.reviewed_by_name || ""} ${s.course_name || ""} ${s.course_code || ""}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const formatSnapshotData = (evalResult) => {
    if (!evalResult) return null;
    const data = typeof evalResult === "string" ? JSON.parse(evalResult) : evalResult;
    const { snapshot_type, ...rest } = data;
    return rest;
  };

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
        <p className="text-sm text-slate-400">{total} total</p>
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
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field text-sm w-auto">
            <option value="">All Types</option>
            {Object.entries(SNAPSHOT_CONFIG).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
          <AlertTriangle size={14} />{error}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((s) => {
          const evalResult = s.evaluation_result ? (typeof s.evaluation_result === "string" ? JSON.parse(s.evaluation_result) : s.evaluation_result) : null;
          const snapType = evalResult?.snapshot_type || "unknown";
          const snapData = formatSnapshotData(evalResult);
          const isExpanded = expanded === s.id;

          return (
            <div
              key={s.id}
              className={`card overflow-hidden transition-all cursor-pointer hover:shadow-md ${isExpanded ? "ring-2 ring-primary-200" : ""}`}
              onClick={() => setExpanded(isExpanded ? null : s.id)}
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
                      <span className="flex items-center gap-1"><Clock size={12} />{new Date(s.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && snapData && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50 space-y-3 text-sm" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Snapshot Type</p>
                      <p className="text-slate-700 font-medium">{snapType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Overall</p>
                      <p className="text-slate-700">{snapData.overall || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Next Sem Subjects</p>
                      <p className="text-slate-700">{snapData.next_semester_subjects?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Gap Fillers</p>
                      <p className="text-slate-700">{snapData.gap_fillers?.length || 0}</p>
                    </div>
                    {snapData.raw_student_subjects && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Raw Subjects (Snapshot)</p>
                        <p className="text-slate-700">{snapData.raw_student_subjects.length} records</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Status</p>
                      <p className="text-slate-700">{s.status}</p>
                    </div>
                  </div>

                  {snapData.recommendations?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Recommendations</p>
                      <ul className="space-y-1">
                        {snapData.recommendations.map((r, i) => (
                          <li key={i} className="text-slate-700 bg-white rounded-lg px-3 py-1.5 border border-slate-200">{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Possible Subjects</p>
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
                          {(snapData.next_semester_subjects || []).slice(0, 15).map((subj, i) => (
                            <tr key={i}>
                              <td className="px-3 py-1.5 font-mono text-slate-700">{subj.subject_code}</td>
                              <td className="px-3 py-1.5 text-slate-700 truncate max-w-[200px]">{subj.subject_name}</td>
                              <td className="px-3 py-1.5 text-slate-500">{subj.prerequisite || "\u2014"}</td>
                              <td className="px-3 py-1.5">{subj.is_retake ? <span className="text-amber-600 font-medium">Yes</span> : "No"}</td>
                            </tr>
                          ))}
                          {(snapData.next_semester_subjects || []).length > 15 && (
                            <tr>
                              <td colSpan={4} className="px-3 py-2 text-center text-slate-400">... and {(snapData.next_semester_subjects || []).length - 15} more</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {snapData.gap_fillers?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Gap Fillers</p>
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

                  {snapData.raw_student_subjects && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Raw Student Grades (at snapshot time)</p>
                      <pre className="text-xs text-slate-600 bg-white rounded-lg p-2.5 border border-slate-200 overflow-x-auto max-h-48">
                        {JSON.stringify(snapData.raw_student_subjects, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && !loading && (
          <div className="card p-12 text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No snapshots found.</p>
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
