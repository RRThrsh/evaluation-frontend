import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-24 border-t border-[#2a221b] bg-[#1b1410]">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

                    {/* Brand */}
                    <div className="max-w-sm text-center md:text-left">
                        <h2 className="text-2xl font-bold text-[#f3e9dc]">
                            Evaluation
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-[#b8a99a]">
                            Crafting beautiful digital experiences with a modern,
                            minimal, and premium aesthetic.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-10 text-center sm:text-left">

                        {/* Company Links */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#f3e9dc] mb-4">
                                Company
                            </h3>

                            <div className="space-y-3">
                                <Link
                                    to="/about"
                                    className="block text-[#b8a99a] hover:text-[#f3e9dc] transition"
                                >
                                    About
                                </Link>

                                <Link
                                    to="/contact"
                                    className="block text-[#b8a99a] hover:text-[#f3e9dc] transition"
                                >
                                    Contact
                                </Link>

                                <Link
                                    to="/careers"
                                    className="block text-[#b8a99a] hover:text-[#f3e9dc] transition"
                                >
                                    Careers
                                </Link>
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#f3e9dc] mb-4">
                                Legal
                            </h3>

                            <div className="space-y-3">
                                <a
                                    href="#"
                                    className="block text-[#b8a99a] hover:text-[#f3e9dc] transition"
                                >
                                    Privacy Policy
                                </a>

                                <a
                                    href="#"
                                    className="block text-[#b8a99a] hover:text-[#f3e9dc] transition"
                                >
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-10 border-t border-[#2a221b]" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Copyright */}
                    <p className="text-sm text-[#8c7a6a] text-center md:text-left">
                        © {new Date().getFullYear()} Evaluation. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">

                        <a
                            href="#"
                            className="px-4 py-2 rounded-full bg-[#2a221b] text-[#b8a99a] hover:bg-[#3a2f25] hover:text-[#f3e9dc] transition text-sm"
                        >
                            Instagram
                        </a>

                        <a
                            href="#"
                            className="px-4 py-2 rounded-full bg-[#2a221b] text-[#b8a99a] hover:bg-[#3a2f25] hover:text-[#f3e9dc] transition text-sm"
                        >
                            Twitter
                        </a>

                        <a
                            href="#"
                            className="px-4 py-2 rounded-full bg-[#2a221b] text-[#b8a99a] hover:bg-[#3a2f25] hover:text-[#f3e9dc] transition text-sm"
                        >
                            GitHub
                        </a>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;