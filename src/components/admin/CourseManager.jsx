import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";
import exportToExcel from "../../utils/exportToExcel";
import { sanitizeObject } from "../../utils/sanitize";
import { usePermissions } from "../../context/PermissionContext";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";
import { toPHDate } from "../../utils/date";

const PAGE_SIZE = 15;

export default function CourseManager() {
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", code: "", group_id: "" });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [exportConfirm, setExportConfirm] = useState(null);
    const [page, setPage] = useState(1);
    const [groupModal, setGroupModal] = useState(false);
    const [groupForm, setGroupForm] = useState({ name: "" });
    const [editingGroup, setEditingGroup] = useState(null);
    const [groupConfirm, setGroupConfirm] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const timerRef = useRef(null);
    const { can } = usePermissions();

    useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

    const scheduleDelete = (id, name) => {
        let remaining = 3;
        setPendingDelete({ id, name, remaining });
        timerRef.current = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                setPendingDelete((prev) => prev ? { ...prev, remaining } : null);
            } else {
                clearInterval(timerRef.current);
                timerRef.current = null;
                const targetId = id;
                const targetName = name;
                setPendingDelete(null);
                (async () => {
                    try { await api.delete(`/api/admin/courses/${targetId}`); showToast(`"${targetName}" deleted`); await load(); }
                    catch (err) { showToast(err.message, "error"); }
                })();
            }
        }, 1000);
    };

    const undoDelete = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setPendingDelete(null);
    };

    const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

    const load = async () => {
        try {
            const [coursesRes, groupsRes] = await Promise.all([
                api.get("/api/admin/courses"),
                api.get("/api/admin/course-groups"),
            ]);
            setCourses(coursesRes.data ?? []);
            setGroups(groupsRes.data ?? []);
        } catch (err) { showToast(err.message, "error"); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => { setForm({ name: "", code: "", group_id: "" }); setEditing(null); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.code.trim()) { showToast("Name and code are required", "error"); return; }
        setSaving(true);
        try {
            const payload = { ...sanitizeObject(form), group_id: form.group_id || null };
            if (editing) { await api.put(`/api/admin/courses/${editing}`, payload); showToast("Course updated"); }
            else { await api.post("/api/admin/courses", payload); showToast("Course created"); }
            resetForm(); await load();
        } catch (err) { showToast(err.message, "error"); }
        finally { setSaving(false); }
    };

    const handleEdit = (course) => { setForm({ name: course.name, code: course.code, group_id: course.group_id || "" }); setEditing(course.id); };

    const filtered = useMemo(() => {
        let list = courses;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
        }
        if (groupFilter) list = list.filter((c) => c.group_id === groupFilter);
        return list;
    }, [courses, search, groupFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => { setPage(1); }, [search, groupFilter]);

    const handleSaveGroup = async (e) => {
        e.preventDefault();
        if (!groupForm.name.trim()) { showToast("Group name is required", "error"); return; }
        try {
            if (editingGroup) { await api.put(`/api/admin/course-groups/${editingGroup}`, sanitizeObject(groupForm)); showToast("Group updated"); }
            else { await api.post("/api/admin/course-groups", sanitizeObject(groupForm)); showToast("Group created"); }
            setGroupForm({ name: "" }); setEditingGroup(null); setGroupModal(false); await load();
        } catch (err) { showToast(err.message, "error"); }
    };

    const handleEditGroup = (g) => { setGroupForm({ name: g.name }); setEditingGroup(g.id); setGroupModal(true); };

    const scheduleDeleteGroup = (id, name) => {
        let remaining = 3;
        setPendingDelete({ id, name, remaining, isGroup: true });
        timerRef.current = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                setPendingDelete((prev) => prev ? { ...prev, remaining } : null);
            } else {
                clearInterval(timerRef.current);
                timerRef.current = null;
                const targetId = id;
                setPendingDelete(null);
                (async () => {
                    try { await api.delete(`/api/admin/course-groups/${targetId}`); showToast(`Group "${name}" deleted`); await load(); }
                    catch (err) { showToast(err.message, "error"); }
                })();
            }
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {toast && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{toast.message}</div>}

            {(can("courses.create") || can("courses.manage")) && (
            <div className="card p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">{editing ? "Edit Course" : "Add Course"}</h3>
                <form onSubmit={handleSave} className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">Course Name</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Bachelor of Science in Computer Science" />
                    </div>
                    <div className="w-28">
                        <label className="block text-xs text-slate-500 mb-1">Code</label>
                        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field uppercase" placeholder="BSCS" />
                    </div>
                    <div className="w-44">
                        <label className="block text-xs text-slate-500 mb-1">Group</label>
                        <select value={form.group_id} onChange={(e) => setForm({ ...form, group_id: e.target.value })} className="input-field text-xs">
                            <option value="">No group</option>
                            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
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
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field py-1.5 text-xs w-36" placeholder="Search..." />
                        <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="input-field py-1.5 text-xs w-36">
                            <option value="">All groups</option>
                            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        {can("courses.manage") && <button onClick={() => setGroupModal(true)} className="btn btn-ghost btn-sm">Manage Groups</button>}
                        {can("courses.manage") && <button onClick={() => setExportConfirm({ step: 1, count: filtered.length })} className="btn btn-ghost btn-sm">Export</button>}
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{courses.length} courses</span>
                    </div>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-400">{search || groupFilter ? "No courses match your filters" : "No courses yet"}</div>
                ) : (
                    <table className="w-full text-left text-xs">
                        <thead className="table-header">
                            <tr>
                                <th className="px-5 py-3">Code</th>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Group</th>
                                <th className="px-5 py-3">Created</th>
                                {can("courses.manage") && <th className="px-5 py-3 w-24">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.map((c) => (
                                <tr key={c.id} className="table-row">
                                    <td className="table-cell font-mono font-medium text-slate-800">{c.code}</td>
                                    <td className="table-cell text-slate-600">{c.name}</td>
                                    <td className="table-cell">{c.group_name ? <span className="badge badge-blue">{c.group_name}</span> : <span className="text-slate-300">—</span>}</td>
                                    <td className="table-cell text-slate-400">{toPHDate(c.created_at)}</td>
                                    {can("courses.manage") && (
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(c)} className="btn btn-ghost btn-sm text-amber-500 hover:text-amber-700"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                            <button onClick={() => setConfirmAction({ step: 1, id: c.id, name: c.name })} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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

            {confirmAction?.step === 1 && <ConfirmModal title="Delete Course" message={`Delete course "${confirmAction.name}"?`} confirmLabel="Continue" onConfirm={() => setConfirmAction({ ...confirmAction, step: 2 })} onCancel={() => setConfirmAction(null)} />}
            {confirmAction?.step === 2 && <ConfirmModal title="Confirm Delete" message={`Are you sure you want to permanently delete "${confirmAction.name}"?`} extra="This action cannot be undone." confirmLabel="Delete" onConfirm={() => { const { id, name } = confirmAction; setConfirmAction(null); scheduleDelete(id, name); }} onCancel={() => setConfirmAction(null)} />}
            {exportConfirm?.step === 1 && <ConfirmModal title="Export to Excel" message={`Export ${exportConfirm.count} course(s) to Excel?`} confirmLabel="Continue" onConfirm={() => setExportConfirm({ ...exportConfirm, step: 2 })} onCancel={() => setExportConfirm(null)} />}
            {exportConfirm?.step === 2 && <ConfirmModal title="Confirm Export" message={`Ready to download "${exportConfirm.count} courses" as an Excel file. Proceed?`} confirmLabel="Export" onConfirm={() => { setExportConfirm(null); exportToExcel(filtered, "courses.xlsx", "Courses"); }} onCancel={() => setExportConfirm(null)} />}

            {groupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setGroupModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-800">{editingGroup ? "Edit Group" : "Manage Groups"}</h3>
                            <button onClick={() => { setGroupModal(false); setGroupForm({ name: "" }); setEditingGroup(null); }} className="p-1 text-slate-400 hover:text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleSaveGroup} className="flex gap-2 mb-4">
                            <input value={groupForm.name} onChange={(e) => setGroupForm({ name: e.target.value.toUpperCase() })} className="input-field flex-1 text-sm" placeholder="GROUP CODE" />
                            <button type="submit" className="btn btn-primary btn-sm">{editingGroup ? "Update" : "Add"}</button>
                            {editingGroup && <button type="button" onClick={() => { setGroupForm({ name: "" }); setEditingGroup(null); }} className="btn btn-secondary btn-sm">Cancel</button>}
                        </form>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            {groups.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">No groups created yet</p>
                            ) : (
                                groups.map((g) => (
                                    <div key={g.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-700">{g.name}</span>
                                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{g.course_count} courses</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEditGroup(g)} className="p-1 text-amber-500 hover:text-amber-700"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                            <button onClick={() => setGroupConfirm({ step: 1, id: g.id, name: g.name })} className="p-1 text-red-400 hover:text-red-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {groupConfirm?.step === 1 && <ConfirmModal title="Delete Group" message={`Delete group "${groupConfirm.name}"? Courses in this group will become ungrouped.`} confirmLabel="Continue" onConfirm={() => setGroupConfirm({ ...groupConfirm, step: 2 })} onCancel={() => setGroupConfirm(null)} />}
            {groupConfirm?.step === 2 && <ConfirmModal title="Confirm Delete" message={`Are you sure you want to permanently delete group "${groupConfirm.name}"?`} extra="Courses in this group will become ungrouped." confirmLabel="Delete" onConfirm={() => { const { id, name } = groupConfirm; setGroupConfirm(null); scheduleDeleteGroup(id, name); }} onCancel={() => setGroupConfirm(null)} />}

            {pendingDelete && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm">
                    <span>Deleting <strong>{pendingDelete.name}</strong>... <span className="text-slate-400">({pendingDelete.remaining}s)</span></span>
                    <button onClick={undoDelete} className="btn bg-white text-slate-900 hover:bg-slate-200 btn-sm font-semibold px-3">Undo</button>
                </div>
            )}
        </div>
    );
}