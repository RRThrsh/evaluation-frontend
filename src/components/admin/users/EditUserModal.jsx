import { X } from "lucide-react";

export default function EditUserModal({
    open,
    formData,
    errors,
    onClose,
    onChange,
    onSave,
}) {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6"
            >
                {/* HEADER */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        Edit User
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-5">

                    {/* FULL NAME */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        {errors.full_name && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.full_name}
                            </p>
                        )}
                    </div>

                    {/* EMAIL (read-only safer for most systems) */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-4 py-3 opacity-60"
                        />
                    </div>

                    {/* ROLE */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">
                            Role
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                        >
                            <option value="USER">User</option>
                            <option value="STAFF">Staff</option>
                            <option value="MODERATOR">Moderator</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-white/10 px-5 py-3 hover:bg-white/10"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="rounded-xl bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}