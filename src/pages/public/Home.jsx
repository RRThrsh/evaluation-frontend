import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Homepage = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Grade review request submitted");
    };

    return (
        <div className="antialiased text-slate-900 font-sans selection:bg-blue-100">
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                            Academic Year 2025-2026
                        </span>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
                            Empowering Student <br className="hidden md:block" />
                            <span className="text-blue-600">Growth & Excellence</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Access your comprehensive academic evaluation, track your GPA trajectory,
                            and identify key areas for competency development through data-driven insights.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-200"
                            >
                                Get Started →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SYSTEM OVERVIEW SECTION */}
                <section className="py-24 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    
                        {/* LEFT SIDE */}
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 text-slate-900">
                                Platform Overview
                            </h2>
                    
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Track your support activity, system performance, and service quality in real time.
                            </p>
                    
                            <div className="grid sm:grid-cols-2 gap-6">
                    
                                {[
                                    {
                                        title: "Ticket Management",
                                        desc: "Track and manage all your support requests in one place."
                                    },
                                    {
                                        title: "Response Tracking",
                                        desc: "Monitor average response and resolution times."
                                    },
                                    {
                                        title: "System Status",
                                        desc: "Real-time availability and performance monitoring."
                                    },
                                    {
                                        title: "User Support History",
                                        desc: "View all past inquiries and resolutions."
                                    }
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                                    >
                                        <h4 className="font-bold text-blue-700 mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-slate-500">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                            
                        {/* RIGHT SIDE DASHBOARD CARD */}
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-20"></div>
                            
                            <div className="relative bg-slate-900 rounded-[2rem] p-8 lg:p-12 text-white shadow-2xl">
                            
                                <h3 className="text-2xl font-bold mb-8 flex items-center justify-between">
                                    System Status
                                    <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                                        Online
                                    </span>
                                </h3>
                            
                                <div className="space-y-8">
                            
                                    {/* Active Tickets */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 uppercase tracking-wider font-semibold">
                                                Active Tickets
                                            </span>
                                            <span className="font-mono text-blue-400 font-bold">
                                                12 Open
                                            </span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full w-[60%]"></div>
                                        </div>
                                    </div>
                            
                                    {/* Response Time */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 uppercase tracking-wider font-semibold">
                                                Avg Response Time
                                            </span>
                                            <span className="font-mono text-purple-400 font-bold">
                                                2.4 hrs
                                            </span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 rounded-full w-[75%]"></div>
                                        </div>
                                    </div>
                            
                                </div>
                            
                                <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                    <p className="text-sm text-slate-300 italic">
                                        "System operating normally with high service stability."
                                    </p>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT + FORM */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">

                        {/* CONTACT */}
                        <div className="lg:col-span-5">
                            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6">
                                Help & Support
                            </h2>

                            <p className="text-slate-600 text-lg mb-8">
                                Need assistance? Reach out to our support team for help with your account,
                                system access, or academic records.
                            </p>

                            <div className="space-y-4">

                                {/* Technical Support */}
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        T
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Technical Support</p>
                                        <p className="text-sm text-slate-500">support@yourplatform.com</p>
                                    </div>
                                </div>

                                {/* Academic Records */}
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        A
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Academic Records</p>
                                        <p className="text-sm text-slate-500">records@yourplatform.com</p>
                                    </div>
                                </div>

                                {/* Response Info */}
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-sm text-blue-700 font-medium">
                                        ⏱ Typical response time: 24–48 hours
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* SUPPORT FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="lg:col-span-7 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold">Support Request</h3>
                                <p className="text-sm text-slate-500">
                                    Need help? Submit a support ticket and our team will assist you.
                                </p>
                            </div>
                            
                            {/* Name + Email */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Issue Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Issue Type
                                </label>
                                <select
                                    className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none"
                                    required
                                >
                                    <option value="">Select issue type</option>
                                    <option>Technical Issue</option>
                                    <option>Account Problem</option>
                                    <option>Grade / Record Inquiry</option>
                                    <option>System Access</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Describe your issue in detail..."
                                    rows="5"
                                    className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none"
                                    required
                                />
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Priority Level
                                </label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl"
                            >
                                Submit Support Ticket
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Homepage;