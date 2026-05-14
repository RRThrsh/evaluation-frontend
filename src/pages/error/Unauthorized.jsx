import React from "react";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Unauthorized Access
                </h2>

                <p className="text-gray-600 mb-6">
                    You do not have permission to view this page.
                </p>

                <a
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
};

export default Unauthorized;