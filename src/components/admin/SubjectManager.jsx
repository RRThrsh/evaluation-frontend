import { useEffect, useState } from "react";
import api from "../../services/api";

export default function SubjectManager() {
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({ max_year_level: 4, semesters_per_year: 2 });
    const YEARS = Array.from({ length: Number(config.max_year_level) }, (_, i) => i + 1);
    const SEMESTERS = Array.from({ length: Number(config.semesters_per_year) }, (_, i) => i + 1);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        subject_code: "", subject_name: "", year_level: 1, semester: 1,
        units: 3, course_id: "", prerequisite_id: "", subject_type: "major",
    });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        try {
            const [subjData, courseData, cfgRes] = await Promise.all([
                api.get("/api/admin/subjects"),
                api.get("/api/admin/courses"),
                api.get("/api/config"),
            ]);
            setSubjects(subjData.data ?? []);
            setCourses(courseData.data ?? []);
            if (cfgRes?.data) setConfig({ max_year_level: Number(cfgRes.data.max_year_level) || 4, semesters_per_year: Number(cfgRes.data.semesters_per_year) || 2 });
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => {
        setForm({ subject_code: "", subject_name: "", year_level: 1, semester: 1, units: 3, course_id: "", prerequisite_id: "", subject_type: "major" });
        setEditing(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.subject_code.trim() || !form.subject_name.trim()) {
            showToast("Subject code and name are required", "error");
            return;
        }
        setSaving(true);
        try {
            const payload = { ...form, prerequisite_id: form.prerequisite_id || null, course_id: form.course_id || null };
            if (editing) {
                await api.put(`/api/admin/subjects/${editing}`, payload);
                showToast("Subject updated");
            } else {
                await api.post("/api/admin/subjects", payload);
                showToast("Subject created");
            }
            resetForm();
            await load();
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (s) => {
        setForm({
            subject_code: s.subject_code, subject_name: s.subject_name,
            year_level: s.year_level, semester: s.semester, units: s.units,
            course_id: s.course_id || "", prerequisite_id: s.prerequisite_id || "",
            subject_type: s.subject_type || "major",
        });
        setEditing(s.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Deactivate this subject?")) return;
        try {
            await api.delete(`/api/admin/subjects/${id}`);
            showToast("Subject deactivated");
            await load();
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const activeSubjects = subjects.filter((s) => s.is_active !== false);
    const subjectsByYear = {};
    YEARS.forEach((y) => {
        SEMESTERS.forEach((sem) => {
            const key = `${y}-${sem}`;
            subjectsByYear[key] = activeSubjects.filter((s) => s.year_level === y && s.semester === sem);
        });
    });

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${
                    toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                }`}>
                    {toast.message}
                </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">{editing ? "Edit Subject" : "Add Subject"}</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Subject Code</label>
                            <input value={form.subject_code} onChange={(e) => setForm({ ...form, subject_code: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase" placeholder="CS101" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Subject Name</label>
                            <input value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Introduction to Programming" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Year Level</label>
                            <select value={form.year_level} onChange={(e) => setForm({ ...form, year_level: Number(e.target.value) })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                {YEARS.map((y) => <option key={y} value={y}>{y}{ordinal(y)} Year</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Semester</label>
                            <select value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Units</label>
                            <input type="number" min={1} max={6} value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Type</label>
                            <select value={form.subject_type} onChange={(e) => setForm({ ...form, subject_type: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                <option value="major">Major</option>
                                <option value="minor">Minor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Course</label>
                            <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                <option value="">— Select Course —</option>
                                {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Prerequisite</label>
                            <select value={form.prerequisite_id} onChange={(e) => setForm({ ...form, prerequisite_id: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                <option value="">— None —</option>
                                {activeSubjects.map((s) => <option key={s.id} value={s.id}>{s.subject_code} — {s.subject_name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={saving}
                            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? "..." : editing ? "Update Subject" : "Add Subject"}
                        </button>
                        {editing && (
                            <button type="button" onClick={resetForm}
                                className="px-5 py-2 text-sm font-medium text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Curriculum View */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">Curriculum Layout</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{activeSubjects.length} subjects</span>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
                ) : (
                    <div className="p-5 space-y-6">
                        {YEARS.map((year) => (
                            <div key={year}>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{ordinal(year)} Year</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {SEMESTERS.map((sem) => {
                                        const key = `${year}-${sem}`;
                                        const subs = subjectsByYear[key] || [];
                                        return (
                                            <div key={sem} className="border border-slate-200 rounded-xl overflow-hidden">
                                                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                                                    <span className="text-xs font-semibold text-slate-600">Semester {sem}</span>
                                                    <span className="text-[10px] text-slate-400 ml-2">{subs.length} subjects</span>
                                                </div>
                                                {subs.length === 0 ? (
                                                    <div className="p-4 text-center text-xs text-slate-400 italic">No subjects</div>
                                                ) : (
                                                    <div className="divide-y divide-slate-50">
                                                        {subs.map((s) => (
                                                            <div key={s.id} className="px-4 py-2.5 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-mono font-medium text-slate-800">{s.subject_code}</span>
                                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${s.subject_type === "major" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
                                                                            {s.subject_type}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] text-slate-500 truncate max-w-[250px]">{s.subject_name}</p>
                                                                    {s.prerequisite_name && (
                                                                        <p className="text-[10px] text-amber-500">Prereq: {s.prerequisite_name}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                                                    <span className="text-[10px] text-slate-400">{s.units} units</span>
                                                                    <button onClick={() => handleEdit(s)}
                                                                        className="text-blue-400 hover:text-blue-600 transition opacity-0 group-hover:opacity-100 text-[11px] font-medium">Edit</button>
                                                                    <button onClick={() => handleDelete(s.id)}
                                                                        className="text-red-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 text-[11px] font-medium">Del</button>
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ordinal(n) {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
}
