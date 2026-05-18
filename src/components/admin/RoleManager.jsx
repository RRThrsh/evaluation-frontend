import { useEffect, useState } from "react";
import api from "../../services/api";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePerms, setRolePerms] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        api.get("/api/admin/tables/roles?limit=50"),
        api.get("/api/admin/tables/permissions?limit=50"),
      ]);
      const r = rolesData.data?.rows ?? [];
      const p = permsData.data?.rows ?? [];
      setRoles(r);
      setPermissions(p);

      const rp = {};
      for (const role of r) {
        try {
          const res = await api.get(`/api/admin/tables/role_permissions?limit=100`);
          const all = res.data?.rows ?? [];
          rp[role.id] = all.filter((rp) => rp.role_id === role.id).map((rp) => rp.permission_id);
        } catch { rp[role.id] = []; }
      }
      setRolePerms(rp);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const togglePerm = async (roleId, permId, hasIt) => {
    const old = { ...rolePerms };
    setRolePerms((prev) => ({
      ...prev,
      [roleId]: hasIt ? (prev[roleId] || []).filter((id) => id !== permId) : [...(prev[roleId] || []), permId],
    }));
    try {
      if (hasIt) {
        await api.post("/api/query", { sql: `DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2`, params: [roleId, permId] });
      } else {
        await api.post("/api/query", { sql: `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`, params: [roleId, permId] });
      }
    } catch {
      setRolePerms(old);
      showToast("Failed to update permission", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
            <div className="h-5 w-24 bg-slate-200 rounded mb-4" />
            <div className="flex gap-2 flex-wrap"><div className="h-8 w-20 bg-slate-100 rounded-lg" /><div className="h-8 w-24 bg-slate-100 rounded-lg" /><div className="h-8 w-16 bg-slate-100 rounded-lg" /></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Roles & Permissions</h2>
          <p className="text-sm text-slate-500 mt-1">Manage role-based access control</p>
        </div>
      </div>

      <div className="space-y-5">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <SvgIcon path="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 capitalize">{role.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-200 text-slate-600 ml-auto">{role.description || ""}</span>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {permissions.map((perm) => {
                  const hasIt = (rolePerms[role.id] || []).includes(perm.id);
                  return (
                    <button
                      key={perm.id}
                      onClick={() => togglePerm(role.id, perm.id, hasIt)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${hasIt ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}
                    >
                      {perm.name || perm.resource || perm.action || perm.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          <SvgIcon path={toast.type === "error" ? "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} className="w-4 h-4" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
