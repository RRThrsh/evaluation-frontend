import { useState, useMemo, useRef, useCallback } from "react";
import { Search, AlertTriangle, CheckCircle, X, Undo2, Plus } from "lucide-react";
import api from "../../../services/api";
import EvaluatorHeader from "../../../components/evaluator/EvaluatorHeader";

const YEAR_LEVELS = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };
const SEM_LABELS = { 1: "1st Semester", 2: "2nd Semester" };

function prevSem(year, sem) {
  if (sem === 1) return { year: Math.max(1, year - 1), sem: 2 };
  return { year, sem: 1 };
}

const gradeBadge = (grade) => {
  if (!grade || grade === "INC") return "badge badge-yellow";
  const num = Number(grade);
  if (!isNaN(num) && num < 75) return "badge badge-red";
  return "badge badge-green";
};

function StudentCard({ student, onSubmit, submitting, hasPendingRequest, pendingRequestedBy }) {
  const evalYear = student.next_semester === 1 ? Number(student.year_level) + 1 : Number(student.year_level);
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 text-sm flex-1">
          <div>
            <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Name</span>
            <p className="font-semibold text-slate-800 mt-0.5">{student.full_name}</p>
          </div>
          <div>
            <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Student No.</span>
            <p className="font-semibold text-slate-800 mt-0.5">{student.student_number}</p>
          </div>
          <div>
            <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Program</span>
            <p className="font-semibold text-slate-800 mt-0.5">{student.course || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {hasPendingRequest ? (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-[220px] text-right leading-relaxed">
              Already submitted by <span className="font-semibold">{pendingRequestedBy || "another evaluator"}</span>
            </div>
          ) : (
            <button onClick={onSubmit} disabled={submitting} className="btn btn-primary btn-sm">
              {submitting ? "Submitting..." : "Submit Evaluation"}
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-center gap-0">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="text-slate-400 text-[10px] uppercase tracking-wide font-medium mt-2">previous</span>
            <p className="font-semibold text-slate-500 text-xs mt-0.5">{YEAR_LEVELS[student.year_level] || `${student.year_level}th Year`} {SEM_LABELS[student.current_semester]}</p>
          </div>
          <div className="w-12 h-0.5 bg-slate-200 relative mx-2 mt-0">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-slate-300 text-sm">→</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary-600" />
            <span className="text-primary-600 text-[10px] uppercase tracking-wide font-medium mt-2">evaluating semester</span>
            <p className="font-semibold text-primary-700 text-xs mt-0.5">{YEAR_LEVELS[evalYear] || `${evalYear}th Year`} {SEM_LABELS[student.next_semester]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const THEMES = {
  green: { card: "border-emerald-200", head: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", count: "text-emerald-500", thText: "text-emerald-600", thRow: "bg-emerald-50/50 border-emerald-100" },
  blue:  { card: "border-blue-200",    head: "bg-blue-50 border-blue-100",       text: "text-blue-700",    count: "text-blue-500",    thText: "text-blue-600",    thRow: "bg-blue-50/50 border-blue-100" },
  amber: { card: "border-amber-200",   head: "bg-amber-50 border-amber-100",     text: "text-amber-700",   count: "text-amber-500",   thText: "text-amber-600",   thRow: "bg-amber-50/50 border-amber-100" },
  red:   { card: "border-red-200",     head: "bg-red-50 border-red-100",         text: "text-red-700",     count: "text-red-500",     thText: "text-red-600",     thRow: "bg-red-50/50 border-red-100" },
};

function SubjectTable({ title, subjects, columns, emptyMsg, rowClassName, color = "green", headerRight }) {
  const t = THEMES[color] || THEMES.green;
  return (
    <div className={`card overflow-hidden border ${t.card}`}>
      <div className={`px-5 py-3 border-b ${t.head} flex items-center justify-between`}>
        <h3 className={`font-semibold text-sm ${t.text}`}>
          {title} <span className={`font-normal ${t.count}`}>({subjects.length})</span>
        </h3>
        {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
      </div>
      {subjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${t.thRow}`}>
                {columns.map((col) => (
                  <th key={col.key} style={col.width ? { width: col.width } : undefined} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wide ${t.thText} ${col.align === "right" ? "text-right" : ""} ${col.className || ""}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subjects.map((s, i) => {
                const extra = typeof rowClassName === "function" ? rowClassName(s) : "";
                return (
                  <tr key={s.id ?? i} className={`transition hover:bg-primary-50/40 ${extra}`}>
                    {columns.map((col) => (
                      <td key={col.key} className={`px-6 py-3 text-slate-700 truncate ${col.align === "right" ? "text-right" : ""}`}>
                        {col.render ? col.render(s) : s[col.key] ?? "\u2014"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">{emptyMsg}</div>
      )}
    </div>
  );
}

export default function EvaluatorHome() {
  const [searchValue, setSearchValue] = useState("");
  const [student, setStudent] = useState(null);
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [nextSubjects, setNextSubjects] = useState([]);
  const [gapFillers, setGapFillers] = useState([]);
  const [allFails, setAllFails] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [pendingRequestedBy, setPendingRequestedBy] = useState(null);
  const [toast, setToast] = useState(null);
  const snapshotRef = useRef(null);
  const [removedSubjectCodes, setRemovedSubjectCodes] = useState(new Set());
  const [specialClassSubjects, setSpecialClassSubjects] = useState([]);

  const handleRemoveSubject = useCallback((subject) => {
    setRemovedSubjectCodes((prev) => new Set([...prev, subject.subject_code]));
    setNextSubjects((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
    setAllFails((prev) => prev.some((s) => s.subject_code === subject.subject_code) ? prev : [subject, ...prev]);
  }, []);

  const handleUndoSubject = useCallback((subject) => {
    setRemovedSubjectCodes((prev) => {
      const next = new Set(prev);
      next.delete(subject.subject_code);
      return next;
    });
    setSpecialClassSubjects((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
    setAllFails((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
    setNextSubjects((prev) => [subject, ...prev]);
  }, []);

  const handleAddSpecialClass = useCallback((subject) => {
    const special = { ...subject, special_class: true };
    setSpecialClassSubjects((prev) => [special, ...prev]);
    setNextSubjects((prev) => [special, ...prev]);
    setAllFails((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
  }, []);

  const handleAddSpecialClassFromNext = useCallback((subjectCode) => {
    const subject = nextSubjects.find((s) => s.subject_code === subjectCode);
    if (!subject) return;
    setRemovedSubjectCodes((prev) => new Set([...prev, subject.subject_code]));
    setNextSubjects((prev) => prev.filter((s) => s.subject_code !== subjectCode));
    const special = { ...subject, special_class: true };
    setSpecialClassSubjects((prev) => [special, ...prev]);
    setAllFails((prev) => [special, ...prev]);
  }, [nextSubjects]);

  const handleSearch = async () => {
    const q = searchValue.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setStudent(null);
    setCurrentSubjects([]);
    setNextSubjects([]);
    setGapFillers([]);
    setAllFails([]);
    setHasPendingRequest(false);
    setPendingRequestedBy(null);
    setRemovedSubjectCodes(new Set());
    setSpecialClassSubjects([]);

    try {
      const lookupRes = await api.get(`/api/students/lookup/${encodeURIComponent(q)}`);
      const data = lookupRes.data;

      let courseName = "";
      let overall = null;
      let current = [];
      let next = [];
      let gaps = [];
      let allFails = [];
      let recs = [];
      let evalData = null;
      try {
        const evalRes = await api.get(`/api/evaluator/students/${data.id}/evaluate`);
        evalData = evalRes.data;
        courseName = evalData?.student?.course || "";
        overall = evalData?.overall || null;
        current = evalData?.current_enrolled_subjects || [];
        next = evalData?.next_semester_subjects || [];
        gaps = evalData?.gap_fillers || [];
        allFails = evalData?.remaining_failed_subjects || [];
        recs = evalData?.recommendations || [];
        const pendingReq = evalData?.has_pending_request;
        setHasPendingRequest(pendingReq);
        if (pendingReq) setPendingRequestedBy(evalData?.pending_requested_by || "another evaluator");
      } catch {}
      snapshotRef.current = evalData;

      setStudent({
        id: data.id, full_name: `${data.first_name} ${data.last_name}`,
        student_number: data.student_number, year_level: data.year_level,
        current_semester: evalData?.student?.current_semester || 1,
        next_semester: evalData?.student?.next_semester || 1,
        course: courseName, overall,
      });
      setCurrentSubjects(current);
      setNextSubjects(next);
      setGapFillers(gaps);
      setAllFails(allFails);
      setRecommendations(recs);
    } catch (err) {
      setError(err.message || "Student not found");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleSubmit = async () => {
    if (!student || submitting) return;
    setSubmitting(true);
    try {
      const snapshot = snapshotRef.current
        ? {
            ...snapshotRef.current,
            next_semester_subjects: [
              ...(snapshotRef.current.next_semester_subjects || []).filter(
                (s) => !removedSubjectCodes.has(s.subject_code)
              ),
              ...specialClassSubjects,
            ],
            gap_fillers: (snapshotRef.current.gap_fillers || []).filter(
              (s) => !removedSubjectCodes.has(s.subject_code)
            ),
            special_class_subjects: specialClassSubjects,
          }
        : null;
      await api.post("/api/evaluator/evaluate", {
        student_number: student.student_number,
        snapshot,
      });
      setToast({ type: "success", message: "Evaluation request submitted" });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to submit" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const currentColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "auto", className: "whitespace-nowrap font-mono font-medium" },
    { key: "grade", label: "Grade", width: "auto", render: (s) => <span className={gradeBadge(s.grade)}>{s.grade || "INC"}</span> },
  ], []);

  const nextColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "auto", className: "whitespace-nowrap font-mono font-medium" },
    { key: "units", label: "Units", width: "auto", align: "right", render: (s) => s.units ?? "\u2014" },
    { key: "prerequisite", label: "Prereq", width: "auto", render: (s) => (
      <div className="flex items-center gap-2">
        {s.special_class && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5 uppercase tracking-wide">Special Class</span>}
        <span>{s.prerequisite || "\u2014"}</span>
      </div>
    )},
    { key: "is_retake", label: "", width: "auto", render: (s) => s.is_retake ? <span className="text-xs font-bold text-amber-600 uppercase">[RETAKE]</span> : null },
    { key: "actions", label: "", width: "auto", render: (s) => (
      <button onClick={() => handleRemoveSubject(s)} title="Remove subject" className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
        <X size={14} />
      </button>
    )},
  ], [handleRemoveSubject]);

  const failColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "auto", className: "whitespace-nowrap font-mono font-medium" },
    { key: "grade", label: "Grade", width: "auto", render: (s) => (
      <span className="text-red-600 font-semibold">{s.grade || "\u2014"}</span>
    )},
    { key: "actions", label: "", width: "auto", render: (s) => (
      <div className="flex items-center gap-1">
        {removedSubjectCodes.has(s.subject_code) && (
          <button onClick={() => handleUndoSubject(s)} title="Restore subject" className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
            <Undo2 size={14} />
          </button>
        )}
        <button onClick={() => handleAddSpecialClass(s)} title="Mark as special class" className="p-1 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
          <Plus size={14} />
        </button>
      </div>
    )},
  ], [removedSubjectCodes, handleUndoSubject, handleAddSpecialClass]);

  return (
    <div className="min-h-screen bg-slate-50">
      <EvaluatorHeader />
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        <div className="card p-4 sm:p-5">
          <label htmlFor="student-search" className="text-sm font-semibold text-slate-700 mb-2 block">
            Search Student Record
          </label>
          <div className="flex gap-2">
            <input
              id="student-search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter student number..."
              className="input-field flex-1"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !searchValue.trim()}
              className="btn btn-primary btn-md"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {toast && (
          <div className="fixed top-5 right-5 z-50">
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl bg-white ${toast.type === "success" ? "border-emerald-200 text-emerald-700" : "border-red-200 text-red-700"}`}>
              {toast.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        )}

        {student && <StudentCard student={student} onSubmit={handleSubmit} submitting={submitting} hasPendingRequest={hasPendingRequest} pendingRequestedBy={pendingRequestedBy} />}

        {!student && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm">Enter a student number to view their records</p>
          </div>
        )}

        {student && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <SubjectTable
                title="Current Subjects"
                subjects={currentSubjects}
                columns={currentColumns}
                emptyMsg="No current semester subjects."
                color="green"
              />
            </div>
            <div className="flex-1 min-w-0">
              <SubjectTable
                title="Possible Subjects"
                subjects={nextSubjects}
                columns={nextColumns}
                emptyMsg="No possible subjects."
                color="blue"
                headerRight={
                  <span className="text-xs font-medium text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-full">
                    Total: {nextSubjects.reduce((sum, s) => sum + Number(s.units || 0), 0)} units
                  </span>
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              {allFails.length > 0 && (
                <SubjectTable
                  title="Failed Subjects"
                  subjects={allFails}
                  columns={failColumns}
                  emptyMsg="No failed subjects."
                  color="red"
                />
              )}
            </div>
          </div>
        )}

        {(student && (gapFillers.length > 0 || recommendations.length > 0)) && (
          <div className="space-y-3">
            {gapFillers.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                <AlertTriangle size={16} className="shrink-0" />
                <span>Subjects recommended to fill remaining units — <strong>higher priority</strong> means they unlock more future subjects.</span>
              </div>
            )}
            <div className="flex flex-col lg:flex-row gap-4">
              {gapFillers.length > 0 && (
                <div className="flex-1 min-w-0">
                  <SubjectTable
                    title="Recommended Subjects"
                    subjects={gapFillers}
                    columns={[
                      { key: "subject_code", label: "Code", width: "auto", className: "whitespace-nowrap font-mono font-medium" },
                      { key: "units", label: "Units", width: "auto", align: "right", render: (s) => s.units ?? "\u2014" },
                      { key: "priority", label: "Priority", width: "auto", render: (s) =>
                        s.prereq_dependents > 0
                          ? <span className="text-xs font-bold text-amber-600">Unlocks {s.prereq_dependents} subject{s.prereq_dependents !== 1 ? "s" : ""}</span>
                          : <span className="text-xs text-slate-400">\u2014</span>
                      },
                    ]}
                    color="amber"
                  />
                </div>
              )}
              {recommendations.length > 0 && (
                <div className={gapFillers.length > 0 ? "w-full lg:w-72 shrink-0" : "w-full"}>
                  <div className="card p-4 border border-amber-200 bg-amber-50/30 space-y-3">
                    <h4 className="text-sm font-semibold text-amber-800">Recommendation Notes</h4>
                    <ul className="space-y-2 text-xs text-amber-700">
                      {gapFillers.filter((s) => s.prereq_dependents > 0).length > 0 && (
                        <li className="flex gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span><strong>{gapFillers.filter((s) => s.prereq_dependents > 0).length} subject(s)</strong> have prerequisites that unlock future courses. Prioritize these to avoid delays.</span>
                        </li>
                      )}
                      {gapFillers.length > 0 && (
                        <li className="flex gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span>Fill <strong>{gapFillers.reduce((sum, g) => sum + Number(g.units || 0), 0)} units</strong> for this semester.</span>
                        </li>
                      )}
                      {gapFillers.filter((s) => s.is_cross_course).length > 0 && (
                        <li className="flex gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span><strong>{gapFillers.filter((s) => s.is_cross_course).length} subject(s)</strong> are from other courses with matching subject codes.</span>
                        </li>
                      )}
                      {recommendations.map((r, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
