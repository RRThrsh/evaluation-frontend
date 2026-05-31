import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail, CheckCircle, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { sanitizeInput } from "../../utils/sanitize";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await forgotPassword(sanitizeInput(email));
      setResetUrl(data?.data?.resetUrl || "");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="auth-card">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
              {sent ? <CheckCircle size={24} /> : <KeyRound size={24} />}
            </div>
          </div>

          {sent ? (
            <div className="text-center">
              <h1 className="text-lg font-bold text-slate-900 mb-1">Check Your Inbox</h1>
              <p className="text-sm text-slate-500 mb-6">
                If an account with that email exists, we've sent a password reset link to <strong className="text-slate-700">{email}</strong>.
              </p>
              {resetUrl && (
                <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg text-left">
                  <p className="text-xs text-primary-600 font-semibold mb-1">Quick Access (dev mode):</p>
                  <a href={resetUrl} className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-800 underline break-all">
                    <ExternalLink size={12} />
                    {resetUrl}
                  </a>
                </div>
              )}
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700">
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-lg font-bold text-slate-900">Forgot Password?</h1>
                <p className="text-sm text-slate-500 mt-1">Enter your institutional email and we'll send you a recovery link.</p>
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Academic Email</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={15} /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@university.edu" className="input-field pl-9" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-md w-full">
                  {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
