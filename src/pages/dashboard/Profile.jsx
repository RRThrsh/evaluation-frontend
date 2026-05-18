import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileHero from "../../components/profile/ProfileHero";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileFAQ from "../../components/profile/ProfileFAQ";
import ProfileSidebar from "../../components/profile/ProfileSidebar";

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
            await updateProfile({ full_name: form.full_name.trim(), email: form.email.trim() });
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
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <ProfileHeader />

            {saved && (
                <div className="fixed top-20 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-2xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Success</p>
                            <p className="text-xs text-slate-500">Profile updated successfully</p>
                        </div>
                    </div>
                </div>
            )}

            <main className="relative mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
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
                        <ProfileFAQ />
                    </div>
                    <ProfileSidebar user={user} />
                </div>
            </main>
        </div>
    );
}
