import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
              <h2 className="text-lg font-bold">Academic Evaluation</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Streamlining student evaluation workflows for higher education institutions.
              Transparent, efficient, and reliable academic clearance.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/login" className="text-slate-400 hover:text-primary-400 transition">Sign In</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-primary-400 transition">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Access</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/login" className="text-slate-400 hover:text-primary-400 transition">Staff Login</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-primary-400 transition">Register Account</Link></li>
              <li><Link to="/forgot-password" className="text-slate-400 hover:text-primary-400 transition">Reset Password</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Academic Evaluation System. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tight">Accredited</span>
            <span className="px-3 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tight">Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
