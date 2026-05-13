import { MoreVertical, Shield, Trash2, Pencil } from "lucide-react";

export default function UserRow({ user, onEdit, onDelete }) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5">

            {/* USER */}
            <td className="px-6 py-4">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
            </td>

            {/* ROLE */}
            <td className="px-6 py-4">
                <div className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                    <Shield size={14} />
                    {user.role}
                </div>
            </td>

            {/* STATUS */}
            <td className="px-6 py-4">
                <span
                    className={`px-3 py-1 rounded-xl text-sm ${
                        user.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                    }`}
                >
                    {user.status}
                </span>
            </td>

            {/* ACTIONS */}
            <td className="px-6 py-4">
                <div className="flex gap-3">

                    <button onClick={() => onEdit(user)}>
                        <Pencil size={16} />
                    </button>

                    <button onClick={() => onDelete(user)} className="text-red-400">
                        <Trash2 size={16} />
                    </button>

                    <button>
                        <MoreVertical size={16} />
                    </button>

                </div>
            </td>
        </tr>
    );
}