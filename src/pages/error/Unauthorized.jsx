import React from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Unauthorized = () => {
  const { user, logout } = useAuth();

  const roleDashboard = {
    superadmin: "/admin",
    admin: "/admin",
    evaluator: "/evaluator",
  };

  const dashboardPath = roleDashboard[user?.role] || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-white border border-red-200 rounded-2xl flex items-center justify-center text-red-500 shadow-lg">
          <Lock size={36} />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-red-50 border border-red-100">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Access Restricted: 403</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Restricted Area</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          You don't have permission to view this page. This area is reserved for authorized personnel.
        </p>

        <div className="space-y-3 mb-8">
          <Link to={dashboardPath} className="flex items-center gap-4 p-4 card card-hover text-left">
            <div className="p-2.5 bg-primary-50 text-primary-600 rounded-lg">
              <ArrowLeft size={18} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Go to My Dashboard</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || "Return"} portal</p>
            </div>
          </Link>

          <button onClick={logout} className="flex items-center gap-4 p-4 card card-hover text-left w-full">
            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg">
              <LogOut size={18} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Switch Account</p>
              <p className="text-xs text-slate-500">Log in with a different account</p>
            </div>
          </button>
        </div>

        <p className="text-sm text-slate-400">
          Think this is a mistake? <Link to="/contact" className="text-primary-600 font-semibold hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
