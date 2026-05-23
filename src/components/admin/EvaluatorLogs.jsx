import { useState, useEffect, useCallback, useMemo } from "react";
import { AlertTriangle, Clock, User, FileText, CheckCircle, XCircle, Send, Eye, Search } from "lucide-react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  PENDING: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  APPROVED: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Approved" },
  REJECTED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Rejected" },
  FOR_ENROLLMENT: { icon: Send, color: "text-blue-600", bg: "bg-blue-50", label: "For Enrollment" },
  ENROLLED: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Enrolled" },
  IRREGULAR: { icon: Eye, color: "text-purple-600", bg: "bg-purple-50", label: "Irregular" },
  IRREGULAR_ENROLLED: { icon: Eye, color: "text-purple-600", bg: "bg-purple-50", label: "Irregular Enrolled" },
  PRE_ENROLLED: { icon: Send, color: "text-blue-600", bg: "bg-blue-50", label: "Pre-Enrolled" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      <Icon size={12} />{cfg.label}
    </span>
  );
}

export default function EvaluatorLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await api.get("/api/admin/evaluator-logs", { params });
      setLogs(res.data ?? []);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() =>
    logs.filter((log) =>
      !search ||
      `${log.student_name} ${log.student_number} ${log.requested_by_name || ""} ${log.reviewed_by_name || ""} ${log.course_name || ""} ${log.course_code || ""}`
        .toLowerCase().includes(search.toLowerCase())
    ), [logs, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedLogs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterStatus]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 pb-6">
        <h2 className="text-lg font-bold text-slate-900">Evaluator Activity Logs</h2>
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
        <h2 className="text-lg font-bold text-slate-900">Evaluator Activity Logs</h2>
        <p className="text-sm text-slate-400">{logs.length} total entries</p>
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
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field text-sm w-auto">
            <option value="">All Status</option>
            {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
          <AlertTriangle size={14} />{error}
        </div>
      )}

      <div className="space-y-3">
        {paginatedLogs.map((log) => {
          const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.PENDING;
          const Icon = cfg.icon;
          const isExpanded = expanded === log.id;
          const evalResult = log.evaluation_result ? (typeof log.evaluation_result === "string" ? JSON.parse(log.evaluation_result) : log.evaluation_result) : null;

          return (
            <div
              key={log.id}
              className={`card overflow-hidden transition-all cursor-pointer hover:shadow-md ${isExpanded ? "ring-2 ring-primary-200" : ""}`}
              onClick={() => setExpanded(isExpanded ? null : log.id)}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-full ${cfg.bg} ${cfg.color} shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-slate-800">{log.student_name}</span>
                      <span className="text-xs font-mono text-slate-400">#{log.student_number}</span>
                      <StatusBadge status={log.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      {log.course_name && <span>{log.course_name} ({log.course_code})</span>}
                      <span className="flex items-center gap-1"><User size={12} />{log.requested_by_name || "Unknown"}</span>
                      {log.reviewed_by_name && <span className="flex items-center gap-1"><CheckCircle size={12} />{log.reviewed_by_name}</span>}
                      <span className="flex items-center gap-1"><Clock size={12} />{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50 space-y-3 text-sm" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Created</p>
                      <p className="text-slate-700">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                    {log.evaluated_at && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Evaluated</p>
                        <p className="text-slate-700">{new Date(log.evaluated_at).toLocaleString()}</p>
                      </div>
                    )}
                    {log.updated_at !== log.created_at && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Last Updated</p>
                        <p className="text-slate-700">{new Date(log.updated_at).toLocaleString()}</p>
                      </div>
                    )}
                    {log.staff_viewed_at && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Staff Viewed</p>
                        <p className="text-slate-700">{new Date(log.staff_viewed_at).toLocaleString()}</p>
                      </div>
                    )}
                    {log.school_year && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">School Year</p>
                        <p className="text-slate-700">{log.school_year}</p>
                      </div>
                    )}
                    {log.semester && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Semester</p>
                        <p className="text-slate-700">{log.semester}</p>
                      </div>
                    )}
                  </div>

                  {log.reason && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Reason</p>
                      <p className="text-slate-700 bg-white rounded-lg p-2.5 border border-slate-200">{log.reason}</p>
                    </div>
                  )}

                  {evalResult && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Evaluation Result</p>
                      <pre className="text-xs text-slate-600 bg-white rounded-lg p-2.5 border border-slate-200 overflow-x-auto max-h-48">
                        {JSON.stringify(evalResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {paginatedLogs.length === 0 && (
          <div className="card p-12 text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No evaluator activity found.</p>
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}