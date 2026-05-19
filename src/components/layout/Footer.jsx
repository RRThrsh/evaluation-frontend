import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-24 border-t border-slate-900 bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Support CTA */}
                <div className="mb-16 p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-black border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    <div className="max-w-2xl text-center md:text-left">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                            Need help with an evaluation?
                        </h3>
                        <p className="mt-3 text-slate-400 leading-relaxed">
                            Reach out to the support team for assistance with evaluation submissions, 
                            approvals, or system access.
                        </p>
                    </div>

                    <Link
                        to="/contact"
                        className="whitespace-nowrap px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                    >
                        Contact Support
                    </Link>
                </div>

                {/* Main Footer Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Brand/System Identity */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">E</div>
                            <h2 className="text-xl font-bold tracking-tighter text-white">
                                Evaluation
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400">
                            The official academic assessment portal for modern higher education institutions. 
                            Dedicated to transparency and growth.
                        </p>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                            Resources
                        </h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition">Home</Link></li>
                            <li><Link to="/about" className="text-slate-400 hover:text-blue-400 transition">About the System</Link></li>
                            <li><Link to="/contact" className="text-slate-400 hover:text-blue-400 transition">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                            Quick Access
                        </h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/login" className="text-slate-400 hover:text-blue-400 transition">Staff Login</Link></li>
                            <li><Link to="/register" className="text-slate-400 hover:text-blue-400 transition">Register Account</Link></li>
                            <li><Link to="/forgot-password" className="text-slate-400 hover:text-blue-400 transition">Reset Password</Link></li>
                        </ul>
                    </div>

                    {/* Global Recognition */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                            Verified By
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Accredited ISO-2026</span>
                            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter">EDU-Cloud Secure</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-12 border-t border-slate-900" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Student Evaluation Workflow System. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2">
                        <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shadow-sm">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                        <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shadow-sm text-xs font-bold px-4">
                            ResearchGate
                        </a>
                        <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shadow-sm text-xs font-bold px-4">
                            Portal Status
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;