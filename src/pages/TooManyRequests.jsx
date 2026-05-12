import { Link } from "react-router-dom";

export default function TooManyRequests() {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white px-6 overflow-hidden">
            {/* soft background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative max-w-md w-full text-center">
                {/* Status code */}
                <h1 className="text-8xl font-extrabold text-red-500 tracking-tight">
                    429
                </h1>

                {/* Title */}
                <h2 className="mt-4 text-2xl sm:text-3xl font-semibold">
                    Too many requests
                </h2>

                {/* Description */}
                <p className="mt-3 text-slate-400 leading-relaxed">
                    You’ve hit the rate limit for this service.  
                    This is usually temporary — please wait a moment before trying again.
                </p>

                {/* hint box */}
                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
                    Tip: refreshing repeatedly won’t speed this up — give it a short pause and retry.
                </div>

                {/* actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition font-medium"
                    >
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-900 transition font-medium"
                    >
                        Try Again
                    </button>
                </div>

                {/* subtle footer hint */}
                <p className="mt-6 text-xs text-slate-600">
                    If this keeps happening, your usage may be above the allowed threshold.
                </p>
            </div>
        </div>
    );
}