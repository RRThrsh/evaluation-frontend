import { useState, useMemo, useRef } from "react";
import { Search, AlertTriangle, CheckCircle } from "lucide-react";
import api from "../../../services/api";
import EvaluatorHeader from "../../../components/evaluator/EvaluatorHeader";

const YEAR_LEVELS = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };

const gradeBadge = (grade) => {
  if (!grade || grade === "INC") return "badge badge-yellow";
  const num = Number(grade);
  if (!isNaN(num) && num < 75) return "badge badge-red";
  return "badge badge-green";
};

function StudentCard({ student, onSubmit, submitting, hasPendingRequest, pendingRequestedBy }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
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
          <div>
            <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Year Level</span>
            <p className="font-semibold text-slate-800 mt-0.5">{YEAR_LEVELS[student.year_level] || `${student.year_level}th Year`}</p>
          </div>
          <div>
            <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Status</span>
            <p className="font-semibold mt-0.5">{student.enrollment_type === "irregular" ? <span className="text-amber-600">Irregular</span> : <span className="text-emerald-600">Regular</span>}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {hasPendingRequest ? (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-[220px] text-right leading-relaxed">
              Already submitted by <span className="font-semibold">{pendingRequestedBy || "another evaluator"}</span>
            </div>
          ) : (
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="btn btn-primary btn-sm"
            >
              {submitting ? "Submitting..." : "Submit Evaluation"}
            </button>
          )}
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

function SubjectTable({ title, subjects, columns, emptyMsg, rowClassName, color = "green" }) {
  const t = THEMES[color] || THEMES.green;
  return (
    <div className={`card overflow-hidden border ${t.card}`}>
      <div className={`px-5 py-3 border-b ${t.head}`}>
        <h3 className={`font-semibold text-sm ${t.text}`}>
          {title} <span className={`font-normal ${t.count}`}>({subjects.length})</span>
        </h3>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [pendingRequestedBy, setPendingRequestedBy] = useState(null);
  const [toast, setToast] = useState(null);
  const snapshotRef = useRef(null);

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

    try {
      const lookupRes = await api.get(`/api/students/lookup/${encodeURIComponent(q)}`);
      const data = lookupRes.data;

      let courseName = "";
      let overall = null;
      let current = [];
      let next = [];
      let gaps = [];
      let allFails = [];
      let enrollmentType = "regular";
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
        enrollmentType = evalData?.student?.enrollment_type || "regular";
        const pendingReq = evalData?.has_pending_request;
        setHasPendingRequest(pendingReq);
        if (pendingReq) setPendingRequestedBy(evalData?.pending_requested_by || "another evaluator");
      } catch {}
      snapshotRef.current = evalData;

      setStudent({
        id: data.id, full_name: `${data.first_name} ${data.last_name}`,
        student_number: data.student_number, year_level: data.year_level,
        course: courseName, overall,
        enrollment_type: enrollmentType,
      });
      setCurrentSubjects(current);
      setNextSubjects(next);
      setGapFillers(gaps);
      setAllFails(allFails);
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
      await api.post("/api/evaluator/evaluate", {
        student_number: student.student_number,
        snapshot: snapshotRef.current,
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
    { key: "subject_code", label: "Code", width: "15%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "40%" },
    { key: "grade", label: "Grade", width: "20%", render: (s) => <span className={gradeBadge(s.grade)}>{s.grade || "INC"}</span> },
  ], []);

  const nextColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "15%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "40%" },
    { key: "prerequisite", label: "Prereq", width: "30%", render: (s) => s.prerequisite || "\u2014" },
    { key: "is_retake", label: "", width: "15%", render: (s) => {
      if (s.is_gap_filler) return <span className="badge badge-amber">Gap</span>;
      if (s.is_retake) return <span className="badge badge-blue">Retake</span>;
      return null;
    }},
  ], []);

  const failColumns = useMemo(() => [
    { key: "subject_code", label: "Code", width: "15%", className: "whitespace-nowrap" },
    { key: "subject_name", label: "Subject", width: "55%" },
    { key: "grade", label: "Grade", width: "20%", align: "right", render: (s) => <span className="text-red-600 font-semibold">{s.grade || "\u2014"}</span> },
  ], []);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubjectTable
              title="Current Subjects"
              subjects={currentSubjects}
              columns={currentColumns}
              emptyMsg="No current semester subjects."
              color="green"
            />
            <div className="space-y-6">
              <SubjectTable
                title="Possible Subjects"
                subjects={nextSubjects}
                columns={nextColumns}
                emptyMsg="No possible subjects."
                color="blue"
              />


            </div>
          </div>
        )}

        {allFails.length > 0 && student && (
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
  );
}
