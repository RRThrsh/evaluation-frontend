import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // temporary log (replace with API later)
        console.log({
            email,
            password,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6">

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Login
                </h1>

                <p className="text-sm text-gray-600 text-center mb-6">
                    Access the Evaluation System
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Email */}
                    <div>
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

                {/* Links */}
                <div className="mt-4 text-sm text-center space-y-2">
                    <a href="/forgot-password" className="text-blue-600 hover:underline block">
                        Forgot Password?
                    </a>

                    <a href="/register" className="text-blue-600 hover:underline block">
                        Create an account
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;