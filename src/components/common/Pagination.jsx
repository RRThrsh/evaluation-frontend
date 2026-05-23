import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 0) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
      <span className="text-xs text-slate-400">Page {currentPage} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="btn btn-ghost btn-sm"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-400">&hellip;</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition ${
                p === currentPage
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="btn btn-ghost btn-sm"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
