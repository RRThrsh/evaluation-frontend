import { X } from "lucide-react";

export default function DeleteUserModal({ open, user, onClose, onConfirm }) {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl bg-slate-900 p-6 border border-white/10"
            >
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Delete User</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <p>
                    Delete <b>{user?.name}</b>?
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onConfirm} className="text-red-400">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}