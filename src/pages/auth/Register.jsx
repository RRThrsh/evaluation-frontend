import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { sanitizeInput } from "../../utils/sanitize";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalView, setModalView] = useState("terms");
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") setShowModal(false); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!agreed) {
            setError("You must agree to the Terms of Service and Privacy Policy.");
            return;
        }

        setLoading(true);
        try {
            await register({
                full_name: sanitizeInput(form.name),
                email: sanitizeInput(form.email),
                password: form.password,
            });
            navigate("/login?registered=1");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12 font-sans antialiased">

            {/* Background Decorative Gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/50 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4">
                        <UserPlus className="text-blue-600" size={24} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Join the Student Evaluation System
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 lg:p-10">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. John Doe"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                                Academic Email
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="name@university.edu"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Section - Grid on larger screens if you want, but vertical is better for focus */}
                        <div className="space-y-5 pt-2">
                            {/* Password */}
                            <div className="space-y-2 relative">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
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

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Policy Agreement */}
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="agree" className="text-xs text-slate-500 leading-relaxed select-none">
                                I agree to the{" "}
                                <button
                                    type="button"
                                    onClick={() => { setModalView("terms"); setShowModal(true); }}
                                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                                >
                                    Terms of Service
                                </button>{" "}
                                and{" "}
                                <button
                                    type="button"
                                    onClick={() => { setModalView("privacy"); setShowModal(true); }}
                                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                                >
                                    Privacy Policy
                                </button>
                                .
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !agreed}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <UserPlus size={20} />
                                    Complete Registration
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Terms & Privacy Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                        <div className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {modalView === "terms" ? "Terms of Service" : "Privacy Policy"}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setModalView(modalView === "terms" ? "privacy" : "terms")}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                                    >
                                        View {modalView === "terms" ? "Privacy Policy" : "Terms of Service"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-4">
                                {modalView === "terms" ? (
                                    <>
                                        <h3 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h3>
                                        <p>By creating an account and using the Student Evaluation Workflow System, you agree to be bound by these Terms of Service. If you do not agree, do not use the system.</p>

                                        <h3 className="text-base font-bold text-slate-900">2. Account Registration</h3>
                                        <p>You must provide accurate and complete information during registration. You are responsible for safeguarding your credentials and for all activity under your account. Notify administration immediately of any unauthorized use.</p>

                                        <h3 className="text-base font-bold text-slate-900">3. Acceptable Use</h3>
                                        <p>The system is intended for academic evaluation purposes only. You agree not to:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Submit false or misleading evaluation requests</li>
                                            <li>Attempt to access data beyond your authorized role</li>
                                            <li>Share your account credentials with others</li>
                                            <li>Use the system for any unlawful purpose</li>
                                        </ul>

                                        <h3 className="text-base font-bold text-slate-900">4. User Roles & Responsibilities</h3>
                                        <p>Users are assigned one of three roles: Evaluator, Admin, or Pending. Each role has specific permissions and responsibilities as defined by the institution. Role assignments are managed by administrators.</p>

                                        <h3 className="text-base font-bold text-slate-900">5. Data Accuracy</h3>
                                        <p>Evaluators are responsible for ensuring the accuracy of evaluation data they submit or review. The institution reserves the right to audit and correct records as necessary.</p>

                                        <h3 className="text-base font-bold text-slate-900">6. Limitation of Liability</h3>
                                        <p>The system is provided "as is" without warranty of any kind. The institution shall not be liable for any damages arising from the use or inability to use the system, including but not limited to data loss, downtime, or evaluation errors.</p>

                                        <h3 className="text-base font-bold text-slate-900">7. Termination</h3>
                                        <p>The institution reserves the right to suspend or terminate accounts that violate these terms or for extended inactivity. Users may request account deletion by contacting administration.</p>

                                        <h3 className="text-base font-bold text-slate-900">8. Changes to Terms</h3>
                                        <p>These terms may be updated at any time. Continued use of the system after changes constitutes acceptance of the revised terms. Users will be notified of material changes via email.</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-base font-bold text-slate-900">1. Information We Collect</h3>
                                        <p>We collect the following information when you register and use the system:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><strong>Account Data:</strong> Full name, institutional email address, and role assignment</li>
                                            <li><strong>Evaluation Data:</strong> Student numbers, academic records, classification results, and enrollment decisions submitted through the system</li>
                                            <li><strong>Usage Data:</strong> Login timestamps, actions performed, and system interactions for audit and security purposes</li>
                                        </ul>

                                        <h3 className="text-base font-bold text-slate-900">2. How We Use Your Data</h3>
                                        <p>Your data is used exclusively for:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Processing and tracking student evaluation requests</li>
                                            <li>Facilitating moderator review and administrator confirmation workflows</li>
                                            <li>Generating reports for academic planning and compliance</li>
                                            <li>System security, audit logging, and troubleshooting</li>
                                        </ul>

                                        <h3 className="text-base font-bold text-slate-900">3. Data Sharing</h3>
                                        <p>Evaluation data is shared internally among authorized Evaluators and Administrators based on role-based access control. We do not sell or share personal data with third parties except as required by law.</p>

                                        <h3 className="text-base font-bold text-slate-900">4. Data Retention</h3>
                                        <p>Account data is retained for the duration of your affiliation with the institution. Evaluation records are retained in accordance with institutional academic record-keeping policies. You may request data deletion by contacting administration.</p>

                                        <h3 className="text-base font-bold text-slate-900">5. Security</h3>
                                        <p>We implement industry-standard security measures including encryption in transit (TLS), password hashing, rate limiting, and audit logging. However, no system is completely secure. Report any security concerns to administration immediately.</p>

                                        <h3 className="text-base font-bold text-slate-900">6. Your Rights</h3>
                                        <p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact the system administrator. You may also request a copy of the data associated with your account.</p>

                                        <h3 className="text-base font-bold text-slate-900">7. Cookies</h3>
                                        <p>We use essential HTTP-only cookies for authentication sessions. No tracking cookies or third-party analytics are used.</p>

                                        <h3 className="text-base font-bold text-slate-900">8. Changes to This Policy</h3>
                                        <p>This privacy policy may be updated periodically. Material changes will be communicated via email. Continued use of the system constitutes acceptance of the updated policy.</p>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setAgreed(true); setShowModal(false); }}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-lg shadow-blue-200"
                                >
                                    I Agree
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Helpful Hint */}
                <p className="text-center mt-6 text-[11px] text-slate-400 uppercase tracking-widest">
                    Registration takes less than 60 seconds.
                </p>
            </div>
        </div> 
    );
};

export default Register;
