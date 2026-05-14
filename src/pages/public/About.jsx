import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ClipboardCheck, Activity, ShieldCheck } from "lucide-react";

const About = () => {
    return (
        /* The flex-col and min-h-screen ensure the footer stays at the bottom */
        <div className="flex flex-col min-h-screen antialiased text-slate-900 font-sans selection:bg-blue-100">

            <Header />

            {/* main flex-grow fills the remaining vertical space */}
            <main className="flex-grow flex flex-col justify-center relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
                
                <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
                    
                    {/* Hero Section of About */}
                    <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
                        <div className="lg:col-span-7">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                                Institutional Transparency
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                How the Student <br />
                                <span className="text-blue-600 text-shadow-sm">Evaluation System Works</span>
                            </h1>
                            <p className="text-slate-600 text-lg lg:text-xl leading-relaxed max-w-2xl">
                                Our platform streamlines the academic assessment lifecycle—collecting, 
                                processing, and validating student performance data to ensure a 
                                fair and transparent journey for every learner.
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

                    {/* Process Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        
                        {/* Step 1 */}
                        <div className="group p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ClipboardCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Submission</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Students and faculty submit feedback or performance requests through 
                                a secure, centralized portal. Every entry is timestamped and encrypted.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="group p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Processing</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Our automated workflows organize evaluations by department and credit type, 
                                ensuring complete documentation before the review phase.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="group p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Verification</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Academic moderators and the registrar conduct final audits to maintain 
                                high standards of institutional integrity and fairness.
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