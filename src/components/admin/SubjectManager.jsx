import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit3, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";
import api from "../../services/api";
import { sanitizeObject } from "../../utils/sanitize";
import { usePermissions } from "../../context/PermissionContext";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 10;

function nth(n) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ max_year_level: 4, semesters_per_year: 2 });
  const YEARS = Array.from({ length: Number(config.max_year_level) }, (_, i) => i + 1);
  const SEMESTERS = Array.from({ length: Number(config.semesters_per_year) }, (_, i) => i + 1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject_code: "", subject_name: "", year_level: 1, semester: 1, units: 3, course_id: "", prerequisites: [], subject_type: "Lec" });
  const [newPrereq, setNewPrereq] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [page, setPage] = useState(1);
  const { can } = usePermissions();

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    try {
      const [subjData, courseData, cfgRes] = await Promise.all([
        api.get("/api/subjects"), api.get("/api/admin/courses"), api.get("/api/config"),
      ]);
      setSubjects(subjData.data ?? []);
      setCourses(courseData.data ?? []);
      if (cfgRes?.data) setConfig({ max_year_level: Number(cfgRes.data.max_year_level) || 4, semesters_per_year: Number(cfgRes.data.semesters_per_year) || 2 });
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ subject_code: "", subject_name: "", year_level: 1, semester: 1, units: 3, course_id: "", prerequisites: [], subject_type: "Lec" });
    setNewPrereq("");
    setEditing(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.subject_code.trim() || !form.subject_name.trim()) { showToast("Subject code and name are required", "error"); return; }
    setSaving(true);
    try {
      const payload = sanitizeObject({ subject_code: form.subject_code, subject_name: form.subject_name, year_level: form.year_level, semester: form.semester, units: form.units, course_id: form.course_id || null, subject_type: form.subject_type });
      let subjectId;
      if (editing) {
        await api.patch(`/api/subjects/${editing}`, payload);
        subjectId = editing;
      } else {
        const res = await api.post("/api/subjects", payload);
        subjectId = res.data?.data?.id || res.data?.id;
      }
      await api.patch(`/api/subjects/${subjectId}/prerequisites/reorder`, { prerequisite_ids: form.prerequisites.map(p => p.prerequisite_id) });
      showToast(editing ? "Subject updated" : "Subject created");
      resetForm();
      await load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = (s) => {
    setForm({ subject_code: s.subject_code, subject_name: s.subject_name, year_level: s.year_level, semester: s.semester, units: s.units, course_id: s.course_id || "", prerequisites: s.prerequisites ? s.prerequisites.map(p => ({ prerequisite_id: p.prerequisite_id, subject_code: p.subject_code, subject_name: p.subject_name })) : [], subject_type: s.subject_type || "Lec" });
    setEditing(s.id);
  };

  const handleDelete = async (id) => {
    setConfirmAction(null);
    try { await api.delete(`/api/subjects/${id}`); showToast("Subject deactivated"); await load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  const activeSubjects = subjects.filter((s) => s.is_active !== false);
  const filteredSubjects = useMemo(() => {
    let list = activeSubjects;
    if (courseFilter) list = list.filter((s) => s.course_id === courseFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.subject_code.toLowerCase().includes(q) || s.subject_name.toLowerCase().includes(q) || (s.course_name || "").toLowerCase().includes(q));
    }
    return list;
  }, [activeSubjects, search, courseFilter]);

  const subjectsByCourse = useMemo(() => {
    const map = {};
    for (const s of filteredSubjects) {
      const cid = s.course_id || "__none__";
      if (!map[cid]) map[cid] = { course_id: cid, course_code: s.course_code || s.course_name || "Uncategorized", course_name: s.course_name || "", subjects: [] };
      map[cid].subjects.push(s);
    }
    return Object.values(map).sort((a, b) => a.course_code.localeCompare(b.course_code));
  }, [filteredSubjects]);

  const courseYearSemSubjects = useMemo(() => {
    const result = {};
    for (const grp of subjectsByCourse) {
      const byYear = {};
      YEARS.forEach((y) => { SEMESTERS.forEach((sem) => { const key = `${y}-${sem}`; if (!byYear[key]) byYear[key] = []; byYear[key] = grp.subjects.filter((s) => s.year_level === y && s.semester === sem); }); });
      result[grp.course_id] = byYear;
    }
    return result;
  }, [subjectsByCourse, YEARS, SEMESTERS]);

  const totalPages = Math.max(1, Math.ceil(subjectsByCourse.length / PAGE_SIZE));
  const paginatedGroups = subjectsByCourse.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  const toggleCourse = (courseId) => { setExpandedCourses((prev) => { const next = { ...prev }; if (next[courseId]) delete next[courseId]; else next[courseId] = true; return next; }); };
  const expandAll = () => { const all = {}; subjectsByCourse.forEach((g) => { all[g.course_id] = true; }); setExpandedCourses(all); };
  const collapseAll = () => setExpandedCourses({});

  return (
    <div className="space-y-6">
      {toast && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{toast.message}</div>}

      {can("subjects.manage") && (
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">{editing ? "Edit Subject" : "Add Subject"}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Subject Code</label>
              <input value={form.subject_code} onChange={(e) => setForm({ ...form, subject_code: e.target.value })} className="input-field uppercase" placeholder="CS101" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Subject Name</label>
              <input value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })} className="input-field" placeholder="Introduction to Programming" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Year Level</label>
              <select value={form.year_level} onChange={(e) => setForm({ ...form, year_level: Number(e.target.value) })} className="input-field">
                {YEARS.map((y) => <option key={y} value={y}>{y}{nth(y)} Year</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Semester</label>
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })} className="input-field">
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Units</label>
              <input type="number" min={1} max={6} value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Type</label>
              <select value={form.subject_type} onChange={(e) => setForm({ ...form, subject_type: e.target.value })} className="input-field">
                <option value="Lab">Lab</option>
                <option value="Lec">Lec</option>
                <option value="Lab & Lec">Lab &amp; Lec</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Course</label>
              <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="input-field">
                <option value="">— Select Course —</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            </div>
            <div className="lg:col-span-4">
              <label className="block text-xs text-slate-500 mb-1">Prerequisite Chain</label>
              <div className="space-y-1.5">
                {form.prerequisites.map((p, i) => (
                  <div key={p.prerequisite_id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 w-4">{i + 1}.</span>
                    <span className="text-xs font-medium text-slate-700 flex-1">{p.subject_code} — {p.subject_name}</span>
                    <button type="button" onClick={() => { const next = [...form.prerequisites]; next.splice(i, 1); setForm({ ...form, prerequisites: next }); }} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                    {i > 0 && <button type="button" onClick={() => { const next = [...form.prerequisites]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; setForm({ ...form, prerequisites: next }); }} className="text-slate-400 hover:text-slate-600"><ChevronUp size={14} /></button>}
                    {i < form.prerequisites.length - 1 && <button type="button" onClick={() => { const next = [...form.prerequisites]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; setForm({ ...form, prerequisites: next }); }} className="text-slate-400 hover:text-slate-600"><ChevronDown size={14} /></button>}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <select value={newPrereq} onChange={(e) => setNewPrereq(e.target.value)} className="input-field py-1.5 text-xs flex-1">
                    <option value="">— Add Prerequisite —</option>
                    {activeSubjects.filter((s) => s.id !== editing && s.course_id === form.course_id && !form.prerequisites.find(p => p.prerequisite_id === s.id)).map((s) => <option key={s.id} value={s.id}>{s.subject_code} — {s.subject_name}</option>)}
                  </select>
                  <button type="button" disabled={!newPrereq} onClick={() => { const sub = activeSubjects.find(s => s.id === newPrereq); if (sub) { setForm({ ...form, prerequisites: [...form.prerequisites, { prerequisite_id: sub.id, subject_code: sub.subject_code, subject_name: sub.subject_name }] }); setNewPrereq(""); } }} className="btn btn-primary btn-sm">Add</button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "..." : editing ? "Update Subject" : "Add Subject"}</button>
            {editing && <button type="button" onClick={resetForm} className="btn btn-secondary btn-md">Cancel</button>}
          </div>
        </form>
      </div>
      )}

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-800">Curriculum Layout</span>
          <div className="flex items-center gap-2">
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="input-field py-1.5 text-xs w-44">
              <option value="">All Courses</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field py-1.5 text-xs w-48" placeholder="Search subjects..." />
            <button onClick={expandAll} className="btn btn-ghost btn-sm">Expand All</button>
            <button onClick={collapseAll} className="btn btn-ghost btn-sm">Collapse All</button>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{activeSubjects.length} subjects</span>
          </div>
        </div>
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
        ) : subjectsByCourse.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">{search ? "No subjects match your search" : "No subjects yet"}</div>
        ) : (
          <div className="p-5 space-y-4">
            {paginatedGroups.map((grp) => {
              const expanded = !!expandedCourses[grp.course_id];
              const byYear = courseYearSemSubjects[grp.course_id] || {};
              const totalUnits = grp.subjects.reduce((sum, s) => sum + (s.units || 0), 0);
              return (
                <div key={grp.course_id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => toggleCourse(grp.course_id)} className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-50 to-white hover:from-blue-50 hover:to-white transition text-left group">
                    <div className="flex items-center gap-3 min-w-0">
                      <svg className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      <svg className={`w-5 h-5 shrink-0 ${expanded ? "text-primary-600" : "text-amber-500"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v1H2V6zm0 3h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" /></svg>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-slate-800">{grp.course_code}</span>
                        {grp.course_name && <span className="text-xs text-slate-400 ml-2">{grp.course_name}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="badge badge-gray">{grp.subjects.length} subjects</span>
                      <span className="text-[10px] text-slate-400">{totalUnits} units</span>
                    </div>
                  </button>
                  {expanded && (
                    <div className="border-t border-slate-100 p-4 space-y-5">
                      {YEARS.map((year) => {
                        const yearHasSubjects = SEMESTERS.some((sem) => (byYear[`${year}-${sem}`] || []).length > 0);
                        if (!yearHasSubjects) return null;
                        return (
                          <div key={year}>
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">{nth(year)} Year</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {SEMESTERS.map((sem) => {
                                const subs = byYear[`${year}-${sem}`] || [];
                                return (
                                  <div key={sem} className="border border-slate-100 rounded-lg overflow-hidden">
                                    <div className="bg-slate-50/50 px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                                      <span className="text-[11px] font-semibold text-slate-600">Semester {sem}</span>
                                      <span className="text-[10px] text-slate-400">{subs.length}</span>
                                    </div>
                                    {subs.length === 0 ? (
                                      <div className="p-3 text-center text-[11px] text-slate-300 italic">—</div>
                                    ) : (
                                      <div className="divide-y divide-slate-50">
                                        {subs.map((s) => (
                                          <div key={s.id} className="px-3.5 py-2 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[11px] font-mono font-medium text-slate-800">{s.subject_code}</span>
                                                <span className={`badge ${s.subject_type === "Lab" ? "badge-blue" : s.subject_type === "Lab & Lec" ? "badge-purple" : "badge-amber"}`}>{s.subject_type}</span>
                                              </div>
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[10px] text-slate-500">{s.subject_name}</span>
                                                {s.prerequisites && s.prerequisites.length > 0 && (
                                                  <span className="text-[10px] text-amber-600/70 ml-1">
                                                    → {s.prerequisites.map((p, i) => <span key={p.prerequisite_id}>{i > 0 && <span className="text-slate-400 mx-0.5">→</span>}{p.subject_code}</span>)}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                              <span className="text-[10px] text-slate-400">{s.units}u</span>
                                              {can("subjects.manage") && <button onClick={() => handleEdit(s)} className="btn btn-ghost btn-sm text-amber-500 hover:text-amber-700 opacity-0 group-hover:opacity-100"><Edit3 size={14} /></button>}
                                              {can("subjects.manage") && <button onClick={() => setConfirmAction({ id: s.id, name: s.subject_code })} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {confirmAction && <ConfirmModal title="Deactivate Subject" message={`Deactivate subject "${confirmAction.name}"?`} extra="This will hide it from the curriculum. Existing enrollments are not affected." confirmLabel="Deactivate" onConfirm={() => handleDelete(confirmAction.id)} onCancel={() => setConfirmAction(null)} />}
    </div>
  );
}
