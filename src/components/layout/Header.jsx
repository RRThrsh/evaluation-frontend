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
        evaluator: "/evaluator",
    };

    const dashboardPath = roleDashboard[user?.role] || "/login";

    return (
        <header className="sticky top-0 z-[100] w-full bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2.5"
                >
                    <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <GraduationCap size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
                            Evaluation
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                            College System
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-0.5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                isActive(link.path)
                                    ? "text-slate-900 bg-slate-100"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-2.5 border-l border-slate-100 ml-3 pl-3">
                    {user ? (
                        <>
                            <Link
                                to={dashboardPath}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors text-sm"
                            >
                                <LayoutDashboard size={15} />
                                Dashboard
                            </Link>
                            <span className="text-sm text-slate-400 font-medium">
                                {user.full_name}
                            </span>
                            <button
                                onClick={logout}
                                className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 px-2 transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-1.5 bg-slate-900 text-white font-medium text-sm rounded-md hover:bg-slate-800 transition-colors"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Toggle Menu"
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-sm">
                    <nav className="flex flex-col p-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                    isActive(link.path)
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.name}
                                <ChevronRight size={14} className={isActive(link.path) ? "opacity-100" : "opacity-0"} />
                            </Link>
                        ))}

                        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
                            {user ? (
                                <>
                                    <Link
                                        to={dashboardPath}
                                        className="w-full py-2.5 text-center text-sm font-medium bg-slate-900 text-white rounded-md"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="w-full py-2.5 text-center text-sm font-medium text-slate-500"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="w-full py-2.5 text-center text-sm font-medium text-slate-500"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="w-full py-2.5 text-center text-sm font-medium bg-slate-900 text-white rounded-md"
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
