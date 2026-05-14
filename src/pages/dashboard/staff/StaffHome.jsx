import React, { useState } from "react";

export default function StaffHome() {
    const [form, setForm] = useState({
        idNo: "",
        name: "",
        requestType: "",
        details: "",
    });

    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSendRequest = async (e) => {
        e.preventDefault();

        if (!form.idNo || !form.name || !form.requestType) {
            alert("Please fill in required fields.");
            return;
        }

        setLoading(true);
        setResponse("");

        try {
            // 🔌 Replace with real API
            /*
            const res = await fetch("/api/staff/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            setResponse(data.response);
            */

            // 🧪 Mock response
            setTimeout(() => {
                setResponse(
                    `✔ Request Received\n\nID No: ${form.idNo}\nName: ${form.name}\nType: ${form.requestType}\nDetails: ${form.details}\n\nStatus: Processed Successfully`
                );
                setLoading(false);
            }, 1000);

        } catch (err) {
            setResponse("Error: Failed to process request.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Staff Request System
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Submit structured requests and receive system responses
                    </p>
                </div>

                {/* 2 Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 📩 REQUEST FORM */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-700 mb-4">
                            Request Form
                        </h2>

                        <form onSubmit={handleSendRequest} className="space-y-4">

                            {/* ID NO */}
                            <input
                                type="text"
                                name="idNo"
                                placeholder="ID No."
                                value={form.idNo}
                                onChange={handleChange}
                                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            {/* NAME */}
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            {/* REQUEST TYPE */}
                            <select
                                name="requestType"
                                value={form.requestType}
                                onChange={handleChange}
                                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Request Type</option>
                                <option value="Leave">Leave Request</option>
                                <option value="Correction">Data Correction</option>
                                <option value="Access">System Access</option>
                                <option value="Other">Other</option>
                            </select>

                            {/* DETAILS */}
                            <textarea
                                name="details"
                                placeholder="Additional Details (optional)"
                                value={form.details}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 rounded-lg text-white font-medium transition ${
                                    loading
                                        ? "bg-slate-400"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            >
                                {loading ? "Sending..." : "Submit Request"}
                            </button>

                        </form>
                    </div>

                    {/* 📥 RESPONSE SECTION */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-700 mb-4">
                            Response
                        </h2>

                        {response ? (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                                    {response}
                                </pre>
                            </div>
                        ) : (
                            <div className="text-slate-400 text-sm italic">
                                No response yet. Submit a request to see output here.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}