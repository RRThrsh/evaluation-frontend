import { useEffect, useState } from "react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 15;

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function EnrollmentHistory() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/api/admin/enrollments/history")
      .then((d) => setEnrollments(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    const map = {
      ENROLLED: "bg-emerald-100 text-emerald-700",
      IRREGULAR_ENROLLED: "bg-purple-100 text-purple-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${map[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace(/_/g, " ")}</span>;
  };

  const totalPages = Math.max(1, Math.ceil(enrollments.length / PAGE_SIZE));
  const paginatedEnrollments = enrollments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enrollment History</h2>
          <p className="text-sm text-slate-500 mt-1">Completed and rejected enrollment requests</p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">{enrollments.length} records</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Number</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested By</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reviewed By</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No enrollment history yet</td>
                </tr>
              ) : (
                paginatedEnrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3 font-medium text-slate-800">{e.first_name} {e.last_name}</td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">{e.student_number}</td>
                    <td className="px-5 py-3">{statusBadge(e.status)}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">Year {e.year_level}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{e.requested_by_name || "—"}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{e.reviewed_by_name || "—"}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">{new Date(e.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
