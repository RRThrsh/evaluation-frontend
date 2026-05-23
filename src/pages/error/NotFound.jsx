import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoveLeft, Home, Search, LifeBuoy } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[20rem] lg:text-[30rem] font-black text-slate-50 leading-none">404</span>
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-red-50 border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Error: Page Not Found</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Lost in the system?
          </h1>

          <p className="text-slate-500 text-base sm:text-lg mb-8 leading-relaxed">
            The page you're looking for might have been moved, renamed, or never existed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button onClick={() => navigate(-1)} className="btn btn-secondary btn-lg w-full sm:w-auto">
              <MoveLeft size={16} />
              Go Back
            </button>
            <Link to="/" className="btn btn-primary btn-lg w-full sm:w-auto">
              <Home size={16} />
              Return to Dashboard
            </Link>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Or try these resources</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/" className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <div className="p-2.5 bg-white rounded-lg shadow-xs mb-2"><Search size={18} /></div>
                <span className="text-sm font-semibold text-slate-700">Find Grades</span>
              </Link>
              <Link to="/about" className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <div className="p-2.5 bg-white rounded-lg shadow-xs mb-2"><Search size={18} /></div>
                <span className="text-sm font-semibold text-slate-700">System Info</span>
              </Link>
              <Link to="/contact" className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <div className="p-2.5 bg-white rounded-lg shadow-xs mb-2"><LifeBuoy size={18} /></div>
                <span className="text-sm font-semibold text-slate-700">Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
