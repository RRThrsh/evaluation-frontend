import { X } from "lucide-react";

export default function DeleteUserModal({
    open,
    user,
    onClose,
    onConfirm,
}) {
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
                {/* HEADER */}
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        Delete User
                    </h2>

                    <button
                        onClick={onClose}
                        className="hover:text-red-400"
                    >
                        <X />
                    </button>
                </div>

                {/* BODY */}
                <p className="text-slate-300">
                    Delete{" "}
                    <b className="text-white">
                        {user?.full_name}
                    </b>
                    ?
                </p>

                {user?.email && (
                    <p className="text-sm text-slate-400 mt-1">
                        {user.email}
                    </p>
                )}

                {/* WARNING */}
                <p className="mt-4 text-sm text-red-400">
                    This action cannot be undone.
                </p>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}