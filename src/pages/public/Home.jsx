import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Homepage = () => {
    const [isOpen, setIsOpen] = useState(false);

    // UX: Prevent body scroll when modal is active
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    return (
        <div className="antialiased text-slate-900 font-sans selection:bg-blue-100">
            <Header />

            <main>
                {/* HERO SECTION: Student Performance Focus */}
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
                            <button
                                onClick={() => setIsOpen(true)}
                                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-200"
                            >
                                View My Evaluation
                            </button>
                            <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-100 hover:border-blue-200 active:scale-95 transition-all">
                                Download Transcript
                            </button>
                        </div>
                    </div>
                </section>

                {/* EVALUATION METRICS SECTION */}
                <section className="py-24 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 text-slate-900">Holistic Evaluation Framework</h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Our college evaluation system looks beyond simple grades. We assess your progress across four core pillars to ensure career readiness.
                            </p>
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Academic Mastery", desc: "Course-specific knowledge and GPA tracking." },
                                    { title: "Soft Skill Credits", desc: "Leadership, teamwork, and communication." },
                                    { title: "Research & Labs", desc: "Practical application and technical proficiency." },
                                    { title: "Attendance & Ethics", desc: "Professionalism and consistent engagement." }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <h4 className="font-bold text-blue-700 mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* VISUAL DATA CARD */}
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-20"></div>
                            <div className="relative bg-slate-900 rounded-[2rem] p-8 lg:p-12 text-white shadow-2xl">
                                <h3 className="text-2xl font-bold mb-8 flex items-center justify-between">
                                    Current Standing
                                    <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">Active</span>
                                </h3>
                                
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 uppercase tracking-wider font-semibold">Cumulative GPA</span>
                                            <span className="font-mono text-blue-400 font-bold">3.85 / 4.0</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full w-[96%]"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 uppercase tracking-wider font-semibold">Credit Completion</span>
                                            <span className="font-mono text-purple-400 font-bold">84 / 120 Units</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 rounded-full w-[70%]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                    <p className="text-sm text-slate-300 italic">"On track for Magna Cum Laude honors."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FACULTY FEEDBACK & CONTACT */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-5">
                            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6">Faculty Consultation</h2>
                            <p className="text-slate-600 text-lg mb-8">
                                Need clarification on your latest evaluation? Connect with your Academic Advisor or Department Head.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
                                    <div>
                                        <p className="font-bold text-slate-800 leading-none">Office of Admissions</p>
                                        <p className="text-sm text-slate-500">Building A, Room 302</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">R</div>
                                    <div>
                                        <p className="font-bold text-slate-800 leading-none">Registrar Support</p>
                                        <p className="text-sm text-slate-500">support.academic@college.edu</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RE-EVALUATION REQUEST FORM */}
                        <form className="lg:col-span-7 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Grade Review Request</h3>
                                <p className="text-sm text-slate-500">Submit this form for a formal evaluation inquiry.</p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-5">
                                <input type="text" placeholder="Student ID Number" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all" />
                                <select className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all">
                                    <option>Select Semester</option>
                                    <option>Fall 2025</option>
                                    <option>Spring 2026</option>
                                </select>
                            </div>
                            
                            <textarea placeholder="Reason for review (e.g., missing lab grade, incorrect credit calculation)" rows="4" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all" />
                            
                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl">
                                Submit Request
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />

            {/* FULL EVALUATION MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-extrabold mb-2">Student Scorecard</h3>
                            <p className="text-slate-500 font-medium">Detailed breakdown of your last evaluation cycle</p>
                        </div>
                        
                        <div className="space-y-6 mb-10">
                            {[
                                { label: "Technical Competency", score: "A-" },
                                { label: "Project Leadership", score: "A+" },
                                { label: "Critical Thinking", score: "B+" },
                                { label: "Participation Rate", score: "98%" }
                            ].map((row, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100">
                                    <span className="font-semibold text-slate-700">{row.label}</span>
                                    <span className="px-4 py-1 bg-blue-50 text-blue-700 font-mono font-bold rounded-lg">{row.score}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors">
                                View Full Report
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                            >
                                Close Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;