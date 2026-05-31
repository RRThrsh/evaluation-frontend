import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Hourglass, RefreshCw } from "lucide-react";

const TooManyRequests = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-white border border-amber-200 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg">
          <Hourglass size={36} />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-amber-50 border border-amber-100">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Rate Limit Exceeded: 429</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">System Cooldown Active</h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          To maintain system stability, we've temporarily paused requests from your connection.
          This usually happens when pages are refreshed too quickly.
        </p>

        <div className="card p-6 mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated wait time</p>
          <div className="text-3xl font-mono font-black text-slate-800">
            00:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          {seconds === 0 && <p className="text-xs text-emerald-600 font-bold mt-2">You can now try again.</p>}
        </div>

        <button
          disabled={seconds > 0}
          onClick={() => window.location.reload()}
          className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            seconds > 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "btn btn-primary"
          }`}
        >
          <RefreshCw size={16} />
          Retry Now
        </button>

        <Link to="/contact" className="text-sm font-semibold text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 mt-4">
          Why am I seeing this?
        </Link>
      </div>
    </div>
  );
};

export default TooManyRequests;
