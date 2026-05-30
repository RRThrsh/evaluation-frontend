import { useState } from "react";
import { Plus, Search, Edit3, Trash2 } from "lucide-react";
import { usePermissions } from "../../context/PermissionContext";
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
  return parts.join(" ") || s.full_name || "\u2014";
}

export default function StudentList({ students, allStudents, loading, search, setSearch, onSelect, onEdit, onAdd, onDelete }) {
  const { can } = usePermissions();
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm font-semibold text-slate-800">Student Records</span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-8 py-1.5 text-xs w-44" placeholder="Search students..." />
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{allStudents?.length || students.length}</span>
          {can("students.manage") && <button onClick={onAdd} className="btn btn-primary btn-sm flex items-center gap-1"><Plus size={13} /> Add</button>}
        </div>
      </div>
      {loading ? (
        <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
      ) : students.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">{search ? "No students match your search" : 'No students found. Click "Add" to create one.'}</div>
      ) : (
        <StudentTable students={students} onSelect={onSelect} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
}

function StudentTable({ students, onSelect, onEdit, onDelete }) {
  const [page, setPage] = useState(1);
  const { can } = usePermissions();
  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const paginated = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <table className="w-full text-left text-xs">
        <thead className="table-header">
          <tr>
            <th className="px-5 py-3">Student #</th>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Year</th>
            <th className="px-5 py-3">Program</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Subjects</th>
            {can("students.manage") && <th className="px-5 py-3 w-28">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginated.map((s) => (
            <tr key={s.id} onClick={() => onSelect(s)} className="table-row cursor-pointer">
              <td className="table-cell font-mono text-slate-700">{s.student_number}</td>
              <td className="table-cell text-slate-700">{fullName(s)}</td>
              <td className="table-cell">
                <span className="badge badge-gray">{ordinal(s.year_level)} Year</span>
              </td>
                <td className="table-cell text-slate-500">{s.course_code || "\u2014"}</td>
                <td className="table-cell">
                <span className={`badge ${s.status === "active" ? "badge-green" : s.status === "graduated" ? "badge-blue" : s.status === "dropped" || s.status === "transferred" ? "badge-red" : "badge-gray"}`}>{s.status || "active"}</span>
              </td>
              <td className="table-cell">
                <span className="badge badge-blue">{s.enrolled_count ?? 0} subjects</span>
              </td>
              {can("students.manage") && (
              <td className="table-cell">
                <div onClick={(e) => e.stopPropagation()} className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(s); }} className="btn btn-ghost btn-sm text-amber-500 hover:text-amber-700" title="Edit">
                    <Edit3 size={14} />
                  </button>
                  {onDelete && (
                    <button onClick={(e) => { e.stopPropagation(); onDelete(s); }} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {students.length > PAGE_SIZE && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </>
  );
}
