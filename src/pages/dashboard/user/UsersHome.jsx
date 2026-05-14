import React, { useMemo, useState } from "react";

export default function UsersHome() {
    const [users] = useState([
        { id: 1, name: "Juan Dela Cruz", email: "juan@gmail.com", status: "Active" },
        { id: 2, name: "Maria Santos", email: "maria@gmail.com", status: "Inactive" },
        { id: 3, name: "Pedro Reyes", email: "pedro@gmail.com", status: "Active" },
    ]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const filteredUsers = useMemo(() => {
        return users.filter((u) =>
            `${u.name} ${u.email} ${u.status}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, users]);

    const handleSearch = () => {
        setShowModal(true);
    };

    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <main className="max-w-5xl mx-auto px-4 py-10">

                {/* Header */}
                <h1 className="text-3xl font-bold text-indigo-600 mb-6">
                    User Dashboard
                </h1>

                {/* Search Bar */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        onClick={handleSearch}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Search
                    </button>
                </div>

                {/* PDF Button (optional global) */}
                {/*<button
                    onClick={handleExportPDF}
                    className="mb-6 px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                    Export Page to PDF
                </button>*/}

                {/* MODAL TABLE POPUP */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">

                            {/* Modal Header */}
                            <div className="flex justify-between items-center px-5 py-4 border-b">
                                <h2 className="text-lg font-semibold">
                                    Search Results
                                </h2>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-red-500 text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Table */}
                            <div className="p-5">
                                <table className="w-full text-left border">
                                    <thead className="bg-gray-100 text-sm">
                                        <tr>
                                            <th className="p-2">ID</th>
                                            <th className="p-2">Name</th>
                                            <th className="p-2">Email</th>
                                            <th className="p-2">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((u) => (
                                                <tr key={u.id} className="border-t">
                                                    {/* TODO: change this in a subject format */}
                                                    <td className="p-2">{u.id}</td>
                                                    <td className="p-2">{u.name}</td>
                                                    <td className="p-2">{u.email}</td>
                                                    <td className="p-2">{u.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                                    No results found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Modal Actions */}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={handleExportPDF}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    >
                                        Export PDF
                                    </button>

                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}