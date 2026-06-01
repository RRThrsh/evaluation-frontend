import { useState, useMemo, useRef, useCallback } from "react";
import { Search, AlertTriangle, CheckCircle, X, Undo2, Plus, Send, RefreshCw } from "lucide-react";
import api from "../../../services/api";
import EvaluatorHeader from "../../../components/evaluator/EvaluatorHeader";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { useAuth } from "../../../context/AuthContext";

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

function StudentCard({ student, onSubmit, submitting, hasPendingRequest, pendingRequestedBy, onShowToast, onShiftComplete, studentHistory, onRefreshStatus, refreshingStatus }) {
  const [showShift, setShowShift] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [targetCourseId, setTargetCourseId] = useState("");
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [shifting, setShifting] = useState(false);
  const evalYear = student.next_semester === 1 ? Number(student.year_level) + 1 : Number(student.year_level);

  const openShift = async () => {
    setShowShift(true);
    setLoadingCourses(true);
    setTargetCourseId("");
    setPreview(null);
    try {
      const res = await api.get("/api/evaluator/courses");
      setCourses(res.data || []);
    } catch {
      if (onShowToast) onShowToast("Failed to load courses", "error");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleTargetChange = async (e) => {
    const id = e.target.value;
    setTargetCourseId(id);
    if (!id) { setPreview(null); return; }
    setLoadingPreview(true);
    setPreview(null);
    try {
      const res = await api.post(`/api/evaluator/students/${student.id}/shift-preview`, { new_course_id: id });
      setPreview(res.data || res);
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Failed to load preview", "error");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConfirmShift = async () => {
    if (!targetCourseId || shifting) return;
    setShifting(true);
    try {
      const res = await api.post(`/api/evaluator/students/${student.id}/shift`, { new_course_id: targetCourseId });
      if (onShowToast) onShowToast(res.data?.message || "Shift completed", "success");
      setShowShift(false);
      if (onShiftComplete && res.data?.evaluation) onShiftComplete(res.data.evaluation);
    } catch (err) {
      if (onShowToast) onShowToast(err.message || "Shift failed", "error");
    } finally {
      setShifting(false);
    }
  };

  return (
    <>
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
              <div className="flex items-center gap-2">
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-[220px] text-right leading-relaxed">
                  Already submitted by <span className="font-semibold">{pendingRequestedBy || "another evaluator"}</span>
                </div>
                <button onClick={onRefreshStatus} disabled={refreshingStatus} className="btn btn-ghost btn-sm gap-1" title="Re-check status">
                  <RefreshCw size={14} className={refreshingStatus ? "animate-spin" : ""} />
                  Re-check
                </button>
              </div>
            ) : (
              <button onClick={onSubmit} disabled={submitting} className="btn btn-primary btn-sm gap-1.5">
                <Send size={14} />
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
            <button onClick={() => setShowHistory(true)} className="btn btn-ghost btn-sm gap-1.5">
              History
            </button>
            <button onClick={openShift} className="btn btn-secondary btn-sm gap-1.5">
              Shifting
            </button>
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

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-8 overflow-y-auto bg-black/40 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Subject History</h3>
            <p className="text-xs text-slate-400 mb-4">{student.full_name} — {student.student_number}</p>
            {studentHistory?.length > 0 ? (
              <div className="max-h-[60vh] overflow-y-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Code</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Name</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Year</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Sem</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Units</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Grade</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentHistory.map((s, i) => (
                      <tr key={s.id ?? i} className="hover:bg-slate-50/40">
                        <td className="px-4 py-2 font-mono font-medium text-slate-700">{s.subject_code}</td>
                        <td className="px-4 py-2 text-slate-600">{s.subject_name}</td>
                        <td className="px-4 py-2 text-center text-slate-600">{s.year_level}</td>
                        <td className="px-4 py-2 text-center text-slate-600">{s.semester}</td>
                        <td className="px-4 py-2 text-center text-slate-600">{s.units}</td>
                        <td className="px-4 py-2 text-center"><span className={gradeBadge(s.grade)}>{s.grade || "INC"}</span></td>
                        <td className="px-4 py-2 text-center">
                          {s.result === "pass" ? <span className="text-emerald-600 font-semibold text-xs">PASS</span> :
                           s.result === "fail" ? <span className="text-red-600 font-semibold text-xs">FAIL</span> :
                           s.result === "inc"  ? <span className="text-amber-600 font-semibold text-xs">INC</span> :
                           <span className="text-slate-400 text-xs">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic py-8 text-center">No subject history available.</p>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowHistory(false)} className="btn btn-primary btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {showShift && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-8 overflow-y-auto bg-black/40 backdrop-blur-sm" onClick={() => setShowShift(false)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-slate-800 mb-4">Shifting Request</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Student</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{student.full_name}</p>
                  <p className="text-slate-500 text-xs">{student.student_number}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Current Course</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{student.course || "N/A"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Target Course</label>
                {loadingCourses ? (
                  <div className="text-sm text-slate-400">Loading courses...</div>
                ) : (
                  <select value={targetCourseId} onChange={handleTargetChange} className="input-field">
                    <option value="">Select a course...</option>
                    {courses
                      .filter((c) => c.id !== student.course_id)
                      .map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                  </select>
                )}
              </div>

              {loadingPreview && (
                <div className="text-sm text-slate-400 py-4 text-center">Loading subject comparison...</div>
              )}

              {preview && !loadingPreview && (
                <>
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">
                      From: <span className="text-slate-500 font-normal">{preview.current_course?.name || student.course}</span>
                      {" → "}
                      To: <span className="text-primary-600">{preview.target_course?.name} ({preview.target_course?.code})</span>
                    </h4>

                    <div>
                      <h5 className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                        Already Taken ({preview.already_taken_subjects?.length || 0})
                        <span className="text-slate-400 font-normal normal-case ml-1">— will not be repeated</span>
                      </h5>
                      {preview.already_taken_subjects?.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto border border-emerald-200 rounded-lg">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-emerald-50 border-b border-emerald-100">
                                <th className="px-3 py-2 text-left font-medium text-emerald-700">Code</th>
                                <th className="px-3 py-2 text-left font-medium text-emerald-700">Name</th>
                                <th className="px-3 py-2 text-center font-medium text-emerald-700">Units</th>
                                <th className="px-3 py-2 text-center font-medium text-emerald-700">Grade</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                              {preview.already_taken_subjects.map((s) => (
                                <tr key={s.id} className="hover:bg-emerald-50/40">
                                  <td className="px-3 py-1.5 font-mono font-medium text-slate-700">{s.subject_code}</td>
                                  <td className="px-3 py-1.5 text-slate-600">{s.subject_name}</td>
                                  <td className="px-3 py-1.5 text-center text-slate-600">{s.units}</td>
                                  <td className="px-3 py-1.5 text-center"><span className={gradeBadge(s.grade)}>{s.grade || "INC"}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No matched subjects taken yet.</p>
                      )}
                    </div>

                    <div>
                      <h5 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                        Need to Take ({preview.not_taken_subjects?.length || 0})
                        <span className="text-slate-400 font-normal normal-case ml-1">— subjects to enroll</span>
                      </h5>
                      {preview.not_taken_subjects?.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto border border-blue-200 rounded-lg">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-blue-50 border-b border-blue-100">
                                <th className="px-3 py-2 text-left font-medium text-blue-700">Code</th>
                                <th className="px-3 py-2 text-left font-medium text-blue-700">Name</th>
                                <th className="px-3 py-2 text-center font-medium text-blue-700">Units</th>
                                <th className="px-3 py-2 text-center font-medium text-blue-700">Year/Sem</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                              {preview.not_taken_subjects.map((s) => (
                                <tr key={s.id} className="hover:bg-blue-50/40">
                                  <td className="px-3 py-1.5 font-mono font-medium text-slate-700">{s.subject_code}</td>
                                  <td className="px-3 py-1.5 text-slate-600">{s.subject_name}</td>
                                  <td className="px-3 py-1.5 text-center text-slate-600">{s.units}</td>
                                  <td className="px-3 py-1.5 text-center text-slate-600">{YEAR_LEVELS[s.year_level] || `${s.year_level}th Year`} - {SEM_LABELS[s.semester]}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">All subjects already taken.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button onClick={() => setShowShift(false)} className="btn btn-ghost btn-sm">Cancel</button>
                    <button onClick={handleConfirmShift} disabled={shifting || !targetCourseId} className="btn btn-primary btn-sm">
                      {shifting ? "Shifting..." : "Confirm Shift"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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
  const { user: authUser } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [student, setStudent] = useState(null);
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [nextSubjects, setNextSubjects] = useState([]);
  const [gapFillers, setGapFillers] = useState([]);
  const [allFails, setAllFails] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [maxUnits, setMaxUnits] = useState(0);
  const [usedUnits, setUsedUnits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [pendingRequestedBy, setPendingRequestedBy] = useState(null);
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [undecided, setUndecided] = useState(false);
  const originalGapFillersRef = useRef([]);
  const [removedSubjectCodes, setRemovedSubjectCodes] = useState(new Set());
  const [specialClassSubjects, setSpecialClassSubjects] = useState([]);
  const [rawStudentSubjects, setRawStudentSubjects] = useState([]);
  const [isGraduatingCandidate, setIsGraduatingCandidate] = useState(false);
  const [graduation, setGraduation] = useState(null);

  const handleRemoveSubject = useCallback((subject) => {
    setRemovedSubjectCodes((prev) => new Set([...prev, subject.subject_code]));
    setNextSubjects((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
    setAllFails((prev) => prev.some((s) => s.subject_code === subject.subject_code) ? prev : [subject, ...prev]);
    setGapFillers((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
  }, []);

  const handleAddFailedToNext = useCallback((subject) => {
    setNextSubjects((prev) => [{ ...subject, is_retake: true }, ...prev]);
    setAllFails((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
    setGapFillers((prev) => prev.filter((s) => s.subject_code !== subject.subject_code));
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
    const wasGapFiller = originalGapFillersRef.current.some(
      (g) => g.subject_code === subject.subject_code
    );
    if (wasGapFiller) {
      const original = originalGapFillersRef.current.find(
        (g) => g.subject_code === subject.subject_code
      );
      setGapFillers((prev) => [original, ...prev]);
    }
  }, []);

  const handleAddSpecialClassFromNext = useCallback((subjectCode) => {
    const subject = nextSubjects.find((s) => s.subject_code === subjectCode);
    if (!subject) return;
    setRemovedSubjectCodes((prev) => new Set([...prev, subject.subject_code]));
    setNextSubjects((prev) => prev.filter((s) => s.subject_code !== subjectCode));
    const special = { ...subject, special_class: true };
    setSpecialClassSubjects((prev) => [special, ...prev]);
    setAllFails((prev) => [special, ...prev]);
    setGapFillers((prev) => prev.filter((s) => s.subject_code !== subjectCode));
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
    setRawStudentSubjects([]);
    setIsGraduatingCandidate(false);
    setGraduation(null);

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
      let maxU = 0;
      let usedU = 0;
      let evalData = null;
      try {
        const evalRes = await api.get(`/api/evaluator/students/${data.id}/evaluate`);
        evalData = evalRes.data;
        courseName = evalData?.student?.course || "";
        overall = evalData?.overall || null;
        current = evalData?.current_enrolled_subjects || [];
        next = evalData?.next_semester_subjects || [];
        gaps = evalData?.gap_fillers || [];
        originalGapFillersRef.current = gaps;
        allFails = evalData?.remaining_failed_subjects || [];
        recs = evalData?.recommendations || [];
        maxU = evalData?.max_units || 0;
        usedU = evalData?.used_units || 0;
        setRawStudentSubjects(evalData?.raw_student_subjects || []);
        setIsGraduatingCandidate(evalData?.is_graduating_candidate || false);
        setGraduation(evalData?.graduation || null);
        const pendingReq = evalData?.has_pending_request;
        setHasPendingRequest(pendingReq);
        if (pendingReq) setPendingRequestedBy(evalData?.pending_requested_by || "another evaluator");
      } catch {}

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
      setMaxUnits(maxU);
      setUsedUnits(usedU);
    } catch (err) {
      setError(err.message || "Student not found");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleRefreshStatus = useCallback(async () => {
    if (!student || refreshingStatus) return;
    setRefreshingStatus(true);
    try {
      const res = await api.get(`/api/evaluator/students/${student.id}/evaluate`);
      const evalData = res.data;
      const pendingReq = evalData?.has_pending_request;
      setHasPendingRequest(pendingReq);
      if (pendingReq) setPendingRequestedBy(evalData?.pending_requested_by || "another evaluator");
      else setPendingRequestedBy(null);

      originalGapFillersRef.current = evalData?.gap_fillers || [];
      setCurrentSubjects(evalData?.current_enrolled_subjects || []);
      setNextSubjects(evalData?.next_semester_subjects || []);
      setGapFillers(evalData?.gap_fillers || []);
      setAllFails(evalData?.remaining_failed_subjects || []);
      setRecommendations(evalData?.recommendations || []);
      setMaxUnits(evalData?.max_units || 0);
      setUsedUnits(evalData?.used_units || 0);
      setRawStudentSubjects(evalData?.raw_student_subjects || []);
      setIsGraduatingCandidate(evalData?.is_graduating_candidate || false);
      setGraduation(evalData?.graduation || null);
      setRemovedSubjectCodes(new Set());
      setSpecialClassSubjects([]);
    } catch {
      setToast({ type: "error", message: "Failed to check status" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setRefreshingStatus(false);
    }
  }, [student, refreshingStatus]);

  const handleShowConfirm = () => setShowConfirm(true);

  const handleConfirmSubmit = async (isUndecided) => {
    setShowConfirm(false);
    if (!student || submitting) return;
    setSubmitting(true);
    try {
      await api.post("/api/evaluator/evaluate", {
        student_number: student.student_number,
        undecided: isUndecided,
        next_semester_subjects: nextSubjects,
        gap_fillers: gapFillers,
        special_class_subjects: specialClassSubjects,
      });
      setHasPendingRequest(true);
      setPendingRequestedBy(authUser?.full_name || "You");
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
        <span className={s.prereq_failed ? "text-red-500 font-medium" : ""}>{s.prerequisite || "\u2014"}</span>
        {s.blocked && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 uppercase tracking-wide whitespace-nowrap">
            {s.blocked_reason === "inc" ? "BLOCKED (INC)" : s.blocked_reason === "not_taken" ? "PREREQ NOT TAKEN" : "BLOCKED"}
          </span>
        )}
        {!s.blocked && s.prerequisite && (
          <span className="text-[10px] text-emerald-600 font-medium">CLEAR</span>
        )}
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
        {removedSubjectCodes.has(s.subject_code) ? (
          <button onClick={() => handleUndoSubject(s)} title="Restore subject" className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
            <Undo2 size={14} />
          </button>
        ) : (
          <button onClick={() => handleAddFailedToNext(s)} title="Add to next semester" className="p-1 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
            <Plus size={14} />
          </button>
        )}
      </div>
    )},
  ], [removedSubjectCodes, handleUndoSubject, handleAddFailedToNext]);

  return (
    <div className="min-h-screen bg-background">
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

        {student && <StudentCard student={student} studentHistory={rawStudentSubjects} onSubmit={handleShowConfirm} submitting={submitting} hasPendingRequest={hasPendingRequest} pendingRequestedBy={pendingRequestedBy} onShowToast={(msg, type) => { setToast({ type, message: msg }); setTimeout(() => setToast(null), 3000); }} onShiftComplete={(evalData) => { if (evalData) { originalGapFillersRef.current = evalData.gap_fillers || []; setCurrentSubjects(evalData.current_enrolled_subjects || []); setNextSubjects(evalData.next_semester_subjects || []); setGapFillers(evalData.gap_fillers || []); setAllFails(evalData.remaining_failed_subjects || []); setRecommendations(evalData.recommendations || []); setMaxUnits(evalData.max_units || 0); setUsedUnits(evalData.used_units || 0); setRawStudentSubjects(evalData.raw_student_subjects || []); setIsGraduatingCandidate(evalData?.is_graduating_candidate || false); setGraduation(evalData?.graduation || null); setStudent((prev) => ({ ...prev, course: evalData.student?.course || prev.course, overall: evalData.overall })); } }} onRefreshStatus={handleRefreshStatus} refreshingStatus={refreshingStatus} />}

        {isGraduatingCandidate && (
          <div className="card overflow-hidden border border-violet-200">
            <div className="px-5 py-3 border-b bg-violet-50 border-violet-100 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-violet-700">Graduation Status</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                graduation?.can_graduate
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {graduation?.can_graduate ? "Can Graduate" : "Cannot Graduate"}
              </span>
            </div>
            <div className="p-5 text-sm text-slate-700 space-y-2">
              {graduation?.can_graduate ? (
                <p>Student has met all graduation requirements.</p>
              ) : (
                <>
                  <p className="font-medium text-red-600">
                    {graduation?.blocking_subjects?.length || 0} blocking subject(s) remaining:
                  </p>
                  <ul className="space-y-1 ml-4">
                    {graduation?.blocking_subjects?.map((s, i) => (
                      <li key={i} className="flex gap-2 text-xs">
                        <span className="text-red-400 font-bold">•</span>
                        <span className="font-mono">{s.subject_code}</span>
                        <span className="text-slate-400">— Year {s.year_level}, Semester {s.semester}</span>
                      </li>
                    ))}
                  </ul>
                  {graduation?.passed_with_broken_prereqs?.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                      <p className="text-xs font-semibold text-amber-700 mb-1">
                        Passed subject(s) with unmet prerequisites:
                      </p>
                      <ul className="space-y-0.5">
                        {graduation.passed_with_broken_prereqs.map((s, i) => (
                          <li key={i} className="text-xs text-amber-600 flex gap-2">
                            <span className="font-bold">•</span>
                            <span className="font-mono">{s.subject_code}</span>
                            <span className="text-amber-500">— prerequisite chain broken</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {graduation?.suggested_year_level && (
                    <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                      Suggested re-enrollment: Year {graduation.suggested_year_level}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
            <div className="modal-content max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Submit Evaluation</h3>
              <p className="text-sm text-slate-500 mb-6">Are you sure you want to submit this evaluation? The student will be notified.</p>
              <label className="flex items-center justify-center gap-2 mb-6 cursor-pointer">
                <input type="checkbox" checked={undecided} onChange={(e) => setUndecided(e.target.checked)} className="rounded border-slate-300" />
                <span className="text-sm text-slate-600">Undecided</span>
              </label>
              <div className="flex gap-3">
                <button onClick={() => { const u = undecided; setUndecided(false); handleConfirmSubmit(u); }} className="flex-1 btn btn-primary btn-md">Submit</button>
                <button onClick={() => { setUndecided(false); setShowConfirm(false); }} className="flex-1 btn btn-secondary btn-md">Cancel</button>
              </div>
            </div>
          </div>
        )}

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
                rowClassName={(s) => s.blocked ? "opacity-50 bg-slate-50" : ""}
                headerRight={
                  <div className="flex items-center gap-2">
                    {maxUnits > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (nextSubjects.reduce((sum, s) => sum + Number(s.units || 0), 0) / maxUnits) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <span className="text-xs font-medium text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {nextSubjects.reduce((sum, s) => sum + Number(s.units || 0), 0)} / {maxUnits} units
                    </span>
                  </div>
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
          <div className="flex flex-col lg:flex-row gap-6">
            {gapFillers.filter((s) => s.prereq_dependents > 0).length > 0 && (
              <div className="flex-1 min-w-0">
                <SubjectTable
                  title="Priority Subjects"
                  subjects={gapFillers.filter((s) => s.prereq_dependents > 0)}
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
              <div className={gapFillers.filter((s) => s.prereq_dependents > 0).length > 0 ? "w-full lg:w-80 shrink-0" : "w-full"}>
                <div className="card p-4 border border-slate-200 bg-white space-y-2">
                  <h4 className="text-sm font-semibold text-slate-800">Recommendation Notes</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {recommendations.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-slate-400 font-bold mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
