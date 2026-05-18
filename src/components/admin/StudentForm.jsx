import api from "../../services/api";

const GENDERS = ["Male", "Female", "Other"];

export default function StudentForm({ open, editingStudent, form, setForm, saving, YEARS, courses, onSave, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-slate-800 mb-5">{editingStudent ? "Edit Student" : "Add Student"}</h3>
        <form onSubmit={onSave} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="student@example.com" required={!editingStudent} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Student Number {!editingStudent && <span className="text-blue-500 font-normal">(auto-generated)</span>}</label>
            <input value={form.student_number} readOnly
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-500 uppercase cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">First Name</label>
              <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Middle Name</label>
              <input value={form.middle_name} onChange={(e) => setForm({ ...form, middle_name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="(optional)" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Last Name</label>
              <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Date of Birth</label>
              <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="">— Select —</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Contact Number</label>
              <input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="09XX-XXX-XXXX" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" rows={2} placeholder="(optional)" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Year Level</label>
              <select value={form.year_level} onChange={(e) => setForm({ ...form, year_level: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                {YEARS.map((y) => <option key={y} value={y}>{ordinal(y)} Year</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Course</label>
              <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="">— Select —</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
              {saving ? "..." : editingStudent ? "Update Student" : "Add Student"}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}
