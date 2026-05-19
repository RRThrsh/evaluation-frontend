import { useEffect, useState } from "react";
import api from "../../services/api";
import exportToExcel from "../../utils/exportToExcel";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function GradeReports() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ course_id: "", year_level: "", semester: "" });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/api/admin/courses").then((d) => setCourses(d.data ?? [])).catch(() => {});
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.course_id) params.set("course_id", filters.course_id);
      if (filters.year_level) params.set("year_level", filters.year_level);
      if (filters.semester) params.set("semester", filters.semester);
      const res = await api.get(`/api/admin/reports/grades?${params.toString()}`);
      setData(res);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!data?.data?.length) return;
    const rows = data.data.map((r) => ({
      "Student No": r.student_number,
      "Name": `${r.first_name} ${r.last_name}`,
      "Year": r.year_level,
      "Course": `${r.course_code} - ${r.course_name}`,
      "Subject": r.subject_code,
      "Subject Name": r.subject_name,
      "Grade": r.grade || "—",
      "Status": r.enrollment_status,
    }));
    exportToExcel(rows, "grade-report");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Grade Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Generate and export grade reports by course, year, and semester</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Course</label>
            <select value={filters.course_id} onChange={(e) => setFilters({ ...filters, course_id: e.target.value })}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[180px]">
              <option value="">All Courses</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Year</label>
            <select value={filters.year_level} onChange={(e) => setFilters({ ...filters, year_level: e.target.value })}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">All Years</option>
              {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{y}st Year</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Semester</label>
            <select value={filters.semester} onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">All</option>
              <option value="1">1st</option>
              <option value="2">2nd</option>
            </select>
          </div>
          <button onClick={loadReport} disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Loading..." : "Generate Report"}
          </button>
          {data?.data?.length > 0 && (
            <button onClick={handleExport}
              className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition">
              Export Excel
            </button>
          )}
        </div>
      </div>

      {data && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">{data.count || data.data?.length || 0} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase text-slate-500">Student No</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase text-slate-500">Name</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase text-slate-500">Course</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase text-slate-500">Subject</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase text-slate-500">Grade</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data?.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">No records found</td></tr>
                ) : data.data?.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-xs font-mono text-slate-600">{r.student_number}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-800">{r.first_name} {r.last_name}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{r.course_code}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{r.subject_code} - {r.subject_name}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-semibold ${r.grade && Number(r.grade) >= 75 ? "text-emerald-600" : r.grade ? "text-red-600" : "text-slate-400"}`}>{r.grade || "—"}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">{r.enrollment_status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-red-500`}>{toast.msg}</div>
      )}
    </div>
  );
}
