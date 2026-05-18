import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ClipboardCheck, Activity, ShieldCheck } from "lucide-react";

const About = () => {
    return (
        <div className="flex flex-col min-h-screen antialiased text-slate-900 font-sans selection:bg-blue-100">
            <Header />
            <main className="flex-grow flex flex-col justify-center relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">

                <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">

                    <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
                        <div className="lg:col-span-7">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                                Three-Role Workflow
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                How the Student <br />
                                <span className="text-blue-600 text-shadow-sm">Evaluation Workflow Works</span>
                            </h1>
                            <p className="text-slate-600 text-lg lg:text-xl leading-relaxed max-w-2xl">
                                Staff submit evaluation requests, moderators review student records 
                                and classify them by academic standing, and administrators confirm 
                                enrollment for the next semester.
                            </p>
                        </div>

                        <div className="hidden lg:block lg:col-span-5">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-10 rounded-full"></div>
                                <div className="relative border border-slate-100 bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-2xl">
                                    <div className="space-y-6">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className={`h-3 rounded-full bg-slate-100 ${i === 1 ? 'w-full' : i === 2 ? 'w-3/4' : 'w-1/2'}`} />
                                        ))}
                                        <div className="flex justify-between items-center pt-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-600" />
                                            <div className="w-24 h-8 rounded-lg bg-blue-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="group p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ClipboardCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Staff Submits</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Staff members enter a student number to submit an evaluation request. 
                                The system creates a PENDING request and notifies the moderator for review.
                            </p>
                        </div>

                        <div className="group p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Moderator Evaluates</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Moderators review the student's grades, check prerequisites, and classify 
                                them as <strong>Regular</strong>, <strong>Conditional</strong>, or 
                                <strong> Irregular</strong>. Requests are forwarded for admin enrollment confirmation.
                            </p>
                        </div>

                        <div className="group p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Admin Confirms</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Administrators review the evaluation, view detailed reports, and confirm 
                                or reject enrollment. Confirmed students are enrolled in the next 
                                semester's curriculum subjects.
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
