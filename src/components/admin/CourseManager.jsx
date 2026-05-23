import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import exportToExcel from "../../utils/exportToExcel";
import { sanitizeObject } from "../../utils/sanitize";
import { usePermissions } from "../../context/PermissionContext";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 15;

export default function CourseManager() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", code: "" });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [exportConfirm, setExportConfirm] = useState(null);
    const [page, setPage] = useState(1);
    const { can } = usePermissions();

    const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

    const load = async () => {
        try { const data = await api.get("/api/admin/courses"); setCourses(data.data ?? []); }
        catch (err) { showToast(err.message, "error"); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => { setForm({ name: "", code: "" }); setEditing(null); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.code.trim()) { showToast("Name and code are required", "error"); return; }
        setSaving(true);
        try {
            if (editing) { await api.put(`/api/admin/courses/${editing}`, sanitizeObject(form)); showToast("Course updated"); }
            else { await api.post("/api/admin/courses", sanitizeObject(form)); showToast("Course created"); }
            resetForm(); await load();
        } catch (err) { showToast(err.message, "error"); }
        finally { setSaving(false); }
    };

    const handleEdit = (course) => { setForm({ name: course.name, code: course.code }); setEditing(course.id); };

    const handleDelete = async (id) => {
        setConfirmAction(null);
        try { await api.delete(`/api/admin/courses/${id}`); showToast("Course deleted"); await load(); }
        catch (err) { showToast(err.message, "error"); }
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return courses;
        const q = search.toLowerCase();
        return courses.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }, [courses, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => { setPage(1); }, [search]);

    return (
        <div className="space-y-6">
            {toast && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{toast.message}</div>}

            {can("courses.manage") && (
            <div className="card p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">{editing ? "Edit Course" : "Add Course"}</h3>
                <form onSubmit={handleSave} className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">Course Name</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Bachelor of Science in Computer Science" />
                    </div>
                    <div className="w-32">
                        <label className="block text-xs text-slate-500 mb-1">Code</label>
                        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field uppercase" placeholder="BSCS" />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "..." : editing ? "Update" : "Add"}</button>
                        {editing && <button type="button" onClick={resetForm} className="btn btn-secondary btn-md">Cancel</button>}
                    </div>
                </form>
            </div>
            )}

            <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">Courses</span>
                    <div className="flex items-center gap-2">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field py-1.5 text-xs w-48" placeholder="Search courses..." />
                        {can("courses.manage") && <button onClick={() => setExportConfirm({ step: 1, count: filtered.length })} className="btn btn-ghost btn-sm">Export</button>}
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{courses.length} courses</span>
                    </div>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-400">{search ? "No courses match your search" : "No courses yet"}</div>
                ) : (
                    <table className="w-full text-left text-xs">
                        <thead className="table-header">
                            <tr>
                                <th className="px-5 py-3">Code</th>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Created</th>
                                {can("courses.manage") && <th className="px-5 py-3 w-24">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.map((c) => (
                                <tr key={c.id} className="table-row">
                                    <td className="table-cell font-mono font-medium text-slate-800">{c.code}</td>
                                    <td className="table-cell text-slate-600">{c.name}</td>
                                    <td className="table-cell text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                                    {can("courses.manage") && (
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(c)} className="btn btn-ghost btn-sm text-amber-500 hover:text-amber-700"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                            <button onClick={() => setConfirmAction({ id: c.id, name: c.name })} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                    </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            {confirmAction && <ConfirmModal title="Delete Course" message={`Delete course "${confirmAction.name}"?`} extra="This action cannot be undone." confirmLabel="Delete" onConfirm={() => handleDelete(confirmAction.id)} onCancel={() => setConfirmAction(null)} />}
            {exportConfirm?.step === 1 && <ConfirmModal title="Export to Excel" message={`Export ${exportConfirm.count} course(s) to Excel?`} confirmLabel="Continue" onConfirm={() => setExportConfirm({ ...exportConfirm, step: 2 })} onCancel={() => setExportConfirm(null)} />}
            {exportConfirm?.step === 2 && <ConfirmModal title="Confirm Export" message={`Ready to download "${exportConfirm.count} courses" as an Excel file. Proceed?`} confirmLabel="Export" onConfirm={() => { setExportConfirm(null); exportToExcel(filtered, "courses.xlsx", "Courses"); }} onCancel={() => setExportConfirm(null)} />}
        </div>
    );
}
