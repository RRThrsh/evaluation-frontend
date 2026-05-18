import { useState } from "react";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 15;

function ordinal(n) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function fullName(s) {
  const parts = [s.first_name, s.middle_name, s.last_name].filter(Boolean);
  return parts.join(" ") || s.full_name || "—";
}

export default function StudentList({ students, loading, onSelect, onEdit, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">Students</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{students.length} students</span>
          <button onClick={onAdd}
            className="text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
            + Add Student
          </button>
        </div>
      </div>
      {loading ? (
        <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
      ) : students.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">No students found. Click "Add Student" to create one.</div>
      ) : (
        <StudentTable students={students} onSelect={onSelect} onEdit={onEdit} />
      )}
    </div>
  );
}

function StudentTable({ students, onSelect, onEdit }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const paginated = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-5 py-3 font-semibold">Student #</th>
            <th className="px-5 py-3 font-semibold">Name</th>
            <th className="px-5 py-3 font-semibold">Year</th>
            <th className="px-5 py-3 font-semibold">Course</th>
            <th className="px-5 py-3 font-semibold">Subjects</th>
            <th className="px-5 py-3 font-semibold">Contact</th>
            <th className="px-5 py-3 font-semibold w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginated.map((s) => (
            <tr key={s.id} onClick={() => onSelect(s)} className="hover:bg-slate-50 transition-colors cursor-pointer">
              <td className="px-5 py-3 font-mono text-slate-700">{s.student_number}</td>
              <td className="px-5 py-3 text-slate-700">{fullName(s)}</td>
              <td className="px-5 py-3">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{ordinal(s.year_level)} Year</span>
              </td>
              <td className="px-5 py-3 text-slate-500">{s.course_code || "—"}</td>
              <td className="px-5 py-3">
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{s.enrolled_count ?? 0} subjects</span>
              </td>
              <td className="px-5 py-3 text-slate-400">{s.contact_number || "—"}</td>
              <td className="px-5 py-3">
                <div onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(s); }} className="text-amber-500 hover:text-amber-700 transition p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length > PAGE_SIZE && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </>
  );
}
