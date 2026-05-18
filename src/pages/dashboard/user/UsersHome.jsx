import React, { useState } from "react";
import api from "../../../services/api";

export default function UsersHome() {
    const [studentNumber, setStudentNumber] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentNumber) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await api.get(`/api/students/lookup/${studentNumber}`);
            if (data?.success && data?.data) {
                setResult(data.data);
            } else {
                setError("Student not found");
            }
        } catch (err) {
            setError(err.status === 404 ? "No student found with that number" : err.message || "Search failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-20">
            <div className="w-full max-w-md mx-auto px-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="number"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        placeholder="Student number"
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={loading || !studentNumber}
                        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "..." : "Search"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-red-500 text-sm text-center bg-red-50 rounded-lg py-3">{error}</div>
                )}

                {result && (
                    <div className="mt-4 bg-white rounded-lg border border-slate-200 p-4 text-sm">
                        <p><span className="text-slate-400">Name:</span> <span className="font-medium">{result.first_name} {result.last_name}</span></p>
                        <p className="mt-1"><span className="text-slate-400">Number:</span> <span className="font-medium">{result.student_number}</span></p>
                        <p className="mt-1"><span className="text-slate-400">Year:</span> <span className="font-medium">{result.year_level || "N/A"}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
}
