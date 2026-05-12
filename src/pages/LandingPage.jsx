import { Link } from "react-router-dom";
import Button from "../components/common/button/Button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/10 backdrop-blur-sm">
                <div>
                    
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/login">
                        <Button variant="outline">
                            Login
                        </Button>
                    </Link>

                    <Link to="/signup">
                        <Button variant="primary">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-36">
                {/* Badge */}
                <div className="mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur">
                    Smart Evaluation Workflow System
                </div>

                {/* Heading */}
                <h2 className="max-w-4xl text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                    Simplify Your
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        {" "}Evaluation Process
                    </span>
                </h2>

                {/* Description */}
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
                    Create, manage, and monitor evaluations efficiently.
                    Staff can submit requests, moderators can review and respond,
                    while administrators oversee every workflow and system activity.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <Link to="/signup">
                        <button className="group rounded-2xl bg-blue-500 px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-600 active:scale-95">
                            Start Evaluation
                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </button>
                    </Link>

                    <Link to="/login">
                        <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-slate-200 backdrop-blur transition-all duration-300 hover:bg-white/10">
                            Login
                        </button>
                    </Link>
                </div>

                {/* Trust Text */}
                <p className="mt-5 text-sm text-slate-500">
                    Fast setup • Modern UI • Role-based workflow
                </p>

                {/* Stats Cards */}
                <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <h3 className="text-3xl font-bold text-blue-400">
                            3 Roles
                        </h3>
                        <p className="mt-2 text-slate-400">
                            Staff, Moderator, and Admin access control.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <h3 className="text-3xl font-bold text-cyan-400">
                            Real-Time
                        </h3>
                        <p className="mt-2 text-slate-400">
                            Track approvals, declines, and updates instantly.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <h3 className="text-3xl font-bold text-indigo-400">
                            Easy Setup
                        </h3>
                        <p className="mt-2 text-slate-400">
                            Minimal learning curve with intuitive navigation.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}