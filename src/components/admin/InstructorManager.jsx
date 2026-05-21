import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";
import SkeletonRows from "./SkeletonRows";

export default function InstructorManager() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/api/admin/instructors");
      setInstructors(data.data ?? []);
    } catch (err) {
      setError(err.message || "Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return instructors;
    const q = search.toLowerCase();
    return instructors.filter(
      (i) =>
        i.employee_id?.toLowerCase().includes(q) ||
        i.first_name?.toLowerCase().includes(q) ||
        i.last_name?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q)
    );
  }, [instructors, search]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-800">Instructors</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field py-1.5 pl-8 text-xs w-48"
                placeholder="Search instructors..."
              />
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{instructors.length} total</span>
          </div>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-200">{error}</div>
        )}

        {loading ? (
          <SkeletonRows cols={5} rows={6} />
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            {search ? "No instructors match your search" : "No instructors yet"}
          </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inst) => (
                <tr key={inst.id} className="table-row">
                  <td className="table-cell font-mono font-medium text-slate-800">{inst.employee_id}</td>
                  <td className="table-cell text-slate-700">
                    {inst.last_name}, {inst.first_name}{inst.middle_name ? ` ${inst.middle_name}` : ""}
                  </td>
                  <td className="table-cell text-slate-600">{inst.email}</td>
                  <td className="table-cell text-slate-600">{inst.department || "—"}</td>
                  <td className="table-cell text-slate-600">{inst.contact_number || "—"}</td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      inst.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {inst.is_active ? "Active" : "Inactive"}
                    </span>
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
