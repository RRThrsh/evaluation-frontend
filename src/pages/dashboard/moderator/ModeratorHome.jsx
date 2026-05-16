import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

function EvaluationReport({ evaluation, onBack }) {
  if (!evaluation) return null;

  const {
    student,
    summary,
    failed_subjects,
    current_subjects,
    passed_subjects,
    next_semester_subjects,
    prerequisite_checks,
    recommendations,
    overall,
    decision,
    graded_subjects,
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
          <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${decisionColor}`}>
            {decision}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Subjects", value: summary.total_subjects, color: "bg-zinc-100" },
          { label: "Currently Enrolled", value: summary.current_enrolled, color: "bg-blue-50 text-blue-700" },
          { label: "Passed", value: summary.passed, color: "bg-emerald-50 text-emerald-700" },
          { label: "Failed", value: summary.failed, color: "bg-red-50 text-red-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-lg p-3 text-center`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Currently Enrolled (no grade yet) */}
      {current_subjects && current_subjects.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-blue-600 mb-2 uppercase tracking-wide">Currently Enrolled</h3>
          <div className="divide-y border border-blue-200 rounded-lg text-sm">
            {current_subjects.map((cs, i) => (
              <div key={i} className="p-3 flex justify-between bg-blue-50">
                <span className="font-medium">{cs.subject_code} — {cs.subject_name}</span>
                <span className="text-blue-600">{cs.subject_type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graded / Completed Subjects */}
      <div>
        <h3 className="font-bold text-sm text-zinc-600 mb-2 uppercase tracking-wide">
          Completed Subjects (with grades)
        </h3>
        <div className="divide-y border rounded-lg text-sm max-h-48 overflow-y-auto">
          {graded_subjects && graded_subjects.length > 0 ? graded_subjects.map((gs, i) => (
            <div key={i} className={`p-3 flex justify-between ${gs.result === "pass" ? "bg-emerald-50" : gs.result === "fail" ? "bg-red-50" : ""}`}>
              <div>
                <span className="font-medium">{gs.subject_code}</span>
                <span className="text-zinc-400 ml-1">{gs.subject_name}</span>
              </div>
              <span className={`font-bold ${gs.result === "pass" ? "text-emerald-600" : gs.result === "fail" ? "text-red-600" : "text-zinc-500"}`}>
                {gs.grade || "—"}
              </span>
            </div>
          )) : (
            <div className="p-3 text-zinc-400 text-sm">No completed subjects</div>
          )}
        </div>
      </div>

      {/* Prerequisite Checks */}
      {prerequisite_checks.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-zinc-600 mb-2 uppercase tracking-wide">
            Prerequisite Checks
          </h3>
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

      {/* Next Semester Subjects */}
      {next_semester_subjects.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-zinc-600 mb-2 uppercase tracking-wide">
            Next Semester Subjects
          </h3>
          <div className="divide-y border rounded-lg text-sm">
            {next_semester_subjects.map((ns, i) => (
              <div key={i} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{ns.subject_code}</span>
                  <span className="text-zinc-400 text-xs ml-2">({ns.subject_type})</span>
                  {ns.prerequisite && (
                    <span className="text-zinc-400 text-xs ml-2">prereq: {ns.prerequisite}</span>
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
        </div>
      )}

      {/* Failed Subjects */}
      {failed_subjects.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-red-600 mb-2 uppercase tracking-wide">
            Failed Subjects
          </h3>
          <div className="divide-y border border-red-200 rounded-lg text-sm">
            {failed_subjects.map((fs, i) => (
              <div key={i} className="p-3 flex justify-between bg-red-50">
                <span className="font-medium">{fs.subject_code} — {fs.subject_name}</span>
                <span className="text-red-600 font-bold">{fs.grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Subjects */}
      {current_subjects.length > 0 && (
        <div>
          <h3 className="font-bold text-sm text-blue-600 mb-2 uppercase tracking-wide">
            Currently Enrolled (Awaiting Grade)
          </h3>
          <div className="divide-y border border-blue-200 rounded-lg text-sm">
            {current_subjects.map((cs, i) => (
              <div key={i} className="p-3 bg-blue-50">
                <span className="font-medium">{cs.subject_code} — {cs.subject_name}</span>
                <span className="text-blue-600 text-xs ml-2">({cs.subject_type})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-zinc-50 border rounded-lg p-4">
        <h3 className="font-bold text-sm text-zinc-600 mb-2 uppercase tracking-wide">
          Recommendations
        </h3>
        <ul className="space-y-1 text-sm">
          {recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-zinc-400 mt-0.5">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
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
  const [tab, setTab] = useState("pending");
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const endpoint = tab === "all"
      ? "/api/moderator/evaluations/all"
      : "/api/moderator/evaluations";
    api.get(endpoint)
      .then((data) => setRequests(data.data ?? data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tab]);

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
      const refresh = await api.get("/api/moderator/evaluations");
      setRequests(refresh.data ?? refresh);
    } catch (err) {
      alert(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const openRequest = async (req) => {
    setSelectedRequest(req);
    if (req.evaluation_result) {
      const parsed = typeof req.evaluation_result === "string"
        ? JSON.parse(req.evaluation_result)
        : req.evaluation_result;
      setEvaluation(parsed);
    } else {
      setEvaluation(null);
      // Auto-fetch student grades preview
      try {
        const data = await api.get(`/api/moderator/students/${req.student_id}/evaluate`);
        setEvaluation(data.data);
      } catch (err) {
        // silently fail
      }
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setEvaluation(null);
    // Refresh the list
    const endpoint = tab === "all"
      ? "/api/moderator/evaluations/all"
      : "/api/moderator/evaluations";
    api.get(endpoint)
      .then((data) => setRequests(data.data ?? data))
      .catch(() => {});
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
              {tab === "all" ? "All Requests" : "Incoming Requests"}
            </h1>
            <p className="text-sm text-zinc-500">
              {tab === "all" ? "View all evaluation history" : "Click a request to evaluate"}
            </p>
          </div>
          <div className="flex gap-1 bg-zinc-100 rounded-lg p-1">
            <button
              onClick={() => setTab("pending")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                tab === "pending" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setTab("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                tab === "all" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              All
            </button>
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
