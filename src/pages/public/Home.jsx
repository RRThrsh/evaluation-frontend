import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ClipboardCheck, Activity, ShieldCheck, ArrowRight, Search } from "lucide-react";
import api from "../../services/api";
import { sanitizeInput } from "../../utils/sanitize";

const Homepage = () => {
    const [studentNumber, setStudentNumber] = useState("");
    const [result, setResult] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [academicYear, setAcademicYear] = useState("");

    useEffect(() => {
        api.get("/api/config").then((d) => {
            if (d?.data?.academic_year_label) setAcademicYear(d.data.academic_year_label);
        }).catch(() => {});
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const sanitized = sanitizeInput(studentNumber);
        if (!sanitized) return;
        setSearchLoading(true);
        setSearchError("");
        setResult(null);
        try {
            const data = await api.get(`/api/students/lookup/${encodeURIComponent(sanitized)}`);
            if (data?.success && data?.data) {
                setResult(data.data);
            } else {
                setSearchError("Student not found");
            }
        } catch (err) {
            setSearchError(err.status === 404 ? "No student found with that number" : err.message || "Search failed");
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div className="antialiased text-slate-900 font-sans selection:bg-blue-100">
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Academic Year {academicYear || "Loading..."}
                        </span>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
                            Student Evaluation
                            <br className="hidden md:block" />
                            <span className="text-blue-600">Workflow System</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Evaluators submit and review evaluation requests.
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

                {/* STUDENT SEARCH */}
                <section className="py-16 bg-white">
                    <div className="max-w-2xl mx-auto px-6 text-center">
                        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100/50 rounded-full">
                            <Search size={12} className="inline mr-1" />
                            Student Lookup
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-extrabold mb-2 text-slate-900">
                            Check Student Information
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">
                            Enter a student number to look up basic details
                        </p>

                        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
                            <input
                                type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                placeholder="Student number"
                                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={searchLoading || !studentNumber}
                                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {searchLoading ? "..." : "Search"}
                            </button>
                        </form>

                        {searchError && (
                            <div className="mt-4 text-red-500 text-sm text-center bg-red-50 rounded-lg py-3 max-w-md mx-auto">{searchError}</div>
                        )}

                        {result && (
                            <div className="mt-4 bg-slate-50 rounded-lg border border-slate-200 p-4 text-sm text-left max-w-md mx-auto">
                                <p><span className="text-slate-400">Number:</span> <span className="font-medium">{result.student_number}</span></p>
                                <p className="mt-1"><span className="text-slate-400">Year Level:</span> <span className="font-medium">{result.year_level || "N/A"}</span></p>

                                {result.subjects && result.subjects.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currently Taken Subjects</p>
                                        <div className="space-y-1.5">
                                            {result.subjects.map((sub, i) => (
                                                <div key={i} className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-slate-100">
                                                    <div>
                                                        <p className="font-medium text-slate-800">{sub.subject_code}</p>
                                                        <p className="text-xs text-slate-400">{sub.subject_name}</p>
                                                    </div>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                                                        sub.status === "APPROVED"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : sub.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                        {sub.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(!result.subjects || result.subjects.length === 0) && (
                                    <p className="mt-2 text-xs text-slate-400">No subjects currently enrolled.</p>
                                )}
                            </div>
                        )}
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
                                    desc: "Staff enter a student number to submit an evaluation request. The system creates a pending request and notifies the evaluator.",
                                    role: "For Staff",
                                },
                                {
                                    icon: <Activity size={28} />,
                                    color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                                    title: "2. Evaluator Evaluates",
                                    desc: "Evaluators review grades, check prerequisites, and classify students as Regular, Conditional, or Irregular. Requests are sent for enrollment approval.",
                                    role: "For Evaluators",
                                },
                                {
                                    icon: <ShieldCheck size={28} />,
                                    color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                                    title: "3. Admin Confirms",
                                    desc: "Admins review and confirm enrollment. Students are enrolled in the next semester's curriculum subjects. The whole system is visible in real time.",
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
                                    desc: "Look up student information using the search above.",
                                    link: "#student-lookup",
                                    color: "border-blue-200 bg-blue-50/50",
                                    textColor: "text-blue-700",
                                },
                                {
                                    title: "Staff",
                                    desc: "Submit evaluation requests for students.",
                                    link: "/evaluator",
                                    color: "border-indigo-200 bg-indigo-50/50",
                                    textColor: "text-indigo-700",
                                },
                                {
                                    title: "Evaluators",
                                    desc: "Review and approve evaluation requests.",
                                    link: "/evaluator",
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
