import { useState } from "react";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 10;

export function SubmissionsSection({ title, dotColor, items, onSelect }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5"
        style={{ color: dotColor === "bg-yellow-400" ? "#ca8a04" : "#71717a" }}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {title}
        <span className="text-[10px] text-zinc-400 font-normal normal-case">({items.length})</span>
      </h3>
      {items.length > 0 ? (
        <div className="space-y-2">
          {paginated.map((ev, i) => (
            <div key={ev.id ?? i} onClick={() => onSelect?.(ev)} className={`border rounded-lg p-3 cursor-pointer hover:opacity-80 transition ${
              dotColor === "bg-yellow-400" ? "border-yellow-100 bg-yellow-50/30 hover:bg-yellow-50" : "border-slate-100 bg-white hover:bg-slate-50"
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500">{ev.student_number || "N/A"}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  ["APPROVED", "ENROLLED", "IRREGULAR_ENROLLED"].includes(ev.status) ? "bg-emerald-100 text-emerald-700" :
                  ev.status === "REJECTED" ? "bg-red-100 text-red-600" :
                  ev.status === "FOR_ENROLLMENT" ? "bg-blue-100 text-blue-700" :
                  ev.status === "IRREGULAR" ? "bg-purple-100 text-purple-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>{ev.status}</span>
              </div>
              <p className="text-xs text-slate-400">{new Date(ev.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-slate-400 italic">None</div>
      )}
      {items.length > PAGE_SIZE && <div className="pt-2"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
    </div>
  );
}

export default function SubmissionsList({ evaluations, onSelect }) {
  const pending = evaluations.filter(e => e.status === "PENDING");
  const reviewed = evaluations.filter(e => e.status !== "PENDING");

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">My Submissions</h2>
      <div className="space-y-4 pr-1">
        {pending.length > 0 && (
          <SubmissionsSection title="Pending" dotColor="bg-yellow-400" items={pending} onSelect={onSelect} />
        )}
        {reviewed.length > 0 && (
          <SubmissionsSection title="Reviewed" dotColor="bg-zinc-400" items={reviewed} onSelect={onSelect} />
        )}
        {evaluations.length === 0 && (
          <div className="text-slate-400 text-sm italic">No submissions yet.</div>
        )}
      </div>
    </div>
  );
}
