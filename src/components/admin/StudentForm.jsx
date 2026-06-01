import { useEffect, useRef } from "react";
import { X, User, Phone, GraduationCap, School } from "lucide-react";
import { usePermissions } from "../../context/PermissionContext";
import { sanitizeInput } from "../../utils/sanitize";

const GENDERS = ["Male", "Female", "Other"];

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function SectionLabel({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-primary-600" />
      </div>
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{title}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function StudentForm({ open, editingStudent, form, setForm, saving, YEARS, courses, onSave, onClose }) {
  const overlayRef = useRef(null);
  const { can } = usePermissions();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || (!can("students.create") && !can("students.manage"))) return null;

  const isTransfer = form.is_transfer;
  const s    = (fn) => (e) => setForm({ ...form, [fn]: sanitizeInput(e.target.value) });
  const sNum = (fn) => (e) => setForm({ ...form, [fn]: e.target.value.replace(/\D/g, "") });

  const initials = [form.first_name, form.last_name].filter(Boolean).map((n) => n[0]).join("").slice(0, 2) || "?";

  return (
    <div ref={overlayRef} className="modal-overlay items-start pt-8 pb-10 overflow-y-auto" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{editingStudent ? "Edit Student" : "Add New Student"}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{editingStudent ? `Editing ${form.student_number}` : "Fill in the student details below"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave}>
          <div className="p-6 space-y-6">

            {/* Student Number */}
            <Field label={<>Student Number {!editingStudent && <span className="text-primary-400 font-normal normal-case tracking-normal">— auto-generated</span>}</>}>
              <input value={form.student_number} readOnly className="input-field bg-slate-50 text-slate-400 font-mono uppercase cursor-not-allowed" />
            </Field>

            {/* Personal Info */}
            <div>
              <SectionLabel icon={User} title="Personal Information" />
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <Field label="First Name" required>
                      <input value={form.first_name} onChange={s("first_name")} className="input-field" required />
                    </Field>
                  </div>
                  <div className="col-span-1">
                    <Field label="Middle Name">
                      <input value={form.middle_name} onChange={s("middle_name")} className="input-field" placeholder="Optional" />
                    </Field>
                  </div>
                  <div className="col-span-1">
                    <Field label="Last Name" required>
                      <input value={form.last_name} onChange={s("last_name")} className="input-field" required />
                    </Field>
                  </div>
                  <div className="col-span-1">
                    <Field label="Ext.">
                      <input value={form.extension_name} onChange={s("extension_name")} className="input-field" placeholder="Jr., III" />
                    </Field>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date of Birth">
                    <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="input-field" />
                  </Field>
                  <Field label="Gender">
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field">
                      <option value="">— Select —</option>
                      {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Address">
                  <textarea value={form.address} onChange={s("address")} className="input-field resize-none" rows={2} placeholder="Optional" />
                </Field>
              </div>
            </div>

            {/* Contact */}
            <div>
              <SectionLabel icon={Phone} title="Contact Details" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email">
                  <input type="email" value={form.email} onChange={s("email")} className="input-field" placeholder="student@example.com" />
                </Field>
                <Field label="Contact Number">
                  <input value={form.contact_number} onChange={sNum("contact_number")} className="input-field" placeholder="09XX-XXX-XXXX" />
                </Field>
              </div>
            </div>

            {/* Academic */}
            <div>
              <SectionLabel icon={GraduationCap} title="Academic Information" />
              <div className="grid grid-cols-3 gap-3">
                <Field label="Program" required>
                  <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="input-field">
                    <option value="">— Select —</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                  </select>
                </Field>
                <Field label="Year Level">
                  <select value={form.year_level} onChange={(e) => setForm({ ...form, year_level: Number(e.target.value) })} className="input-field">
                    {YEARS.map((y) => <option key={y} value={y}>{ordinal(y)} Year</option>)}
                  </select>
                </Field>
                <Field label="Semester">
                  <select value={form.current_semester} onChange={(e) => setForm({ ...form, current_semester: Number(e.target.value) })} className="input-field">
                    <option value={1}>1st Semester</option>
                    <option value={2}>2nd Semester</option>
                  </select>
                </Field>
              </div>

              {editingStudent && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                      <option value="dropped">Dropped</option>
                      <option value="transferred">Transferred</option>
                    </select>
                  </Field>
                </div>
              )}
            </div>

            {/* Transferee toggle */}
            {!editingStudent && (
              <button
                type="button"
                onClick={() => setForm({ ...form, is_transfer: !isTransfer })}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isTransfer ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex items-center gap-2">
                  <School size={15} className={isTransfer ? "text-blue-600" : "text-slate-400"} />
                  <span className={`text-xs font-medium ${isTransfer ? "text-blue-700" : "text-slate-600"}`}>This student is a transferee</span>
                </div>
                <div className={`w-9 h-5 rounded-full relative transition-colors ${isTransfer ? "bg-blue-500" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isTransfer ? "left-4" : "left-0.5"}`} />
                </div>
              </button>
            )}

            {/* Transfer info */}
            {isTransfer && (
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 space-y-3">
                <SectionLabel icon={School} title="Previous School Information" />
                <Field label="Previous School">
                  <input value={form.previous_school} onChange={s("previous_school")} className="input-field" placeholder="Name of previous school" />
                </Field>
                <Field label="School Address">
                  <textarea value={form.previous_school_address} onChange={s("previous_school_address")} className="input-field resize-none" rows={2} placeholder="Optional" />
                </Field>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-md">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary btn-md min-w-[120px]">
              {saving ? "Saving..." : editingStudent ? "Update Student" : "Add Student"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
