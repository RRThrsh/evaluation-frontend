import { useState, useEffect } from "react";
import api from "../../services/api";

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

const SEM_LABELS = { 1: "Sem 1", 2: "Sem 2", 3: "Sem 3" };

function GradeBadge({ grade }) {
  if (!grade) return <span className="badge badge-yellow">INC</span>;
  return <span className="badge badge-green">{grade}</span>;
}

export default function AcademicRecord({ studentId, curriculum: propCurriculum, loading: propLoading, onBack, student }) {
  const [data, setData] = useState(propCurriculum || []);
  const [loading, setLoading] = useState(!!propLoading);

  useEffect(() => {
    if (studentId && !propCurriculum) {
      setLoading(true);
      api.get(`/api/admin/students/${studentId}/curriculum`)
        .then((d) => setData(d.data ?? []))
        .catch(() => setData([]))
        .finally(() => setLoading(false));
    } else if (propCurriculum) {
      setData(propCurriculum);
    }
  }, [studentId, propCurriculum]);

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">Academic Record</span>
          {onBack && <button onClick={onBack} className="btn btn-ghost btn-sm">Back</button>}
        </div>
        <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">Academic Record</span>
          {onBack && <button onClick={onBack} className="btn btn-ghost btn-sm">Back</button>}
        </div>
        <div className="p-10 text-center text-sm text-slate-400">No curriculum found</div>
      </div>
    );
  }

  const byYearSem = {};
  for (const sub of data) {
    const key = `${sub.year_level}-${sub.semester}`;
    if (!byYearSem[key]) byYearSem[key] = { year: sub.year_level, sem: sub.semester, subjects: [] };
    byYearSem[key].subjects.push(sub);
  }
  const sections = Object.values(byYearSem).sort((a, b) => a.year - b.year || a.sem - b.sem);

  const isPassed = (g) => {
    if (!g) return false;
    const n = parseFloat(g);
    if (!isNaN(n)) return true;
    return !["F", "W", "D"].includes(g.toUpperCase());
  };

  const isFailed = (g) => {
    if (!g) return false;
    return ["F", "W", "D"].includes(g.toUpperCase());
  };

  let totalUnits = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalInc = 0;

  for (const sub of data) {
    if (!sub.enrollment_status) continue;
    totalUnits += Number(sub.units || 0);
    if (isPassed(sub.grade)) totalPassed++;
    else if (isFailed(sub.grade)) totalFailed++;
    else totalInc++;
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-slate-800">Academic Record</span>
          {student && <span className="text-xs text-slate-400 ml-2">{student.student_number} — {student.first_name} {student.last_name}</span>}
        </div>
        {onBack && <button onClick={onBack} className="btn btn-ghost btn-sm">Back</button>}
      </div>

      <div>
        {sections.map((sec) => (
          <div key={`${sec.year}-${sec.sem}`}>
            <div className="px-5 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{ordinal(sec.year)} Year — {SEM_LABELS[sec.sem] || `Sem ${sec.sem}`}</span>
              <span className="text-[10px] text-slate-400">
                {sec.subjects.filter((s) => s.grade).length}/{sec.subjects.length} graded
              </span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="table-header text-slate-400">
                <tr>
                  <th className="px-5 py-2">Code</th>
                  <th className="px-5 py-2">Subject</th>
                  <th className="px-5 py-2">Type</th>
                  <th className="px-5 py-2 text-center">Units</th>
                  <th className="px-5 py-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sec.subjects.map((sub) => (
                  <tr key={sub.id || sub.subject_code} className="table-row">
                    <td className="table-cell font-mono text-slate-700">{sub.subject_code}</td>
                    <td className="table-cell text-slate-700">
                      {sub.subject_name}
                      {sub.prerequisite_name && <span className="text-[10px] text-slate-400 ml-1">(prereq: {sub.prerequisite_name})</span>}
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${sub.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>{sub.subject_type}</span>
                    </td>
                    <td className="table-cell text-center text-slate-600">{sub.units}</td>
                    <td className="table-cell text-center">
                      {sub.enrollment_status ? <GradeBadge grade={sub.grade} /> : <span className="text-[10px] text-slate-300 italic">Not taken</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-6 text-xs">
        <span className="text-slate-500">Total Units: <strong className="text-slate-800">{totalUnits}</strong></span>
        <span className="text-emerald-600">Passed: <strong>{totalPassed}</strong></span>
        {totalFailed > 0 && <span className="text-red-600">Failed: <strong>{totalFailed}</strong></span>}
        {totalInc > 0 && <span className="text-amber-600">INC: <strong>{totalInc}</strong></span>}
      </div>
    </div>
  );
}
