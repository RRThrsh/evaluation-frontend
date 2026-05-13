import { useEffect, useMemo, useState } from "react";
import {
    Search,
    MoreVertical,
    Shield,
    Trash2,
    Pencil,
} from "lucide-react";

export default function UsersPage() {

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const perPage = 5;

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
            {
                id: 4,
                name: "Sarah Connor",
                email: "sarah@example.com",
                role: "user",
                status: "active",
            },
            {
                id: 5,
                name: "Bruce Wayne",
                email: "bruce@example.com",
                role: "moderator",
                status: "active",
            },
            {
                id: 6,
                name: "Clark Kent",
                email: "clark@example.com",
                role: "user",
                status: "banned",
            },
            {
                id: 7,
                name: "Tony Stark",
                email: "tony@example.com",
                role: "admin",
                status: "active",
            },
        ],
        []
    );

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / perPage);

    const paginatedUsers = filteredUsers.slice(
        (page - 1) * perPage,
        page * perPage
    );

    useEffect(() => {
        setPage(1);
    }, [query]);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-2xl font-bold">
                        User Management
                    </h1>

                    <p className="text-slate-400">
                        Manage platform users and permissions
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-xl bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-600"
                >
                    Add User
                </button>

            </div>

            {/* SEARCH */}
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4">

                <Search
                    size={18}
                    className="text-slate-400"
                />

                <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search users"
                    className="w-full bg-transparent px-4 py-4 outline-none"
                />

            </div>

            {/* TABLE CONTAINER */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                        {/* TABLE HEADER */}
                        <thead className="border-b border-white/10 bg-white/5">

                            <tr className="text-left text-sm text-slate-400">

                                <th className="px-6 py-4">
                                    User
                                </th>

                                <th className="px-6 py-4">
                                    Role
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>

                                <th className="px-6 py-4">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        {/* TABLE BODY */}
                        <tbody>

                            {paginatedUsers.length > 0 ? (

                                paginatedUsers.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="border-b border-white/5 transition hover:bg-white/5"
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

                                                {/* EDIT */}
                                                <button
                                                    type="button"
                                                    className="rounded-lg p-2 transition hover:bg-white/10"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    type="button"
                                                    className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                {/* MORE */}
                                                <button
                                                    type="button"
                                                    className="rounded-lg p-2 transition hover:bg-white/10"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="px-6 py-10 text-center text-slate-400"
                                    >
                                        No users found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">

                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-xl border border-white/10 px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-slate-400">
                        Page {page} of {totalPages || 1}
                    </span>

                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-xl border border-white/10 px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}