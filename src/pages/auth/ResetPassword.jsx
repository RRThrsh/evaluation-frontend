import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!password || !confirm) {
            setError("All fields are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/api/auth/reset-password", { token, password });
            if (res.success) {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans antialiased selection:bg-blue-100 px-6">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 lg:p-10">
                {success ? (
                    <div className="text-center">
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <CheckCircle size={32} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Password Reset
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Your password has been reset successfully.
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                                Reset Password
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Enter your new password below.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Min. 6 characters"
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                                    Confirm New Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        required
                                        placeholder="Re-enter new password"
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
