import { X } from "lucide-react";

export default function EditUserModal({
    open,
    user,
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
                    <h2 className="text-xl font-bold">Edit User</h2>

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

                    {/* NAME */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        {errors.name && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        {errors.email && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.email}
                            </p>
                        )}
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
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={onChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
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