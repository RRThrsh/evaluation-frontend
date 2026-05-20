import { sanitizeInput } from "../../utils/sanitize";

export default function SubjectEditor({ subjectData, selectedSubjectToAdd, setSelectedSubjectToAdd, onAdd, onUpdate, onDelete, onClose }) {
  return (
    <div className="mt-4 space-y-3">
      <h3 className="font-bold text-sm text-zinc-700 uppercase tracking-wide">Subject Editor</h3>

      <div className="flex gap-2">
        <select value={selectedSubjectToAdd} onChange={(e) => setSelectedSubjectToAdd(e.target.value)}
          className="flex-1 border border-zinc-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select subject to add...</option>
          {subjectData.available.map((s) => (
            <option key={s.id} value={s.id}>{s.subject_code} — {s.subject_name} (Y{s.year_level} Sem{s.semester})</option>
          ))}
        </select>
        <button onClick={onAdd} disabled={!selectedSubjectToAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:bg-zinc-300">
          Add
        </button>
        {onClose && <button onClick={onClose} className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-700">Close</button>}
      </div>

      <div className="divide-y border rounded-lg text-sm max-h-60 overflow-y-auto">
        {subjectData.taken.length === 0 && <div className="p-3 text-zinc-400 text-center">No subjects taken yet</div>}
        {subjectData.taken.map((s) => (
          <div key={s.id} className="p-3 flex items-center gap-2 transition hover:bg-zinc-50">
            <div className="flex-1 min-w-0">
              <span className="font-medium">{s.subject_code}</span>
              <span className="text-zinc-400 ml-1 text-xs">{s.subject_name} Y{s.year_level} S{s.semester}</span>
            </div>
            <select value={s.status} onChange={(e) => onUpdate(s.id, { status: e.target.value })}
              className="text-xs border border-zinc-200 rounded px-1 py-0.5">
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <input type="text" defaultValue={s.grade || ""}
              onBlur={(e) => { const v = sanitizeInput(e.target.value); if (v !== (s.grade || "")) onUpdate(s.id, { grade: v || null }); }}
              placeholder="Grade" className="w-16 text-xs border border-zinc-200 rounded px-1 py-0.5 text-center" />
            <button onClick={() => onDelete(s.id)} className="text-red-500 hover:text-red-700 text-xs font-bold px-1">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
