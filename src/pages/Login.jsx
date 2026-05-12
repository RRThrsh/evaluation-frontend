import { useState } from "react";
import { loginUser } from "../api/auth";

export default function Login() {

    const [form, setForm] = useState({
        email: "",
        password: ""
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
            const res = await loginUser(form);

            console.log(res.data);

            localStorage.setItem(
                "accessToken",
                res.data.accessToken
            );

            setMessage("Login successful");

        } catch (err) {
            console.error(err);

            setMessage(
                err.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8">
                <h2 className="mb-6 text-3xl font-bold text-white">
                    Login
                </h2>

                {message && (
                    <p className="mb-4 text-sm text-green-400">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}