export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-white">Login</h2>

                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}