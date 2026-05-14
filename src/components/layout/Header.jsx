import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-[#f8f5ef]/90 border-b border-[#e7dfd2]">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-[#3e3428] hover:opacity-80 transition"
                >
                    Evaluation
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-sm font-medium text-[#6b5e4f] hover:text-[#3e3428] transition"
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className="text-sm font-medium text-[#6b5e4f] hover:text-[#3e3428] transition"
                    >
                        About
                    </Link>

                    <Link
                        to="/contact"
                        className="text-sm font-medium text-[#6b5e4f] hover:text-[#3e3428] transition"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <button className="px-5 py-2.5 rounded-xl bg-[#c8a97e] text-white text-sm font-medium hover:bg-[#b89567] transition-all duration-300 shadow-sm hover:shadow-md">
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-[#efe7db] transition"
                >
                    {mobileOpen ? (
                        <X size={22} className="text-[#5c4d3d]" />
                    ) : (
                        <Menu size={22} className="text-[#5c4d3d]" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-[#e7dfd2] bg-[#f8f5ef]/95 backdrop-blur-lg">
                    <nav className="flex flex-col px-6 py-4 space-y-4">
                        <Link
                            to="/"
                            className="text-[#6b5e4f] hover:text-[#3e3428] transition"
                            onClick={() => setMobileOpen(false)}
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            className="text-[#6b5e4f] hover:text-[#3e3428] transition"
                            onClick={() => setMobileOpen(false)}
                        >
                            About
                        </Link>

                        <Link
                            to="/contact"
                            className="text-[#6b5e4f] hover:text-[#3e3428] transition"
                            onClick={() => setMobileOpen(false)}
                        >
                            Contact
                        </Link>

                        <button className="w-full mt-2 px-4 py-3 rounded-xl bg-[#c8a97e] text-white font-medium hover:bg-[#b89567] transition">
                            Get Started
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;