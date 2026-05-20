import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { sanitizeObject } from "../../utils/sanitize";
import StudentForm from "./StudentForm";
import StudentSubjectsModal from "./StudentSubjectsModal";
import StudentList from "./StudentList";
import ConfirmModal from "../common/ConfirmModal";

export default function StudentManager() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [config, setConfig] = useState({ max_year_level: 4, passing_grade: 75 });
    const YEARS = Array.from({ length: Number(config.max_year_level) }, (_, i) => i + 1);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ email: "", student_number: "", first_name: "", last_name: "", middle_name: "", date_of_birth: "", gender: "", address: "", contact_number: "", year_level: 1, current_semester: 1, course_id: "" });
    const [editingStudent, setEditingStudent] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

    const load = async () => {
        try {
            const cfgRes = await api.get("/api/config");
            if (cfgRes?.data) setConfig({ max_year_level: Number(cfgRes.data.max_year_level) || 4, passing_grade: Number(cfgRes.data.passing_grade) || 75 });
            const [sData, subjData, cData] = await Promise.all([
                api.get("/api/admin/students"), api.get("/api/admin/subjects"), api.get("/api/admin/courses"),
            ]);
            setStudents(sData.data ?? []); setSubjects(subjData.data ?? []); setCourses(cData.data ?? []);
        } catch (err) { showToast(err.message, "error"); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const openCreateForm = async () => {
        setForm({ email: "", student_number: "", first_name: "", last_name: "", middle_name: "", date_of_birth: "", gender: "", address: "", contact_number: "", year_level: 1, current_semester: 1, course_id: "" });
        setEditingStudent(null);
        setShowForm(true);
        try { const res = await api.get("/api/admin/students/next-number"); if (res?.data?.student_number) setForm((prev) => ({ ...prev, student_number: res.data.student_number })); } catch {}
    };

    const openEditForm = (student) => {
        setForm({ email: student.email || "", student_number: student.student_number, first_name: student.first_name || "", last_name: student.last_name || "", middle_name: student.middle_name || "", date_of_birth: student.date_of_birth ? student.date_of_birth.slice(0, 10) : "", gender: student.gender || "", address: student.address || "", contact_number: student.contact_number || "", year_level: student.year_level || 1, current_semester: student.current_semester || 1, course_id: student.course_id || "" });
        setEditingStudent(student.id);
        setShowForm(true);
    };

    const handleSaveStudent = async (e) => {
        e.preventDefault();
        if (!editingStudent && (!form.email.trim() || !form.first_name.trim() || !form.last_name.trim())) { showToast("Email, first name, and last name are required", "error"); return; }
        if (editingStudent && (!form.first_name.trim() || !form.last_name.trim())) { showToast("First name and last name are required", "error"); return; }
        setSaving(true);
        try {
            if (editingStudent) {
                await api.put(`/api/admin/students/${editingStudent}`, sanitizeObject({ email: form.email.trim() || null, first_name: form.first_name.trim(), last_name: form.last_name.trim(), middle_name: form.middle_name.trim() || null, date_of_birth: form.date_of_birth || null, gender: form.gender || null, address: form.address.trim() || null, contact_number: form.contact_number.trim() || null, year_level: form.year_level, current_semester: form.current_semester, course_id: form.course_id || null }));
                showToast("Student updated");
            } else {
                await api.post("/api/admin/students", sanitizeObject({ email: form.email.trim(), student_number: form.student_number.toUpperCase(), first_name: form.first_name.trim(), last_name: form.last_name.trim(), middle_name: form.middle_name.trim() || null, date_of_birth: form.date_of_birth || null, gender: form.gender || null, address: form.address.trim() || null, contact_number: form.contact_number.trim() || null, year_level: form.year_level, current_semester: form.current_semester, course_id: form.course_id || null }));
                showToast("Student created");
            }
            setShowForm(false); await load();
        } catch (err) { showToast(err.message, "error"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        setConfirmAction(null);
        try { await api.delete(`/api/admin/students/${id}`); showToast("Student deleted"); setSelectedStudent(null); await load(); }
        catch (err) { showToast(err.message, "error"); }
    };

    const filteredStudents = useMemo(() => {
        if (!search.trim()) return students;
        const q = search.toLowerCase();
        return students.filter((s) => { const name = [s.first_name, s.middle_name, s.last_name, s.full_name].filter(Boolean).join(" ").toLowerCase(); return s.student_number.toLowerCase().includes(q) || name.includes(q) || (s.course_code || "").toLowerCase().includes(q); });
    }, [students, search]);

    return (
        <div className="space-y-6">
            {toast && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{toast.message}</div>}

            <StudentForm open={showForm} editingStudent={editingStudent} form={form} setForm={setForm} saving={saving} YEARS={YEARS} courses={courses} onSave={handleSaveStudent} onClose={() => { setShowForm(false); setEditingStudent(null); }} />

            {selectedStudent && <StudentSubjectsModal student={selectedStudent} subjects={subjects} config={config} onClose={() => setSelectedStudent(null)} onToast={showToast} />}

            <StudentList students={filteredStudents} allStudents={students} loading={loading} search={search} setSearch={setSearch} onSelect={setSelectedStudent} onEdit={openEditForm} onAdd={openCreateForm} onDelete={(s) => setConfirmAction({ id: s.id, name: `${s.first_name} ${s.last_name}` })} />

            {confirmAction && <ConfirmModal title="Delete Student" message={`Delete student "${confirmAction.name}"?`} extra="All enrollment records and data will also be deleted. This cannot be undone." confirmLabel="Delete" onConfirm={() => handleDelete(confirmAction.id)} onCancel={() => setConfirmAction(null)} />}
        </div>
    );
}
