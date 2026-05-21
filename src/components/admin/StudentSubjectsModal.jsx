import { useEffect, useState } from "react";
import api from "../../services/api";

function statusBadge(status) {
  const map = {
    PENDING: { label: "Pending", cls: "badge badge-yellow" },
    APPROVED: { label: "Pass", cls: "badge badge-green" },
    REJECTED: { label: "Fail", cls: "badge badge-red" },
  };
  return map[status] || { label: status || "\u2014", cls: "badge badge-gray" };
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "\u2014";
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return d; }
}

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function CurriculumView({ curriculum, loading, onBack }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">Academic Record</span>
        <button onClick={onBack} className="btn btn-ghost btn-sm">Show Enrolled</button>
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
                  <thead className="table-header text-slate-400">
                    <tr>
                      <th className="px-5 py-2">Code</th>
                      <th className="px-5 py-2">Subject</th>
                      <th className="px-5 py-2">Sem</th>
                      <th className="px-5 py-2">Type</th>
                      <th className="px-5 py-2">Units</th>
                      <th className="px-5 py-2">Grade</th>
                      <th className="px-5 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {yrSubjects.map((sub) => (
                      <tr key={sub.id} className="table-row">
                        <td className="table-cell font-mono text-slate-700">{sub.subject_code}</td>
                        <td className="table-cell text-slate-700">{sub.subject_name}{sub.prerequisite_name && <span className="text-[10px] text-slate-400 ml-1">(req: {sub.prerequisite_name})</span>}</td>
                        <td className="table-cell text-slate-500">{sub.semester}</td>
                        <td className="table-cell"><span className={`badge ${sub.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>{sub.subject_type}</span></td>
                        <td className="table-cell text-slate-600">{sub.units}</td>
                        <td className="table-cell text-slate-700 font-medium">{sub.grade ?? "\u2014"}</td>
                        <td className="table-cell">
                          {sub.enrollment_status ? <span className={statusBadge(sub.enrollment_status).cls}>{statusBadge(sub.enrollment_status).label}</span> : <span className="text-[10px] text-slate-300 italic">Not taken</span>}
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

export default function StudentSubjectsModal({ student, subjects, config, onClose, onToast }) {
  const [tab, setTab] = useState("subjects");
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [managingSubjects, setManagingSubjects] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});
  const [enrollSubjectId, setEnrollSubjectId] = useState("");
  const [enrollYear, setEnrollYear] = useState(1);
  const [enrollSem, setEnrollSem] = useState(1);
  const [saving, setSaving] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);

  useEffect(() => { loadSubjects(); }, []);

  useEffect(() => {
    if (tab === "profile" && !profileData && !profileLoading) loadProfile();
    if (tab === "curriculum" && curriculum.length === 0 && !loadingCurriculum) loadCurriculum();
  }, [tab]);

  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const d = await api.get(`/api/admin/students/${student.id}`);
      setProfileData(d.data ?? d);
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const d = await api.get(`/api/admin/students/${student.id}/subjects`);
      setStudentSubjects(d.data ?? []);
    } catch (err) { onToast(err.message, "error"); }
  };

  const handleGrade = async (ssId, grade, status) => {
    try {
      await api.put(`/api/admin/students/grade/${ssId}`, { grade, status });
      onToast("Grade saved");
      await loadSubjects();
    } catch (err) { onToast(err.message, "error"); }
  };

  const handleEnroll = async () => {
    if (!enrollSubjectId) return;
    setSaving(true);
    try {
      await api.post("/api/admin/students/enroll", { student_id: student.id, subject_id: enrollSubjectId });
      onToast("Enrolled");
      setEnrollSubjectId("");
      await loadSubjects();
    } catch (err) { onToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleEnrollSemester = async () => {
    setSaving(true);
    try {
      const res = await api.post("/api/admin/students/enroll-semester", { student_id: student.id, year_level: enrollYear, semester: enrollSem });
      onToast(res.message || "Enrolled");
      await loadSubjects();
    } catch (err) { onToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const loadCurriculum = async () => {
    setLoadingCurriculum(true);
    try {
      const d = await api.get(`/api/admin/students/${student.id}/curriculum`);
      setCurriculum(d.data ?? []);
    } catch (err) { onToast(err.message, "error"); }
    finally { setLoadingCurriculum(false); }
  };

  const activeSubjects = subjects.filter((s) => s.is_active !== false);
  const enrolledSubjectIds = new Set(studentSubjects.map((ss) => ss.subject_id));
  const availableSubjects = activeSubjects.filter((s) => !enrolledSubjectIds.has(s.id));
  const previewSubjects = activeSubjects.filter((s) => s.course_id === student.course_id && s.year_level === enrollYear && s.semester === enrollSem);
  const toEnroll = previewSubjects.filter((s) => !enrolledSubjectIds.has(s.id));

  const fullName = (s) => { const parts = [s.first_name, s.middle_name, s.last_name].filter(Boolean); return parts.join(" ") || s.full_name || "\u2014"; };

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "subjects", label: `Subjects (${studentSubjects.length})` },
    { key: "curriculum", label: "Curriculum" },
  ];

  return (
    <div className="modal-overlay items-start pt-10 pb-10 overflow-y-auto" onClick={onClose}>
      <div className="modal-content max-w-4xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{fullName(student)}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{student.student_number}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
        </div>

        <div className="flex gap-1 border-b border-slate-200">
          {tabs.map((t) => (
            <button key={t.key}
              onClick={() => { setTab(t.key); setManagingSubjects(false); }}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${tab === t.key ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {tab === "profile" && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800">Student Information</span>
            </div>
            {profileLoading ? (
              <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
            ) : profileData ? (
              <div className="p-5 grid grid-cols-2 gap-4 text-sm">
                <Field label="Student No." value={profileData.student_number} />
                <Field label="Full Name" value={fullName(profileData)} />
                <Field label="Email" value={profileData.email} />
                <Field label="Date of Birth" value={formatDate(profileData.date_of_birth)} />
                <Field label="Gender" value={profileData.gender || "\u2014"} />
                <Field label="Contact No." value={profileData.contact_number || "\u2014"} />
                <Field label="Address" value={profileData.address || "\u2014"} />
                <Field label="Course" value={profileData.course_name || "\u2014"} />
                <Field label="Year Level" value={profileData.year_level ? `${ordinal(profileData.year_level)} Year` : "\u2014"} />
                <Field label="Current Semester" value={profileData.current_semester ? `${ordinal(profileData.current_semester)} Semester` : "\u2014"} />
              </div>
            ) : (
              <div className="p-10 text-center text-sm text-slate-400">No data available</div>
            )}
          </div>
        )}

        {/* ── Subjects Tab ── */}
        {tab === "subjects" && managingSubjects && (
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Enroll by Semester</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Select year and semester to see available subjects</p>
              </div>
              <button onClick={() => setManagingSubjects(false)} className="btn btn-primary btn-sm">Done</button>
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Year Level</label>
                <select value={enrollYear} onChange={(e) => setEnrollYear(Number(e.target.value))} className="input-field">
                  {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{ordinal(y)} Year</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Semester</label>
                <select value={enrollSem} onChange={(e) => setEnrollSem(Number(e.target.value))} className="input-field">
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
                  <thead className="table-header">
                    <tr>
                      <th className="px-4 py-2">Code</th>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Units</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewSubjects.map((s) => {
                      const alreadyIn = enrolledSubjectIds.has(s.id);
                      return (
                        <tr key={s.id} className={`${alreadyIn ? "bg-slate-50" : "hover:bg-emerald-50"} transition-colors`}>
                          <td className="px-4 py-2 font-mono text-slate-700">{s.subject_code}</td>
                          <td className="px-4 py-2 text-slate-700">{s.subject_name}</td>
                          <td className="px-4 py-2"><span className={`badge ${s.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>{s.subject_type}</span></td>
                          <td className="px-4 py-2 text-slate-600">{s.units}</td>
                          <td className="px-4 py-2">
                            {alreadyIn ? <span className="badge badge-gray">Already enrolled</span> : <span className="badge badge-green">Ready to enroll</span>}
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
                <span className="text-xs text-emerald-700"><strong>{toEnroll.length}</strong> subject{toEnroll.length !== 1 ? "s" : ""} ready to enroll</span>
                <button onClick={handleEnrollSemester} disabled={saving} className="btn btn-primary btn-sm">{saving ? "..." : `Enroll All (${toEnroll.length})`}</button>
              </div>
            )}
          </div>
        )}

        {tab === "subjects" && !managingSubjects && (
          <>
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Enrolled Subjects</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{studentSubjects.length} subjects</span>
                  <button onClick={async () => { setManagingSubjects(true); await loadSubjects(); }} className="btn btn-primary btn-sm">Manage</button>
                </div>
              </div>
              {studentSubjects.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">No subjects enrolled</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="table-header">
                    <tr>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Units</th>
                      <th className="px-5 py-3">Grade</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentSubjects.map((ss) => (
                      <tr key={ss.id} className="table-row">
                        <td className="table-cell">
                          <span className="font-mono font-medium text-slate-800">{ss.subject_code}</span>
                          <p className="text-[11px] text-slate-500">{ss.subject_name}</p>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${ss.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>{ss.subject_type}</span>
                        </td>
                        <td className="table-cell text-slate-600">{ss.units}</td>
                        <td className="table-cell">
                          {editingGradeId === ss.id ? (
                            <input type="number" min={0} max={100}
                              value={gradeInputs[ss.id] ?? ss.grade ?? ""}
                              onChange={(e) => setGradeInputs({ ...gradeInputs, [ss.id]: e.target.value })}
                              onBlur={(e) => { const val = e.target.value; if (val) handleGrade(ss.id, Number(val), Number(val) >= Number(config.passing_grade) ? "APPROVED" : "REJECTED"); setEditingGradeId(null); }}
                              onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingGradeId(null); }}
                              className="input-field w-16 py-1 text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              autoFocus />
                          ) : (
                            <span className="text-sm text-slate-700 font-medium">{ss.grade ?? "\u2014"}</span>
                          )}
                        </td>
                        <td className="table-cell"><span className={statusBadge(ss.status).cls}>{statusBadge(ss.status).label}</span></td>
                        <td className="table-cell">
                          <button onClick={() => { setEditingGradeId(ss.id); setGradeInputs({ ...gradeInputs, [ss.id]: ss.grade ?? "" }); }} className="btn btn-ghost btn-sm text-amber-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {availableSubjects.length > 0 && (
              <div className="flex gap-2">
                <select value={enrollSubjectId} onChange={(e) => setEnrollSubjectId(e.target.value)} className="input-field flex-1">
                  <option value="">Enroll in a subject...</option>
                  {availableSubjects.map((s) => <option key={s.id} value={s.id}>{s.subject_code} — {s.subject_name} (Y{s.year_level} S{s.semester})</option>)}
                </select>
                <button onClick={handleEnroll} disabled={!enrollSubjectId || saving} className="btn btn-primary btn-sm">{saving ? "..." : "Enroll"}</button>
              </div>
            )}
          </>
        )}

        {/* ── Curriculum Tab ── */}
        {tab === "curriculum" && (
          <CurriculumView curriculum={curriculum} loading={loadingCurriculum} onBack={() => setTab("subjects")} />
        )}
      </div>
    </div>
  );
}
