import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import api from "../../services/api";

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

const SEM_LABELS = { 1: "Sem 1", 2: "Sem 2", 3: "Sem 3" };

export default function StudentGradeWizard({ student, curriculum, onClose, onToast }) {
  const [step, setStep] = useState(0);
  const [grades, setGrades] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const sections = useMemo(() => {
    const byYearSem = {};
    for (const sub of curriculum) {
      if (sub.year_level > student.year_level) continue;
      if (sub.year_level === student.year_level && sub.semester > student.current_semester) continue;
      const key = `${sub.year_level}-${sub.semester}`;
      if (!byYearSem[key]) byYearSem[key] = { year: sub.year_level, sem: sub.semester, subjects: [] };
      byYearSem[key].subjects.push(sub);
    }
    return Object.values(byYearSem).sort((a, b) => a.year - b.year || a.sem - b.sem);
  }, [curriculum, student]);

  const current = sections[step];
  const isLast = step === sections.length - 1;

  const handleGrade = (subjectId, value) => {
    setGrades((prev) => ({ ...prev, [subjectId]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const subjects = Object.entries(grades).map(([subject_id, grade]) => ({
        subject_id,
        grade: grade || null,
      }));
      await api.post(`/api/admin/students/${student.id}/bulk-enroll`, { subjects });
      onToast("Grades saved");
      setDone(true);
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const subjectCount = sections.reduce((sum, s) => sum + s.subjects.length, 0);
  const gradedCount = Object.keys(grades).length;

  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-lg p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Grades Saved</h3>
          <p className="text-sm text-slate-500 mt-1">
            {gradedCount} of {subjectCount} subjects graded
          </p>
          <button onClick={onClose} className="btn btn-primary btn-md mt-6">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay items-start pt-10 pb-10 overflow-y-auto" onClick={onClose}>
      <div className="modal-content max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Set Grades — {student.first_name} {student.last_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {step + 1} of {sections.length} &middot; {gradedCount}/{subjectCount} subjects graded
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"><X size={18} /></button>
        </div>

        {current && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl px-5 py-3 border border-slate-200">
              <span className="text-sm font-bold text-slate-700">{ordinal(current.year)} Year — {SEM_LABELS[current.sem] || `Sem ${current.sem}`}</span>
              <span className="text-xs text-slate-400 ml-2">({current.subjects.length} subjects)</span>
            </div>

            <div className="divide-y border rounded-xl text-sm max-h-80 overflow-y-auto">
              {current.subjects.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono font-medium text-slate-700">{sub.subject_code}</span>
                    <span className="text-slate-400 ml-1.5 text-xs">{sub.subject_name}</span>
                    <span className={`badge ml-2 ${sub.subject_type === "major" ? "badge-purple" : "badge-amber"}`}>{sub.subject_type}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">{sub.units} units</span>
                    <input
                      type="number" min={0} max={100}
                      value={grades[sub.id] ?? ""}
                      onChange={(e) => handleGrade(sub.id, e.target.value)}
                      placeholder="Grade"
                      className="input-field w-20 py-1.5 text-xs text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn btn-ghost btn-sm gap-1 disabled:text-slate-300"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
            {!isLast ? (
              <button onClick={() => setStep((s) => Math.min(sections.length - 1, s + 1))} className="btn btn-primary btn-sm gap-1">
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving} className="btn btn-primary btn-sm gap-1">
                {saving ? "Saving..." : "Save All Grades"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
