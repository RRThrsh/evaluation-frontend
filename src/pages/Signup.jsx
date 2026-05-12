import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Signup() {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "USER",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedTerms) {
            setMessage("Please accept the Terms & Privacy Policy.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await registerUser(form);

            setMessage(res.data.message);

            setForm({
                full_name: "",
                email: "",
                password: "",
                role: "USER",
            });

            setAcceptedTerms(false);

        } catch (err) {
            console.error(err);

            setMessage(
                err.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6">

            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
            </div>

            {/* Signup Card */}
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20">
                        <span className="text-3xl">🚀</span>
                    </div>

                    <h2 className="text-4xl font-extrabold tracking-tight text-white">
                        Create Account
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Start managing evaluations with your team
                    </p>
                </div>

                {/* Alert */}
                {message && (
                    <div
                        className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                            message.toLowerCase().includes("success")
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Enter your full name"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a secure password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Use at least 8 characters for better security
                        </p>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) =>
                                setAcceptedTerms(e.target.checked)
                            }
                            className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                        />

                        <p className="text-sm text-slate-400">
                            I agree to the{" "}
                            <button
                                type="button"
                                onClick={() => setShowModal(true)}
                                className="font-medium text-cyan-400 hover:text-cyan-300 underline"
                            >
                                Terms & Privacy Policy
                            </button>
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center rounded-xl bg-cyan-500 py-3 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                Create Account
                                <span className="ml-2 transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-cyan-400 hover:text-cyan-300"
                    >
                        Login
                    </Link>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">

                        {/* Modal Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white">
                                Terms & Privacy Policy
                            </h3>

                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="max-h-[400px] overflow-y-auto pr-2 text-sm leading-relaxed text-slate-300 space-y-4">

                            <div>
                                <h4 className="mb-2 font-semibold text-white">
                                    1. User Responsibilities
                                </h4>

                                <p>
                                    Users are responsible for maintaining
                                    the confidentiality of their accounts
                                    and ensuring all submitted information
                                    is accurate and appropriate.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-2 font-semibold text-white">
                                    2. Data Privacy
                                </h4>

                                <p>
                                    Your information is securely stored and
                                    used only for evaluation system
                                    functionality, monitoring, and account
                                    management.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-2 font-semibold text-white">
                                    3. Acceptable Use
                                </h4>

                                <p>
                                    Misuse of the platform, unauthorized
                                    access attempts, or harmful activities
                                    may result in account suspension or
                                    termination.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-2 font-semibold text-white">
                                    4. Monitoring
                                </h4>

                                <p>
                                    Administrators may review system
                                    activity logs to ensure security,
                                    compliance, and operational integrity.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}