import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import api from "../../services/api";

const PERIOD_OPTIONS = [
  { value: "prelim", label: "Prelim" },
  { value: "midterm", label: "Midterm" },
  { value: "finals", label: "Finals" },
  { value: "total", label: "Total" },
];

const VIEW_OPTIONS = [
  { value: "exam", label: "Exam" },
  { value: "qar", label: "QAR" },
  { value: "grades", label: "Grades" },
];

function computePeriodGrade(exam, qar) {
  if (exam == null || qar == null) return null;
  return ((parseFloat(exam) + parseFloat(qar)) / 2).toFixed(2);
}

function EditableCell({ value, onSave, type = "number" }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? "");

  const handleSave = () => {
    onSave(val === "" ? null : parseFloat(val));
    setEditing(false);
  };

  if (!editing) {
    return (
      <span className="cursor-pointer hover:bg-primary-50 px-2 py-1 rounded block min-h-[24px]" onClick={() => setEditing(true)} title="Click to edit">
        {value != null ? value : "\u2014"}
      </span>
    );
  }

  return (
    <input
      type="number"
      step="0.01"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
      className="input-field w-20 text-sm px-2 py-1"
      autoFocus
    />
  );
}

export default function Grading() {
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [period, setPeriod] = useState("prelim");
  const [view, setView] = useState("exam");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [subjRes, secRes] = await Promise.all([
          api.get("/api/admin/subjects"),
          api.get("/api/admin/sections"),
        ]);
        setSubjects(subjRes.data ?? []);
        setSections(secRes.data ?? []);
      } catch {} finally {
        setLoadingSubjects(false);
      }
    })();
  }, []);

  const fetchGrades = useCallback(async () => {
    if (!selectedSubject) return;
    setLoading(true);
    setError("");
    try {
      const params = { period };
      if (selectedSection) params.section_id = selectedSection;
      const res = await api.get(`/api/admin/subjects/${selectedSubject}/grades`, { params });
      let data = res.data ?? [];
      if (period === "total") {
        const grouped = {};
        data.forEach((g) => {
          if (!grouped[g.student_subject_id]) {
            grouped[g.student_subject_id] = { ...g, periods: {} };
          }
          grouped[g.student_subject_id].periods[g.period] = { exam: g.exam_score, qar: g.qar_score };
        });
        data = Object.values(grouped).map((g) => {
          const periods = ["prelim", "midterm", "finals"];
          const scores = periods.map((p) => g.periods[p]);
          const total = scores.reduce((sum, s) => {
            if (s?.exam != null && s?.qar != null) return sum + ((s.exam + s.qar) / 2);
            return sum;
          }, 0);
          const count = scores.filter((s) => s?.exam != null && s?.qar != null).length;
          return { ...g, total_grade: count > 0 ? (total / count).toFixed(2) : null };
        });
      }
      setGrades(data);
    } catch (err) {
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, selectedSection, period]);

  useEffect(() => { fetchGrades(); }, [fetchGrades]);

  const handleUpdateGrade = async (gradeId, field, value) => {
    try {
      await api.put(`/api/admin/grades/${gradeId}`, { [field]: value });
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  const selectedSubjectObj = subjects.find((s) => s.id === selectedSubject);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Grading</h2>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="input-field w-full text-sm">
              <option value="">-- Select Subject --</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.subject_code} - {s.subject_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Section</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="input-field w-full text-sm">
              <option value="">All Sections</option>
              {sections.map((s) => <option key={s.id} value={s.id}>Section {s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field w-full text-sm">
              {PERIOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">View</label>
            <select value={view} onChange={(e) => setView(e.target.value)} className="input-field w-full text-sm">
              {VIEW_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
          <AlertTriangle size={16} />{error}
        </div>
      )}

      <div className="card overflow-hidden">
        {selectedSubject && selectedSubjectObj && (
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-sm text-slate-700">
              {selectedSubjectObj.subject_code} - {selectedSubjectObj.subject_name}
              <span className="text-slate-400 font-normal ml-2">({grades.length} students)</span>
            </h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Student No.</th>
                {view === "exam" && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Exam</th>}
                {view === "qar" && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">QAR</th>}
                {view === "grades" && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">{period === "total" ? "Total Grade" : "Period Grade"}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {grades.map((g, i) => (
                <tr key={g.student_subject_id ?? i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-700">{g.section_name || "\u2014"}</td>
                  <td className="px-6 py-4 text-slate-700">{g.instructor_name || "\u2014"}</td>
                  <td className="px-6 py-4 text-slate-700">{g.course_code || "\u2014"}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium font-mono">{g.student_number}</td>
                  {view === "exam" && (
                    <td className="px-6 py-4">
                      {g.grade_id ? (
                        <EditableCell value={g.exam_score} onSave={(v) => handleUpdateGrade(g.grade_id, "exam_score", v)} />
                      ) : (
                        <span className="text-slate-300">\u2014</span>
                      )}
                    </td>
                  )}
                  {view === "qar" && (
                    <td className="px-6 py-4">
                      {g.grade_id ? (
                        <EditableCell value={g.qar_score} onSave={(v) => handleUpdateGrade(g.grade_id, "qar_score", v)} />
                      ) : (
                        <span className="text-slate-300">\u2014</span>
                      )}
                    </td>
                  )}
                  {view === "grades" && (
                    <td className="px-6 py-4 font-semibold">
                      {period === "total"
                        ? g.total_grade ?? "\u2014"
                        : g.grade_id
                          ? computePeriodGrade(g.exam_score, g.qar_score) ?? "\u2014"
                          : "\u2014"
                      }
                    </td>
                  )}
                </tr>
              ))}
              {grades.length === 0 && !loading && selectedSubject && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No students found for this subject.</td></tr>
              )}
              {!selectedSubject && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">Select a subject to view grades.</td></tr>
              )}
            </tbody>
          </table>
          {loading && (
            <div className="flex justify-center py-6">
              <span className="inline-block w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
