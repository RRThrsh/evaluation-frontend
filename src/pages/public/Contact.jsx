import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import api from "../../services/api";
import { sanitizeObject } from "../../utils/sanitize";

const Contact = () => {
    const [form, setForm] = useState({ name: "", student_id: "", email: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await api.post("/api/contact", sanitizeObject(form));
            setSent(true);
            setForm({ name: "", student_id: "", email: "", message: "" });
        } catch (err) {
            setError(err.message || "Failed to send. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased selection:bg-blue-100">

            <Header />

            <main className="flex-grow flex items-center justify-center py-12 lg:py-20 px-6">
                <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col lg:flex-row border border-slate-100">

                    {/* Left Panel: Contact Info */}
                    <div className="lg:w-2/5 bg-blue-600 p-8 lg:p-12 text-white flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-4">
                                Get in Touch
                            </h2>
                            <p className="text-blue-100 leading-relaxed mb-10">
                                Questions about the evaluation system or need help with a submission? 
                                Reach out to the support team.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/50 rounded-xl">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Email</p>
                                        <p className="font-medium">support@eval-system.edu</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/50 rounded-xl">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Phone</p>
                                        <p className="font-medium">+1 (555) 000-1234</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/50 rounded-xl">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Office</p>
                                        <p className="font-medium text-sm leading-snug">
                                            Registrar Building, Room 203<br />
                                            Main Campus
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-blue-500/50">
                            <p className="text-xs text-blue-200">
                                Response time: 24-48 business hours
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="lg:w-3/5 p-8 lg:p-12 bg-white">
                        {sent ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                <p className="text-slate-500 max-w-sm">
                                    Thank you for reaching out. We'll get back to you within 24-48 business hours.
                                </p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-8 text-sm font-bold text-blue-600 hover:text-blue-700"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                                        {error}
                                    </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Student ID (Optional)</label>
                                        <input
                                            type="text"
                                            name="student_id"
                                            value={form.student_id}
                                            onChange={handleChange}
                                            placeholder="2020-0001"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Please describe your inquiry in detail..."
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="group w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Sending..." : "Send Inquiry"}
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
