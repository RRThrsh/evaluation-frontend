import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 20;

const PERIOD_LABELS = {
  prelim: "Prelim",
  midterm: "Midterm",
  finals: "Finals",
  general_average: "General Average",
};

function computeGrade(exam, qar, examW, qarW) {
  if (exam == null || qar == null) return null;
  return ((parseFloat(exam) * examW + parseFloat(qar) * qarW) / (examW + qarW)).toFixed(2);
}

function EditableCell({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? "");

  useEffect(() => { setVal(value ?? ""); }, [value]);

  const save = () => { onSave(val === "" ? null : parseFloat(val)); setEditing(false); };

  if (!editing)
    return (
      <span
        className="cursor-pointer hover:bg-primary-50 px-2 py-1 rounded block min-h-[24px]"
        onClick={() => setEditing(true)}
        title="Click to edit"
      >
        {value != null ? value : "—"}
      </span>
    );

  return (
    <input
      type="number"
      step="0.01"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
      className="input-field w-20 text-sm px-2 py-1"
      autoFocus
    />
  );
}

export default function Grading({ defaultPeriod }) {
  const period = defaultPeriod || "prelim";
  const isGA = period === "general_average";

  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState("");
  const [allWeights, setAllWeights] = useState(null);
  const [page, setPage] = useState(1);

  const getWeights = (p) => {
    const map = {
      prelim: { exam: "exam_weight_prelim", qar: "qar_weight_prelim" },
      midterm: { exam: "exam_weight_midterm", qar: "qar_weight_midterm" },
      finals: { exam: "exam_weight_finals", qar: "qar_weight_finals" },
    };
    const keys = map[p] || map.prelim;
    return {
      exam: parseFloat(allWeights?.[keys.exam]) || 60,
      qar: parseFloat(allWeights?.[keys.qar]) || 40,
    };
  };

  const weights = getWeights(period);
  const gaDivider = parseFloat(allWeights?.general_average_divider) || 3;
  const gradeBonus = parseFloat(allWeights?.grade_bonus) || 0;
  const gradeFloor = parseFloat(allWeights?.grade_floor) || 0;

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
        if (cfgRes?.data) setAllWeights(cfgRes.data);
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
  useEffect(() => { setPage(1); }, [selectedSubject, selectedSection]);

  const handleUpdateGrade = async (gradeId, field, value) => {
    try {
      await api.put(`/api/admin/grades/${gradeId}`, { [field]: value });
      fetchGrades();
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  // Group by student_subject_id
  const studentRows = Object.values(
    grades.reduce((acc, g) => {
      if (!acc[g.student_subject_id]) acc[g.student_subject_id] = { ...g, periods: [] };
      acc[g.student_subject_id].periods.push(g);
      return acc;
    }, {})
  );

  const totalPages = Math.max(1, Math.ceil(studentRows.length / PAGE_SIZE));
  const paginatedRows = studentRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedSubjectObj = subjects.find((s) => s.id === selectedSubject);
  const periodLabel = PERIOD_LABELS[period];

  const getGrade = (periods, p) => {
    const g = periods.find((x) => x.period === p);
    const w = getWeights(p);
    if (!g) return null;
    const raw = parseFloat(computeGrade(g.exam_score, g.qar_score, w.exam, w.qar)) + gradeBonus;
    return Math.max(raw, gradeFloor).toFixed(2);
  };

  const getGA = (periods) => {
    const scores = ["prelim", "midterm", "finals"]
      .map((p) => getGrade(periods, p))
      .filter(Boolean);
    if (!scores.length) return null;
    const raw = scores.reduce((a, b) => a + parseFloat(b), 0) / gaDivider;
    return Math.max(raw, gradeFloor).toFixed(2);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">{periodLabel} Grades</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field w-full text-sm"
              disabled={loadingSubjects}
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
              <span className="text-slate-400 font-normal ml-2">({studentRows.length} students)</span>
            </h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Instructor", "Section", "Student No.", ...(!isGA ? ["Exam", "QAR"] : []), periodLabel].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedRows.map((row) => {
                const pg = row.periods.find((g) => g.period === period);
                const grade = isGA ? getGA(row.periods) : getGrade(row.periods, period);

                return (
                  <tr key={row.student_subject_id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-600 text-xs">{row.instructor_name || "—"}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{row.section_name || "—"}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium font-mono text-xs">{row.student_number}</td>
                    {!isGA && (
                      <>
                        <td className="px-4 py-3">
                          <EditableCell
                            value={pg?.exam_score}
                            onSave={(v) => pg && handleUpdateGrade(pg.grade_id, "exam_score", v)}
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {pg?.qar_score ?? "—"}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 font-semibold text-slate-700 text-xs">
                      {grade ?? "—"}
                    </td>
                  </tr>
                );
              })}
              {studentRows.length === 0 && !loading && selectedSubject && (
                <tr>
                  <td colSpan={isGA ? 4 : 6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No students found for this subject.
                  </td>
                </tr>
              )}
              {paginatedRows.length === 0 && studentRows.length > 0 && (
                <tr>
                  <td colSpan={isGA ? 4 : 6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No students on this page.
                  </td>
                </tr>
              )}
              {!selectedSubject && (
                <tr>
                  <td colSpan={isGA ? 4 : 6} className="px-6 py-12 text-center text-slate-400 text-sm">
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
          {!loading && studentRows.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
      </div>
    </div>
  );
}
