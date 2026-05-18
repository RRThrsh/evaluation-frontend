import { useEffect, useState } from "react";
import api from "../../services/api";

const SECTIONS = [
  {
    title: "Academic Period & Student ID",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    fields: [
      { key: "academic_year_label", label: "Academic Year", type: "text", placeholder: "e.g. 2025-2026", desc: "Displayed on public pages" },
      { key: "semesters_per_year", label: "Semesters Per Year", type: "number", placeholder: "2", desc: "Number of semesters in an academic year" },
      { key: "student_number_prefix", label: "Student Number Prefix", type: "text", placeholder: "2025", desc: "4-digit prefix used when auto-generating student numbers" },
    ],
  },
  {
    title: "Grading",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    fields: [
      { key: "passing_grade", label: "Passing Grade", type: "number", placeholder: "75", desc: "Minimum score required to pass a subject" },
      { key: "grade_pass_letters", label: "Passing Letters", type: "text", placeholder: "P", desc: "Letter grades treated as pass (comma-separated)" },
      { key: "grade_fail_letters", label: "Failing Letters", type: "text", placeholder: "F,INC,W,D", desc: "Letter grades treated as fail (comma-separated)" },
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
];

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function AcademicConfigManager() {
  const [config, setConfig] = useState({});
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/api/config")
      .then((d) => {
        if (d?.data) {
          setConfig(d.data);
          setOriginal({ ...d.data });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/api/config", config);
      setOriginal({ ...config });
      showToast("Configuration saved successfully");
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = original && Object.keys(config).some((k) => String(config[k]) !== String(original[k]));

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
            <div className="h-5 w-36 bg-slate-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Academic Configuration</h2>
          <p className="text-sm text-slate-500 mt-1">Manage grading rules, academic periods, and progression limits</p>
        </div>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <SvgIcon path={section.icon} className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">{section.title}</h3>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.fields.map(({ key, label, type, placeholder, desc }) => (
                  <div key={key} className={section.fields.length % 2 === 1 && section.fields.indexOf({ key, label, type, placeholder, desc }) === section.fields.length - 1 ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={config[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                    />
                    <p className="text-xs text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        {hasChanges && (
          <button
            onClick={() => setConfig({ ...original })}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Revert Changes
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-sm"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <SvgIcon path="M5 13l4 4L19 7" className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.type === "error" ? (
            <SvgIcon path="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
          ) : (
            <SvgIcon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
