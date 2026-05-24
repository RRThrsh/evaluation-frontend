import { useEffect, useState, useMemo } from "react";
import { X, User, BookOpen, GraduationCap } from "lucide-react";
import api from "../../services/api";
import AcademicRecord from "./AcademicRecord";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-slate-800 mt-0.5">{value || "—"}</p>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return d; }
}

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

const TABS = [
  { key: "profile",    label: "Profile",    icon: User },
  { key: "subjects",   label: "Subjects",   icon: BookOpen },
  { key: "curriculum", label: "Curriculum", icon: GraduationCap },
];

export default function StudentSubjectsModal({ student, subjects, config, onClose, onToast }) {
  const [tab, setTab] = useState("subjects");
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);

  useEffect(() => { loadSubjects(); }, []);

  useEffect(() => {
    if (tab === "profile" && !profileData && !profileLoading) loadProfile();
    if (tab === "curriculum" && curriculum.length === 0 && !loadingCurriculum) loadCurriculum();
  }, [tab]);

  const loadProfile = async () => {
    setProfileLoading(true);
    try { const d = await api.get(`/api/admin/students/${student.id}`); setProfileData(d.data ?? d); }
    catch (err) { onToast(err.message, "error"); }
    finally { setProfileLoading(false); }
  };

  const loadSubjects = async () => {
    try { const d = await api.get(`/api/admin/students/${student.id}/subjects`); setStudentSubjects(d.data ?? []); }
    catch (err) { onToast(err.message, "error"); }
  };

  const loadCurriculum = async () => {
    setLoadingCurriculum(true);
    try { const d = await api.get(`/api/admin/students/${student.id}/curriculum`); setCurriculum(d.data ?? []); }
    catch (err) { onToast(err.message, "error"); }
    finally { setLoadingCurriculum(false); }
  };

  const fullName = (s) => [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ") || s.full_name || "—";

  const currentSubjects = useMemo(() => {
    return studentSubjects.filter((ss) => {
      if (ss.sub_year == null || ss.sub_semester == null) return true;
      return ss.sub_year === student.year_level && ss.sub_semester === student.current_semester;
    });
  }, [studentSubjects, student.year_level, student.current_semester]);

  const tabIndex = TABS.findIndex((t) => t.key === tab);

  return (
    <div className="modal-overlay items-start pt-8 pb-10 overflow-y-auto" onClick={onClose}>
      <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {fullName(student).split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{fullName(student)}</h3>
              <p className="text-xs text-slate-400 font-mono">{student.student_number} · {student.course_name || "—"} · {student.year_level ? `${ordinal(student.year_level)} Year` : "—"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* ── Step tabs ── */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-0">
            {TABS.map((t, i) => {
              const Icon = t.icon;
              const isActive = tab === t.key;
              const isDone = i < tabIndex;
              return (
                <div key={t.key} className="flex items-center">
                  <button
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive ? "bg-white text-primary-600 shadow-sm border border-slate-200" :
                      isDone   ? "text-emerald-600 hover:bg-white/60" :
                                 "text-slate-400 hover:text-slate-600 hover:bg-white/60"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive ? "bg-primary-600 text-white" :
                      isDone   ? "bg-emerald-500 text-white" :
                                 "bg-slate-200 text-slate-500"
                    }`}>
                      {isDone ? "✓" : i + 1}
                    </span>
                    <Icon size={12} />
                    {t.key === "subjects" ? `Subjects (${studentSubjects.length})` : t.label}
                  </button>
                  {i < TABS.length - 1 && (
                    <div className={`w-8 h-px mx-1 ${i < tabIndex ? "bg-emerald-300" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 space-y-5">

          {/* Profile */}
          {tab === "profile" && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-800">Student Information</span>
              </div>
              {profileLoading ? (
                <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
              ) : profileData ? (
                <div className="p-5 grid grid-cols-2 gap-4">
                  <Field label="Student No." value={profileData.student_number} />
                  <Field label="Full Name" value={fullName(profileData)} />
                  <Field label="Email" value={profileData.email} />
                  <Field label="Date of Birth" value={formatDate(profileData.date_of_birth)} />
                  <Field label="Gender" value={profileData.gender} />
                  <Field label="Contact No." value={profileData.contact_number} />
                  <Field label="Address" value={profileData.address} />
                  <Field label="Course" value={profileData.course_name} />
                  <Field label="Year Level" value={profileData.year_level ? `${ordinal(profileData.year_level)} Year` : null} />
                  <Field label="Current Semester" value={profileData.current_semester ? `${ordinal(profileData.current_semester)} Semester` : null} />
                  {profileData.is_transfer && (
                    <>
                      <div className="col-span-2 border-t border-blue-100 pt-3 mt-1">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">Transfer Information</span>
                      </div>
                      <Field label="Previous School" value={profileData.previous_school} />
                      <Field label="School Address" value={profileData.previous_school_address} />
                      <Field label="Previous Year Level" value={profileData.previous_year_level ? `${ordinal(profileData.previous_year_level)} Year` : null} />
                    </>
                  )}
                </div>
              ) : (
                <div className="p-10 text-center text-sm text-slate-400">No data available</div>
              )}
            </div>
          )}

          {/* Subjects */}
          {tab === "subjects" && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  {ordinal(student.year_level)} Year — {ordinal(student.current_semester)} Semester Subjects
                </span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{currentSubjects.length} subjects</span>
              </div>
              {currentSubjects.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">No subjects enrolled for this semester</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="table-header">
                    <tr>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Units</th>
                      <th className="px-5 py-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentSubjects.map((ss) => (
                      <tr key={ss.id} className="table-row">
                        <td className="table-cell">
                          <span className="font-mono font-medium text-slate-800">{ss.subject_code}</span>
                          <p className="text-[11px] text-slate-500">{ss.subject_name}</p>
                        </td>
                        <td className="table-cell"><span className={`badge ${ss.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>{ss.subject_type}</span></td>
                        <td className="table-cell text-slate-600">{ss.units}</td>
                        <td className="table-cell">{ss.grade ? <span className="badge badge-green">{ss.grade}</span> : <span className="badge badge-yellow">INC</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Curriculum */}
          {tab === "curriculum" && (
            <AcademicRecord student={student} curriculum={curriculum} loading={loadingCurriculum} onBack={() => setTab("subjects")} />
          )}
        </div>
      </div>
    </div>
  );
}
