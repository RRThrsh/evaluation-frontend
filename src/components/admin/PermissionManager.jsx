import { useState, useEffect, useCallback } from "react";
import { Search, Shield, Eye, Edit3 } from "lucide-react";
import api from "../../services/api";

const FEATURES = [
  { key: "courses", label: "Programs" },
  { key: "subjects", label: "Subjects" },
  { key: "students", label: "Student Records" },
  { key: "users", label: "Pending Approvals" },
  { key: "user-management", label: "All Users" },
  { key: "enrolled-students", label: "Enrolled Students" },
  { key: "grading", label: "Grading" },
  { key: "sections", label: "Sections" },
  { key: "instructors", label: "Instructors" },
  { key: "database", label: "Database Explorer" },
];

const SIMPLE_PERMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "audit-logs", label: "Audit Trail" },
  { key: "evaluator-logs", label: "Evaluator Logs" },
  { key: "academic-config", label: "Academic Config" },
  { key: "sessions", label: "Active Sessions" },
  { key: "class-subjects", label: "Class Subjects" },
  { key: "pre-evaluate", label: "Pre-Evaluate" },
  { key: "pre-enrolled", label: "Pre-Enrolled" },
  { key: "import-logs", label: "Import Logs" },
  { key: "permissions", label: "Permissions (control)" },
];

export default function PermissionManager() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [userPerms, setUserPerms] = useState({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState({});

  useEffect(() => {
    api.get("/api/admin/permissions").then(r => setPermissions(r.data || [])).catch(() => {});
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/users", { params: { role: "admin", limit: 100 } });
      setUsers((res.data || []).filter(u => u.role === "admin"));
    } catch {}
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const loadUserPerms = async (userId) => {
    try {
      const res = await api.get(`/api/admin/users/${userId}/permissions`);
      setUserPerms(prev => ({ ...prev, [userId]: new Set(res.data || []) }));
    } catch {}
  };

  useEffect(() => {
    users.forEach(u => { if (userPerms[u.id] === undefined) loadUserPerms(u.id); });
  }, [users]);

  const toggle = async (userId, permName, granted) => {
    setSaving(prev => ({ ...prev, [`${userId}-${permName}`]: true }));
    try {
      await api.post(`/api/admin/users/${userId}/permissions`, { permission_name: permName, granted });
      setUserPerms(prev => {
        const next = new Set(prev[userId] || []);
        granted ? next.add(permName) : next.delete(permName);
        return { ...prev, [userId]: next };
      });
    } catch {} finally {
      setSaving(prev => ({ ...prev, [`${userId}-${permName}`]: false }));
    }
  };

  const has = (userId, permName) => userPerms[userId]?.has(permName) ?? false;

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-sm text-slate-700 shrink-0 flex items-center gap-2">
            <Shield size={16} className="text-primary-500" />
            Admin Permissions
          </h3>
          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search admins..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-xs w-full" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-44">Admin</th>
                {FEATURES.map(f => (
                  <th key={f.key} colSpan={2} className="px-1 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide border-l border-slate-100">
                    {f.label}
                  </th>
                ))}
                {SIMPLE_PERMS.map(p => (
                  <th key={p.key} className="px-3 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide border-l border-slate-100 whitespace-nowrap">
                    {p.label}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-4 py-2" />
                {FEATURES.map(f => (
                  <th key={f.key} colSpan={2} className="px-1 py-2 text-center border-l border-slate-100">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      <Eye size={11} /> View
                      <span className="mx-1 text-slate-200">|</span>
                      <Edit3 size={11} /> Manage
                    </span>
                  </th>
                ))}
                {SIMPLE_PERMS.map(p => (
                  <th key={p.key} className="px-1 py-2 text-center border-l border-slate-100" />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 text-sm">{u.full_name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  {FEATURES.map(f => (
                    <td key={f.key} colSpan={2} className="px-1 py-3 border-l border-slate-100">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => toggle(u.id, `${f.key}.view`, !has(u.id, `${f.key}.view`))}
                          disabled={saving[`${u.id}-${f.key}.view`]}
                          className={`w-6 h-6 rounded-md border-2 transition-all ${
                            saving[`${u.id}-${f.key}.view`] ? "opacity-50 animate-pulse" :
                            has(u.id, `${f.key}.view`) ? "bg-sky-500 border-sky-500" : "bg-white border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {has(u.id, `${f.key}.view`) && <span className="flex items-center justify-center text-white text-xs font-bold">✓</span>}
                        </button>
                        <button
                          onClick={() => toggle(u.id, `${f.key}.manage`, !has(u.id, `${f.key}.manage`))}
                          disabled={saving[`${u.id}-${f.key}.manage`]}
                          className={`w-6 h-6 rounded-md border-2 transition-all ${
                            saving[`${u.id}-${f.key}.manage`] ? "opacity-50 animate-pulse" :
                            has(u.id, `${f.key}.manage`) ? "bg-amber-500 border-amber-500" : "bg-white border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {has(u.id, `${f.key}.manage`) && <span className="flex items-center justify-center text-white text-xs font-bold">✓</span>}
                        </button>
                      </div>
                    </td>
                  ))}
                  {SIMPLE_PERMS.map(p => (
                    <td key={p.key} className="px-3 py-3 text-center border-l border-slate-100">
                      <button
                        onClick={() => toggle(u.id, p.key, !has(u.id, p.key))}
                        disabled={saving[`${u.id}-${p.key}`]}
                        className={`w-6 h-6 rounded-md border-2 transition-all ${
                          saving[`${u.id}-${p.key}`] ? "opacity-50 animate-pulse" :
                          has(u.id, p.key) ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {has(u.id, p.key) && <span className="flex items-center justify-center text-white text-xs font-bold">✓</span>}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={1 + FEATURES.length * 2 + SIMPLE_PERMS.length} className="px-6 py-12 text-center text-slate-400 text-sm">No admin users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}