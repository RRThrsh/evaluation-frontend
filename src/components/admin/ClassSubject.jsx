import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, BookOpen, Users, GraduationCap, Plus } from "lucide-react";
import api from "../../services/api";
import { usePermissions } from "../../context/PermissionContext";
import Pagination from "../common/Pagination";
import { sanitizeInput, sanitizeObject } from "../../utils/sanitize";

const PAGE_SIZE = 15;

export default function ClassSubject() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [semester, setSemester] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [schoolYearModal, setSchoolYearModal] = useState(false);
  const [newSchoolYear, setNewSchoolYear] = useState("");

  const [schoolYearList, setSchoolYearList] = useState([]);
  const [sections, setSections] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [addStudentSearch, setAddStudentSearch] = useState("");
  const [addStudentResults, setAddStudentResults] = useState([]);
  const [addStudentSectionId, setAddStudentSectionId] = useState("");
  const { can } = usePermissions();
  const schoolYearOptions = useMemo(() => [
    { value: "", label: "All School Years" },
    ...schoolYearList.map(y => ({ value: y, label: y })),
  ], [schoolYearList]);

  useEffect(() => {
    api.get("/api/admin/school-years").then(r => setSchoolYearList(r.data ?? [])).catch(() => {});
  }, []);

  const yearOptions = [
    { value: "", label: "All Years" },
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
  ];

  const semesterOptions = [
    { value: "", label: "All Semesters" },
    { value: "1", label: "1st Semester" },
    { value: "2", label: "2nd Semester" },
  ];

  useEffect(() => {
    api.get("/api/admin/courses").then((res) => setCourses(res.data ?? [])).catch(() => {});
  }, []);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (courseId) params.course_id = courseId;
      if (schoolYear) params.school_year = schoolYear;
      if (semester) params.semester = semester;
      if (yearLevel) params.year_level = yearLevel;
      const res = await api.get("/api/admin/class-subjects", { params });
      setSubjects(res.data ?? []);
    } catch {} finally { setLoading(false); }
  }, [courseId, schoolYear, semester, yearLevel]);

  useEffect(() => { loadSubjects(); }, [loadSubjects]);

  useEffect(() => { setPage(1); }, [search, courseId, schoolYear, semester, yearLevel]);

  const loadStudents = async (subject) => {
    setSelectedSubject(subject);
    setStudentsLoading(true);
    setStudents([]);
    setAddStudentSearch("");
    setAddStudentResults([]);
    setAddStudentSectionId("");
    try {
      const [sRes, stRes] = await Promise.all([
        api.get("/api/admin/sections"),
        api.get(`/api/admin/class-subjects/${subject.id}/students`),
      ]);
      setSections(sRes.data ?? []);
      setStudents(stRes.data ?? []);
    } catch {} finally { setStudentsLoading(false); }
  };

  const loadStudentSearch = async (q) => {
    if (!q.trim()) { setAddStudentResults([]); return; }
    try {
      const res = await api.get("/api/admin/students");
      const all = res.data ?? [];
      const term = q.toLowerCase();
      setAddStudentResults(
        all.filter(
          (s) =>
            !students.find((en) => en.id === s.id) &&
            (`${s.last_name} ${s.first_name} ${s.student_number}`.toLowerCase().includes(term))
        ).slice(0, 10)
      );
    } catch {}
  };

  const handleAddStudent = async (studentId) => {
    if (!selectedSubject) return;
    try {
      await api.post(`/api/admin/class-subjects/${selectedSubject.id}/students`, {
        student_id: studentId,
        section_id: addStudentSectionId || null,
      });
      setAddStudentSearch("");
      setAddStudentResults([]);
      setAddStudentSectionId("");
      const res = await api.get(`/api/admin/class-subjects/${selectedSubject.id}/students`);
      setStudents(res.data ?? []);
    } catch (e) {
      alert(e.message || "Failed to add student");
    }
  };

  const handleAssignSection = async (ssId, sectionId) => {
    try {
      await api.patch(`/api/admin/student-subjects/${ssId}/section`, { section_id: sectionId || null });
      setStudents((prev) =>
        prev.map((st) => {
          if (st.ss_id === ssId) {
            const sec = sections.find((s) => s.id === sectionId);
            return { ...st, section_id: sectionId, section_name: sec?.name || null };
          }
          return st;
        })
      );
    } catch (e) {
      alert(e.message || "Failed to assign section");
    }
  };

  const filtered = useMemo(() =>
    subjects.filter((s) =>
      !search || `${s.subject_code} ${s.subject_name} ${s.course_name || ""}`.toLowerCase().includes(search.toLowerCase())
    ), [subjects, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Class Subjects</h2>
          <p className="text-sm text-slate-500 mt-0.5">Browse subjects and view enrolled students</p>
        </div>
        {can("academic-config") && (
        <button onClick={() => { setNewSchoolYear(""); setSchoolYearModal(true); }} className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus size={14} /> Create School Year
        </button>
        )}
      </div>

      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject code or name..."
              className="input-field w-full text-sm pl-9"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="input-field text-sm w-auto">
            <option value="">All Programs</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} className="input-field text-sm w-auto">
            {schoolYearOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="input-field text-sm w-auto">
            {yearOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input-field text-sm w-auto">
            {semesterOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header border-b border-slate-200">
                <th className="text-left px-5 py-3.5">Code</th>
                <th className="text-left px-5 py-3.5">Subject</th>
                <th className="text-left px-5 py-3.5">Program</th>
                <th className="text-center px-5 py-3.5">Year</th>
                <th className="text-center px-5 py-3.5">Sem</th>
                <th className="text-center px-5 py-3.5">Units</th>
                <th className="text-center px-5 py-3.5">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>)}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No subjects found</td></tr>
              ) : (
                paginated.map((subj) => (
                  <tr
                    key={subj.id}
                    onClick={() => loadStudents(subj)}
                    className="table-row cursor-pointer"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{subj.subject_code}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{subj.subject_name}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{subj.course_name || "\u2014"}</td>
                    <td className="px-5 py-3 text-center text-xs text-slate-600">{subj.year_level}</td>
                    <td className="px-5 py-3 text-center text-xs text-slate-600">{subj.semester}</td>
                    <td className="px-5 py-3 text-center text-xs text-slate-600">{subj.units}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                        <Users size={12} />{subj.enrolled_count ?? 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {schoolYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSchoolYearModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Create School Year</h3>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">School Year</label>
            <input
              value={newSchoolYear}
              onChange={(e) => setNewSchoolYear(e.target.value)}
              placeholder="e.g. 2026-2027"
              className="input-field w-full text-sm mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setSchoolYearModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button
                onClick={async () => {
                  if (!newSchoolYear.trim()) return;
                  try {
                    await api.patch("/api/config", sanitizeObject({ school_year_label: sanitizeInput(newSchoolYear) }));
                    setSchoolYear(newSchoolYear.trim());
                    setSchoolYearModal(false);
                  } catch {}
                }}
                disabled={!newSchoolYear.trim()}
                className="btn btn-primary btn-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedSubject(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedSubject.subject_name}</h3>
                  <p className="text-xs text-slate-500">{selectedSubject.subject_code} &middot; {selectedSubject.course_name || "No program"} &middot; Year {selectedSubject.year_level}, Sem {selectedSubject.semester}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSubject(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    value={addStudentSearch}
                    onChange={(e) => { setAddStudentSearch(e.target.value); loadStudentSearch(e.target.value); }}
                    placeholder="Search student to add..."
                    className="input-field w-full text-xs pl-8"
                  />
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  {addStudentResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {addStudentResults.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleAddStudent(s.id)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 last:border-0"
                        >
                          <span className="font-medium">{s.last_name}, {s.first_name}</span>
                          <span className="text-slate-400">{s.student_number}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select
                  value={addStudentSectionId}
                  onChange={(e) => setAddStudentSectionId(e.target.value)}
                  className="input-field text-xs w-auto"
                >
                  <option value="">No section</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {studentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="w-8 h-8 bg-slate-200 rounded-full" />
                      <div className="flex-1 space-y-1.5"><div className="h-3 bg-slate-200 rounded w-1/3" /><div className="h-2.5 bg-slate-100 rounded w-1/4" /></div>
                    </div>
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400">No students enrolled in this subject</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-medium mb-3">{students.length} student(s) enrolled</p>
                  {students.map((st) => (
                    <div key={st.ss_id || st.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {st.student_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{st.student_name}</p>
                        <p className="text-xs text-slate-500">
                          {st.student_number} &middot; {st.course_name || "N/A"} &middot; Year {st.year_level}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={st.section_id || ""}
                          onChange={(e) => handleAssignSection(st.ss_id, e.target.value)}
                          className="input-field text-xs w-auto py-1"
                        >
                          <option value="">No section</option>
                          {sections.map((sec) => (
                            <option key={sec.id} value={sec.id}>{sec.name}</option>
                          ))}
                        </select>
                        {st.grade && (
                          <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
                            {st.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 text-right">
              <button onClick={() => setSelectedSubject(null)} className="btn btn-secondary btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
