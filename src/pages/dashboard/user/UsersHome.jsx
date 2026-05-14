import React from "react";

export default function UsersHome() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Main Content Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl">
                        User Dashboard
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Welcome back! Here is a quick look at what’s happening today.
                    </p>
                </header>

                {/* Stats / Quick Info Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Card 1 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-6 transition hover:shadow-lg">
                        <h3 className="text-sm font-medium text-gray-500 truncate">Total Activity</h3>
                        <p className="mt-1 text-3xl font-semibold text-indigo-600">128</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-6 transition hover:shadow-lg">
                        <h3 className="text-sm font-medium text-gray-500 truncate">New Notifications</h3>
                        <p className="mt-1 text-3xl font-semibold text-emerald-500">12</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-6 transition hover:shadow-lg">
                        <h3 className="text-sm font-medium text-gray-500 truncate">Account Status</h3>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">Active</p>
                    </div>

                </div>

                {/* Placeholder for Main List/Feed */}
                <section className="mt-12">
                    <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No content yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new project or checking your feed.</p>
                        <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                            Create New
                        </button>
                    </div>
                </section>

            </main>
        </div>
    );
}