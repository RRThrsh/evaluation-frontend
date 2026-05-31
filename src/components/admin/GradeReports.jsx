import { useState, useEffect, useCallback } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";

const PAGE_SIZE = 20;

export default function GradeReports() {
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get("/api/admin/courses").then((r) => {
      if (r.data?.courses) setCourses(r.data.courses);
    }).catch(() => {});
  }, []);

  const fetchReports = useCallback(async (pg) => {
    setLoading(true);
    setError("");
    try {
      const params = { page: pg, limit: PAGE_SIZE };
      if (courseId) params.course_id = courseId;
      if (yearLevel) params.year_level = yearLevel;
      if (semester) params.semester = semester;
      const res = await api.get("/api/admin/grade-reports", { params });
      setRows(res.data.rows || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [courseId, yearLevel, semester]);

  useEffect(() => { setPage(1); }, [courseId, yearLevel, semester]);

  useEffect(() => { fetchReports(page); }, [page, fetchReports]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-semibold text-sm text-slate-700">
            Grade Reports {!loading && <span className="text-slate-400 font-normal">({total})</span>}
          </h3>
          <div className="flex items-center gap-3">
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="input input-sm min-w-[140px]">
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.code || c.name}</option>
              ))}
            </select>
            <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="input input-sm min-w-[100px]">
              <option value="">All Years</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>{ordinal(y)} Year</option>
              ))}
            </select>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input input-sm min-w-[100px]">
              <option value="">All Semesters</option>
              {[1, 2, 3].map((s) => (
                <option key={s} value={s}>{s}{s === 1 ? "st" : s === 2 ? "nd" : "rd"} Sem</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Student No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Subject Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Subject</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide">Grade</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((r, i) => (
                <tr key={`${r.student_number}-${r.subject_code}-${i}`} className="transition hover:bg-primary-50/40">
                  <td className="px-6 py-3 text-slate-700 font-mono">{r.student_number}</td>
                  <td className="px-6 py-3 text-slate-800 font-medium">{r.last_name}, {r.first_name}</td>
                  <td className="px-6 py-3 text-slate-700">{r.course_code || r.course_name}</td>
                  <td className="px-6 py-3 text-slate-700">{ordinal(r.year_level)}</td>
                  <td className="px-6 py-3 text-slate-600 font-mono">{r.subject_code}</td>
                  <td className="px-6 py-3 text-slate-700 max-w-[200px] truncate" title={r.subject_name}>{r.subject_name}</td>
                  <td className="px-6 py-3 text-center font-semibold">{r.grade ?? "\u2014"}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`badge ${r.enrollment_status === "enrolled" ? "badge-green" : r.enrollment_status === "failed" ? "badge-red" : r.enrollment_status === "dropped" ? "badge-yellow" : "badge-gray"}`}>
                      {r.enrollment_status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">No grade records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
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
    </div>
  );
}

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}
