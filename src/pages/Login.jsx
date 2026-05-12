import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await loginUser(form);

            localStorage.setItem(
                "accessToken",
                res.data.accessToken
            );

            setMessage("Login successful!");

            // Optional redirect
            // navigate("/dashboard");

        } catch (err) {
            console.error(err);

            setMessage(
                err.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6">
            
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">
                        <span className="text-3xl">🔐</span>
                    </div>

                    <h2 className="text-4xl font-extrabold tracking-tight text-white">
                        Welcome Back
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Login to continue managing evaluations
                    </p>
                </div>

                {/* Alert Message */}
                {message && (
                    <div
                        className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                            message.toLowerCase().includes("successful")
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
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
                            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-300">
                                Password
                            </label>

                            <button
                                type="button"
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center rounded-xl bg-blue-500 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                Login
                                <span className="ml-2 transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-sm text-slate-500">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Signup */}
                <p className="text-center text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-medium text-blue-400 transition hover:text-blue-300"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}