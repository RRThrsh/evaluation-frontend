import { useEffect, useState } from "react";
import api from "../../services/api";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function ModeratorCourses() {
  const [moderators, setModerators] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMod, setSelectedMod] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/moderator-courses");
      setModerators(res.data.moderators ?? []);
      setAssignments(res.data.assignments ?? []);
      setCourses(res.data.courses ?? []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selectMod = (mod) => {
    setSelectedMod(mod);
    setSelectedCourses(assignments.filter(a => a.user_id === mod.id).map(a => a.course_id));
  };

  const toggleCourse = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const save = async () => {
    if (!selectedMod) return;
    setSaving(true);
    try {
      await api.post("/api/admin/moderator-courses", { user_id: selectedMod.id, course_ids: selectedCourses });
      showToast(`Courses assigned to ${selectedMod.full_name}`);
      await load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const getAssignedNames = (userId) =>
    assignments.filter(a => a.user_id === userId).map(a => a.course_name).join(", ") || "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Moderator Course Assignments</h2>
        <p className="mt-1 text-sm text-slate-500">Assign courses to moderators so they only see relevant evaluation requests.</p>
      </div>

      {toast && (
        <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          <SvgIcon path={toast.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-700">Moderators</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {moderators.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-slate-400">No moderators found.</p>
              )}
              {moderators.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => selectMod(mod)}
                  className={`w-full px-5 py-4 text-left transition hover:bg-slate-50 ${selectedMod?.id === mod.id ? "bg-blue-50 ring-1 ring-blue-200" : ""}`}
                >
                  <p className="text-sm font-medium text-slate-800">{mod.full_name}</p>
                  <p className="text-xs text-slate-400">{mod.email}</p>
                  <p className="mt-1 text-xs text-slate-500 truncate">{getAssignedNames(mod.id)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          {!selectedMod ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20">
              <div className="text-center">
                <SvgIcon path="M13 10V3L4 14h7v7l9-11h-7z" className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm text-slate-400">Select a moderator to assign courses</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">{selectedMod.full_name}</h3>
                  <p className="text-xs text-slate-400">{selectedMod.email}</p>
                </div>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <SvgIcon path="M5 13l4 4L19 7" className="w-4 h-4" />
                  )}
                  Save Assignments
                </button>
              </div>
              <div className="p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">Available Courses</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {courses.map(course => {
                    const checked = selectedCourses.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                          checked
                            ? "border-blue-200 bg-blue-50 ring-1 ring-blue-300"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCourse(course.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">{course.name}</p>
                          <p className="text-xs text-slate-400">{course.code}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {courses.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">No courses available. Create courses first.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
