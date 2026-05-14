import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="w-full bg-white border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-xl font-bold text-gray-800"
                >
                    MyBrand
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex gap-6 text-sm text-gray-600">
                    <Link
                        to="/"
                        className="hover:text-gray-900"
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        className="hover:text-gray-900"
                    >
                        About
                    </Link>

                    <Link
                        to="/contact"
                        className="hover:text-gray-900"
                    >
                        Contact
                    </Link>
                </nav>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu Icon */}
                <div className="md:hidden text-gray-600 cursor-pointer">
                    ☰
                </div>
            </div>
        </header>
    );
};

export default Header;