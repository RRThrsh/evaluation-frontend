import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

export default function UsersHome() {
    const { user } = useAuth();
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/api/staff/evaluations")
            .then((data) => setEvaluations(data.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-4xl mx-auto px-4 py-10">

                {/* PROFILE CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                            {user?.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {user?.full_name || "User"}
                            </h1>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                {user?.role || "user"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* EVALUATIONS */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                        Evaluation Requests
                    </h2>

                    {loading ? (
                        <div className="text-slate-400 text-sm py-8 text-center">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500 text-sm py-8 text-center">{error}</div>
                    ) : evaluations.length === 0 ? (
                        <div className="text-slate-400 text-sm py-8 text-center">
                            No evaluation requests found.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {evaluations.map((ev, i) => (
                                <div
                                    key={ev.id ?? i}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            Student: {ev.student_number || "N/A"}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(ev.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                                        ev.status === "Approved"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : ev.status === "Rejected"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {ev.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
