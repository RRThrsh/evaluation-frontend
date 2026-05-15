import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CourseManager() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", code: "" });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        try {
            const data = await api.get("/api/admin/courses");
            setCourses(data.data ?? []);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => { setForm({ name: "", code: "" }); setEditing(null); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.code.trim()) { showToast("Name and code are required", "error"); return; }
        setSaving(true);
        try {
            if (editing) {
                await api.put(`/api/admin/courses/${editing}`, form);
                showToast("Course updated");
            } else {
                await api.post("/api/admin/courses", form);
                showToast("Course created");
            }
            resetForm();
            await load();
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (course) => {
        setForm({ name: course.name, code: course.code });
        setEditing(course.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course?")) return;
        try {
            await api.delete(`/api/admin/courses/${id}`);
            showToast("Course deleted");
            await load();
        } catch (err) {
            showToast(err.message, "error");
        }
    };

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
                <h3 className="text-sm font-bold text-slate-800 mb-4">{editing ? "Edit Course" : "Add Course"}</h3>
                <form onSubmit={handleSave} className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">Course Name</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Bachelor of Science in Computer Science" />
                    </div>
                    <div className="w-32">
                        <label className="block text-xs text-slate-500 mb-1">Code</label>
                        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase" placeholder="BSCS" />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={saving}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? "..." : editing ? "Update" : "Add"}
                        </button>
                        {editing && (
                            <button type="button" onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">Courses</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{courses.length} courses</span>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
                ) : courses.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-400">No courses yet</div>
                ) : (
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Code</th>
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold">Created</th>
                                <th className="px-5 py-3 font-semibold w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {courses.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3 font-mono font-medium text-slate-800">{c.code}</td>
                                    <td className="px-5 py-3 text-slate-600">{c.name}</td>
                                    <td className="px-5 py-3 text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(c)} className="text-blue-500 hover:text-blue-700 transition text-[11px] font-medium">Edit</button>
                                            <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 transition text-[11px] font-medium">Del</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
