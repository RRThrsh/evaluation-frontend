import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Trash2, Search, Pencil, AlertTriangle } from "lucide-react";
import api from "../../services/api";
import { usePermissions } from "../../context/PermissionContext";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 15;

export default function SectionManager() {
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", course_id: "", instructor_id: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { can } = usePermissions();

  const filteredSections = useMemo(() => {
    return sections.filter((sec) =>
      !search || `${sec.name} ${sec.course_name || ""} ${sec.course_code || ""} ${sec.instructor_name || ""}`
        .toLowerCase().includes(search.toLowerCase())
    );
  }, [sections, search]);

  const totalPages = Math.max(1, Math.ceil(filteredSections.length / PAGE_SIZE));
  const paginatedSections = filteredSections.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [secRes, crsRes, instRes] = await Promise.all([
        api.get("/api/admin/sections"),
        api.get("/api/admin/courses"),
        api.get("/api/admin/instructors"),
      ]);
      setSections(secRes.data ?? []);
      setCourses(crsRes.data ?? []);
      setInstructors(instRes.data ?? []);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await api.post("/api/admin/sections", {
        name: form.name.trim(),
        course_id: form.course_id || null,
        instructor_id: form.instructor_id || null,
      });
      setShowForm(false);
      setForm({ name: "", course_id: "", instructor_id: "" });
      load();
    } catch (err) {
      setError(err.message || "Failed to create");
    }
  };

  const handleEdit = (sec) => {
    setEditing(sec.id);
    setForm({ name: sec.name, course_id: sec.course_id || "", instructor_id: sec.instructor_id || "" });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await api.put(`/api/admin/sections/${editing}`, {
        name: form.name.trim(),
        course_id: form.course_id || null,
        instructor_id: form.instructor_id || null,
      });
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", course_id: "", instructor_id: "" });
      load();
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Section Management</h2>
          {can("sections.manage") && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            <Plus size={14} className="mr-1" /> Add Section
          </button>
          )}
        </div>

        {showForm && can("sections.manage") && (
          <form onSubmit={editing ? handleUpdate : handleCreate} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Section Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field w-full text-sm" placeholder="e.g. A" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Course</label>
                <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="input-field w-full text-sm">
                  <option value="">-- Select --</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Instructor</label>
                  <select value={form.instructor_id} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })} className="input-field w-full text-sm">
                    <option value="">-- Select --</option>
                    {instructors.filter((i) => i.is_active).map((i) => <option key={i.id} value={i.id}>{i.last_name}, {i.first_name}{i.middle_name ? ` ${i.middle_name}` : ""}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm">{editing ? "Update" : "Create"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm({ name: "", course_id: "", instructor_id: "" }); }} className="btn btn-ghost btn-sm">Cancel</button>
            </div>
          </form>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2 mb-4">
            <AlertTriangle size={14} />{error}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections..."
            className="input-field w-full text-sm pl-9"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <button onClick={() => setSearch(search)} className="btn btn-primary btn-sm"><Search size={14} className="mr-1" />Search</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Instructor</th>
                {can("sections.manage") && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedSections.map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-800 font-medium">{sec.name}</td>
                  <td className="px-6 py-4 text-slate-700">{sec.course_name || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{sec.course_code || "—"}</td>
                  <td className="px-6 py-4 text-slate-700">{sec.instructor_name || "N/A"}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                    {can("sections.manage") && (
                    <button onClick={() => handleEdit(sec)} className="btn btn-ghost btn-sm text-slate-500 hover:text-primary-600">
                      <Pencil size={14} />
                    </button>
                    )}
                    {can("sections.manage") && (
                    <button
                      onClick={async () => { if (confirm("Delete this section?")) { try { await api.delete(`/api/admin/sections/${sec.id}`); load(); } catch (err) { setError(err.message); } } }}
                      className="btn btn-ghost btn-sm text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedSections.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No sections found.</td></tr>
              )}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
