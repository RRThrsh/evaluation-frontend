import React, { useEffect, useState } from "react";
import api from "../../../services/api";

export default function ModeratorHome() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/api/moderator/evaluations")
            .then((data) => setRequests(data.data ?? data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleAction = async (id, action) => {
        try {
            await api.post(`/api/moderator/evaluations/${id}/action`, { action });
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === id ? { ...req, status: action } : req
                )
            );
            setSelectedRequest(null);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">

            {/* NAVBAR */}
            <nav className="bg-white border-b border-zinc-200 px-6 py-3 flex justify-between items-center">
                <span className="font-bold text-zinc-700">
                    MODERATOR CONTROL CENTER
                </span>

                <span className="text-sm text-zinc-500">
                    Pending: {requests.filter(r => r.status === "Pending").length}
                </span>
            </nav>

            <main className="max-w-6xl mx-auto p-6">

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-800">
                        Incoming Requests
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Click a request to review
                    </p>
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
                                    onClick={() => setSelectedRequest(req)}
                                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-50 transition"
                                >

                                    {/* LEFT */}
                                    <div>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded">
                                                {req.id}
                                            </span>

                                            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                                                req.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : req.status === "Approved"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-rose-100 text-rose-600"
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-zinc-700 mt-1">
                                            {req.reason ?? req.type} — {req.student_number ?? req.name}
                                        </p>
                                    </div>

                                    <span className="text-xs text-zinc-400">
                                        Click to review →
                                    </span>
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

            {/* MODAL */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-zinc-800">
                                Request Details
                            </h2>

                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="text-zinc-500 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>

                        {/* CONTENT */}
                        <div className="space-y-2 text-sm text-zinc-700">
                            <p><strong>ID:</strong> {selectedRequest.id}</p>
                            <p><strong>Student:</strong> {selectedRequest.student_number}</p>
                            <p><strong>Year Level:</strong> {selectedRequest.year_level ?? "—"}</p>
                            <p><strong>Requested By:</strong> {selectedRequest.requested_by_name ?? selectedRequest.requested_by}</p>
                            <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-6 flex gap-2">

                            <button
                                onClick={() =>
                                    handleAction(selectedRequest.id, "Approved")
                                }
                                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-700"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() =>
                                    handleAction(selectedRequest.id, "Rejected")
                                }
                                className="flex-1 bg-zinc-200 text-zinc-800 py-2 rounded-lg text-sm font-bold hover:bg-zinc-300"
                            >
                                Remove
                            </button>

                            <button
                                onClick={() =>
                                    handleAction(selectedRequest.id, "Rejected")
                                }
                                className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-rose-700"
                            >
                                Reject
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
