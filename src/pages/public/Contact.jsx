import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased selection:bg-blue-100">
            
            <Header />

            <main className="flex-grow flex items-center justify-center py-12 lg:py-20 px-6">
                <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col lg:flex-row border border-slate-100">
                    
                    {/* Left Panel: Contact Info */}
                    <div className="lg:w-2/5 bg-blue-600 p-8 lg:p-12 text-white flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-4">
                                Contact Academic Support
                            </h2>
                            <p className="text-blue-100 leading-relaxed mb-10">
                                Have questions regarding your evaluation or need technical assistance with the portal? Our team is here to help.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/50 rounded-xl">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Email Us</p>
                                        <p className="font-medium">support@university.edu</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/50 rounded-xl">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Call Us</p>
                                        <p className="font-medium">+1 (555) 012-3456</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/50 rounded-xl">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Office</p>
                                        <p className="font-medium text-sm leading-snug">
                                            Building 4, Registrar Wing<br />
                                            Academic Heights Campus
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtle decorative element */}
                        <div className="mt-12 pt-8 border-t border-blue-500/50">
                            <p className="text-xs text-blue-200">
                                Typical response time: 24-48 Business Hours
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="lg:w-3/5 p-8 lg:p-12 bg-white">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Student ID (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="STU-12345"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Academic Email</label>
                                <input
                                    type="email"
                                    placeholder="j.doe@university.edu"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">How can we help?</label>
                                <textarea
                                    rows="5"
                                    placeholder="Please describe your inquiry in detail..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="group w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                            >
                                Send Inquiry
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;