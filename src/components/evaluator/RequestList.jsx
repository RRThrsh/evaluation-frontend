import { useState, memo } from "react";
import { ChevronRight } from "lucide-react";
import Pagination from "../common/Pagination";
import { toPHDate } from "../../utils/date";

const PAGE_SIZE = 10;

export const RequestSection = memo(function RequestSection({ title, dotColor, requests, onOpen }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const paginated = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusStyle = (status) => {
    switch (status) {
      case "PENDING": return "badge badge-yellow";
      case "APPROVED":
      case "ENROLLED":
      case "IRREGULAR_ENROLLED": return "badge badge-green";
      case "FOR_ENROLLMENT": return "badge badge-blue";
      case "IRREGULAR": return "badge";
      default: return "badge badge-red";
    }
  };

  const overallStyle = (overall) =>
    ["qualified", "conditional"].includes(overall) ? "badge badge-green" : "badge badge-red";

  return (
    <div>
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {title}
        <span className="text-xs text-slate-400 font-normal normal-case">({requests.length})</span>
      </h2>
      {requests.length > 0 ? (
        <div className="card divide-y divide-slate-100 overflow-hidden">
          {paginated.map((req, i) => (
            <div
              key={req.id ?? i}
              onClick={() => onOpen(req)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(req); } }}
              role="button"
              tabIndex={0}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <div className="min-w-0 flex-1">
                <div className="flex gap-1.5 items-center flex-wrap">
                  <span className={statusStyle(req.status)}>{req.status}</span>
                  {(req.evaluation_result?.evaluator_submit || req.evaluation_result)?.overall && (
                    <span className={overallStyle((req.evaluation_result.evaluator_submit || req.evaluation_result).overall)}>{(req.evaluation_result.evaluator_submit || req.evaluation_result).overall}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mt-1">{req.student_number || "N/A"} &mdash; {req.reason ?? req.type}</p>
                {req.course_name && <p className="text-xs text-slate-400 mt-0.5">{req.course_code || req.course_name}</p>}
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-xs text-slate-400">{toPHDate(req.created_at)}</span>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-slate-400 text-sm">No requests.</div>
      )}
      {requests.length > PAGE_SIZE && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
});
