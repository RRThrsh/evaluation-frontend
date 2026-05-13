import { Search } from "lucide-react";
import UserRow from "./UserRow";

export default function UsersTable({
    users,
    query,
    setQuery,
    page,
    setPage,
    totalPages,
    onEdit,
    onDelete,
}) {
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-slate-400">
                        Manage platform users and permissions
                    </p>
                </div>
                
                <button
                    onClick={handleOpenCreate}
                    className="rounded-xl bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-600"
                >
                    Add User
                </button>
            </div>

            {/* SEARCH */}
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4">
                <Search size={18} className="text-slate-400" />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-transparent px-4 py-4 outline-none"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <table className="w-full min-w-[700px]">
                    <thead className="border-b border-white/10 bg-white/5">
                        <tr className="text-left text-sm text-slate-400">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-slate-400">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="border px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-slate-400">
                        Page {page} of {totalPages || 1}
                    </span>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="border px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}