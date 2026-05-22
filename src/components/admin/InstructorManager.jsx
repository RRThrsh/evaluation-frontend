import { useState, useEffect, useMemo } from "react";
import { Search, Plus, AlertTriangle } from "lucide-react";
import api from "../../services/api";
import { sanitizeObject } from "../../utils/sanitize";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";
import SkeletonRows from "./SkeletonRows";

const PAGE_SIZE = 15;

export default function InstructorManager() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employee_id: "", first_name: "", last_name: "", middle_name: "", email: "", contact_number: "", department: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1);

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true); setError("");
    try { const data = await api.get("/api/admin/instructors"); setInstructors(data.data ?? []); }
    catch (err) { setError(err.message || "Failed to load instructors"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ employee_id: "", first_name: "", last_name: "", middle_name: "", email: "", contact_number: "", department: "" }); setEditing(null); setShowForm(false); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.employee_id.trim() || !form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
      showToast("Employee ID, first name, last name, and email are required", "error"); return;
    }
    setSaving(true);
    try {
      if (editing) { await api.put(`/api/admin/instructors/${editing}`, sanitizeObject(form)); showToast("Instructor updated"); }
      else { await api.post("/api/admin/instructors", sanitizeObject(form)); showToast("Instructor created"); }
      resetForm(); await load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = (inst) => {
    setForm({ employee_id: inst.employee_id, first_name: inst.first_name, last_name: inst.last_name, middle_name: inst.middle_name || "", email: inst.email, contact_number: inst.contact_number || "", department: inst.department || "" });
    setEditing(inst.id); setShowForm(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await api.delete(`/api/admin/instructors/${confirmDelete}`); showToast("Instructor deleted"); await load(); }
    catch (err) { showToast(err.message, "error"); }
    finally { setConfirmDelete(null); }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return instructors;
    const q = search.toLowerCase();
    return instructors.filter((i) =>
      i.employee_id?.toLowerCase().includes(q) ||
      i.first_name?.toLowerCase().includes(q) ||
      i.last_name?.toLowerCase().includes(q) ||
      i.email?.toLowerCase().includes(q)
    );
  }, [instructors, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      {toast && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${
          toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
        }`}>{toast.message}</div>
      )}

      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Instructor Management</h2>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary btn-sm">
            <Plus size={14} className="mr-1" /> {showForm ? "Cancel" : "Add Instructor"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Employee ID *</label>
                <input type="text" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="input-field w-full text-sm" placeholder="e.g. EMP-001" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">First Name *</label>
                <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input-field w-full text-sm" placeholder="John" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Last Name *</label>
                <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input-field w-full text-sm" placeholder="Doe" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Middle Name</label>
                <input type="text" value={form.middle_name} onChange={(e) => setForm({ ...form, middle_name: e.target.value })} className="input-field w-full text-sm" placeholder="M." />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field w-full text-sm" placeholder="john.doe@school.edu" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Contact Number</label>
                <input type="text" value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} className="input-field w-full text-sm" placeholder="0917xxxxxxx" />
              </div>
              <div className="col-span-3">
                <label className="text-xs font-medium text-slate-600 mb-1 block">Department</label>
                <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field w-full text-sm" placeholder="College of Computer Studies" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? "..." : editing ? "Update" : "Create"}</button>
              <button type="button" onClick={resetForm} className="btn btn-ghost btn-sm">Cancel</button>
            </div>
          </form>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2 mb-4">
            <AlertTriangle size={14} />{error}
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-800">Instructors</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field py-1.5 pl-8 text-xs w-48" placeholder="Search instructors..." />
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{instructors.length} total</span>
          </div>
        </div>

        {loading ? (
          <SkeletonRows cols={7} rows={6} />
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">{search ? "No instructors match your search" : "No instructors yet"}</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="table-header">
              <tr>
                <th className="px-5 py-3">Employee ID</th>
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                    {paginated.map((inst) => (
                <tr key={inst.id} className="table-row">
                  <td className="table-cell font-mono font-medium text-slate-800">{inst.employee_id}</td>
                  <td className="table-cell text-slate-700">{inst.last_name}, {inst.first_name}{inst.middle_name ? ` ${inst.middle_name}` : ""}</td>
                  <td className="table-cell text-slate-600">{inst.email}</td>
                  <td className="table-cell text-slate-600">{inst.department || "—"}</td>
                  <td className="table-cell text-slate-600">{inst.contact_number || "—"}</td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      inst.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>{inst.is_active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(inst)} className="btn btn-ghost btn-sm text-amber-500 hover:text-amber-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setConfirmDelete(inst.id)} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {confirmDelete && (
        <ConfirmModal title="Delete Instructor" message="Are you sure you want to delete this instructor?" extra="This action cannot be undone." confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
      )}
    </div>
  );
}
