import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                  {/* Logo */}
                    <div className="text-xl font-bold text-gray-800">
                        MyBrand
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6">
                        <a href="#" className="text-gray-600 hover:text-black">Home</a>
                        <a href="#" className="text-gray-600 hover:text-black">About</a>
                        <a href="#" className="text-gray-600 hover:text-black">Contact</a>
                    </div>

                    {/* Mobile Button */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setOpen(!open)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-2">
                    <a href="#" className="block text-gray-600">Home</a>
                    <a href="#" className="block text-gray-600">About</a>
                    <a href="#" className="block text-gray-600">Contact</a>
                </div>
            )}
        </nav>
    );
}