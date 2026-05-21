import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import api from "../../services/api";

export default function SectionManager() {
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", course_id: "", instructor_id: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [secRes, crsRes, usrRes] = await Promise.all([
        api.get("/api/admin/sections"),
        api.get("/api/admin/courses"),
        api.get("/api/admin/users"),
      ]);
      setSections(secRes.data ?? []);
      setCourses(crsRes.data ?? []);
      setUsers(usrRes.data ?? []);
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

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Section Management</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            <Plus size={14} className="mr-1" /> Add Section
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
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
                  {users.filter((u) => u.role === "evaluator").map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">Cancel</button>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Instructor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sections.map((sec) => (
                <tr key={sec.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-800 font-medium">Section {sec.name}</td>
                  <td className="px-6 py-4 text-slate-700">{sec.course_name || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-700">{sec.instructor_name || "N/A"}</td>
                </tr>
              ))}
              {sections.length === 0 && !loading && (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm">No sections yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
