import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-24 border-t border-[#1a1a1a] bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-14">

                {/* CTA Section */}
                <div className="mb-14 p-8 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    <div className="max-w-xl">
                        <h3 className="text-2xl font-bold text-white">
                            Ready to build something exceptional?
                        </h3>

                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                            Join us in creating modern, minimal, and high-performing digital experiences.
                            Whether you're starting a project or scaling your product, we’re here to help.
                        </p>
                    </div>

                    <Link
                        to="/contact"
                        className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
                    >
                        Get in Touch
                    </Link>
                </div>

                {/* Top Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

                    {/* Brand */}
                    <div className="max-w-sm text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white">
                            Evaluation
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-gray-400">
                            Crafting beautiful digital experiences with a modern,
                            minimal, and premium aesthetic.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-10 text-center sm:text-left">

                        {/* Company Links */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                                Company
                            </h3>

                            <div className="space-y-3">
                                <Link to="/about" className="block text-gray-400 hover:text-white transition">
                                    About
                                </Link>
                                <Link to="/contact" className="block text-gray-400 hover:text-white transition">
                                    Contact
                                </Link>
                                <Link to="/careers" className="block text-gray-400 hover:text-white transition">
                                    Careers
                                </Link>
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                                Legal
                            </h3>

                            <div className="space-y-3">
                                <a href="#" className="block text-gray-400 hover:text-white transition">
                                    Privacy Policy
                                </a>
                                <a href="#" className="block text-gray-400 hover:text-white transition">
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-10 border-t border-[#1a1a1a]" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    <p className="text-sm text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} Evaluation. All rights reserved.
                    </p>

                    <div className="flex items-center gap-3">

                        <a href="#" className="px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#1f1f1f] text-gray-400 hover:text-white hover:border-gray-600 transition text-sm">
                            Instagram
                        </a>

                        <a href="#" className="px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#1f1f1f] text-gray-400 hover:text-white hover:border-gray-600 transition text-sm">
                            Twitter
                        </a>

                        <a href="#" className="px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#1f1f1f] text-gray-400 hover:text-white hover:border-gray-600 transition text-sm">
                            GitHub
                        </a>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;