import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ShieldCheck, Check, Loader2, Users, Eye, Edit3, ChevronRight } from "lucide-react";
import api from "../../services/api";

const FEATURES = [
  { key: "courses",           label: "Programs" },
  { key: "subjects",          label: "Subjects" },
  { key: "students",          label: "Student Records" },
  { key: "users",             label: "Pending Approvals" },
  { key: "user-management",   label: "All Users" },
  { key: "enrolled-students", label: "Enrolled Students" },

  { key: "sections",          label: "Sections" },
  { key: "instructors",       label: "Instructors" },
  { key: "database",          label: "Database Explorer" },
];

const SIMPLE_PERMS = [
  { key: "dashboard",       label: "Dashboard" },
  { key: "audit-logs",      label: "Audit Trail" },
  { key: "evaluator-logs",  label: "Evaluator Logs" },
  { key: "academic-config", label: "Academic Config" },
  { key: "sessions",        label: "Active Sessions" },
  { key: "class-subjects",  label: "Class Subjects" },
  { key: "pre-evaluate",    label: "Pre-Evaluate" },
  { key: "pre-enrolled",    label: "Pre-Enrolled" },
  { key: "import-logs",     label: "Import Logs" },
  { key: "permissions",     label: "Permissions" },
  { key: "snapshots",       label: "Snapshots" },
];

const initials = (name) => name?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "?";

function PermRow({ label, viewKey, manageKey, has, saving, toggle, userId }) {
  const viewActive   = has(userId, viewKey);
  const manageActive = has(userId, manageKey);

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggle(userId, viewKey, !viewActive)}
          disabled={!!saving[`${userId}-${viewKey}`]}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
            viewActive ? "bg-sky-50 border-sky-200 text-sky-700" : "bg-white border-slate-200 text-slate-400 hover:border-sky-200 hover:text-sky-500"
          }`}
        >
          {saving[`${userId}-${viewKey}`] ? <Loader2 size={11} className="animate-spin" /> : <Eye size={11} />}
          View
        </button>
        <button
          onClick={() => toggle(userId, manageKey, !manageActive)}
          disabled={!!saving[`${userId}-${manageKey}`]}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
            manageActive ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-slate-200 text-slate-400 hover:border-amber-200 hover:text-amber-500"
          }`}
        >
          {saving[`${userId}-${manageKey}`] ? <Loader2 size={11} className="animate-spin" /> : <Edit3 size={11} />}
          Manage
        </button>
      </div>
    </div>
  );
}

function AccessRow({ label, permKey, has, saving, toggle, userId }) {
  const active = has(userId, permKey);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        onClick={() => toggle(userId, permKey, !active)}
        disabled={!!saving[`${userId}-${permKey}`]}
        className={`w-9 h-5 rounded-full border transition-all relative disabled:opacity-50 ${
          active ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-200"
        }`}
      >
        {saving[`${userId}-${permKey}`]
          ? <Loader2 size={10} className="animate-spin absolute top-0.5 left-0.5 text-white" />
          : <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${active ? "left-4" : "left-0.5"}`} />
        }
      </button>
    </div>
  );
}

export default function PermissionManager() {
  const [users, setUsers] = useState([]);
  const [userPerms, setUserPerms] = useState({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get("/api/admin/users", { params: { role: "admin", limit: 100 } });
      setUsers((res.data || []).filter((u) => u.role === "admin"));
    } catch {} finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  useEffect(() => {
    users.forEach((u) => {
      if (userPerms[u.id] === undefined) {
        api.get(`/api/admin/users/${u.id}/permissions`)
          .then((r) => setUserPerms((prev) => ({ ...prev, [u.id]: new Set(r.data || []) })))
          .catch(() => {});
      }
    });
  }, [users]);

  const toggle = async (userId, permName, granted) => {
    setSaving((prev) => ({ ...prev, [`${userId}-${permName}`]: true }));
    try {
      await api.post(`/api/admin/users/${userId}/permissions`, { permission_name: permName, granted });
      setUserPerms((prev) => {
        const next = new Set(prev[userId] || []);
        granted ? next.add(permName) : next.delete(permName);
        return { ...prev, [userId]: next };
      });
    } catch {} finally {
      setSaving((prev) => ({ ...prev, [`${userId}-${permName}`]: false }));
    }
  };

  const has = (userId, permName) => userPerms[userId]?.has(permName) ?? false;

  const filtered = useMemo(() =>
    users.filter((u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ), [users, search]);

  const selectedUser = users.find((u) => u.id === selected);

  const activeCount = selectedUser
    ? [...(userPerms[selectedUser.id] ?? [])].length
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shrink-0">
          <ShieldCheck size={17} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Permission Manager</h2>
          <p className="text-xs text-slate-500">{users.length} administrator{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex gap-5 items-start">

        {/* Left — user list */}
        <div className="w-64 shrink-0 card overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-8 py-1.5 text-xs w-full"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {loadingUsers ? (
              <div className="py-10 flex justify-center text-slate-400">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">No admins found</div>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelected(u.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${selected === u.id ? "bg-primary-50 border-l-2 border-primary-600" : "border-l-2 border-transparent"}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                    {initials(u.full_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{u.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                  </div>
                  {selected === u.id && <ChevronRight size={13} className="text-primary-500 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right — permission form */}
        {!selectedUser ? (
          <div className="flex-1 card flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <Users size={36} className="opacity-30" />
            <p className="text-sm font-medium">Select an administrator</p>
            <p className="text-xs">Choose from the list to manage their permissions</p>
          </div>
        ) : (
          <div className="flex-1 space-y-4">

            {/* User info bar */}
            <div className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {initials(selectedUser.full_name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{selectedUser.full_name}</p>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {activeCount} permission{activeCount !== 1 ? "s" : ""} active
              </span>
            </div>

            {/* Feature permissions */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={14} className="text-sky-500" />
                <h3 className="text-sm font-semibold text-slate-700">Feature Permissions</h3>
                <span className="text-xs text-slate-400 ml-1">View &amp; Manage access per feature</span>
              </div>
              <div>
                {FEATURES.map((f) => (
                  <PermRow
                    key={f.key}
                    label={f.label}
                    viewKey={`${f.key}.view`}
                    manageKey={`${f.key}.manage`}
                    has={has}
                    saving={saving}
                    toggle={toggle}
                    userId={selectedUser.id}
                  />
                ))}
              </div>
            </div>

            {/* Access permissions */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={14} className="text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-700">Access Permissions</h3>
                <span className="text-xs text-slate-400 ml-1">Toggle section visibility</span>
              </div>
              <div>
                {SIMPLE_PERMS.map((p) => (
                  <AccessRow
                    key={p.key}
                    label={p.label}
                    permKey={p.key}
                    has={has}
                    saving={saving}
                    toggle={toggle}
                    userId={selectedUser.id}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
