import { useState } from "react";
import { registerUser } from "../api/auth";

export default function Signup() {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await registerUser(form);

            setMessage(res.data.message);

            console.log(res.data);

        } catch (err) {
            console.error(err);

            setMessage(
                err.response?.data?.message || "Registration failed"
            );
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8">
                <h2 className="mb-6 text-3xl font-bold text-white">
                    Sign Up
                </h2>

                {message && (
                    <p className="mb-4 text-sm text-green-400">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white"
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-500 py-3 text-white"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}