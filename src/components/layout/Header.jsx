import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../common/button/Button";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-xl font-semibold tracking-tight text-gray-900 hover:opacity-70 transition"
                >
                    Evaluation
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link className="text-md text-gray-600 hover:text-gray-900 transition" to="/">
                        Home
                    </Link>
                    <Link className="text-md text-gray-600 hover:text-gray-900 transition" to="/about">
                        About
                    </Link>
                    <Link className="text-md text-gray-600 hover:text-gray-900 transition" to="/contact">
                        Contact
                    </Link>
                </nav>

                {/* CTA */}
                <div className="hidden md:block">
                    <Button variant="primary">
                        Get Started
                    </Button>
                </div>

                {/* Mobile Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
                >
                    {mobileOpen ? (
                        <X size={22} className="text-gray-800" />
                    ) : (
                        <Menu size={22} className="text-gray-800" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <nav className="flex flex-col px-6 py-4 space-y-4">
                        <Link className="text-gray-600 hover:text-gray-900" to="/" onClick={() => setMobileOpen(false)}>
                            Home
                        </Link>
                        <Link className="text-gray-600 hover:text-gray-900" to="/about" onClick={() => setMobileOpen(false)}>
                            About
                        </Link>
                        <Link className="text-gray-600 hover:text-gray-900" to="/contact" onClick={() => setMobileOpen(false)}>
                            Contact
                        </Link>

                        <Button variant="outline">
                            Get Started
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;