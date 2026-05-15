import { useEffect, useState } from "react";
import api from "../../services/api";

const YEARS = [1, 2, 3, 4];
const GENDERS = ["Male", "Female", "Other"];

export default function StudentManager() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentSubjects, setStudentSubjects] = useState([]);
    const [enrollSubjectId, setEnrollSubjectId] = useState("");
    const [managingSubjects, setManagingSubjects] = useState(false);
    const [editingGradeId, setEditingGradeId] = useState(null);
    const [gradeInputs, setGradeInputs] = useState({});
    const [enrollYear, setEnrollYear] = useState(1);
    const [enrollSem, setEnrollSem] = useState(1);
    const [showCurriculum, setShowCurriculum] = useState(false);
    const [curriculum, setCurriculum] = useState([]);
    const [loadingCurriculum, setLoadingCurriculum] = useState(false);
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        email: "", student_number: "", first_name: "", last_name: "", middle_name: "",
        date_of_birth: "", gender: "", address: "", contact_number: "",
        year_level: 1, course_id: "",
    });
    const [editingStudent, setEditingStudent] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        try {
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

    useEffect(() => {
        if (managingSubjects) setShowCurriculum(false);
    }, [managingSubjects]);

    useEffect(() => {
        if (showCurriculum) setManagingSubjects(false);
    }, [showCurriculum]);

    const viewStudent = async (student) => {
        setSelectedStudent(student);
        setEnrollSubjectId("");
        setShowCurriculum(false);
        setCurriculum([]);
        try {
            const data = await api.get(`/api/admin/students/${student.id}/subjects`);
            setStudentSubjects(data.data ?? []);
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const backToList = () => {
        setSelectedStudent(null);
        setStudentSubjects([]);
        setManagingSubjects(false);
        setShowCurriculum(false);
        setCurriculum([]);
    };

    const openCreateForm = () => {
        setSelectedStudent(null);
        setForm({ email: "", student_number: "", first_name: "", last_name: "", middle_name: "", date_of_birth: "", gender: "", address: "", contact_number: "", year_level: 1, course_id: "" });
        setEditingStudent(null);
        setShowForm(true);
    };

    const openEditForm = (student) => {
        setSelectedStudent(null);
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
        if (editingStudent) {
            if (!form.first_name.trim() || !form.last_name.trim()) {
                showToast("First name and last name are required", "error");
                return;
            }
        } else {
            if (!form.email.trim() || !form.student_number.trim() || !form.first_name.trim() || !form.last_name.trim()) {
                showToast("Email, student number, first name, and last name are required", "error");
                return;
            }
        }
        setSaving(true);
        try {
            if (editingStudent) {
                await api.put(`/api/admin/students/${editingStudent}`, {
                    email: form.email.trim() || null,
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    middle_name: form.middle_name.trim() || null,
                    date_of_birth: form.date_of_birth || null,
                    gender: form.gender || null,
                    address: form.address.trim() || null,
                    contact_number: form.contact_number.trim() || null,
                    year_level: form.year_level,
                    course_id: form.course_id || null,
                });
                showToast("Student updated");
            } else {
                await api.post("/api/admin/students", {
                    email: form.email.trim(),
                    student_number: form.student_number.toUpperCase(),
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    middle_name: form.middle_name.trim() || null,
                    date_of_birth: form.date_of_birth || null,
                    gender: form.gender || null,
                    address: form.address.trim() || null,
                    contact_number: form.contact_number.trim() || null,
                    year_level: form.year_level,
                    course_id: form.course_id || null,
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

    const handleEnroll = async () => {
        if (!enrollSubjectId) return;
        setSaving(true);
        try {
            await api.post("/api/admin/students/enroll", {
                student_id: selectedStudent.id,
                subject_id: enrollSubjectId,
            });
            showToast("Enrolled");
            setEnrollSubjectId("");
            const data = await api.get(`/api/admin/students/${selectedStudent.id}/subjects`);
            setStudentSubjects(data.data ?? []);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleEnrollSemester = async () => {
        setSaving(true);
        try {
            const res = await api.post("/api/admin/students/enroll-semester", {
                student_id: selectedStudent.id,
                year_level: enrollYear,
                semester: enrollSem,
            });
            showToast(res.message || "Enrolled");
            const data = await api.get(`/api/admin/students/${selectedStudent.id}/subjects`);
            setStudentSubjects(data.data ?? []);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const loadCurriculum = async () => {
        setLoadingCurriculum(true);
        try {
            const data = await api.get(`/api/admin/students/${selectedStudent.id}/curriculum`);
            setCurriculum(data.data ?? []);
            setShowCurriculum(true);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoadingCurriculum(false);
        }
    };

    const handleGrade = async (ssId, grade, status) => {
        try {
            await api.put(`/api/admin/students/grade/${ssId}`, { grade, status });
            showToast("Grade saved");
            const data = await api.get(`/api/admin/students/${selectedStudent.id}/subjects`);
            setStudentSubjects(data.data ?? []);
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const activeSubjects = subjects.filter((s) => s.is_active !== false);
    const enrolledSubjectIds = new Set(studentSubjects.map((ss) => ss.subject_id));
    const availableSubjects = activeSubjects.filter((s) => !enrolledSubjectIds.has(s.id));

    const statusBadge = (status) => {
        const map = {
            PENDING: { label: "Pending", cls: "bg-yellow-100 text-yellow-700" },
            APPROVED: { label: "Pass", cls: "bg-emerald-100 text-emerald-700" },
            REJECTED: { label: "Fail", cls: "bg-red-100 text-red-600" },
        };
        return map[status] || { label: status || "—", cls: "bg-slate-100 text-slate-500" };
    };

    const fullName = (s) => {
        const parts = [s.first_name, s.middle_name, s.last_name].filter(Boolean);
        return parts.join(" ") || s.full_name || "—";
    };

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {toast.message}
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-sm font-bold text-slate-800 mb-5">{editingStudent ? "Edit Student" : "Add Student"}</h3>
                        <form onSubmit={handleSaveStudent} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="student@example.com" required={!editingStudent} />
                            </div>

                            {/* Student Number */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Student Number</label>
                                <input value={form.student_number} onChange={(e) => setForm({ ...form, student_number: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase"
                                    placeholder="2020-0001" required={!editingStudent} disabled={!!editingStudent} />
                            </div>

                            {/* Name Fields */}
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

                            {/* DOB, Gender, Contact */}
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

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Address</label>
                                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" rows={2} placeholder="(optional)" />
                            </div>

                            {/* Year, Course */}
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
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-6 py-2.5 text-sm font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Student Subjects Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto" onClick={backToList}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">{fullName(selectedStudent)}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedStudent.student_number}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!managingSubjects && (
                                    <>
                                        <button onClick={() => setManagingSubjects(true)}
                                            className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition">
                                            Manage
                                        </button>
                                        <button onClick={loadCurriculum}
                                            className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                                            Logs
                                        </button>
                                    </>
                                )}
                                <button onClick={backToList}
                                    className="text-sm text-slate-400 hover:text-slate-600 transition px-3 py-1.5 rounded-lg hover:bg-slate-100">
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Manage — Semester Enrollment */}
                        {managingSubjects && (
                            <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">Enroll by Semester</h3>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Enroll in all subjects for a year and semester at once</p>
                                    </div>
                                    <button onClick={() => setManagingSubjects(false)}
                                        className="text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                                        Done
                                    </button>
                                </div>
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-medium text-slate-500 mb-1">Year Level</label>
                                        <select value={enrollYear} onChange={(e) => setEnrollYear(Number(e.target.value))}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white">
                                            {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{ordinal(y)} Year</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-medium text-slate-500 mb-1">Semester</label>
                                        <select value={enrollSem} onChange={(e) => setEnrollSem(Number(e.target.value))}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white">
                                            {[1, 2].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={handleEnrollSemester} disabled={saving}
                                        className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-1.5 h-[42px]">
                                        {saving ? "..." : "Enroll Semester"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Curriculum Logs View */}
                        {showCurriculum ? (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800">Academic Record</span>
                                    <button onClick={() => setShowCurriculum(false)}
                                        className="text-xs text-slate-400 hover:text-slate-600 transition">
                                        Show Enrolled
                                    </button>
                                </div>
                                {loadingCurriculum ? (
                                    <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
                                ) : curriculum.length === 0 ? (
                                    <div className="p-10 text-center text-sm text-slate-400">No curriculum found for this course</div>
                                ) : (
                                    <div>
                                        {[1, 2, 3, 4].map((yr) => {
                                            const yrSubjects = curriculum.filter((s) => s.year_level === yr);
                                            if (yrSubjects.length === 0) return null;
                                            return (
                                                <div key={yr}>
                                                    <div className="px-5 py-2 bg-slate-50 border-b border-slate-100">
                                                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{ordinal(yr)} Year</span>
                                                    </div>
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="text-slate-400 uppercase tracking-wider">
                                                            <tr>
                                                                <th className="px-5 py-2 font-semibold">Code</th>
                                                                <th className="px-5 py-2 font-semibold">Subject</th>
                                                                <th className="px-5 py-2 font-semibold">Sem</th>
                                                                <th className="px-5 py-2 font-semibold">Type</th>
                                                                <th className="px-5 py-2 font-semibold">Units</th>
                                                                <th className="px-5 py-2 font-semibold">Grade</th>
                                                                <th className="px-5 py-2 font-semibold">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {yrSubjects.map((sub) => (
                                                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                                                    <td className="px-5 py-2 font-mono text-slate-700">{sub.subject_code}</td>
                                                                    <td className="px-5 py-2 text-slate-700">
                                                                        {sub.subject_name}
                                                                        {sub.prerequisite_name && <span className="text-[10px] text-slate-400 ml-1">(req: {sub.prerequisite_name})</span>}
                                                                    </td>
                                                                    <td className="px-5 py-2 text-slate-500">{sub.semester}</td>
                                                                    <td className="px-5 py-2">
                                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${sub.subject_type === "major" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
                                                                            {sub.subject_type}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-2 text-slate-600">{sub.units}</td>
                                                                    <td className="px-5 py-2 text-slate-700 font-medium">{sub.grade ?? "—"}</td>
                                                                    <td className="px-5 py-2">
                                                                        {sub.enrollment_status ? (
                                                                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${statusBadge(sub.enrollment_status).cls}`}>
                                                                                {statusBadge(sub.enrollment_status).label}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[10px] text-slate-300 italic">Not taken</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Enrolled Subjects */
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800">Enrolled Subjects</span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{studentSubjects.length} subjects</span>
                                </div>
                                {studentSubjects.length === 0 ? (
                                    <div className="p-10 text-center text-sm text-slate-400">No subjects enrolled</div>
                                ) : (
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-5 py-3 font-semibold">Subject</th>
                                                <th className="px-5 py-3 font-semibold">Type</th>
                                                <th className="px-5 py-3 font-semibold">Units</th>
                                                <th className="px-5 py-3 font-semibold">Grade</th>
                                                <th className="px-5 py-3 font-semibold">Status</th>
                                                <th className="px-5 py-3 font-semibold w-16">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {studentSubjects.map((ss) => (
                                                <tr key={ss.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <span className="font-mono font-medium text-slate-800">{ss.subject_code}</span>
                                                        <p className="text-[11px] text-slate-500">{ss.subject_name}</p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${ss.subject_type === "major" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
                                                            {ss.subject_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600">{ss.units}</td>
                                                    <td className="px-5 py-3">
                                                        {editingGradeId === ss.id ? (
                                                            <input type="number" min={0} max={100}
                                                                value={gradeInputs[ss.id] ?? ss.grade ?? ""}
                                                                onChange={(e) => setGradeInputs({ ...gradeInputs, [ss.id]: e.target.value })}
                                                                onBlur={(e) => {
                                                                    const val = e.target.value;
                                                                    if (val) {
                                                                        handleGrade(ss.id, Number(val), Number(val) >= 75 ? "APPROVED" : "REJECTED");
                                                                    }
                                                                    setEditingGradeId(null);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") e.target.blur();
                                                                    if (e.key === "Escape") setEditingGradeId(null);
                                                                }}
                                                                className="w-16 border border-blue-400 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                                autoFocus />
                                                        ) : (
                                                            <span className="text-sm text-slate-700 font-medium">{ss.grade ?? "—"}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${statusBadge(ss.status).cls}`}>{statusBadge(ss.status).label}</span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <button onClick={() => {
                                                            setEditingGradeId(ss.id);
                                                            setGradeInputs({ ...gradeInputs, [ss.id]: ss.grade ?? "" });
                                                        }}
                                                            className="text-[11px] text-blue-500 hover:text-blue-700 transition font-medium">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Student List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800">Students</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{students.length} students</span>
                            <button onClick={openCreateForm}
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
                                {students.map((s) => (
                                    <tr key={s.id} onClick={() => viewStudent(s)}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer">
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
                                                <button onClick={(e) => { e.stopPropagation(); openEditForm(s); }} className="text-amber-500 hover:text-amber-700 transition text-[11px] font-medium">Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
