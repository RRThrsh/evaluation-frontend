import React, { useEffect, useState } from "react";
import api from "../../../services/api";

export default function StaffHome() {
    const [studentNumber, setStudentNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loadingEvals, setLoadingEvals] = useState(true);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        api.get("/api/staff/evaluations")
            .then((data) => setEvaluations(data.data ?? []))
            .catch(() => {})
            .finally(() => setLoadingEvals(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentNumber.trim()) return;

        setSubmitting(true);
        setError("");
        setResult(null);

        try {
            const data = await api.post("/api/staff/evaluate", {
                student_number: studentNumber,
            });
            setResult(data.data);
            // Refresh list
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

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Evaluation Request
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Submit a student evaluation for moderator review
                    </p>
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

                        {result && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                                result.status === "Pending"
                                    ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                                    : result.status === "Approved"
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                    : "bg-red-50 border border-red-200 text-red-600"
                            }`}>
                                Evaluation submitted! Status: <strong>{result.status}</strong>
                                {result.student && (
                                    <span> — Student: {result.student.student_number}</span>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        className="border border-slate-100 rounded-lg p-3"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500">
                                                {ev.student_number || "N/A"}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                                ev.status === "Approved"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : ev.status === "Rejected"
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
        </div>
    );
}
