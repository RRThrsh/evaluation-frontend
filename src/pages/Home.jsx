import { useState } from "react";
import {
    Search,
    X,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";
import Button from "../components/common/button/Button";

export default function Home() {
    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const storedUser = JSON.parse(
        localStorage.getItem("user")
    );

    const user = storedUser || {
        full_name: "Unknown User",
        email: "No Email",
        role: "User",
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        setShowModal(true);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6">

            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            {/* Navbar Right */}
            <div className="absolute right-6 top-6 flex items-center gap-3">

                {/* Profile Button */}
                <div className="relative">

                    <button
                        onClick={() =>
                            setShowProfile(!showProfile)
                        }
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-xl transition hover:bg-white/10"
                    >
                        <User size={18} />

                        <span className="hidden sm:block">
                            {user.full_name}
                        </span>
                    </button>

                    {/* Profile Modal */}
                    {showProfile && (
                        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">

                            {/* Header */}
                            <div className="border-b border-white/10 p-5">

                                <div className="flex items-center gap-4">

                                    {/* Avatar */}
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-2xl font-bold text-blue-400">
                                        {user.full_name
                                            ?.split(" ")
                                            .map(
                                                (name) => name[0]
                                            )
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    {/* User Info */}
                                    <div className="min-w-0">

                                        <h3 className="truncate text-lg font-semibold text-white">
                                            {user.full_name}
                                        </h3>

                                        <p className="truncate text-sm text-slate-400">
                                            {user.email}
                                        </p>

                                        <span className="mt-2 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Menu */}
                            <div className="p-2">

                                {/* Settings */}
                                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                                    <Settings size={18} />
                                    Settings
                                </button>

                                {/* Logout */}
                                <Link to="/">
                                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10">
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Search Section */}
            <div className="w-full max-w-3xl text-center">

                {/* Heading */}
                <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
                    Search Anything
                </h1>

                <p className="mt-4 text-lg text-slate-400">
                    Quickly search evaluations, records, or users
                </p>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className="mt-10"
                >
                    <div className="group flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">

                        {/* Icon */}
                        <div className="pl-5 text-slate-500">
                            <Search size={22} />
                        </div>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Search evaluations..."
                            value={query}
                            onChange={(e) =>
                                setQuery(e.target.value)
                            }
                            className="w-full bg-transparent px-4 py-5 text-lg text-white outline-none placeholder:text-slate-500"
                        />

                        {/* Button */}
                        <button
                            type="submit"
                            className="m-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-600 active:scale-95"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Quick Suggestions */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {[
                        "Pending Evaluations",
                        "Approved Requests",
                        "Staff Records",
                        "Moderators",
                    ].map((item) => (
                        <button
                            key={item}
                            onClick={() => setQuery(item)}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Search Results
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Results for:{" "}
                                    <span className="text-blue-400">
                                        "{query}"
                                    </span>
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 p-6">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                                >
                                    <h3 className="text-lg font-semibold text-white">
                                        Evaluation #{item}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        This is a sample search
                                        result related to "{query}
                                        ".
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">

                                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                                            Pending
                                        </span>

                                        <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end border-t border-white/10 px-6 py-4">

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="rounded-xl bg-blue-500 px-5 py-2 font-semibold text-white transition hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}