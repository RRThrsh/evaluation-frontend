import { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!currentPassword || !newPassword || !confirm) { setError("All fields are required"); return; }
    if (newPassword.length < 6) { setError("New password must be at least 6 characters"); return; }
    if (newPassword !== confirm) { setError("New passwords do not match"); return; }
    setSaving(true);
    try {
      const res = await api.post("/api/auth/change-password", { currentPassword, newPassword });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Confirm New Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" />
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary btn-md w-full">
            {saving ? "Saving..." : "Change Password"}
          </button>
          <p className="text-[11px] text-slate-400 text-center">You will be logged out after changing your password.</p>
        </form>
      </div>
    </div>
  );
}
