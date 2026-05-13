import { useMemo, useState } from "react";
import {
    Search,
    MoreVertical,
    Shield,
    Trash2,
    Pencil,
} from "lucide-react";

export default function UsersPage() {

    const [query, setQuery] = useState("");

    const users = useMemo(
        () => [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                role: "admin",
                status: "active",
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                role: "moderator",
                status: "active",
            },
            {
                id: 3,
                name: "Mike Ross",
                email: "mike@example.com",
                role: "user",
                status: "banned",
            },
        ],
        []
    );

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        User Management
                    </h1>
                    <p className="text-slate-400">
                        Manage platform users and permissions
                    </p>
                </div>

                <button className="rounded-xl bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600">
                    Add User
                </button>
            </div>

            {/* SEARCH */}
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4">
                <Search size={18} className="text-slate-400" />

                <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent px-4 py-4 outline-none"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

                <table className="w-full">

                    <thead className="border-b border-white/10 bg-white/5">
                        <tr className="text-left text-sm text-slate-400">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredUsers.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b border-white/5 hover:bg-white/5"
                            >

                                {/* USER */}
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {user.email}
                                        </p>
                                    </div>
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
                                        className={`rounded-xl px-3 py-1 text-sm ${
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
                                    <div className="flex items-center gap-3">

                                        <button className="rounded-lg p-2 hover:bg-white/10">
                                            <Pencil size={16} />
                                        </button>

                                        <button className="rounded-lg p-2 hover:bg-red-500/10 text-red-400">
                                            <Trash2 size={16} />
                                        </button>

                                        <button className="rounded-lg p-2 hover:bg-white/10">
                                            <MoreVertical size={16} />
                                        </button>

                                    </div>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}