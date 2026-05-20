import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import exportToExcel from "../../utils/exportToExcel";
import { sanitizeObject } from "../../utils/sanitize";
import ConfirmModal from "../common/ConfirmModal";

export default function SubjectManager() {
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({ max_year_level: 4, semesters_per_year: 2 });
    const YEARS = Array.from({ length: Number(config.max_year_level) }, (_, i) => i + 1);
    const SEMESTERS = Array.from({ length: Number(config.semesters_per_year) }, (_, i) => i + 1);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ subject_code: "", subject_name: "", year_level: 1, semester: 1, units: 3, course_id: "", prerequisite_id: "", subject_type: "major" });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [exportConfirm, setExportConfirm] = useState(null);
    const [expandedCourses, setExpandedCourses] = useState({});

    const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

    const load = async () => {
        try {
            const [subjData, courseData, cfgRes] = await Promise.all([
                api.get("/api/admin/subjects"), api.get("/api/admin/courses"), api.get("/api/config"),
            ]);
            setSubjects(subjData.data ?? []); setCourses(courseData.data ?? []);
            if (cfgRes?.data) setConfig({ max_year_level: Number(cfgRes.data.max_year_level) || 4, semesters_per_year: Number(cfgRes.data.semesters_per_year) || 2 });
        } catch (err) { showToast(err.message, "error"); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => {
        setForm({ subject_code: "", subject_name: "", year_level: 1, semester: 1, units: 3, course_id: "", prerequisite_id: "", subject_type: "major" });
        setEditing(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.subject_code.trim() || !form.subject_name.trim()) { showToast("Subject code and name are required", "error"); return; }
        setSaving(true);
        try {
            const payload = sanitizeObject({ ...form, prerequisite_id: form.prerequisite_id || null, course_id: form.course_id || null });
            if (editing) { await api.put(`/api/admin/subjects/${editing}`, payload); showToast("Subject updated"); }
            else { await api.post("/api/admin/subjects", payload); showToast("Subject created"); }
            resetForm(); await load();
        } catch (err) { showToast(err.message, "error"); }
        finally { setSaving(false); }
    };

    const handleEdit = (s) => {
        setForm({ subject_code: s.subject_code, subject_name: s.subject_name, year_level: s.year_level, semester: s.semester, units: s.units, course_id: s.course_id || "", prerequisite_id: s.prerequisite_id || "", subject_type: s.subject_type || "major" });
        setEditing(s.id);
    };

    const handleDelete = async (id) => {
        setConfirmAction(null);
        try { await api.delete(`/api/admin/subjects/${id}`); showToast("Subject deactivated"); await load(); }
        catch (err) { showToast(err.message, "error"); }
    };

    const activeSubjects = subjects.filter((s) => s.is_active !== false);
    const filteredSubjects = useMemo(() => {
        if (!search.trim()) return activeSubjects;
        const q = search.toLowerCase();
        return activeSubjects.filter((s) => s.subject_code.toLowerCase().includes(q) || s.subject_name.toLowerCase().includes(q) || (s.course_name || "").toLowerCase().includes(q));
    }, [activeSubjects, search]);

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

    const toggleCourse = (courseId) => { setExpandedCourses((prev) => { const next = { ...prev }; if (next[courseId]) delete next[courseId]; else next[courseId] = true; return next; }); };
    const expandAll = () => { const all = {}; subjectsByCourse.forEach((g) => { all[g.course_id] = true; }); setExpandedCourses(all); };
    const collapseAll = () => setExpandedCourses({});

    return (
        <div className="space-y-6">
            {toast && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{toast.message}</div>}

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
                                <option value="major">Major</option>
                                <option value="minor">Minor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Course</label>
                            <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="input-field">
                                <option value="">— Select Course —</option>
                                {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Prerequisite</label>
                            <select value={form.prerequisite_id} onChange={(e) => setForm({ ...form, prerequisite_id: e.target.value })} className="input-field">
                                <option value="">— None —</option>
                                {activeSubjects.filter((s) => !form.course_id || s.course_id === form.course_id).map((s) => <option key={s.id} value={s.id}>{s.subject_code} — {s.subject_name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "..." : editing ? "Update Subject" : "Add Subject"}</button>
                        {editing && <button type="button" onClick={resetForm} className="btn btn-secondary btn-md">Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">Curriculum Layout</span>
                    <div className="flex items-center gap-2">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field py-1.5 text-xs w-48" placeholder="Search subjects..." />
                        <button onClick={expandAll} className="btn btn-ghost btn-sm">Expand All</button>
                        <button onClick={collapseAll} className="btn btn-ghost btn-sm">Collapse All</button>
                        <button onClick={() => setExportConfirm({ step: 1, count: activeSubjects.length })} className="btn btn-ghost btn-sm">Export</button>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{activeSubjects.length} subjects</span>
                    </div>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
                ) : subjectsByCourse.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-400">{search ? "No subjects match your search" : "No subjects yet"}</div>
                ) : (
                    <div className="p-5 space-y-4">
                        {subjectsByCourse.map((grp) => {
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
                                                                                        <div className="min-w-0">
                                                                                            <div className="flex items-center gap-1.5">
                                                                                                <span className="text-[11px] font-mono font-medium text-slate-800">{s.subject_code}</span>
                                                                                                <span className={`badge ${s.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>{s.subject_type}</span>
                                                                                            </div>
                                                                                            <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{s.subject_name}</p>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                                                                            <span className="text-[10px] text-slate-400">{s.units}u</span>
                                                                                            <button onClick={() => handleEdit(s)} className="btn btn-ghost btn-sm text-amber-500 hover:text-amber-700 opacity-0 group-hover:opacity-100"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                                                                            <button onClick={() => setConfirmAction({ id: s.id, name: s.subject_code })} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
            </div>

            {confirmAction && <ConfirmModal title="Deactivate Subject" message={`Deactivate subject "${confirmAction.name}"?`} extra="This will hide it from the curriculum. Existing enrollments are not affected." confirmLabel="Deactivate" onConfirm={() => handleDelete(confirmAction.id)} onCancel={() => setConfirmAction(null)} />}
            {exportConfirm?.step === 1 && <ConfirmModal title="Export to Excel" message={`Export ${exportConfirm.count} subject(s) to Excel?`} confirmLabel="Continue" onConfirm={() => setExportConfirm({ ...exportConfirm, step: 2 })} onCancel={() => setExportConfirm(null)} />}
            {exportConfirm?.step === 2 && <ConfirmModal title="Confirm Export" message={`Ready to download "${exportConfirm.count} subjects" as an Excel file. Proceed?`} confirmLabel="Export" onConfirm={() => { setExportConfirm(null); exportToExcel(activeSubjects, "subjects.xlsx", "Subjects"); }} onCancel={() => setExportConfirm(null)} />}
        </div>
    );
}

function nth(n) {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return `th`;
}
