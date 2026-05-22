import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

function EnrolledModal({ request, onClose }) {
  const overlayRef = useRef(null);
  const [data, setData] = useState(null);
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
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [request.id]);

  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div ref={overlayRef} onClick={handleOverlay} className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Enrolled Student Details</h2>
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
              <div>
                <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Status</span>
                <p className="font-semibold text-slate-800 mt-0.5 capitalize">{request.status === "IRREGULAR_ENROLLED" ? "Irregular Enrolled" : "Enrolled"}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="inline-block w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : data?.subjects?.length > 0 ? (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="font-semibold text-sm text-slate-700">
                  Enrolled Subjects <span className="text-slate-400 font-normal">({data.subjects.length})</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Units</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.subjects.map((s, i) => (
                      <tr key={i} className="hover:bg-primary-50/40">
                        <td className="px-6 py-3 font-mono text-slate-700">{s.subject_code}</td>
                        <td className="px-6 py-3 text-slate-700">{s.subject_name}</td>
                        <td className="px-6 py-3">
                          <span className={`badge ${s.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>
                            {s.subject_type}
                          </span>
                          {s.is_gap_filler && <span className="badge badge-gray ml-1">Gap</span>}
                          {s.is_retake && <span className="badge badge-red ml-1">Retake</span>}
                        </td>
                        <td className="px-6 py-3 text-right text-slate-600">{s.units}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-400 text-sm">No subject data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EnrolledStudents() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ENROLLED");

  const fetchRequests = useCallback(async (pg) => {
    setLoading(true);
    setError("");
    try {
      const params = { page: pg, limit: 20, status: statusFilter || "ENROLLED" };
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
  }, [search, statusFilter]);

  useEffect(() => { fetchRequests(1); setPage(1); }, [fetchRequests]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    fetchRequests(p);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-sm text-slate-700 shrink-0">
            Enrolled Students {!loading && <span className="text-slate-400 font-normal">({total})</span>}
          </h3>
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by name or student number..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-xs" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field text-xs w-auto">
              <option value="ENROLLED">Enrolled</option>
              <option value="IRREGULAR_ENROLLED">Irregular Enrolled</option>
            </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">School Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Semester</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide">Fails</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Standing</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((row) => (
                <tr key={row.id} onClick={() => setModal(row)} className="transition hover:bg-primary-50/40 cursor-pointer">
                  <td className="px-6 py-4 text-slate-700 font-mono">{row.student_number}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{row.first_name} {row.last_name}</td>
                  <td className="px-6 py-4 text-slate-700">{row.course_code || row.course_name || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600">{row.year_level ? `${row.year_level}th` : "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600">{row.school_year || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600">{row.semester ? `Sem ${row.semester}` : "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-semibold ${(row.failed_subjects_count || 0) > 0 ? "text-red-500" : "text-emerald-500"}`}>
                      {row.failed_subjects_count ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${row.enrollment_status === "Irregular" ? "badge-red" : "badge-green"}`}>
                      {row.enrollment_status || "Regular"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-primary-600 font-medium">View</span>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-400 text-sm">No enrolled students.</td></tr>
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

      {modal && <EnrolledModal request={modal} onClose={() => setModal(null)} />}
    </div>
  );
}