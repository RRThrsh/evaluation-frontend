import { MoreVertical, Shield, Trash2, Pencil, CheckCircle } from "lucide-react";

export default function UserRow({ user, onEdit, onDelete }) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5">

            {/* USER */}
            <td className="px-6 py-4">
                <p className="font-medium">
                    {user.full_name}
                </p>

                <p className="text-sm text-slate-400">
                    {user.email}
                </p>
            </td>

            {/* ROLE */}
            <td className="px-6 py-4">
                <div className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                    <Shield size={14} />
                    {user.role}
                </div>
            </td>

            {/* VERIFIED (REPLACES STATUS) */}
            <td className="px-6 py-4">
                {user.is_verified ? (
                    <span className="inline-flex items-center gap-1 rounded-xl bg-green-500/10 px-3 py-1 text-sm text-green-400">
                        <CheckCircle size={14} />
                        Verified
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-xl bg-red-500/10 px-3 py-1 text-sm text-red-400">
                        Unverified
                    </span>
                )}
            </td>

            {/* ACTIONS */}
            <td className="px-6 py-4">
                <div className="flex gap-3">

                    <button
                        onClick={() => onEdit(user)}
                        className="hover:text-blue-400"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => onDelete(user)}
                        className="text-red-400 hover:text-red-300"
                    >
                        <Trash2 size={16} />
                    </button>

                    <button className="hover:text-slate-300">
                        <MoreVertical size={16} />
                    </button>

                </div>
            </td>
        </tr>
    );
}