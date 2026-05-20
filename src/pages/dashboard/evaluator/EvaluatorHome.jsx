import { useState, useMemo } from "react";
import api from "../../../services/api";
import EvaluatorHeader from "../../../components/evaluator/EvaluatorHeader";

const YEAR_LEVELS = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };

const statusBadge = (status) =>
  `text-xs font-semibold px-2 py-0.5 rounded uppercase ${
    status === "APPROVED" || status === "ENROLLED" || status === "PASSED"
      ? "bg-emerald-100 text-emerald-700"
      : status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : status === "FAILED"
      ? "bg-red-100 text-red-700"
      : "bg-zinc-100 text-zinc-600"
  }`;

const overallBadge = (overall) =>
  overall === "qualified"
    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
    : overall === "conditional"
    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
    : "bg-red-100 text-red-700 border-red-300";

function StudentCard({ student }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-zinc-400 text-xs uppercase tracking-wide font-medium">Name</span>
            <p className="font-semibold text-zinc-800 mt-0.5">{student.full_name}</p>
          </div>
          <div>
            <span className="text-zinc-400 text-xs uppercase tracking-wide font-medium">Student No.</span>
            <p className="font-semibold text-zinc-800 mt-0.5">{student.student_number}</p>
          </div>
          <div>
            <span className="text-zinc-400 text-xs uppercase tracking-wide font-medium">Course</span>
            <p className="font-semibold text-zinc-800 mt-0.5">{student.course || "N/A"}</p>
          </div>
          <div>
            <span className="text-zinc-400 text-xs uppercase tracking-wide font-medium">Year Level</span>
            <p className="font-semibold text-zinc-800 mt-0.5">{YEAR_LEVELS[student.year_level] || `${student.year_level}th Year`}</p>
          </div>
        </div>
        {student.overall && (
          <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase border ${overallBadge(student.overall)}`}>
            {student.overall}
          </span>
        )}
      </div>
    </div>
  );
}

function SubjectTable({ title, subjects, columns, emptyMsg, rowClassName }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="px-5 py-3 border-b border-zinc-100">
        <h3 className="font-semibold text-sm text-zinc-700">
          {title} <span className="text-zinc-400 font-normal">({subjects.length})</span>
        </h3>
      </div>
      {subjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {columns.map((col) => (
                  <th key={col.key} style={col.width ? { width: col.width } : undefined} className={`px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide ${col.align === "right" ? "text-right" : ""} ${col.className || ""}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {subjects.map((s, i) => {
                const extra = typeof rowClassName === "function" ? rowClassName(s) : "";
                return (
                  <tr key={s.id ?? i} className={`transition hover:bg-indigo-50/40 ${extra}`}>
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-2.5 text-zinc-700 truncate ${col.align === "right" ? "text-right" : ""}`}>
                        {col.render ? col.render(s) : s[col.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-zinc-400 text-sm">{emptyMsg}</div>
      )}
    </div>
  );
}

export default function EvaluatorHome() {
  const [searchValue, setSearchValue] = useState("");
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState({ taken: [], available: [] });
  const [replacements, setReplacements] = useState([]);
  const [remainingFails, setRemainingFails] = useState([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const q = searchValue.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setStudent(null);
    setSubjects({ taken: [], available: [] });
    setReplacements([]);
    setRemainingFails([]);
    setBlockedCount(0);

    try {
      const lookupRes = await api.get(`/api/students/lookup/${encodeURIComponent(q)}`);
      const data = lookupRes.data;

      let courseName = "";
      let overall = null;
      let current = [];
      let next = [];
      let gaps = [];
      let remainingFailsData = [];
      let blocked = 0;
      try {
        const evalRes = await api.get(`/api/evaluator/students/${data.id}/evaluate`);
        courseName = evalRes.data?.student?.course || "";
        overall = evalRes.data?.overall || null;
        current = evalRes.data?.current_semester_subjects || [];
        next = evalRes.data?.next_semester_subjects || [];
        gaps = evalRes.data?.gap_fillers || [];
        remainingFailsData = evalRes.data?.remaining_failed_subjects || [];
        blocked = evalRes.data?.summary_extras?.blocked_count || 0;
      } catch {}

      setStudent({
        id: data.id,
        full_name: `${data.first_name} ${data.last_name}`,
        student_number: data.student_number,
        year_level: data.year_level,
        course: courseName,
        overall,
      });
      setSubjects({ taken: current, available: next });
      setReplacements(gaps);
      setRemainingFails(remainingFailsData);
      setBlockedCount(blocked);
    } catch (err) {
      setError(err.message || "Student not found");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const currentColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "15%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "45%" },
    { key: "grade", label: "Grade", align: "right", width: "15%", className: "whitespace-nowrap", render: (s) => s.grade || "—" },
    { key: "status", label: "Status", width: "25%", render: (s) => <span className={statusBadge(s.status)}>{s.status}</span> },
  ], []);

  const nextColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "15%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "45%" },
    { key: "prerequisite", label: "Prereq", width: "25%", render: (s) => {
      if (s.prerequisite) {
        const badge = s.prereq_failed ? "bg-red-100 text-red-700" : s.prereq_met ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700";
        const label = s.prereq_failed ? "FAILED" : s.prereq_met ? "OK" : "PENDING";
        return <span className={`text-xs font-semibold px-2 py-0.5 rounded ${badge}`}>{s.prerequisite} ({label})</span>;
      }
      return <span className="text-zinc-300">—</span>;
    }},
    { key: "is_retake", label: "", width: "15%", render: (s) => s.is_retake ? <span className="text-xs font-bold text-amber-600 uppercase">[RETAKE]</span> : null },
  ], []);

  const remainingColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "20%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "55%" },
    { key: "grade", label: "Grade", align: "right", width: "25%", className: "whitespace-nowrap", render: (s) => <span className="text-red-600 font-semibold">{s.grade || "—"}</span> },
  ], []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <EvaluatorHeader />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Search */}
        <div className="bg-white border rounded-xl shadow-sm p-4 sm:p-5">
          <label htmlFor="student-search" className="text-sm font-semibold text-zinc-700 mb-2 block">
            Search Student
          </label>
          <div className="flex gap-2">
            <input
              id="student-search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter student number..."
              className="flex-1 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !searchValue.trim()}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
              )}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {error}
          </div>
        )}

        {/* Student Info */}
        {student && <StudentCard student={student} />}

        {/* Subjects */}
        {student && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SubjectTable
                title="Current Semester Subjects"
                subjects={subjects.taken}
                columns={currentColumns}
                emptyMsg="No current semester subjects."
              />
            </div>
            <div className="space-y-6">
              <SubjectTable
                title="Possible Subjects (Next Semester)"
                subjects={subjects.available}
                columns={nextColumns}
                emptyMsg="No next semester subjects."
                rowClassName={(s) => s.prereq_failed ? "opacity-50 bg-zinc-50" : ""}
              />
              {blockedCount > 0 && (
                <div className="bg-white border border-amber-200 rounded-xl shadow-sm">
                  <div className="px-5 py-3 border-b border-amber-100 bg-amber-50/50 rounded-t-xl">
                    <h3 className="font-semibold text-sm text-amber-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                      Fill the Gap
                      {replacements[0]?.gap_year && (
                        <span className="text-xs font-normal text-amber-500">(Y{replacements[0].gap_year}S{replacements[0].gap_semester})</span>
                      )}
                    </h3>
                  </div>
                  <div className="p-4 text-sm text-zinc-600 border-b border-amber-100 bg-amber-50/20">
                    {blockedCount} subject{blockedCount > 1 ? "s" : ""} blocked by failed prerequisites — filling with {replacements.length} minor subject{replacements.length > 1 ? "s" : ""} from next year
                  </div>
                  {replacements.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm table-fixed">
                        <thead>
                          <tr className="border-b border-amber-100 bg-amber-50/30">
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide w-[18%]">Code</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide w-[48%]">Subject</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide w-[18%]">Type</th>
                            <th className="px-4 py-2.5 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide w-[16%]">Units</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-50">
                          {replacements.map((r, i) => (
                            <tr key={i} className="transition hover:bg-amber-50/40">
                              <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm font-semibold truncate">{r.subject_code}</td>
                              <td className="px-4 py-2.5 text-zinc-700 truncate">{r.subject_name}</td>
                              <td className="px-4 py-2.5"><span className="text-xs font-semibold px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-700">{r.subject_type}</span></td>
                              <td className="px-4 py-2.5 text-zinc-700 text-right">{r.units}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remaining Failed Subjects */}
        {student && remainingFails.length > 0 && (
          <div className="border-t border-zinc-200 pt-6">
            <SubjectTable
              title="Remaining Failed Subjects"
              subjects={remainingFails}
              columns={remainingColumns}
              emptyMsg="No remaining failed subjects."
            />
          </div>
        )}

        {/* Empty state */}
        {!student && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <p className="text-zinc-400 text-sm">Enter a student number to view their records</p>
          </div>
        )}
      </main>
    </div>
  );
}
