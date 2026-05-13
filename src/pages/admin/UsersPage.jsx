import { useEffect, useMemo, useState } from "react";

import UsersTable from "../../components/admin/users/UsersTable";
import DeleteUserModal from "../../components/admin/users/DeleteUserModal";
import EditUserModal from "../../components/admin/users/EditUserModal";
import CreateUserModal from "../../components/admin/users/CreateUserModal";

export default function UsersPage() {
    const perPage = 5;

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "moderator", status: "active" },
        { id: 3, name: "Mike Ross", email: "mike@example.com", role: "user", status: "banned" },
        { id: 4, name: "Sarah Connor", email: "sarah@example.com", role: "user", status: "active" },
        { id: 5, name: "Bruce Wayne", email: "bruce@example.com", role: "moderator", status: "active" },
        { id: 6, name: "Clark Kent", email: "clark@example.com", role: "user", status: "banned" },
        { id: 7, name: "Tony Stark", email: "tony@example.com", role: "admin", status: "active" },
    ]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [errors, setErrors] = useState({});

    // ---------------- FILTER + PAGINATION ----------------
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

    useEffect(() => setPage(1), [query]);

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

    // ---------------- DELETE ----------------
    const handleOpenDelete = (user) => {
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    const handleDeleteUser = () => {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setOpenDeleteModal(false);
        setSelectedUser(null);
    };

    // ---------------- EDIT ----------------
    const handleOpenEdit = (user) => {
        setSelectedUser(user);
        setFormData(user);
        setErrors({});
        setOpenEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!validateForm()) return;

        setUsers((prev) =>
            prev.map((u) =>
                u.id === selectedUser.id ? { ...u, ...formData } : u
            )
        );

        setOpenEditModal(false);
        setSelectedUser(null);
    };

    // ---------------- FORM ----------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <>
            {/* TABLE */}
            <UsersTable
                users={paginatedUsers}
                query={query}
                setQuery={setQuery}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
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