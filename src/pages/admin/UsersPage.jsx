import {
    Search,
    MoreVertical,
    Shield,
    Trash2,
    Pencil,
    X,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

export default function UsersPage() {

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const [selectedUser, setSelectedUser] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [openEditModal, setOpenEditModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        status: "active",
    });

    const [errors, setErrors] = useState({});

    const perPage = 5;

    const [users, setUsers] = useState([
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
    ]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            user.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [users, query]);

    const totalPages = Math.ceil(filteredUsers.length / perPage);

    const paginatedUsers = filteredUsers.slice(
        (page - 1) * perPage,
        page * perPage
    );

    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {

        const handleEsc = (e) => {

            if (e.key === "Escape") {
                setOpenDeleteModal(false);
                setOpenEditModal(false);
            }
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };

    }, []);

    const handleOpenDelete = (user) => {
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    const handleDeleteUser = () => {

        setUsers((prev) =>
            prev.filter((u) => u.id !== selectedUser.id)
        );

        setOpenDeleteModal(false);
        setSelectedUser(null);
    };

    const handleOpenEdit = (user) => {

        setSelectedUser(user);

        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });

        setErrors({});
        setOpenEditModal(true);
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {

        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Invalid email address";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // SAVE EDIT
    const handleSaveEdit = () => {

        if (!validateForm()) return;

        setUsers((prev) =>
            prev.map((user) =>
                user.id === selectedUser.id
                    ? {
                            ...user,
                            ...formData,
                        }
                    : user
            )
        );

        setOpenEditModal(false);
        setSelectedUser(null);
    };

    return (
        <>
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
                        className="w-full bg-transparent px-4 py-4 outline-none"
                    />

                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[700px]">

                            {/* TABLE HEAD */}
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

                                                    {/* EDIT */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(user)}
                                                        className="rounded-lg p-2 hover:bg-white/10"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    {/* DELETE */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenDelete(user)}
                                                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    {/* MORE */}
                                                    <button
                                                        type="button"
                                                        className="rounded-lg p-2 hover:bg-white/10"
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
                            className="rounded-xl border border-white/10 px-4 py-2 disabled:opacity-50"
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
                            className="rounded-xl border border-white/10 px-4 py-2 disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

            {/* DELETE MODAL */}
            {openDeleteModal && (

                <div
                    onClick={() => setOpenDeleteModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                >

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6"
                    >

                        <div className="mb-4 flex items-center justify-between">

                            <h2 className="text-xl font-bold">
                                Delete User
                            </h2>

                            <button
                                type="button"
                                onClick={() => setOpenDeleteModal(false)}
                                className="rounded-lg p-2 hover:bg-white/10"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <p className="text-slate-300">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-white">
                                {selectedUser?.name}
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => setOpenDeleteModal(false)}
                                className="rounded-xl border border-white/10 px-5 py-3 hover:bg-white/10"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteUser}
                                className="rounded-xl bg-red-500 px-5 py-3 font-semibold hover:bg-red-600"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* EDIT MODAL */}
            {openEditModal && (

                <div
                    onClick={() => setOpenEditModal(false)}
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
                                onClick={() => setOpenEditModal(false)}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    <option value="user">
                                        User
                                    </option>

                                    <option value="moderator">
                                        Moderator
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

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
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="banned">
                                        Banned
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="mt-8 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => setOpenEditModal(false)}
                                className="rounded-xl border border-white/10 px-5 py-3 hover:bg-white/10"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="rounded-xl bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600"
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </>
    );
}