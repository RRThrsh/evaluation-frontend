import { useEffect, useState } from "react";
import api from "../../services/api";

function statusBadge(status) {
  const map = {
    PENDING: { label: "Pending", cls: "bg-yellow-100 text-yellow-700" },
    APPROVED: { label: "Pass", cls: "bg-emerald-100 text-emerald-700" },
    REJECTED: { label: "Fail", cls: "bg-red-100 text-red-600" },
  };
  return map[status] || { label: status || "—", cls: "bg-slate-100 text-slate-500" };
}

export default function StudentSubjectsModal({
  student, subjects, config, onClose, onToast,
}) {
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [managingSubjects, setManagingSubjects] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});
  const [enrollSubjectId, setEnrollSubjectId] = useState("");
  const [enrollYear, setEnrollYear] = useState(1);
  const [enrollSem, setEnrollSem] = useState(1);
  const [saving, setSaving] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);

  useEffect(() => { loadSubjects(); }, []);

  const loadSubjects = async () => {
    try {
      const data = await api.get(`/api/admin/students/${student.id}/subjects`);
      setStudentSubjects(data.data ?? []);
    } catch (err) {
      onToast(err.message, "error");
    }
  };

  const handleGrade = async (ssId, grade, status) => {
    try {
      await api.put(`/api/admin/students/grade/${ssId}`, { grade, status });
      onToast("Grade saved");
      await loadSubjects();
    } catch (err) {
      onToast(err.message, "error");
    }
  };

  const handleEnroll = async () => {
    if (!enrollSubjectId) return;
    setSaving(true);
    try {
      await api.post("/api/admin/students/enroll", { student_id: student.id, subject_id: enrollSubjectId });
      onToast("Enrolled");
      setEnrollSubjectId("");
      await loadSubjects();
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEnrollSemester = async () => {
    setSaving(true);
    try {
      const res = await api.post("/api/admin/students/enroll-semester", { student_id: student.id, year_level: enrollYear, semester: enrollSem });
      onToast(res.message || "Enrolled");
      await loadSubjects();
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const loadCurriculum = async () => {
    setLoadingCurriculum(true);
    try {
      const data = await api.get(`/api/admin/students/${student.id}/curriculum`);
      setCurriculum(data.data ?? []);
      setShowCurriculum(true);
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setLoadingCurriculum(false);
    }
  };

  const activeSubjects = subjects.filter((s) => s.is_active !== false);
  const enrolledSubjectIds = new Set(studentSubjects.map((ss) => ss.subject_id));
  const availableSubjects = activeSubjects.filter((s) => !enrolledSubjectIds.has(s.id));

  const previewSubjects = activeSubjects.filter(
    (s) => s.course_id === student.course_id && s.year_level === enrollYear && s.semester === enrollSem
  );
  const toEnroll = previewSubjects.filter((s) => !enrolledSubjectIds.has(s.id));

  const fullName = (s) => {
    const parts = [s.first_name, s.middle_name, s.last_name].filter(Boolean);
    return parts.join(" ") || s.full_name || "—";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{fullName(student)}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{student.student_number}</p>
          </div>
          <div className="flex items-center gap-2">
            {!managingSubjects && (
              <>
                <button onClick={async () => { setManagingSubjects(true); await loadSubjects(); }}
                  className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition">Manage</button>
                <button onClick={loadCurriculum}
                  className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">Logs</button>
              </>
            )}
            <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 transition px-3 py-1.5 rounded-lg hover:bg-slate-100">Close</button>
          </div>
        </div>

        {managingSubjects && (
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Enroll by Semester</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Select year and semester to see available subjects</p>
              </div>
              <button onClick={() => setManagingSubjects(false)}
                className="text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Done</button>
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Year Level</label>
                <select value={enrollYear} onChange={(e) => setEnrollYear(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white">
                  {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{ordinal(y)} Year</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Semester</label>
                <select value={enrollSem} onChange={(e) => setEnrollSem(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white">
                  {[1, 2].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>
            {previewSubjects.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4 bg-white rounded-lg border border-dashed border-slate-200">
                No subjects found for {ordinal(enrollYear)} Year, Semester {enrollSem}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Code</th>
                      <th className="px-4 py-2 font-semibold">Subject</th>
                      <th className="px-4 py-2 font-semibold">Type</th>
                      <th className="px-4 py-2 font-semibold">Units</th>
                      <th className="px-4 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewSubjects.map((s) => {
                      const alreadyIn = enrolledSubjectIds.has(s.id);
                      return (
                        <tr key={s.id} className={`${alreadyIn ? "bg-slate-50" : "hover:bg-emerald-50"} transition-colors`}>
                          <td className="px-4 py-2 font-mono text-slate-700">{s.subject_code}</td>
                          <td className="px-4 py-2 text-slate-700">{s.subject_name}</td>
                          <td className="px-4 py-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${s.subject_type === "major" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>{s.subject_type}</span>
                          </td>
                          <td className="px-4 py-2 text-slate-600">{s.units}</td>
                          <td className="px-4 py-2">
                            {alreadyIn ? (
                              <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded font-medium">Already enrolled</span>
                            ) : (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">Ready to enroll</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {toEnroll.length > 0 && (
              <div className="flex items-center justify-between bg-emerald-100/50 rounded-lg px-4 py-2.5">
                <span className="text-xs text-emerald-700">
                  <strong>{toEnroll.length}</strong> subject{toEnroll.length !== 1 ? "s" : ""} ready to enroll
                </span>
                <button onClick={handleEnrollSemester} disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                  {saving ? "..." : `Enroll All (${toEnroll.length})`}
                </button>
              </div>
            )}
          </div>
        )}

        {showCurriculum ? (
          <CurriculumView curriculum={curriculum} loading={loadingCurriculum} onBack={() => setShowCurriculum(false)} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Enrolled Subjects</span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{studentSubjects.length} subjects</span>
            </div>
            {studentSubjects.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">No subjects enrolled</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Subject</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Units</th>
                    <th className="px-5 py-3 font-semibold">Grade</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentSubjects.map((ss) => (
                    <tr key={ss.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-mono font-medium text-slate-800">{ss.subject_code}</span>
                        <p className="text-[11px] text-slate-500">{ss.subject_name}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${ss.subject_type === "major" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>{ss.subject_type}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{ss.units}</td>
                      <td className="px-5 py-3">
                        {editingGradeId === ss.id ? (
                          <input type="number" min={0} max={100}
                            value={gradeInputs[ss.id] ?? ss.grade ?? ""}
                            onChange={(e) => setGradeInputs({ ...gradeInputs, [ss.id]: e.target.value })}
                            onBlur={(e) => {
                              const val = e.target.value;
                              if (val) handleGrade(ss.id, Number(val), Number(val) >= Number(config.passing_grade) ? "APPROVED" : "REJECTED");
                              setEditingGradeId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.target.blur();
                              if (e.key === "Escape") setEditingGradeId(null);
                            }}
                            className="w-16 border border-blue-400 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            autoFocus />
                        ) : (
                          <span className="text-sm text-slate-700 font-medium">{ss.grade ?? "—"}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${statusBadge(ss.status).cls}`}>{statusBadge(ss.status).label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setEditingGradeId(ss.id); setGradeInputs({ ...gradeInputs, [ss.id]: ss.grade ?? "" }); }}
                          className="text-blue-500 hover:text-blue-700 transition p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Quick enroll single subject */}
        {!managingSubjects && !showCurriculum && availableSubjects.length > 0 && (
          <div className="flex gap-2">
            <select value={enrollSubjectId} onChange={(e) => setEnrollSubjectId(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">Enroll in a subject...</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>{s.subject_code} — {s.subject_name} (Y{s.year_level} S{s.semester})</option>
              ))}
            </select>
            <button onClick={handleEnroll} disabled={!enrollSubjectId || saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
              {saving ? "..." : "Enroll"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CurriculumView({ curriculum, loading, onBack }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">Academic Record</span>
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600 transition">Show Enrolled</button>
      </div>
      {loading ? (
        <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
      ) : curriculum.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">No curriculum found for this course</div>
      ) : (
        <div>
          {[1, 2, 3, 4].map((yr) => {
            const yrSubjects = curriculum.filter((s) => s.year_level === yr);
            if (yrSubjects.length === 0) return null;
            return (
              <div key={yr}>
                <div className="px-5 py-2 bg-slate-50 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{ordinal(yr)} Year</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-2 font-semibold">Code</th>
                      <th className="px-5 py-2 font-semibold">Subject</th>
                      <th className="px-5 py-2 font-semibold">Sem</th>
                      <th className="px-5 py-2 font-semibold">Type</th>
                      <th className="px-5 py-2 font-semibold">Units</th>
                      <th className="px-5 py-2 font-semibold">Grade</th>
                      <th className="px-5 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {yrSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-2 font-mono text-slate-700">{sub.subject_code}</td>
                        <td className="px-5 py-2 text-slate-700">
                          {sub.subject_name}
                          {sub.prerequisite_name && <span className="text-[10px] text-slate-400 ml-1">(req: {sub.prerequisite_name})</span>}
                        </td>
                        <td className="px-5 py-2 text-slate-500">{sub.semester}</td>
                        <td className="px-5 py-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${sub.subject_type === "major" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>{sub.subject_type}</span>
                        </td>
                        <td className="px-5 py-2 text-slate-600">{sub.units}</td>
                        <td className="px-5 py-2 text-slate-700 font-medium">{sub.grade ?? "—"}</td>
                        <td className="px-5 py-2">
                          {sub.enrollment_status ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${statusBadge(sub.enrollment_status).cls}`}>{statusBadge(sub.enrollment_status).label}</span>
                          ) : (
                            <span className="text-[10px] text-slate-300 italic">Not taken</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
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
