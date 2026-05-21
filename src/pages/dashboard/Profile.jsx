import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { sanitizeObject } from "../../utils/sanitize";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileHero from "../../components/profile/ProfileHero";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileFAQ from "../../components/profile/ProfileFAQ";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import ProfileActivity from "../../components/profile/ProfileActivity";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editError, setEditError] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "" });

  const startEditing = () => {
    setForm({ full_name: user?.full_name || "", email: user?.email || "" });
    setEditing(true);
    setEditError("");
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      setEditError("All fields are required");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      await updateProfile(sanitizeObject({ full_name: form.full_name.trim(), email: form.email.trim() }));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ProfileHeader />

      {saved && (
        <div className="fixed top-5 right-5 z-50">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Success</p>
              <p className="text-xs text-slate-500">Profile updated successfully</p>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <ProfileHero user={user} editing={editing} onEdit={startEditing} />

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <ProfileInfo
              user={user}
              editing={editing}
              saving={saving}
              editError={editError}
              form={form}
              setForm={setForm}
              onSave={handleSave}
              onCancel={cancelEditing}
            />
            <ProfileActivity user={user} />
            <ProfileFAQ />
          </div>
          <ProfileSidebar user={user} />
        </div>
      </main>
    </div>
  );
}
