import React from "react";
import { Hammer, RefreshCw, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Maintenance = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-6">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-200">
          <Hammer size={32} className="animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary-50 border border-primary-100">
          <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-700">Scheduled Maintenance</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">System Improvement in Progress</h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          The Academic Evaluation System is undergoing routine maintenance to improve performance and security.
          We'll be back online shortly.
        </p>

        <div className="card p-5 mb-8">
          <div className="grid grid-cols-2 divide-x divide-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Estimated Time</p>
              <p className="font-bold text-slate-800">&sim; 45 Minutes</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Status</p>
              <p className="font-bold text-primary-600">In Progress</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => window.location.reload()} className="btn btn-primary btn-md w-full sm:w-auto">
            <RefreshCw size={16} />
            Refresh Page
          </button>
          <Link to="/" className="btn btn-secondary btn-md w-full sm:w-auto">
            <ChevronLeft size={16} />
            Return Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Need urgent access? Contact the <a href="mailto:it@university.edu" className="text-primary-600 hover:underline">IT Help Desk</a>.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
