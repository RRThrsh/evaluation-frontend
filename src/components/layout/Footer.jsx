import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white border-t mt-10">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            
                {/* Brand */}
                <div className="text-gray-800 font-semibold text-lg">
                    MyBrand
                </div>

                {/* Links */}
                <div className="flex gap-6 text-sm text-gray-600">
                    <a href="#" className="hover:text-gray-900">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Terms
                    </a>
                    <a href="#" className="hover:text-gray-900">
                        Contact
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} MyBrand. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;