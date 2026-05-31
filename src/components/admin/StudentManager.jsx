import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Edit3, Trash2, Eye } from "lucide-react";
import api from "../../services/api";
import { sanitizeObject } from "../../utils/sanitize";
import { usePermissions } from "../../context/PermissionContext";
import StudentForm from "./StudentForm";
import StudentSubjectsModal from "./StudentSubjectsModal";
import StudentGradeWizard from "./StudentGradeWizard";
import ConfirmModal from "../common/ConfirmModal";
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

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [config, setConfig] = useState({ max_year_level: 4 });
  const YEARS = Array.from({ length: Number(config.max_year_level) }, (_, i) => i + 1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", student_number: "", first_name: "", last_name: "", middle_name: "", extension_name: "", date_of_birth: "", gender: "", address: "", contact_number: "", year_level: 1, current_semester: 1, course_id: "", status: "active", is_transfer: false, previous_school: "", previous_school_address: "", previous_year_level: "" });
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);
  const [recordModalStudent, setRecordModalStudent] = useState(null);
  const [gradeWizard, setGradeWizard] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const timerRef = useRef(null);
  const { can } = usePermissions();

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    try {
      const cfgRes = await api.get("/api/config");
      if (cfgRes?.data) setConfig({ max_year_level: Number(cfgRes.data.max_year_level) || 4 });
      const [sData, cData] = await Promise.all([
        api.get("/api/students"), api.get("/api/admin/courses"),
      ]);
      setStudents(sData.data ?? []);
      setCourses(cData.data ?? []);
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreateForm = async () => {
    setForm({ email: "", student_number: "", first_name: "", last_name: "", middle_name: "", extension_name: "", date_of_birth: "", gender: "", address: "", contact_number: "", year_level: 1, current_semester: 1, course_id: "", status: "active", is_transfer: false, previous_school: "", previous_school_address: "", previous_year_level: "" });
    setEditingStudent(null);
    setShowForm(true);
    try { const res = await api.get("/api/students/next-number"); if (res?.data?.student_number) setForm((prev) => ({ ...prev, student_number: res.data.student_number })); } catch {}
  };

  const openEditForm = (student) => {
    setForm({ email: student.email || "", student_number: student.student_number, first_name: student.first_name || "", last_name: student.last_name || "", middle_name: student.middle_name || "", extension_name: student.extension_name || "", date_of_birth: student.date_of_birth ? student.date_of_birth.slice(0, 10) : "", gender: student.gender || "", address: student.address || "", contact_number: student.contact_number || "", year_level: student.year_level || 1, current_semester: student.current_semester || 1, course_id: student.course_id || "", status: student.status || "active", is_transfer: student.is_transfer || false, previous_school: student.previous_school || "", previous_school_address: student.previous_school_address || "", previous_year_level: student.previous_year_level || "" });
    setEditingStudent(student.id);
    setShowForm(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) { showToast("First name and last name are required", "error"); return; }
    setSaving(true);
    try {
      if (editingStudent) {
        await api.patch(`/api/students/${editingStudent}`, sanitizeObject({ email: form.email.trim() || null, first_name: form.first_name.trim(), last_name: form.last_name.trim(), middle_name: form.middle_name.trim() || null, extension_name: form.extension_name.trim() || null, date_of_birth: form.date_of_birth || null, gender: form.gender || null, address: form.address.trim() || null, contact_number: form.contact_number.trim() || null, year_level: form.year_level, current_semester: form.current_semester, course_id: form.course_id || null, status: form.status, is_transfer: form.is_transfer, previous_school: form.previous_school.trim() || null, previous_school_address: form.previous_school_address.trim() || null, previous_year_level: form.previous_year_level || null }));
        showToast("Student updated");
      } else {
        const res = await api.post("/api/students", sanitizeObject({ email: form.email.trim() || null, student_number: form.student_number.toUpperCase(), first_name: form.first_name.trim(), last_name: form.last_name.trim(), middle_name: form.middle_name.trim() || null, extension_name: form.extension_name.trim() || null, date_of_birth: form.date_of_birth || null, gender: form.gender || null, address: form.address.trim() || null, contact_number: form.contact_number.trim() || null, year_level: form.year_level, current_semester: form.current_semester, course_id: form.course_id || null, is_transfer: form.is_transfer, previous_school: form.previous_school.trim() || null, previous_school_address: form.previous_school_address.trim() || null, previous_year_level: form.previous_year_level || null }));
        showToast("Student created");
        const newStudent = res?.data ?? res;
        const curRes = await api.get(`/api/admin/students/${newStudent.id}/curriculum`);
        setGradeWizard({ student: newStudent, curriculum: curRes?.data ?? [] });
      }
      setShowForm(false);
      setEditingStudent(null);
      await load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const scheduleDelete = (id, name) => {
    let remaining = 3;
    setPendingDelete({ id, name, remaining });
    timerRef.current = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        setPendingDelete((prev) => prev ? { ...prev, remaining } : null);
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
        const targetId = id;
        setPendingDelete(null);
        (async () => {
          try { await api.delete(`/api/students/${targetId}`); showToast(`"${name}" deleted`); await load(); }
          catch (err) { showToast(err.message, "error"); }
        })();
      }
    }, 1000);
  };

  const undoDelete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPendingDelete(null);
  };

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter((s) => {
      const name = [s.first_name, s.middle_name, s.last_name, s.full_name].filter(Boolean).join(" ").toLowerCase();
      return s.student_number.toLowerCase().includes(q) || name.includes(q) || (s.course_code || "").toLowerCase().includes(q);
    });
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginatedStudents = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  return (
    <div className="space-y-6">
      {toast && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{toast.message}</div>}

      <StudentForm open={showForm} editingStudent={editingStudent} form={form} setForm={setForm} saving={saving} YEARS={YEARS} courses={courses} onSave={handleSaveStudent} onClose={() => { setShowForm(false); setEditingStudent(null); }} />

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-800">Student Records</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-8 py-1.5 text-xs w-44" placeholder="Search students..." />
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{students.length}</span>
            {can("students.manage") && <button onClick={openCreateForm} className="btn btn-primary btn-sm flex items-center gap-1"><Plus size={13} /> Add</button>}
          </div>
        </div>
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
        ) : paginatedStudents.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">{search ? "No students match your search" : 'No students found. Click "Add" to create one.'}</div>
        ) : (
          <>
            <table className="w-full text-left text-xs">
              <thead className="table-header">
                <tr>
                  <th className="px-5 py-3">Student #</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Year</th>
                  <th className="px-5 py-3">Program</th>
                  <th className="px-5 py-3">Status</th>
                  {can("students.manage") && <th className="px-5 py-3 w-28">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.map((s) => (
                  <tr key={s.id} className="table-row">
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
                      <div className="flex gap-1">
                        <button onClick={() => setRecordModalStudent(s)} className="btn btn-ghost btn-sm text-blue-500 hover:text-blue-700" title="View Record">
                          <Eye size={14} />
                        </button>
                        {can("students.manage") && (
                        <>
                        <button onClick={() => openEditForm(s)} className="btn btn-ghost btn-sm text-amber-500 hover:text-amber-700" title="Edit">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => setConfirmAction({ step: 1, id: s.id, name: fullName(s) })} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600" title="Delete">
                          <Trash2 size={14} />
                        </button>
                        </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>

      {confirmAction?.step === 1 && <ConfirmModal title="Delete Student" message={`Delete student "${confirmAction.name}"?`} extra="All enrollment records and data will also be deleted. This cannot be undone." confirmLabel="Continue" onConfirm={() => setConfirmAction({ ...confirmAction, step: 2 })} onCancel={() => setConfirmAction(null)} />}
      {confirmAction?.step === 2 && <ConfirmModal title="Confirm Delete" message={`Are you sure you want to permanently delete "${confirmAction.name}"?`} extra="All enrollment records and data will be deleted. This cannot be undone." confirmLabel="Delete" onConfirm={() => { const { id, name } = confirmAction; setConfirmAction(null); scheduleDelete(id, name); }} onCancel={() => setConfirmAction(null)} />}
      {recordModalStudent && <StudentSubjectsModal student={recordModalStudent} onClose={() => setRecordModalStudent(null)} />}

      {pendingDelete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm">
          <span>Deleting <strong>{pendingDelete.name}</strong>... <span className="text-slate-400">({pendingDelete.remaining}s)</span></span>
          <button onClick={undoDelete} className="btn bg-white text-slate-900 hover:bg-slate-200 btn-sm font-semibold px-3">Undo</button>
        </div>
      )}
      {gradeWizard && (
        <StudentGradeWizard
          student={gradeWizard.student}
          curriculum={gradeWizard.curriculum}
          onClose={() => setGradeWizard(null)}
          onDone={() => setGradeWizard(null)}
          onToast={showToast}
        />
      )}
    </div>
  );
}
