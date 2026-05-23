import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { sanitizeInput } from "../../utils/sanitize";

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
    if (!password || !confirm) { setError("All fields are required"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) { setError("Password must contain uppercase, lowercase, number, and special character"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/reset-password", { token: sanitizeInput(token), password });
      if (res.success) setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="auth-card">
          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
              </div>
              <h1 className="text-lg font-bold text-slate-900 mb-1">Password Reset</h1>
              <p className="text-sm text-slate-500 mb-6">Your password has been reset successfully.</p>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700">
                <ArrowLeft size={14} />
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-slate-900">Reset Password</h1>
                <p className="text-sm text-slate-500 mt-1">Enter your new password below.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={15} /></div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" className="input-field pl-9" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={15} /></div>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Re-enter new password" className="input-field pl-9" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-md w-full">
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
