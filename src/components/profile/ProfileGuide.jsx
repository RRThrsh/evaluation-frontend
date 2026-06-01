import { useEffect, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";

export default function ProfileGuide() {
  const [guides, setGuides] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/guides")
      .then(({ data }) => setGuides(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Guide
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Helpful information about the Academic Evaluation System.
          </p>
        </div>
        <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
          <Sparkles size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {guides.map((g, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={g.id} className="group transition-all duration-300">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className={`flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-all duration-300 ${
                    isOpen ? "bg-slate-50" : "hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                      isOpen
                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}>
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold transition-colors duration-300 ${
                        isOpen ? "text-slate-900" : "text-slate-700"
                      }`}>
                        {g.question}
                      </h3>
                      {!isOpen && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                          Click to view answer
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                    isOpen ? "rotate-180 bg-slate-200 text-slate-700" : "bg-slate-100 text-slate-400"
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}>
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-5">
                      <div className="pl-14">
                        <p className="text-sm leading-7 text-slate-600">{g.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
