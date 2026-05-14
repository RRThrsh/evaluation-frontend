import React from "react";

const TooManyRequest = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Content */}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="text-center max-w-md">

                    <h1 className="text-6xl font-bold text-gray-900 mb-4">
                        429
                    </h1>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Too Many Requests
                    </h2>

                    <p className="text-gray-600 mb-6">
                        You have sent too many requests in a short period of time.
                        Please wait a few moments before trying again.
                    </p>

                    <div className="text-sm text-gray-500 mb-6">
                        This is a security measure to protect the system from overload.
                    </div>

                    <a
                        href="/"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                        Return Home
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 text-sm text-gray-500 border-t bg-white">
                © {new Date().getFullYear()} Evaluation System
            </footer>
        </div>
    );
};

export default TooManyRequest;