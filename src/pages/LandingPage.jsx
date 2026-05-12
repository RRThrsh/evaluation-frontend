import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-6">
                <h1 className="text-2xl font-bold">MyApp</h1>

                <div className="flex gap-4">
                    <Link to="/login">
                        <button className="rounded-lg border border-white px-4 py-2 hover:bg-white hover:text-black transition">
                            Login
                        </button>
                    </Link>

                    <Link to="/signup">
                        <button className="rounded-lg bg-blue-500 px-4 py-2 hover:bg-blue-600 transition">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="flex flex-col items-center justify-center text-center px-6 mt-32">
                <h2 className="text-5xl font-extrabold leading-tight max-w-3xl">
                    Build modern web apps faster with React + Vite
                </h2>

                <p className="mt-6 text-slate-400 max-w-xl">
                    Fast. Clean. Responsive. Start building your next project today.
                </p>

                <Link to="/signup">
                    <button className="mt-8 rounded-xl bg-blue-500 px-8 py-4 text-lg font-semibold hover:bg-blue-600 transition">
                        Get Started 🚀
                    </button>
                </Link>
            </section>
        </div>
    );
}