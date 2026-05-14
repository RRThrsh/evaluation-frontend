import React from "react";

const ForgotPassword = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6">

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Forgot Password
                </h1>

                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter your email address and we’ll send you a reset link.
                </p>

                {/* Form */}
                <form className="space-y-4">

                    <div>
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Reset Link
                    </button>

                </form>

                {/* Back to login */}
                <div className="text-center mt-4">
                    <a
                        href="/login"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;