import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Hourglass, ShieldAlert, RefreshCw, Info } from "lucide-react";

const TooManyRequests = () => {
    const [seconds, setSeconds] = useState(60);

    // UX: A countdown timer gives the user a sense of "end time" 
    // and prevents them from spamming the refresh button.
    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [seconds]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased">

            <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-20">
                <div className="max-w-md w-full text-center">
                    
                    {/* Status Illustration */}
                    <div className="relative mb-8 inline-block">
                        <div className="absolute inset-0 bg-amber-100 rounded-full scale-150 opacity-50 blur-xl"></div>
                        <div className="relative w-24 h-24 bg-white border-2 border-amber-100 rounded-[2.5rem] flex items-center justify-center text-amber-500 shadow-xl shadow-amber-900/5">
                            <Hourglass size={40} className={seconds > 0 ? "animate-spin-slow" : ""} />
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-amber-50 border border-amber-100">
                        <ShieldAlert size={14} className="text-amber-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                            Error 429: Rate Limit Exceeded
                        </span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        System Cooldown Active
                    </h1>

                    <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                        To maintain portal stability and security, we've temporarily paused 
                        requests from your connection. This usually happens when pages are 
                        refreshed too quickly.
                    </p>

                    {/* Timer Box */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Estimated wait time
                        </p>
                        <div className="text-4xl font-mono font-black text-slate-800">
                            00:{seconds < 10 ? `0${seconds}` : seconds}
                        </div>
                        {seconds === 0 && (
                            <p className="text-xs text-emerald-600 font-bold mt-2">
                                You can now try again.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button
                            disabled={seconds > 0}
                            onClick={() => window.location.reload()}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                                seconds > 0 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
                            }`}
                        >
                            <RefreshCw size={18} className={seconds > 0 ? "" : "animate-spin-once"} />
                            Retry Now
                        </button>

                        <Link 
                            to="/contact"
                            className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors"
                        >
                            <Info size={14} />
                            Why am I seeing this?
                        </Link>
                    </div>
                </div>
            </main>

            {/* Custom Tailwind Animation for the spin */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-once {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-once {
                    animation: spin-once 0.6s ease-in-out;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
            `}} />
        </div>
    );
};

export default TooManyRequests;