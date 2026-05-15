import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, ChevronRight, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    const roleDashboard = {
        admin: "/admin",
        moderator: "/moderator",
        staff: "/staff",
        user: "/users",
    };

    const dashboardPath = roleDashboard[user?.role] || "/login";

    return (
        <header className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-xl border-b border-slate-100/80">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo & Institution Branding */}
                <Link
                    to="/"
                    className="flex items-center gap-3 hover:opacity-80 transition-all group"
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-3 transition-transform">
                        <GraduationCap size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                            Evaluation
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            College System
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                isActive(link.path)
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth Section */}
                <div className="hidden md:flex items-center gap-3 border-l border-slate-100 ml-4 pl-4">
                    {user ? (
                        <>
                            <Link
                                to={dashboardPath}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all text-sm"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                            <span className="text-sm text-slate-400 font-medium">
                                {user.full_name}
                            </span>
                            <button
                                onClick={logout}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 px-3 transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Toggle Menu"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl">
                    <nav className="flex flex-col p-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                                    isActive(link.path)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.name}
                                <ChevronRight size={16} className={isActive(link.path) ? "opacity-100" : "opacity-0"} />
                            </Link>
                        ))}

                        <div className="pt-4 mt-4 border-t border-slate-50 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <Link
                                        to={dashboardPath}
                                        className="w-full py-4 text-center text-sm font-bold bg-blue-600 text-white rounded-xl"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="w-full py-4 text-center text-sm font-bold text-red-500"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="w-full py-4 text-center text-sm font-bold text-slate-500"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="w-full py-4 text-center text-sm font-bold bg-blue-600 text-white rounded-xl"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
