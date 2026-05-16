import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

function EvaluationReport({ evalData }) {
  if (!evalData) return null;

  const { student, summary, failed_subjects, passed_subjects, current_subjects, next_semester_subjects, prerequisite_checks, recommendations, overall, graded_subjects } = evalData;

  const badgeColor = overall === "qualified"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : overall === "conditional"
    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
    : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-lg border ${badgeColor}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold uppercase text-sm">{overall}</span>
        </div>
      </div>

      {student && (
        <div className="bg-zinc-50 border rounded-lg p-3 text-xs grid grid-cols-2 gap-1">
          <div><span className="font-medium">Student:</span> {student.full_name}</div>
          <div><span className="font-medium">Number:</span> {student.student_number}</div>
          <div><span className="font-medium">Course:</span> {student.course}</div>
          <div><span className="font-medium">Year:</span> {student.year_level} — Sem {student.current_semester}</div>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Total", value: summary.total_subjects, color: "bg-zinc-100" },
            { label: "Enrolled", value: summary.current_enrolled, color: "bg-blue-50 text-blue-700" },
            { label: "Passed", value: summary.passed, color: "bg-emerald-50 text-emerald-700" },
            { label: "Failed", value: summary.failed, color: "bg-red-50 text-red-700" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} border rounded-lg p-2 text-center`}>
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Currently Enrolled (no grade yet) */}
      {current_subjects && current_subjects.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-blue-600 mb-1 uppercase">Currently Enrolled</h4>
          <div className="divide-y border border-blue-200 rounded-lg text-xs">
            {current_subjects.map((cs, i) => (
              <div key={i} className="p-2 flex justify-between bg-blue-50">
                <span className="font-medium">{cs.subject_code} — {cs.subject_name}</span>
                <span className="text-blue-600">{cs.subject_type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graded / Completed Subjects */}
      {graded_subjects && graded_subjects.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Completed Subjects (with grades)</h4>
          <div className="divide-y border rounded-lg text-xs max-h-40 overflow-y-auto">
            {graded_subjects.map((gs, i) => (
              <div key={i} className={`p-2 flex justify-between ${gs.result === "pass" ? "bg-emerald-50" : gs.result === "fail" ? "bg-red-50" : ""}`}>
                <div>
                  <span className="font-medium">{gs.subject_code}</span>
                  <span className="text-zinc-400 ml-1">{gs.subject_name}</span>
                </div>
                <span className={`font-bold ${gs.result === "pass" ? "text-emerald-600" : gs.result === "fail" ? "text-red-600" : "text-zinc-500"}`}>
                  {gs.grade || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Semester Subjects */}
      {next_semester_subjects && next_semester_subjects.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Next Semester Subjects</h4>
          <div className="divide-y border rounded-lg text-xs">
            {next_semester_subjects.map((ns, i) => (
              <div key={i} className="p-2 flex justify-between items-center">
                <div>
                  <span className="font-medium">{ns.subject_code}</span>
                  <span className="text-zinc-400 ml-1">({ns.subject_type})</span>
                  {ns.prerequisite && (
                    <span className="text-zinc-400 ml-1">prereq: {ns.prerequisite}</span>
                  )}
                </div>
                {ns.prerequisite && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
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

      {failed_subjects && failed_subjects.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-red-600 mb-1 uppercase">Failed Subjects</h4>
          <div className="divide-y border border-red-200 rounded-lg text-xs">
            {failed_subjects.map((fs, i) => (
              <div key={i} className="p-2 flex justify-between bg-red-50">
                <span className="font-medium">{fs.subject_code}</span>
                <span className="text-red-600 font-bold">{fs.grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {prerequisite_checks && prerequisite_checks.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Prerequisite Checks</h4>
          <div className="divide-y border rounded-lg text-xs">
            {prerequisite_checks.map((pc, i) => (
              <div key={i} className="p-2 flex justify-between">
                <span>{pc.subject_code} → {pc.prereq_code}</span>
                <span className={`font-bold ${pc.prereq_failed ? "text-red-600" : pc.prereq_met ? "text-emerald-600" : "text-yellow-600"}`}>
                  {pc.prereq_failed ? "FAILED" : pc.prereq_met ? "MET" : "PENDING"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="bg-zinc-50 border rounded-lg p-3">
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Recommendations</h4>
          <ul className="space-y-0.5 text-xs">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-zinc-400">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function StaffHome() {
  const { user, logout } = useAuth();
  const [studentNumber, setStudentNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvals, setLoadingEvals] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEval, setSelectedEval] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [sendingPdf, setSendingPdf] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");

  const fetchEvaluations = () => {
    api.get("/api/staff/evaluations")
      .then((data) => setEvaluations(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingEvals(false));
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!studentNumber.trim()) return;
    setConfirmSubmit(true);
  };

  const handleSendPdf = async (studentNumberToSend, closeAfter) => {
    setSendingPdf(true);
    setSendSuccess("");
    setError("");
    try {
      await api.post("/api/staff/evaluate/send-pdf", { student_number: studentNumberToSend });
      setSendSuccess("PDF sent to student email");
      if (closeAfter) closeAfter();
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingPdf(false);
    }
  };

  const handleConfirmSubmit = async () => {
    setConfirmSubmit(false);
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const data = await api.post("/api/staff/evaluate", {
        student_number: studentNumber,
      });
      setResult(data.data);
      const evals = await api.get("/api/staff/evaluations");
      setEvaluations(evals.data ?? []);
      setStudentNumber("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Evaluation Request
            </h1>
            <p className="text-slate-500 text-sm">
              Submit a student evaluation for moderator review
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="text-sm text-slate-400 hover:text-blue-600 transition flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-blue-50 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-sm text-slate-400 hover:text-red-500 transition flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SUBMIT FORM */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              Submit Evaluation
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
                {error}
              </div>
            )}
            {sendSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 font-medium">
                {sendSuccess}
              </div>
            )}

            {result && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  result.status === "PENDING"
                    ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                    : result.status === "APPROVED"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-red-50 border border-red-200 text-red-600"
              }`}>
                Evaluation submitted! Status: <strong>{result.status}</strong>
                {result.student && (
                  <span> — Student: {result.student.student_number}</span>
                )}
                <div className="mt-2">
                  <button
                    onClick={() => handleSendPdf(result.student.student_number)}
                    disabled={sendingPdf}
                    className="text-xs bg-white border border-current rounded px-2 py-1 hover:bg-black/5 disabled:opacity-50"
                  >
                    {sendingPdf ? "Sending..." : "Send PDF to Student Email"}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitClick} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Student Number
                </label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="e.g. 2020-0001"
                  className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 rounded-lg text-white font-medium transition ${
                  submitting
                    ? "bg-slate-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {submitting ? "Submitting..." : "Submit for Evaluation"}
              </button>
            </form>
          </div>

          {/* RECENT EVALUATIONS */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              My Submissions
            </h2>

            {loadingEvals ? (
              <div className="text-slate-400 text-sm italic">Loading...</div>
            ) : evaluations.length === 0 ? (
              <div className="text-slate-400 text-sm italic">
                No submissions yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {evaluations.map((ev, i) => (
                  <div
                    key={ev.id ?? i}
                    onClick={() => setSelectedEval(ev)}
                    className="border border-slate-100 rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-500">
                        {ev.student_number || "N/A"}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          ev.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : ev.status === "REJECTED"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(ev.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* STAFF EVALUATION DETAIL MODAL */}
      {selectedEval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Evaluation Details
              </h2>
              <button
                onClick={() => setSelectedEval(null)}
                className="text-slate-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-700 mb-4">
              <p><strong>Student:</strong> {selectedEval.student_number || "N/A"}</p>
              <p><strong>Year Level:</strong> {selectedEval.year_level ?? "—"}</p>
              <p><strong>Reason:</strong> {selectedEval.reason}</p>
              <p><strong>Submitted:</strong> {new Date(selectedEval.created_at).toLocaleString()}</p>
              <p>
                <strong>Status: </strong>
                <span className={`font-bold uppercase ${
                  selectedEval.status === "APPROVED" ? "text-emerald-600" : selectedEval.status === "REJECTED" ? "text-red-600" : "text-yellow-600"
                }`}>
                  {selectedEval.status}
                </span>
              </p>
              {selectedEval.reviewed_by_name && (
                <p><strong>Reviewed By:</strong> {selectedEval.reviewed_by_name}</p>
              )}
            </div>

            {selectedEval.evaluation_result && (
              <>
                <hr className="my-4" />
                <h3 className="font-bold text-sm text-slate-700 mb-3 uppercase">
                  Evaluation Report
                </h3>
                <EvaluationReport evalData={
                  typeof selectedEval.evaluation_result === "string"
                    ? JSON.parse(selectedEval.evaluation_result)
                    : selectedEval.evaluation_result
                } />
              </>
            )}

            <div className="mt-6 space-y-2">
              <button
                onClick={() => handleSendPdf(selectedEval.student_number, () => setSelectedEval(null))}
                disabled={sendingPdf}
                className="w-full py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400"
              >
                {sendingPdf ? "Sending..." : "Send PDF to Student Email"}
              </button>
              <button
                onClick={() => setSelectedEval(null)}
                className="w-full py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM SUBMIT MODAL */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Submission</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to submit an evaluation request for <strong>{studentNumber}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmSubmit(false)}
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
