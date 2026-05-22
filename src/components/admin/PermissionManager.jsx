import { useState, useEffect, useCallback } from "react";
import { Search, Shield } from "lucide-react";
import api from "../../services/api";

const PERMISSION_LABELS = {
  dashboard: "Dashboard",
  courses: "Courses",
  subjects: "Subjects",
  students: "Students",
  users: "Users (Pending Approvals)",
  "user-management": "All Users",
  "audit-logs": "Audit Trail",
  "evaluator-logs": "Evaluator Logs",
  "academic-config": "Academic Config",
  sessions: "Active Sessions",
  "enrolled-students": "Enrolled Students",
  grading: "Grading",
  sections: "Sections",
  instructors: "Instructors",
  "class-subjects": "Class Subjects",
  "pre-evaluate": "Pre-Evaluate",
  "pre-enrolled": "Pre-Enrolled",
  database: "Database Viewer",
  "import-logs": "Import Logs",
  permissions: "Permissions (control)",
};

export default function PermissionManager() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [userPerms, setUserPerms] = useState({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState({});

  useEffect(() => {
    api.get("/api/admin/permissions").then(r => setPermissions(r.data.data)).catch(() => {});
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/users", { params: { role: "admin", limit: 100 } });
      setUsers((res.data.data || []).filter(u => u.role === "admin"));
    } catch {}
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const loadUserPerms = async (userId) => {
    try {
      const res = await api.get(`/api/admin/users/${userId}/permissions`);
      setUserPerms(prev => ({ ...prev, [userId]: new Set(res.data.data) }));
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

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const permNames = permissions.map(p => p.name);

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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-48">Admin</th>
                {permNames.map(p => (
                  <th key={p} className="px-3 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {PERMISSION_LABELS[p] || p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/40">
                  <td className="px-6 py-3">
                    <p className="font-medium text-slate-800">{u.full_name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  {permNames.map(p => {
                    const has = userPerms[u.id]?.has(p);
                    const loading = saving[`${u.id}-${p}`];
                    return (
                      <td key={p} className="px-3 py-3 text-center">
                        <button
                          onClick={() => toggle(u.id, p, !has)}
                          disabled={loading}
                          className={`w-6 h-6 rounded-md border-2 transition-all ${
                            loading ? "opacity-50 animate-pulse" :
                            has ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {has && <span className="flex items-center justify-center text-white text-xs font-bold">✓</span>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={permNames.length + 1} className="px-6 py-12 text-center text-slate-400 text-sm">No admin users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}