import { useState } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/button/Button";

export default function Home() {
    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false);

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

            {/* Logout */}
            <div className="absolute right-6 top-6">
                <Link to="/">
                    <Button variant="outline">
                        Logout
                    </Button>
                </Link>
            </div>

            {/* Main Search Section */}
            <div className="w-full max-w-3xl text-center">

                {/* Heading */}
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
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
                            onChange={(e) => setQuery(e.target.value)}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">

                        {/* Modal Header */}
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
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="space-y-4 p-6">

                            {/* Example Results */}
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                                >
                                    <h3 className="text-lg font-semibold text-white">
                                        Evaluation #{item}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        This is a sample search result related
                                        to "{query}".
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
                                onClick={() => setShowModal(false)}
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