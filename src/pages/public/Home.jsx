import React from "react";

const Homepage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Header */}
            <header className="w-full px-6 py-4 bg-white border-b shadow-sm flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">
                    Evaluation System
                </h1>

                <div className="space-x-3">
                    <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                        Login
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Register
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="text-center max-w-2xl">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to the Evaluation System
                    </h2>

                    <p className="text-gray-600 text-lg mb-6">
                        A simple platform for staff, moderators, and users to manage and
                        submit evaluations efficiently and securely.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                            Get Started
                        </button>

                        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition">
                            Learn More
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 text-sm text-gray-500 border-t bg-white">
                © {new Date().getFullYear()} Evaluation System. All rights reserved.
            </footer>
        </div>
    );
};

export default Homepage;