import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 font-sans antialiased">
            
            {/* Subtle background element */}
            <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/5 clip-path-slant" />

            <div className="w-full max-w-md">
                {/* Branding / Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4">
                        <Lock className="text-blue-600" size={28} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Sign in to the Evaluation System
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                                Institutional Email
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@university.edu"
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                                    Password
                                </label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 mt-2"
                        >
                            <LogIn size={20} />
                            Sign In
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500">
                            New to the system?{" "}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* System Notice */}
                <p className="text-center mt-8 text-[11px] text-slate-400 leading-relaxed uppercase tracking-widest px-4">
                    Authorized use only. Unauthorized access is subject to university policy and local law.
                </p>
            </div>
        </div>
    );
};

export default Login;