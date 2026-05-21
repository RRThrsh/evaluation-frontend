import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import api from "../../services/api";

function computePeriodGrade(exam, qar, examWeight, qarWeight) {
  if (exam == null || qar == null) return null;
  const total = parseFloat(exam) * examWeight + parseFloat(qar) * qarWeight;
  return (total / (examWeight + qarWeight)).toFixed(2);
}

function EditableCell({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? "");

  const handleSave = () => {
    onSave(val === "" ? null : parseFloat(val));
    setEditing(false);
  };

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:bg-primary-50 px-2 py-1 rounded block min-h-[24px]"
        onClick={() => setEditing(true)}
        title="Click to edit"
      >
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
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") setEditing(false);
      }}
      className="input-field w-20 text-sm px-2 py-1"
      autoFocus
    />
  );
}

function PeriodCell({ studentGrades, examWeight, qarWeight }) {
  const [selected, setSelected] = useState("general_average");

  const getGrade = (period) => {
    if (period === "general_average") {
      const scores = ["prelim", "midterm", "finals"]
        .map((p) => {
          const g = studentGrades.find((gr) => gr.period === p);
          return g ? computePeriodGrade(g.exam_score, g.qar_score, examWeight, qarWeight) : null;
        })
        .filter((v) => v !== null);
      if (scores.length === 0) return null;
      return (scores.reduce((a, b) => a + parseFloat(b), 0) / scores.length).toFixed(2);
    }
    const g = studentGrades.find((gr) => gr.period === period);
    if (!g) return null;
    return computePeriodGrade(g.exam_score, g.qar_score, examWeight, qarWeight);
  };

  const labels = { prelim: "Prelim", midterm: "Midterm", finals: "Finals", general_average: "General Average" };
  const displayGrade = getGrade(selected);

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border border-slate-300 bg-white rounded-md px-2 py-1 text-xs font-medium text-slate-700 shadow-sm cursor-pointer min-w-[110px]"
      >
        {["prelim", "midterm", "finals", "general_average"].map((p) => (
          <option key={p} value={p}>{labels[p]}</option>
        ))}
      </select>
      <span className="font-bold text-sm text-slate-800 min-w-[36px]">{displayGrade != null ? displayGrade : "\u2014"}</span>
    </div>
  );
}

export default function Grading() {
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState("");
  const [examWeight, setExamWeight] = useState(60);
  const [qarWeight, setQarWeight] = useState(40);

  useEffect(() => {
    (async () => {
      try {
        const [subjRes, secRes, cfgRes] = await Promise.all([
          api.get("/api/admin/subjects"),
          api.get("/api/admin/sections"),
          api.get("/api/config"),
        ]);
        setSubjects(subjRes.data ?? []);
        setSections(secRes.data ?? []);
        if (cfgRes?.data) {
          setExamWeight(parseFloat(cfgRes.data.exam_weight) || 60);
          setQarWeight(parseFloat(cfgRes.data.qar_weight) || 40);
        }
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
      const params = {};
      if (selectedSection) params.section_id = selectedSection;
      const res = await api.get(`/api/admin/subjects/${selectedSubject}/grades`, { params });
      setGrades(res.data ?? []);
    } catch (err) {
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, selectedSection]);

  useEffect(() => { fetchGrades(); }, [fetchGrades]);

  const handleUpdateGrade = async (gradeId, field, value) => {
    try {
      await api.put(`/api/admin/grades/${gradeId}`, { [field]: value });
      fetchGrades();
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  const grouped = {};
  grades.forEach((g) => {
    if (!grouped[g.student_subject_id]) {
      grouped[g.student_subject_id] = { ...g, periods: [] };
    }
    grouped[g.student_subject_id].periods.push(g);
  });
  const studentRows = Object.values(grouped);

  const selectedSubjectObj = subjects.find((s) => s.id === selectedSubject);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Grading</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field w-full text-sm"
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subject_code} - {s.subject_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field w-full text-sm"
            >
              <option value="">All Sections</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  Section {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {selectedSubject && selectedSubjectObj && (
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-sm text-slate-700">
              {selectedSubjectObj.subject_code} - {selectedSubjectObj.subject_name}
              <span className="text-slate-400 font-normal ml-2">
                ({studentRows.length} students)
              </span>
            </h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Student No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Section
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Instructor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Exam
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  QAR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentRows.map((row) => {
                const prelim = row.periods.find((g) => g.period === "prelim");
                const midterm = row.periods.find((g) => g.period === "midterm");
                const finals = row.periods.find((g) => g.period === "finals");

                return (
                  <tr key={row.student_subject_id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-800 font-medium font-mono text-xs">
                      {row.student_number}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{row.section_name || "\u2014"}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{row.instructor_name || "\u2014"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <EditableCell
                          value={prelim?.exam_score}
                          onSave={(v) => prelim && handleUpdateGrade(prelim.grade_id, "exam_score", v)}
                        />
                        <span className="text-slate-300 mx-0.5">|</span>
                        <EditableCell
                          value={midterm?.exam_score}
                          onSave={(v) => midterm && handleUpdateGrade(midterm.grade_id, "exam_score", v)}
                        />
                        <span className="text-slate-300 mx-0.5">|</span>
                        <EditableCell
                          value={finals?.exam_score}
                          onSave={(v) => finals && handleUpdateGrade(finals.grade_id, "exam_score", v)}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">P | M | F</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <EditableCell
                          value={prelim?.qar_score}
                          onSave={(v) => prelim && handleUpdateGrade(prelim.grade_id, "qar_score", v)}
                        />
                        <span className="text-slate-300 mx-0.5">|</span>
                        <EditableCell
                          value={midterm?.qar_score}
                          onSave={(v) => midterm && handleUpdateGrade(midterm.grade_id, "qar_score", v)}
                        />
                        <span className="text-slate-300 mx-0.5">|</span>
                        <EditableCell
                          value={finals?.qar_score}
                          onSave={(v) => finals && handleUpdateGrade(finals.grade_id, "qar_score", v)}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">P | M | F</div>
                    </td>
                    <td className="px-4 py-3">
                      <PeriodCell
                        studentGrades={row.periods}
                        examWeight={examWeight}
                        qarWeight={qarWeight}
                        onUpdateGrade={handleUpdateGrade}
                      />
                    </td>
                  </tr>
                );
              })}
              {studentRows.length === 0 && !loading && selectedSubject && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No students found for this subject.
                  </td>
                </tr>
              )}
              {!selectedSubject && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Select a subject to view grades.
                  </td>
                </tr>
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
