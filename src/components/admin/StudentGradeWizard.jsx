import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import api from "../../services/api";

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

const SEM_LABELS = { 1: "Sem 1", 2: "Sem 2" };

function StepBar({ sections, step }) {
  return (
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
      <div className="flex items-center gap-0 overflow-x-auto pb-0.5">
        {sections.map((s, i) => {
          const isActive = i === step;
          const isDone   = i < step;
          return (
            <div key={`${s.year}-${s.sem}`} className="flex items-center shrink-0">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive ? "bg-white text-primary-600 shadow-sm border border-slate-200" :
                isDone   ? "text-emerald-600" :
                           "text-slate-400"
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isActive ? "bg-primary-600 text-white" :
                  isDone   ? "bg-emerald-500 text-white" :
                             "bg-slate-200 text-slate-500"
                }`}>
                  {isDone ? <Check size={10} strokeWidth={3} /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{ordinal(s.year)} · {SEM_LABELS[s.sem] ?? `Sem ${s.sem}`}</span>
              </div>
              {i < sections.length - 1 && (
                <div className={`w-6 h-px mx-0.5 shrink-0 ${i < step ? "bg-emerald-300" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StudentGradeWizard({ student, curriculum, onClose, onDone, onToast }) {
  const [step, setStep] = useState(0);
  const [grades, setGrades] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);

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
  const isLast  = step === sections.length - 1;
  const subjectCount = sections.reduce((sum, s) => sum + s.subjects.length, 0);
  const gradedCount  = Object.keys(grades).length;

  const handleGrade = (subjectId, value) => {
    if (value === "" || /^\d+$/.test(value)) {
      const num = Number(value);
      if (value === "" || (num >= 0 && num <= 100)) {
        setGrades((prev) => ({ ...prev, [subjectId]: value }));
      }
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const allSubjects = sections.flatMap((s) => s.subjects);
      const subjects = allSubjects.map((sub) => ({ subject_id: sub.id, grade: grades[sub.id] || null }));
      await api.post(`/api/admin/students/${student.id}/bulk-enroll`, { subjects });
      onToast("Grades saved");
      setDone(true);
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const fullName = [student.first_name, student.last_name].filter(Boolean).join(" ");
  const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2);

  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-sm p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Grades Saved</h3>
          <p className="text-sm text-slate-500 mt-1">{subjectCount} subjects processed</p>
          <p className="text-xs text-slate-400 mt-1">
            {gradedCount} with grade{gradedCount !== 1 ? "s" : ""} &middot; {subjectCount - gradedCount} marked as INC
          </p>
          <button onClick={onDone} className="btn btn-primary btn-md mt-6 w-full">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay items-start pt-8 pb-10 overflow-y-auto" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Set Grades — {fullName}</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{student.student_number} · {gradedCount}/{subjectCount} subjects graded</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* ── Step bar ── */}
        {sections.length > 0 && <StepBar sections={sections} step={step} />}

        {/* ── Content ── */}
        <div className="p-6 space-y-4">
          {confirm && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-amber-600 font-bold text-sm shrink-0 mt-0.5">!</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Ready to save?</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This will enroll <strong>{subjectCount} subjects</strong> with the grades above.
                  {subjectCount - gradedCount > 0 && <span> Subjects without a grade will be marked as <strong>INC</strong>.</span>}
                  Click <strong>Confirm</strong> to proceed or <strong>Cancel</strong> to review.
                </p>
              </div>
            </div>
          )}
          {current && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {ordinal(current.year)} Year — {SEM_LABELS[current.sem] ?? `Sem ${current.sem}`}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{current.subjects.length} subjects · enter grades below</p>
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Step {step + 1} of {sections.length}
                </span>
              </div>

              <div className="divide-y border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                {current.subjects.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 px-5 py-3 bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono font-medium text-slate-700 text-xs">{sub.subject_code}</span>
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
                        className="input-field w-24 sm:w-28 py-2 text-sm text-center font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <button
            onClick={() => { setConfirm(false); setStep((s) => Math.max(0, s - 1)); }}
            disabled={step === 0}
            className="btn btn-ghost btn-sm gap-1 disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
            {!isLast ? (
              <button onClick={() => { setConfirm(false); setStep((s) => Math.min(sections.length - 1, s + 1)); }} className="btn btn-primary btn-sm gap-1">
                Next <ChevronRight size={14} />
              </button>
            ) : !confirm ? (
              <button onClick={() => setConfirm(true)} className="btn btn-primary btn-sm">
                Save All Grades
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setConfirm(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button onClick={handleSubmit} disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? "Saving..." : `Confirm — Save ${subjectCount} Subjects`}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
