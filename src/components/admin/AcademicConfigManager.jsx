import { useEffect, useState } from "react";
import api from "../../services/api";
import { usePermissions } from "../../context/PermissionContext";
import { sanitizeObject } from "../../utils/sanitize";

const SECTIONS = [
  {
    title: "Academic Period & Student ID",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    fields: [
      { key: "school_year_label", label: "School Year", type: "text", placeholder: "e.g. 2025-2026", desc: "Current school year label used across the system" },
      { key: "semesters_per_year", label: "Semesters Per Year", type: "number", placeholder: "2", desc: "Number of semesters in an academic year" },
      { key: "student_number_prefix", label: "Student Number Prefix", type: "text", placeholder: "2025", desc: "4-digit prefix used when auto-generating student numbers" },
    ],
  },
  {
    title: "Progression & Limits",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    fields: [
      { key: "max_year_level", label: "Max Year Level", type: "number", placeholder: "4", desc: "Highest year level (e.g. 4 for a 4-year program)" },
      { key: "irregular_threshold", label: "Irregular Threshold", type: "number", placeholder: "2", desc: "Students with more failed subjects than this are flagged irregular" },
      { key: "minor_max_fails", label: "Minor Max Fails", type: "number", placeholder: "1", desc: "How many times a minor prerequisite can be retaken" },
    ],
  },
  {
    title: "On-the-Job Training (OJT)",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    fields: [
      { key: "ojt_min_year_level", label: "Min Year Level", type: "number", placeholder: "4", desc: "Minimum year level required for OJT eligibility" },
      { key: "ojt_max_failed_subjects", label: "Max Failed Majors", type: "number", placeholder: "4", desc: "Maximum failed major subjects allowed before OJT is blocked" },
    ],
  },
  {
    title: "Audit Logs",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    fields: [
      { key: "audit_log_retention_days", label: "Retention Period (Days)", type: "number", placeholder: "14", desc: "Audit logs older than this many days are automatically deleted every hour. Default: 14 days." },
    ],
  },
];

function SvgIcon({ path, className = "w-5 h-5" }) {
  return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>;
}

export default function AcademicConfigManager() {
  const [config, setConfig] = useState({});
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const { can } = usePermissions();

  const [ojtGroups, setOjtGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newOjtCode, setNewOjtCode] = useState("");
  const [addingOjt, setAddingOjt] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState(new Set());

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const loadOjtSubjects = async () => {
    try {
      const data = await api.get("/api/config/ojt-subjects");
      setOjtGroups(data.data ?? []);
    } catch { /* ignore */ }
  };

  const loadCourses = async () => {
    try {
      const data = await api.get("/api/admin/courses");
      setCourses(data.data ?? []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    api.get("/api/config").then((d) => { if (d?.data) { setConfig(d.data); setOriginal({ ...d.data }); } }).catch(() => {}).finally(() => setLoading(false));
    loadOjtSubjects();
    loadCourses();
  }, []);

  const handleChange = (key, value) => { setConfig((prev) => ({ ...prev, [key]: value })); };

  const handleSave = async () => {
    setSaving(true);
    try { await api.patch("/api/config", sanitizeObject(config)); setOriginal({ ...config }); showToast("Configuration saved successfully"); }
    catch (err) { showToast(err.message || "Failed to save", "error"); }
    finally { setSaving(false); }
  };

  const handleAddOjtCode = async () => {
    if (!selectedCourse || !newOjtCode.trim()) { showToast("Select a course and enter a subject code", "error"); return; }
    setAddingOjt(true);
    try {
      await api.post("/api/config/ojt-subjects", { course_id: selectedCourse, subject_code: newOjtCode.trim() });
      setNewOjtCode("");
      showToast("OJT subject code added");
      await loadOjtSubjects();
      setExpandedCourses((prev) => new Set(prev).add(selectedCourse));
    } catch (err) { showToast(err.message || "Failed to add", "error"); }
    finally { setAddingOjt(false); }
  };

  const handleRemoveOjtCode = async (id) => {
    try {
      await api.delete(`/api/config/ojt-subjects/${id}`);
      showToast("OJT subject code removed");
      await loadOjtSubjects();
    } catch (err) { showToast(err.message || "Failed to remove", "error"); }
  };

  const toggleExpand = (courseId) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId); else next.add(courseId);
      return next;
    });
  };

  const hasChanges = original && Object.keys(config).some((k) => String(config[k]) !== String(original[k]));

  if (loading) {
    return <div className="p-6 max-w-3xl mx-auto space-y-6">
      {[1, 2, 3].map((s) => <div key={s} className="card p-6 animate-pulse"><div className="h-5 w-36 bg-slate-200 rounded mb-4" /><div className="space-y-3"><div className="h-10 bg-slate-100 rounded-lg" /><div className="h-10 bg-slate-100 rounded-lg" /></div></div>)}
    </div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Academic Configuration</h2>
          <p className="text-sm text-slate-500 mt-1">Manage academic periods, progression limits, OJT subject codes, and system settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Config form */}
        <div className="lg:col-span-3 space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="card overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600"><SvgIcon path={section.icon} className="w-4 h-4" /></div>
                <h3 className="text-sm font-semibold text-slate-800">{section.title}</h3>
              </div>
              <div className="px-6 py-5 space-y-5">
                {section.fields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {section.fields.map(({ key, label, type, placeholder, desc }, idx) => (
                      <div key={key} className={section.fields.length % 2 === 1 && idx === section.fields.length - 1 ? "md:col-span-2" : ""}>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
                        <input type={type} value={config[key] ?? ""} onChange={(e) => handleChange(key, e.target.value)} placeholder={placeholder} className="input-field" />
                        <p className="text-xs text-slate-400 mt-1">{desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-end gap-3">
            {hasChanges && <button onClick={() => setConfig({ ...original })} className="btn btn-secondary btn-md">Revert Changes</button>}
            {can("academic-config") && (
            <button onClick={handleSave} disabled={saving || !hasChanges} className="btn btn-primary btn-md">
              {saving ? <><svg className="animate-spin h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Saving...</> : <><SvgIcon path="M5 13l4 4L19 7" className="w-4 h-4 mr-1.5" />Save Changes</>}
            </button>
            )}
          </div>
        </div>

        {/* Right: OJT Subject Codes Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600"><SvgIcon path="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-4 h-4" /></div>
              <h3 className="text-sm font-semibold text-slate-800">OJT Subject Codes</h3>
            </div>

            {/* Add form */}
            {can("academic-config") && (
              <div className="px-6 py-4 border-b border-slate-100 space-y-3">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOjtCode}
                    onChange={(e) => setNewOjtCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ITO500"
                    className="input-field flex-1 text-sm"
                  />
                  <button
                    onClick={handleAddOjtCode}
                    disabled={addingOjt || !selectedCourse || !newOjtCode.trim()}
                    className="btn btn-primary btn-sm whitespace-nowrap"
                  >
                    {addingOjt ? "..." : "Add"}
                  </button>
                </div>
              </div>
            )}

            {/* Grouped list */}
            <div className="px-6 py-4 max-h-[480px] overflow-y-auto space-y-2">
              {ojtGroups.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">No OJT subject codes configured yet.<br />Select a course and add one above.</p>
              )}
              {ojtGroups.map((group) => (
                <div key={group.course_id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleExpand(group.course_id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <SvgIcon
                        path={expandedCourses.has(group.course_id) ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                        className="w-3.5 h-3.5 text-slate-400"
                      />
                      <span className="text-sm font-semibold text-slate-700">{group.course_code}</span>
                      <span className="text-xs text-slate-400 font-normal">{group.course_name}</span>
                    </div>
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{group.subjects.length}</span>
                  </button>
                  {expandedCourses.has(group.course_id) && (
                    <div className="divide-y divide-slate-100">
                      {group.subjects.map((subj) => (
                        <div key={subj.id} className="flex items-center justify-between px-4 py-2.5 pl-10">
                          <span className="text-sm font-mono font-medium text-slate-700">{subj.subject_code}</span>
                          {can("academic-config") && (
                            <button
                              onClick={() => handleRemoveOjtCode(subj.id)}
                              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
        <SvgIcon path={toast.type === "error" ? "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} className="w-4 h-4" />
        {toast.message}
      </div>}
    </div>
  );
}
