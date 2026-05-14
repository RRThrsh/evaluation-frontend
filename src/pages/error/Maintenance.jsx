import React from "react";

const Maintenance = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="text-center max-w-md">

                <div className="text-6xl mb-4">🛠️</div>

                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Under Maintenance
                </h1>

                <p className="text-gray-600 mb-6">
                    The system is currently undergoing scheduled maintenance.
                    Please try again later.
                </p>

                <div className="text-sm text-gray-500 mb-6">
                    We’re working to improve your experience.
                </div>

                <a
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    Refresh / Return Home
                </a>
            </div>
        </div>
    );
};

export default Maintenance;