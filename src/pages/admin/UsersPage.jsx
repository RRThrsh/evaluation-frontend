import { useEffect, useMemo, useState } from "react";

import UsersTable from "../../components/admin/users/UsersTable";
import DeleteUserModal from "../../components/admin/users/DeleteUserModal";
import EditUserModal from "../../components/admin/users/EditUserModal";

const API_URL = "http://localhost:5000";

/* =========================
    API LAYER (clean separation)
========================= */
const fetchUsersAPI = async () => {
    const res = await fetch(`${API_URL}/admin/users?limit=100&offset=0`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
    }

    return data.data;
};

const deleteUserAPI = async (id) => {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
    }

    return data;
};

const updateUserRoleAPI = async (id, role) => {
    const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
    }

    return data;
};

/* =========================
    MAIN COMPONENT
========================= */
export default function UsersPage() {
    const perPage = 5;

    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        role: "USER",
    });

    const [errors, setErrors] = useState({});

    /* =========================
        LOAD USERS
    ========================= */
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchUsersAPI();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    /* =========================
        NORMALIZED FILTER
    ========================= */
    const filteredUsers = useMemo(() => {
        const q = query.toLowerCase();

        return users.filter((u) => {
            return (
                u.full_name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.role?.toLowerCase().includes(q)
            );
        });
    }, [users, query]);

    const totalPages = Math.ceil(filteredUsers.length / perPage);

    const paginatedUsers = filteredUsers.slice(
        (page - 1) * perPage,
        page * perPage
    );

    useEffect(() => setPage(1), [query]);

    /* =========================
        MODALS
    ========================= */
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpenDeleteModal(false);
                setOpenEditModal(false);
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    /* =========================
        DELETE USER
    ========================= */
    const handleOpenDelete = (user) => {
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    const handleDeleteUser = async () => {
        try {
            await deleteUserAPI(selectedUser.id);

            setUsers((prev) =>
                prev.filter((u) => u.id !== selectedUser.id)
            );

            setOpenDeleteModal(false);
            setSelectedUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    /* =========================
        EDIT USER (ROLE ONLY)
    ========================= */
    const handleOpenEdit = (user) => {
        setSelectedUser(user);

        setFormData({
            full_name: user.full_name || "",
            email: user.email || "",
            role: user.role || "USER",
        });

        setErrors({});
        setOpenEditModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const validateForm = () => {
        const err = {};

        if (!formData.full_name.trim()) {
            err.full_name = "Name is required";
        }

        if (!formData.email.trim()) {
            err.email = "Email is required";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSaveEdit = async () => {
        if (!validateForm()) return;

        try {
            await updateUserRoleAPI(selectedUser.id, formData.role);

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === selectedUser.id
                        ? { ...u, role: formData.role }
                        : u
                )
            );

            setOpenEditModal(false);
            setSelectedUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    /* =========================
        UI
    ========================= */
    return (
        <>
            {error && (
                <div className="p-3 text-red-500">
                    {error}
                </div>
            )}

            <UsersTable
                users={paginatedUsers}
                query={query}
                setQuery={setQuery}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                loading={loading}
            />

            <EditUserModal
                open={openEditModal}
                formData={formData}
                errors={errors}
                onClose={() => setOpenEditModal(false)}
                onChange={handleChange}
                onSave={handleSaveEdit}
            />

            <DeleteUserModal
                open={openDeleteModal}
                user={selectedUser}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDeleteUser}
            />
        </>
    );
}