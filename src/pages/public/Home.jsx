import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ClipboardCheck, Activity, ShieldCheck, ArrowRight } from "lucide-react";

const Homepage = () => {
    return (
        <div className="antialiased text-slate-900 font-sans selection:bg-blue-100">
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Academic Year 2025-2026
                        </span>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
                            Student Evaluation
                            <br className="hidden md:block" />
                            <span className="text-blue-600">Workflow System</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Staff submit evaluation requests. Moderators review and approve.
                            Administrators oversee the entire process. Simple, transparent, efficient.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="py-24 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                            Workflow
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 text-slate-900">
                            How It Works
                        </h2>
                        <p className="text-slate-500 text-lg mb-16 max-w-2xl mx-auto">
                            Three simple steps from submission to completion
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            {[
                                {
                                    icon: <ClipboardCheck size={28} />,
                                    color: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                                    title: "1. Staff Submits",
                                    desc: "Staff enter a student number to submit an evaluation request. The system checks student eligibility and creates a pending request.",
                                    role: "For Staff",
                                },
                                {
                                    icon: <Activity size={28} />,
                                    color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                                    title: "2. Moderator Reviews",
                                    desc: "Moderators review the evaluation details, verify the information, and approve or reject the request with one click.",
                                    role: "For Moderators",
                                },
                                {
                                    icon: <ShieldCheck size={28} />,
                                    color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                                    title: "3. Completed",
                                    desc: "Approved evaluations are finalized. Students can view their status, and admins can monitor the entire system in real time.",
                                    role: "For Everyone",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed mb-4">{item.desc}</p>
                                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                        {item.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ROLE-BASED ACTIONS */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                                Roles
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 text-slate-900">
                                Who Is This For?
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Students",
                                    desc: "Track evaluation status and academic progress.",
                                    link: "/users",
                                    color: "border-blue-200 bg-blue-50/50",
                                    textColor: "text-blue-700",
                                },
                                {
                                    title: "Staff",
                                    desc: "Submit evaluation requests for students.",
                                    link: "/staff",
                                    color: "border-indigo-200 bg-indigo-50/50",
                                    textColor: "text-indigo-700",
                                },
                                {
                                    title: "Moderators",
                                    desc: "Review and approve evaluation requests.",
                                    link: "/moderator",
                                    color: "border-emerald-200 bg-emerald-50/50",
                                    textColor: "text-emerald-700",
                                },
                                {
                                    title: "Admins",
                                    desc: "Full system oversight and configuration.",
                                    link: "/admin",
                                    color: "border-purple-200 bg-purple-50/50",
                                    textColor: "text-purple-700",
                                },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.link}
                                    className={`p-6 rounded-2xl border ${item.color} hover:shadow-lg hover:-translate-y-0.5 transition-all`}
                                >
                                    <h3 className={`font-bold text-lg mb-2 ${item.textColor}`}>{item.title}</h3>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Homepage;
