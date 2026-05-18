import { useEffect, useState } from "react";
import api from "../../services/api";
import StudentForm from "../../components/admin/StudentForm";
import StudentSubjectsModal from "../../components/admin/StudentSubjectsModal";
import StudentList from "../../components/admin/StudentList";

export default function StudentManager() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [config, setConfig] = useState({ max_year_level: 4, passing_grade: 75 });
    const YEARS = Array.from({ length: Number(config.max_year_level) }, (_, i) => i + 1);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [toast, setToast] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        email: "", student_number: "", first_name: "", last_name: "", middle_name: "",
        date_of_birth: "", gender: "", address: "", contact_number: "",
        year_level: 1, course_id: "",
    });
    const [editingStudent, setEditingStudent] = useState(null);
    const [saving, setSaving] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        try {
            const cfgRes = await api.get("/api/config");
            if (cfgRes?.data) setConfig({ max_year_level: Number(cfgRes.data.max_year_level) || 4, passing_grade: Number(cfgRes.data.passing_grade) || 75 });
            const [sData, subjData, cData] = await Promise.all([
                api.get("/api/admin/students"),
                api.get("/api/admin/subjects"),
                api.get("/api/admin/courses"),
            ]);
            setStudents(sData.data ?? []);
            setSubjects(subjData.data ?? []);
            setCourses(cData.data ?? []);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openCreateForm = () => {
        setForm({ email: "", student_number: "", first_name: "", last_name: "", middle_name: "", date_of_birth: "", gender: "", address: "", contact_number: "", year_level: 1, course_id: "" });
        setEditingStudent(null);
        setShowForm(true);
    };

    const openEditForm = (student) => {
        setForm({
            email: student.email || "",
            student_number: student.student_number,
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            middle_name: student.middle_name || "",
            date_of_birth: student.date_of_birth ? student.date_of_birth.slice(0, 10) : "",
            gender: student.gender || "",
            address: student.address || "",
            contact_number: student.contact_number || "",
            year_level: student.year_level || 1,
            course_id: student.course_id || "",
        });
        setEditingStudent(student.id);
        setShowForm(true);
    };

    const handleSaveStudent = async (e) => {
        e.preventDefault();
        if (!editingStudent && (!form.email.trim() || !form.student_number.trim() || !form.first_name.trim() || !form.last_name.trim())) {
            showToast("Email, student number, first name, and last name are required", "error");
            return;
        }
        if (editingStudent && (!form.first_name.trim() || !form.last_name.trim())) {
            showToast("First name and last name are required", "error");
            return;
        }
        setSaving(true);
        try {
            if (editingStudent) {
                await api.put(`/api/admin/students/${editingStudent}`, {
                    email: form.email.trim() || null, first_name: form.first_name.trim(), last_name: form.last_name.trim(),
                    middle_name: form.middle_name.trim() || null, date_of_birth: form.date_of_birth || null,
                    gender: form.gender || null, address: form.address.trim() || null,
                    contact_number: form.contact_number.trim() || null, year_level: form.year_level, course_id: form.course_id || null,
                });
                showToast("Student updated");
            } else {
                await api.post("/api/admin/students", {
                    email: form.email.trim(), student_number: form.student_number.toUpperCase(),
                    first_name: form.first_name.trim(), last_name: form.last_name.trim(),
                    middle_name: form.middle_name.trim() || null, date_of_birth: form.date_of_birth || null,
                    gender: form.gender || null, address: form.address.trim() || null,
                    contact_number: form.contact_number.trim() || null, year_level: form.year_level, course_id: form.course_id || null,
                });
                showToast("Student created");
            }
            setShowForm(false);
            await load();
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this student? All enrollment records will also be deleted.")) return;
        try {
            await api.delete(`/api/admin/students/${id}`);
            showToast("Student deleted");
            setSelectedStudent(null);
            await load();
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {toast.message}
                </div>
            )}

            <StudentForm
                open={showForm}
                editingStudent={editingStudent}
                form={form}
                setForm={setForm}
                saving={saving}
                YEARS={YEARS}
                courses={courses}
                onSave={handleSaveStudent}
                onClose={() => { setShowForm(false); setEditingStudent(null); }}
            />

            {selectedStudent && (
                <StudentSubjectsModal
                    student={selectedStudent}
                    subjects={subjects}
                    config={config}
                    onClose={() => setSelectedStudent(null)}
                    onToast={showToast}
                />
            )}

            <StudentList
                students={students}
                loading={loading}
                onSelect={setSelectedStudent}
                onEdit={openEditForm}
                onAdd={openCreateForm}
            />
        </div>
    );
}
