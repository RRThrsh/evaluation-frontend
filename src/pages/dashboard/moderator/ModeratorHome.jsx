import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

function EvaluationReport({ evaluation, onBack }) {
  if (!evaluation) return null;

  const {
    student,
    summary,
    current_semester_subjects,
    next_semester_subjects,
    failed_subjects,
    unresolved_failed_subjects,
    retake_subjects,
    prerequisite_checks,
    recommendations,
    overall,
    decision,
  } = evaluation;

  const badgeColor =
    overall === "qualified"
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : overall === "conditional"
      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
      : "bg-red-100 text-red-700 border-red-300";

  const decisionColor =
    decision === "APPROVED"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700";

  const statusColor = (status) => ({
    enrolled: "bg-blue-50",
    passed: "bg-emerald-50",
    failed: "bg-red-50",
    pending: "bg-zinc-50",
  }[status] || "bg-zinc-50");

  const statusBadge = (status) => {
    const colors = {
      enrolled: "bg-blue-200 text-blue-800",
      passed: "bg-emerald-200 text-emerald-800",
      failed: "bg-red-200 text-red-800",
      pending: "bg-zinc-200 text-zinc-600",
    };
    return colors[status] || "bg-zinc-200 text-zinc-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-zinc-800">
          Evaluation Report — {student.full_name}
        </h2>
        <button
          onClick={onBack}
          className="text-sm text-zinc-500 hover:text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-100"
        >
          Back to list
        </button>
      </div>

      {/* Student Info */}
      <div className="bg-zinc-50 border rounded-lg p-4 text-sm grid grid-cols-2 gap-2">
        <div><span className="font-medium">Student:</span> {student.full_name}</div>
        <div><span className="font-medium">Number:</span> {student.student_number}</div>
        <div><span className="font-medium">Course:</span> {student.course}</div>
        <div><span className="font-medium">Year:</span> {student.year_level} — Semester {student.current_semester}</div>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg border ${badgeColor}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg uppercase">{overall}</span>
          {decision && (
            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${decisionColor}`}>
              {decision}
            </span>
          )}
        </div>
      </div>

      {/* SECTION 1 - Current Semester Subjects (TOP) */}
      <div className="border-l-4 border-blue-500 pl-3">
        <h3 className="font-bold text-sm text-blue-600 mb-2 uppercase tracking-wide">Current Semester — Subjects Taken</h3>
      </div>
      {current_semester_subjects && current_semester_subjects.length > 0 ? (
        <div className="divide-y border rounded-lg text-sm">
          {current_semester_subjects.map((cs, i) => (
            <div key={i} className={`p-3 flex justify-between items-center ${statusColor(cs.status)}`}>
              <div>
                <span className="font-medium">{cs.subject_code}</span>
                <span className="text-zinc-400 ml-1">{cs.subject_name}</span>
                <span className="text-zinc-400 ml-1">({cs.subject_type})</span>
              </div>
              <div className="flex items-center gap-2">
                {cs.grade && <span className="font-bold">{cs.grade}</span>}
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${statusBadge(cs.status)}`}>{cs.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-zinc-400 italic p-3 bg-zinc-50 rounded-lg">No current semester subjects</div>
      )}

      {/* SECTION 2 - Next Semester Subjects (MIDDLE) */}
      <div className="border-l-4 border-emerald-500 pl-3 mt-6">
        <h3 className="font-bold text-sm text-emerald-600 mb-2 uppercase tracking-wide">Next Semester — Subjects to Take</h3>
      </div>
      {next_semester_subjects && next_semester_subjects.length > 0 ? (
        <div className="divide-y border rounded-lg text-sm">
          {next_semester_subjects.map((ns, i) => (
            <div key={i} className={`p-3 flex items-center justify-between ${ns.is_retake ? "bg-amber-50" : ""}`}>
              <div>
                <span className="font-medium">{ns.subject_code}</span>
                <span className="text-zinc-400 text-xs ml-2">({ns.subject_type})</span>
                {ns.prerequisite && (
                  <span className="text-zinc-400 text-xs ml-2">prereq: {ns.prerequisite}</span>
                )}
                {ns.is_retake && (
                  <span className="text-amber-600 text-xs ml-2 font-bold">[RETAKE]</span>
                )}
              </div>
              {ns.prerequisite && (
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  ns.prereq_failed ? "bg-red-100 text-red-700" : ns.prereq_met ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {ns.prereq_failed ? "FAILED" : ns.prereq_met ? "OK" : "PENDING"}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-zinc-400 italic p-3 bg-zinc-50 rounded-lg">No next semester subjects</div>
      )}

      {/* SECTION 3 - Failed Subjects / Retakes (BOTTOM) */}
      {(unresolved_failed_subjects?.length > 0 || retake_subjects?.length > 0) && (
        <>
          <div className="border-l-4 border-red-500 pl-3 mt-6">
            <h3 className="font-bold text-sm text-red-600 mb-2 uppercase tracking-wide">Failed Subjects — Needs to Retake</h3>
          </div>
          <div className="divide-y border border-red-200 rounded-lg text-sm">
            {retake_subjects && retake_subjects.length > 0 && retake_subjects.map((rs, i) => (
              <div key={`retake-${i}`} className="p-3 flex justify-between bg-amber-50">
                <div>
                  <span className="font-medium">{rs.subject_code} — {rs.subject_name}</span>
                  <span className="text-amber-600 text-xs ml-2 font-bold">[OFFERED NEXT SEM]</span>
                </div>
                <span className="text-amber-600 font-bold">{rs.grade}</span>
              </div>
            ))}
            {unresolved_failed_subjects && unresolved_failed_subjects.length > 0 && unresolved_failed_subjects.map((fs, i) => (
              <div key={`unresolved-${i}`} className="p-3 flex justify-between bg-red-50">
                <div>
                  <span className="font-medium">{fs.subject_code} — {fs.subject_name}</span>
                  <span className="text-red-600 text-xs ml-2 font-bold">[NOT OFFERED NEXT SEM]</span>
                </div>
                <span className="text-red-600 font-bold">{fs.grade}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Failed Subjects from current semester (that need retake) */}
      {failed_subjects && failed_subjects.length > 0 && (
        <div>
          <div className="border-l-4 border-orange-500 pl-3 mt-6">
            <h3 className="font-bold text-sm text-orange-600 mb-2 uppercase tracking-wide">Current Semester Fails — Needs to Retake</h3>
          </div>
          <div className="divide-y border border-orange-200 rounded-lg text-sm">
            {failed_subjects.map((fs, i) => (
              <div key={i} className="p-3 flex justify-between bg-orange-50">
                <span className="font-medium">{fs.subject_code} — {fs.subject_name}</span>
                <span className="text-orange-600 font-bold">{fs.grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisite Checks */}
      {prerequisite_checks && prerequisite_checks.length > 0 && (
        <div className="mt-6">
          <div className="border-l-4 border-zinc-500 pl-3">
            <h3 className="font-bold text-sm text-zinc-600 mb-2 uppercase tracking-wide">Prerequisite Checks</h3>
          </div>
          <div className="divide-y border rounded-lg text-sm">
            {prerequisite_checks.map((pc, i) => (
              <div key={i} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{pc.subject_code}</span>
                  <span className="text-zinc-400 mx-1">→</span>
                  <span>prerequisite: {pc.prereq_code}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  pc.prereq_failed
                    ? "bg-red-100 text-red-700"
                    : pc.prereq_met
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {pc.prereq_failed ? "FAILED" : pc.prereq_met ? "MET" : "NOT YET TAKEN"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModeratorHome() {
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingSubjects, setEditingSubjects] = useState(false);
  const [subjectData, setSubjectData] = useState({ taken: [], available: [] });
  const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState("");

  const fetchRequests = () => {
    api.get("/api/moderator/evaluations")
      .then((data) => setRequests(data.data ?? data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchStudentSubjects = async (studentId) => {
    try {
      const data = await api.get(`/api/moderator/students/${studentId}/subjects`);
      setSubjectData(data.data ?? data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSubject = async (studentId) => {
    if (!selectedSubjectToAdd) return;
    try {
      await api.post(`/api/moderator/students/${studentId}/subjects`, {
        subject_id: selectedSubjectToAdd,
        status: "PENDING",
      });
      setSelectedSubjectToAdd("");
      await fetchStudentSubjects(studentId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateSubject = async (studentId, subjectRecordId, updates) => {
    try {
      await api.patch(`/api/moderator/students/${studentId}/subjects/${subjectRecordId}`, updates);
      await fetchStudentSubjects(studentId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSubject = async (studentId, subjectRecordId) => {
    try {
      await api.delete(`/api/moderator/students/${studentId}/subjects/${subjectRecordId}`);
      await fetchStudentSubjects(studentId);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleEditSubjects = async (studentId) => {
    if (!editingSubjects) {
      await fetchStudentSubjects(studentId);
    }
    setEditingSubjects(!editingSubjects);
  };

  const handleEvaluate = async (id) => {
    setEvaluating(true);
    setError("");
    try {
      const data = await api.post(`/api/moderator/evaluations/${id}/evaluate`);
      setEvaluation(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleOverride = async (id, action) => {
    setEvaluating(true);
    try {
      await api.post(`/api/moderator/evaluations/${id}/override`, { action });
      setSelectedRequest(null);
      setEvaluation(null);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const openRequest = async (req) => {
    setSelectedRequest(req);
    setEvaluation(null);
    try {
      const data = await api.get(`/api/moderator/students/${req.student_id}/evaluate`);
      // Include the stored decision in fresh evaluation data
      if (req.evaluation_result) {
        data.data.decision = req.status;
      }
      setEvaluation(data.data);
    } catch (err) {
      // Fallback to stored result if preview fails
      if (req.evaluation_result) {
        const parsed = typeof req.evaluation_result === "string"
          ? JSON.parse(req.evaluation_result)
          : req.evaluation_result;
        setEvaluation(parsed);
      }
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setEvaluation(null);
    fetchRequests();
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { id, action } = confirmAction;
    setConfirmAction(null);
    if (action === "approve") {
      await handleEvaluate(id);
      closeModal();
    } else if (action === "reject") {
      await handleOverride(id, "REJECTED");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-zinc-200 px-6 py-3 flex justify-between items-center">
        <span className="font-bold text-zinc-700">
          MODERATOR CONTROL CENTER
        </span>

        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">
            Pending: {requests.filter(r => r.status === "PENDING").length}
          </span>
          <Link
            to="/profile"
            className="text-sm text-zinc-400 hover:text-blue-600 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            Profile
          </Link>
          <button
            onClick={logout}
            className="text-sm text-zinc-400 hover:text-red-500 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">
              Evaluation Requests
            </h1>
            <p className="text-sm text-zinc-500">
              Click a request to view evaluation result
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* REQUEST LIST */}
        {loading ? (
          <div className="text-center text-zinc-400 py-10">Loading requests...</div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm divide-y">

            {requests.length > 0 ? (
              requests.map((req, i) => (
                <div
                  key={req.id ?? i}
                  onClick={() => openRequest(req)}
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-50 transition"
                >
                  {/* LEFT */}
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                        req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-600"
                      }`}>
                        {req.status}
                      </span>
                      {req.status !== "PENDING" && req.evaluation_result && (
                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                          (req.evaluation_result.overall === "qualified" || req.evaluation_result.overall === "conditional")
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {req.evaluation_result.overall}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-700 mt-1">
                      {req.student_number || "N/A"} — {req.reason ?? req.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                    {req.status === "PENDING" && (
                      <span className="text-xs text-blue-500 font-medium ml-2">
                        Click to evaluate →
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-zinc-400">
                No requests found.
              </div>
            )}

          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">

            {/* Request Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-zinc-800">
                {selectedRequest.status === "PENDING" ? "Student Grades Overview" : "Evaluation Report"}
              </h2>
              <button onClick={closeModal} className="text-zinc-500 hover:text-red-500">✕</button>
            </div>

            {/* Evaluation Report (preview or saved) */}
            {evaluation && (
              <EvaluationReport evaluation={evaluation} onBack={() => {}} />
            )}

            {!evaluation && selectedRequest.status === "PENDING" && (
              <div className="text-center text-zinc-400 py-10 text-sm">Loading student grades...</div>
            )}

            {/* Edit Subjects Section (moderator only) */}
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => toggleEditSubjects(selectedRequest.student_id)}
                className="w-full py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                {editingSubjects ? "Close Subject Editor" : "Edit Student Subjects"}
              </button>
            </div>

            {editingSubjects && (
              <div className="mt-4 space-y-3">
                <h3 className="font-bold text-sm text-zinc-700 uppercase tracking-wide">Subject Editor</h3>

                {/* Add new subject */}
                <div className="flex gap-2">
                  <select
                    value={selectedSubjectToAdd}
                    onChange={(e) => setSelectedSubjectToAdd(e.target.value)}
                    className="flex-1 border border-zinc-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select subject to add...</option>
                    {subjectData.available.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.subject_code} — {s.subject_name} (Y{s.year_level} Sem{s.semester})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddSubject(selectedRequest.student_id)}
                    disabled={!selectedSubjectToAdd}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:bg-zinc-300"
                  >
                    Add
                  </button>
                </div>

                {/* Current taken subjects */}
                <div className="divide-y border rounded-lg text-sm max-h-60 overflow-y-auto">
                  {subjectData.taken.length === 0 && (
                    <div className="p-3 text-zinc-400 text-center">No subjects taken yet</div>
                  )}
                  {subjectData.taken.map((s) => (
                    <div key={s.id} className="p-3 flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{s.subject_code}</span>
                        <span className="text-zinc-400 ml-1 text-xs">{s.subject_name}</span>
                        <span className="text-zinc-400 ml-1 text-xs">Y{s.year_level} S{s.semester}</span>
                      </div>
                      <select
                        value={s.status}
                        onChange={(e) => handleUpdateSubject(selectedRequest.student_id, s.id, { status: e.target.value })}
                        className="text-xs border border-zinc-200 rounded px-1 py-0.5"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                      <input
                        type="text"
                        defaultValue={s.grade || ""}
                        onBlur={(e) => {
                          if (e.target.value !== (s.grade || "")) {
                            handleUpdateSubject(selectedRequest.student_id, s.id, { grade: e.target.value || null });
                          }
                        }}
                        placeholder="Grade"
                        className="w-16 text-xs border border-zinc-200 rounded px-1 py-0.5 text-center"
                      />
                      <button
                        onClick={() => handleDeleteSubject(selectedRequest.student_id, s.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t flex gap-2">
              {selectedRequest.status === "PENDING" ? (
                <>
                  <button
                    onClick={() => setConfirmAction({ id: selectedRequest.id, action: "approve" })}
                    disabled={evaluating}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {evaluating ? "Processing..." : "Save Evaluation & Approve"}
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: selectedRequest.id, action: "reject" })}
                    disabled={evaluating}
                    className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-rose-700 disabled:opacity-50"
                  >
                    {evaluating ? "Processing..." : "Reject"}
                  </button>
                  <button onClick={closeModal} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700">
                    Close
                  </button>
                </>
              ) : (
                <button onClick={closeModal} className="w-full py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
                  Close
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* CONFIRM ACTION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Action</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to {confirmAction.action === "approve" ? "approve" : "reject"} this evaluation?
              {confirmAction.action === "approve" && (
                <span className="block mt-1 text-amber-600 font-medium">
                  The student will proceed based on the evaluation result.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmAction}
                className={`flex-1 py-2 rounded-lg text-sm font-bold text-white ${
                  confirmAction.action === "approve" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 bg-zinc-200 text-zinc-700 py-2 rounded-lg text-sm font-bold hover:bg-zinc-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
