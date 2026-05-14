import React from "react";

const Header = () => {
    return (
        <header className="w-full bg-white border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            
                {/* Logo */}
                <div className="text-xl font-bold text-gray-800">
                    MyBrand
                </div>

                {/* Nav */}
                <nav className="hidden md:flex gap-6 text-sm text-gray-600">
                    <a href="#" className="hover:text-gray-900">
                        Home
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Features
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Pricing
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Contact
                    </a>
                </nav>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Get Started
                    </button>
                </div>

                {/* Mobile Placeholder (simple) */}
                <div className="md:hidden text-gray-600">
                    ☰
                </div>
            </div>
        </header>
    );
};

export default Header;