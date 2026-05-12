import { Link, useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-6">
            <div className="max-w-xl w-full text-center">

                {/* Decorative 404 */}
                <div className="relative mb-6">
                    <div
                        aria-hidden="true"
                        className="text-[120px] md:text-[160px] font-extrabold text-white/10 leading-none select-none"
                    >
                        404
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-28 w-28 rounded-full bg-blue-500/20 blur-3xl"></div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Oops! Page not found
                </h1>

                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    The page you’re looking for might have been removed,
                    renamed, or is temporarily unavailable.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">

                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/60 text-white hover:bg-slate-700 transition-all duration-300"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                </div>

                {/* Hint */}
                <div className="mt-10 flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Search size={16} />
                    Try checking the URL or navigating from the homepage.
                </div>
            </div>
        </div>
    );
}

export default NotFound;