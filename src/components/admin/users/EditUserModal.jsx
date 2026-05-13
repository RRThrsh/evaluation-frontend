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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl bg-slate-900 p-6 border border-white/10"
            >
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-bold">Edit User</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="space-y-4">

                    <input
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        className="w-full p-3 rounded-xl bg-white/5"
                        placeholder="Name"
                    />
                    {errors.name && <p className="text-red-400">{errors.name}</p>}

                    <input
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        className="w-full p-3 rounded-xl bg-white/5"
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-red-400">{errors.email}</p>}

                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onSave} className="bg-blue-500 px-4 py-2 rounded-xl">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}