import { X } from "lucide-react";

const GENDERS = ["Male", "Female", "Other"];

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

import { usePermissions } from "../../context/PermissionContext";

export default function StudentForm({ open, editingStudent, form, setForm, saving, YEARS, courses, onSave, onClose }) {
  const { can } = usePermissions();
  if (!open || !can("students.manage")) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800">{editingStudent ? "Edit Student" : "Add Student"}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"><X size={18} /></button>
        </div>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Student Number {!editingStudent && <span className="text-primary-500 font-normal">(auto-generated)</span>}</label>
            <input value={form.student_number} readOnly className="input-field bg-slate-50 text-slate-500 uppercase cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">First Name</label>
              <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Middle Name</label>
              <input value={form.middle_name} onChange={(e) => setForm({ ...form, middle_name: e.target.value })} className="input-field" placeholder="(optional)" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Last Name</label>
              <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Extension</label>
              <input value={form.extension_name} onChange={(e) => setForm({ ...form, extension_name: e.target.value })} className="input-field" placeholder="Jr., III" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="student@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Contact Number</label>
              <input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} className="input-field" placeholder="09XX-XXX-XXXX" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Date of Birth</label>
              <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field">
                <option value="">— Select —</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Enrollment Type</label>
              <select value={form.enrollment_type} onChange={(e) => setForm({ ...form, enrollment_type: e.target.value })} className="input-field">
                <option value="regular">Regular</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
            {editingStudent && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="dropped">Dropped</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field resize-none" rows={2} placeholder="(optional)" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Year Level</label>
              <select value={form.year_level} onChange={(e) => setForm({ ...form, year_level: Number(e.target.value) })} className="input-field">
                {YEARS.map((y) => <option key={y} value={y}>{ordinal(y)} Year</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Current Semester</label>
              <select value={form.current_semester} onChange={(e) => setForm({ ...form, current_semester: Number(e.target.value) })} className="input-field">
                <option value={1}>1st Semester</option>
                <option value={2}>2nd Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Program</label>
              <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="input-field">
                <option value="">— Select —</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn btn-primary btn-md">{saving ? "..." : editingStudent ? "Update Student" : "Add Student"}</button>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-md">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
