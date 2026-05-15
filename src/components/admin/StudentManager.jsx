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

    const viewStudent = async (student) => {
        setSelectedStudent(student);
        setEnrollSubjectId("");
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
    };

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
            PENDING: "bg-yellow-100 text-yellow-700",
            APPROVED: "bg-emerald-100 text-emerald-700",
            REJECTED: "bg-red-100 text-red-600",
        };
        return map[status] || "bg-slate-100 text-slate-500";
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

            {selectedStudent ? (
                <>
                    {/* Detail Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                                    {fullName(selectedStudent).charAt(0) || "S"}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{fullName(selectedStudent)}</h3>
                                    <p className="text-sm text-slate-500 font-mono mt-0.5">{selectedStudent.student_number}</p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-medium">{ordinal(selectedStudent.year_level)} Year</span>
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded font-medium">Sem {selectedStudent.current_semester || 1}</span>
                                        {selectedStudent.course_name && (
                                            <span className="text-[10px] bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded font-medium">{selectedStudent.course_code}</span>
                                        )}
                                        {selectedStudent.gender && (
                                            <span className="text-[10px] bg-pink-50 text-pink-600 px-2.5 py-0.5 rounded font-medium">{selectedStudent.gender}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-slate-400">
                                        {selectedStudent.email && <span>✉️ {selectedStudent.email}</span>}
                                        {selectedStudent.contact_number && <span>📞 {selectedStudent.contact_number}</span>}
                                        {selectedStudent.date_of_birth && <span>🎂 {new Date(selectedStudent.date_of_birth).toLocaleDateString()}</span>}
                                        {selectedStudent.address && <span className="w-full sm:w-auto">📍 {selectedStudent.address}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button onClick={() => { openEditForm(selectedStudent); }}
                                    className="text-sm text-blue-500 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-blue-50">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(selectedStudent.id)}
                                    className="text-sm text-red-400 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50">
                                    Delete
                                </button>
                                <button onClick={backToList}
                                    className="text-sm text-slate-400 hover:text-slate-600 transition px-3 py-1.5 rounded-lg hover:bg-slate-100">
                                    ← Back
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enroll */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <h3 className="text-sm font-bold text-slate-800 mb-3">Enroll in Subject</h3>
                        <div className="flex gap-3">
                            <select value={enrollSubjectId} onChange={(e) => setEnrollSubjectId(e.target.value)}
                                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                <option value="">— Select Subject —</option>
                                {availableSubjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.subject_code} — {s.subject_name} ({ordinal(s.year_level)}Y Sem{s.semester})
                                        {s.prerequisite_name ? ` [Req: ${s.prerequisite_name}]` : ""}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleEnroll} disabled={!enrollSubjectId || saving}
                                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                                {saving ? "..." : "Enroll"}
                            </button>
                        </div>
                        {availableSubjects.length === 0 && (
                            <p className="text-xs text-slate-400 mt-2 italic">All subjects enrolled</p>
                        )}
                    </div>

                    {/* Enrolled Subjects */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                                        <th className="px-5 py-3 font-semibold w-36">Action</th>
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
                                                <input type="number" min={0} max={100}
                                                    defaultValue={ss.grade || ""}
                                                    onBlur={(e) => {
                                                        const val = e.target.value;
                                                        if (val) handleGrade(ss.id, Number(val), Number(val) >= 75 ? "APPROVED" : "REJECTED");
                                                    }}
                                                    className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="—" />
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${statusBadge(ss.status)}`}>{ss.status}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-1">
                                                    <button onClick={() => handleGrade(ss.id, ss.grade || 75, "APPROVED")}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition">Pass</button>
                                                    <button onClick={() => handleGrade(ss.id, ss.grade || 0, "REJECTED")}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg font-medium text-red-500 bg-red-50 hover:bg-red-100 transition">Fail</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            ) : (
                /* Student List */
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
                                    <th className="px-5 py-3 font-semibold">Contact</th>
                                    <th className="px-5 py-3 font-semibold w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3 font-mono text-slate-700">{s.student_number}</td>
                                        <td className="px-5 py-3 text-slate-700">{fullName(s)}</td>
                                        <td className="px-5 py-3">
                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{ordinal(s.year_level)} Year</span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">{s.course_code || "—"}</td>
                                        <td className="px-5 py-3 text-slate-400">{s.contact_number || "—"}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => viewStudent(s)} className="text-blue-500 hover:text-blue-700 transition text-[11px] font-medium">View</button>
                                                <button onClick={() => openEditForm(s)} className="text-amber-500 hover:text-amber-700 transition text-[11px] font-medium">Edit</button>
                                                <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 transition text-[11px] font-medium">Del</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

function ordinal(n) {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
}
