import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { sanitizeInput } from "../../utils/sanitize";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.password)) {
      setError("Password must contain uppercase, lowercase, number, and special character.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      await register({ full_name: sanitizeInput(form.name), email: sanitizeInput(form.email), password: form.password });
      navigate("/login?registered=1");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl mb-4">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join the Academic Evaluation System</p>
        </div>

        <div className="auth-card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Full Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={15} /></div>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input-field pl-9" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Academic Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={15} /></div>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@university.edu" className="input-field pl-9" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={15} /></div>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}                   placeholder="Min. 8 characters" className="input-field pl-9 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={15} /></div>
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className="input-field pl-9" required />
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="agree" className="text-xs text-slate-500 leading-relaxed select-none">
                I agree to the{" "}
                <button type="button" onClick={() => { setModalView("terms"); setShowModal(true); }} className="text-primary-600 font-semibold hover:underline cursor-pointer">
                  Terms of Service
                </button>{" "}and{" "}
                <button type="button" onClick={() => { setModalView("privacy"); setShowModal(true); }} className="text-primary-600 font-semibold hover:underline cursor-pointer">
                  Privacy Policy
                </button>.
              </label>
            </div>

            <button type="submit" disabled={loading || !agreed} className="btn btn-primary btn-md w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={16} />
                  Complete Registration
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-[11px] text-slate-400 uppercase tracking-wider">
          Registration takes less than 60 seconds.
        </p>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-bold text-slate-900">{modalView === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setModalView(modalView === "terms" ? "privacy" : "terms")} className="text-xs font-bold text-primary-600 hover:text-primary-700 px-2.5 py-1.5 rounded-lg hover:bg-primary-50 transition">
                  View {modalView === "terms" ? "Privacy Policy" : "Terms of Service"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-4">
              {modalView === "terms" ? (
                <>
                  <h3 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h3>
                  <p>By creating an account and using the Academic Evaluation System, you agree to be bound by these Terms of Service.</p>
                  <h3 className="text-base font-bold text-slate-900">2. Account Registration</h3>
                  <p>You must provide accurate information. You are responsible for safeguarding your credentials. Notify administration immediately of any unauthorized use.</p>
                  <h3 className="text-base font-bold text-slate-900">3. Acceptable Use</h3>
                  <p>The system is intended for academic evaluation purposes only. You agree not to submit false information, access data beyond your role, share credentials, or use the system unlawfully.</p>
                  <h3 className="text-base font-bold text-slate-900">4. User Roles & Responsibilities</h3>
                  <p>Users are assigned roles with specific permissions. Role assignments are managed by administrators.</p>
                  <h3 className="text-base font-bold text-slate-900">5. Data Accuracy</h3>
                  <p>Evaluators are responsible for ensuring the accuracy of evaluation data. The institution reserves the right to audit records.</p>
                  <h3 className="text-base font-bold text-slate-900">6. Limitation of Liability</h3>
                  <p>The system is provided "as is" without warranty. The institution shall not be liable for damages arising from use.</p>
                  <h3 className="text-base font-bold text-slate-900">7. Termination</h3>
                  <p>The institution may suspend or terminate accounts that violate terms. Users may request deletion by contacting administration.</p>
                  <h3 className="text-base font-bold text-slate-900">8. Changes to Terms</h3>
                  <p>Terms may be updated. Continued use constitutes acceptance. Material changes will be notified via email.</p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-bold text-slate-900">1. Information We Collect</h3>
                  <p>We collect account data (name, email, role), evaluation data (student records, classifications), and usage data (login timestamps, actions).</p>
                  <h3 className="text-base font-bold text-slate-900">2. How We Use Your Data</h3>
                  <p>Data is used for processing evaluations, facilitating workflows, generating reports, and system security.</p>
                  <h3 className="text-base font-bold text-slate-900">3. Data Sharing</h3>
                  <p>Evaluation data is shared internally based on role-based access. We do not sell or share personal data except as required by law.</p>
                  <h3 className="text-base font-bold text-slate-900">4. Data Retention</h3>
                  <p>Account data is retained for the duration of your affiliation. Evaluation records follow institutional policies.</p>
                  <h3 className="text-base font-bold text-slate-900">5. Security</h3>
                  <p>We implement encryption in transit, password hashing, rate limiting, and audit logging.</p>
                  <h3 className="text-base font-bold text-slate-900">6. Your Rights</h3>
                  <p>You may access, correct, or request deletion of your data. Contact the system administrator.</p>
                  <h3 className="text-base font-bold text-slate-900">7. Cookies</h3>
                  <p>We use essential HTTP-only cookies for authentication. No tracking cookies.</p>
                  <h3 className="text-base font-bold text-slate-900">8. Changes</h3>
                  <p>This policy may be updated. Material changes communicated via email.</p>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost btn-md">Close</button>
              <button type="button" onClick={() => { setAgreed(true); setShowModal(false); }} className="btn btn-primary btn-md">I Agree</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
