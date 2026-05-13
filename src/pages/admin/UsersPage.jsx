import {
    Search,
    MoreVertical,
    Shield,
    Trash2,
    Pencil,
    X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

export default function UsersPage() {

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const perPage = 5;

    // =========================
    // USERS DATA
    // =========================
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "moderator", status: "active" },
        { id: 3, name: "Mike Ross", email: "mike@example.com", role: "user", status: "banned" },
        { id: 4, name: "Sarah Connor", email: "sarah@example.com", role: "user", status: "active" },
        { id: 5, name: "Bruce Wayne", email: "bruce@example.com", role: "moderator", status: "active" },
        { id: 6, name: "Clark Kent", email: "clark@example.com", role: "user", status: "banned" },
        { id: 7, name: "Tony Stark", email: "tony@example.com", role: "admin", status: "active" },
    ]);

    // =========================
    // MODALS STATE
    // =========================
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    // =========================
    // EDIT FORM
    // =========================
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        status: "active",
    });

    const [errors, setErrors] = useState({});

    // =========================
    // CREATE FORM
    // =========================
    const [createFormData, setCreateFormData] = useState({
        name: "",
        email: "",
        role: "user",
        status: "active",
    });

    const [createErrors, setCreateErrors] = useState({});

    // =========================
    // FILTER + PAGINATION
    // =========================
    const filteredUsers = useMemo(() => {
        return users.filter((u) =>
            u.name.toLowerCase().includes(query.toLowerCase())
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

    // =========================
    // ESC CLOSE MODALS
    // =========================
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpenDeleteModal(false);
                setOpenEditModal(false);
                setOpenCreateModal(false);
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    // =========================
    // DELETE USER
    // =========================
    const openDelete = (user) => {
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    const handleDelete = () => {
        setUsers((prev) =>
            prev.filter((u) => u.id !== selectedUser.id)
        );
        setSelectedUser(null);
        setOpenDeleteModal(false);
    };

    // =========================
    // EDIT USER
    // =========================
    const openEdit = (user) => {
        setSelectedUser(user);
        setFormData(user);
        setErrors({});
        setOpenEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateEdit = () => {
        const err = {};
        if (!formData.name.trim()) err.name = "Name required";
        if (!formData.email.trim()) err.email = "Email required";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const saveEdit = () => {
        if (!validateEdit()) return;

        setUsers((prev) =>
            prev.map((u) =>
                u.id === selectedUser.id ? { ...u, ...formData } : u
            )
        );

        setOpenEditModal(false);
        setSelectedUser(null);
    };

    // =========================
    // CREATE USER
    // =========================
    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateCreate = () => {
        const err = {};

        if (!createFormData.name.trim()) err.name = "Name required";
        if (!createFormData.email.trim()) err.email = "Email required";

        const exists = users.some(
            (u) => u.email === createFormData.email
        );

        if (exists) err.email = "Email already exists";

        setCreateErrors(err);
        return Object.keys(err).length === 0;
    };

    const createUser = () => {
        if (!validateCreate()) return;

        const newUser = {
            id: Date.now(),
            ...createFormData,
        };

        setUsers((prev) => [newUser, ...prev]);

        setCreateFormData({
            name: "",
            email: "",
            role: "user",
            status: "active",
        });

        setOpenCreateModal(false);
    };

    // =========================
    // UI
    // =========================
    return (
        <>
            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            User Management
                        </h1>
                        <p className="text-slate-400">
                            Manage users
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="rounded-xl bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600"
                    >
                        Add User
                    </button>
                </div>

                {/* SEARCH */}
                <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4">
                    <Search size={18} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent px-4 py-4 outline-none"
                        placeholder="Search users..."
                    />
                </div>

                {/* TABLE */}
                <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-white/5 border-b border-white/10">
                            <tr className="text-left text-sm text-slate-400">
                                <th className="p-4">User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedUsers.map((u) => (
                                <tr key={u.id} className="border-b border-white/5">
                                    <td className="p-4">
                                        <div>
                                            <p>{u.name}</p>
                                            <p className="text-sm text-slate-400">
                                                {u.email}
                                            </p>
                                        </div>
                                    </td>

                                    <td>{u.role}</td>

                                    <td>{u.status}</td>

                                    <td className="flex gap-2 p-4">

                                        <button onClick={() => openEdit(u)}>
                                            <Pencil size={16} />
                                        </button>

                                        <button onClick={() => openDelete(u)}>
                                            <Trash2 size={16} />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>

            {/* ================= DELETE MODAL ================= */}
            {openDeleteModal && (
                <Modal onClose={() => setOpenDeleteModal(false)}>
                    <h2 className="text-xl font-bold mb-4">
                        Delete User
                    </h2>

                    <p>
                        Are you sure you want to delete{" "}
                        <b>{selectedUser?.name}</b>?
                    </p>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setOpenDeleteModal(false)}>
                            Cancel
                        </button>

                        <button onClick={handleDelete} className="text-red-500">
                            Delete
                        </button>
                    </div>
                </Modal>
            )}

            {/* ================= EDIT MODAL ================= */}
            {openEditModal && (
                <Modal onClose={() => setOpenEditModal(false)}>

                    <h2 className="text-xl font-bold mb-4">
                        Edit User
                    </h2>

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleEditChange}
                        placeholder="Name"
                        className="w-full mb-2"
                    />
                    {errors.name && <p>{errors.name}</p>}

                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleEditChange}
                        placeholder="Email"
                        className="w-full mb-2"
                    />
                    {errors.email && <p>{errors.email}</p>}

                    <button onClick={saveEdit}>
                        Save
                    </button>

                </Modal>
            )}

            {/* ================= CREATE MODAL ================= */}
            {openCreateModal && (
                <Modal onClose={() => setOpenCreateModal(false)}>

                    <h2 className="text-xl font-bold mb-4">
                        Create User
                    </h2>

                    <input
                        name="name"
                        value={createFormData.name}
                        onChange={handleCreateChange}
                        placeholder="Name"
                        className="w-full mb-2"
                    />
                    {createErrors.name && <p>{createErrors.name}</p>}

                    <input
                        name="email"
                        value={createFormData.email}
                        onChange={handleCreateChange}
                        placeholder="Email"
                        className="w-full mb-2"
                    />
                    {createErrors.email && <p>{createErrors.email}</p>}

                    <button onClick={createUser}>
                        Create
                    </button>

                </Modal>
            )}
        </>
    );
}

/* ================= REUSABLE MODAL ================= */
function Modal({ children, onClose }) {

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 flex items-center justify-center bg-black/60"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 p-6 rounded-2xl w-[400px]"
            >
                <button
                    className="absolute top-3 right-3"
                    onClick={onClose}
                >
                    <X size={18} />
                </button>

                {children}
            </div>
        </div>
    );
}