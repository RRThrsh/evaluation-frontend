import { useState } from "react";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 10;

function Section({ title, color, dotColor, items, onSelect, renderItem }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color }}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {title}
        <span className="text-[10px] text-zinc-400 font-normal normal-case">({items.length})</span>
      </h3>
      {items.length > 0 ? (
        <div className="space-y-2">
          {paginated.map((ev, i) => renderItem(ev, i))}
        </div>
      ) : (
        <div className="text-xs text-slate-400 italic">None</div>
      )}
      {items.length > PAGE_SIZE && <div className="pt-2"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const color = ["APPROVED", "ENROLLED", "IRREGULAR_ENROLLED"].includes(status) ? "bg-emerald-100 text-emerald-700"
    : status === "REJECTED" ? "bg-red-100 text-red-600"
    : status === "FOR_ENROLLMENT" ? "bg-blue-100 text-blue-700"
    : status === "IRREGULAR" ? "bg-purple-100 text-purple-700"
    : "bg-yellow-100 text-yellow-700";
  return <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${color}`}>{status}</span>;
}

export default function SubmissionsList({ evaluations, onSelect }) {
  const pending = evaluations.filter(e => e.status === "PENDING" && !e.staff_viewed_at);
  const responded = evaluations.filter(e => e.status !== "PENDING");
  const seen = evaluations.filter(e => e.status === "PENDING" && e.staff_viewed_at);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">My Submissions</h2>
      <div className="space-y-6 pr-1">

        {pending.length > 0 && (
          <Section title="Pending" color="#ca8a04" dotColor="bg-yellow-400" items={pending} onSelect={onSelect}
            renderItem={(ev) => (
              <div key={ev.id} onClick={() => onSelect?.(ev)} className="border border-yellow-100 bg-yellow-50/30 rounded-lg p-3 cursor-pointer hover:bg-yellow-50 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500">{ev.student_number || "N/A"}</span>
                  <StatusBadge status={ev.status} />
                </div>
                <p className="text-xs text-slate-400">{new Date(ev.created_at).toLocaleDateString()}</p>
              </div>
            )}
          />
        )}

        {responded.length > 0 && (
          <Section title="Response Received" color="#16a34a" dotColor="bg-emerald-500" items={responded} onSelect={onSelect}
            renderItem={(ev) => (
              <div key={ev.id} onClick={() => onSelect?.(ev)} className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-3 cursor-pointer hover:bg-emerald-50 transition">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {!ev.staff_viewed_at && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    <span className="text-xs font-bold text-slate-500">{ev.student_number || "N/A"}</span>
                  </div>
                  <StatusBadge status={ev.status} />
                </div>
                <p className="text-xs text-slate-400">{new Date(ev.created_at).toLocaleDateString()}</p>
              </div>
            )}
          />
        )}

        {seen.length > 0 && (
          <Section title="Seen" color="#71717a" dotColor="bg-zinc-400" items={seen} onSelect={onSelect}
            renderItem={(ev) => (
              <div key={ev.id} onClick={() => onSelect?.(ev)} className="border border-slate-100 bg-white rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500">{ev.student_number || "N/A"}</span>
                  <StatusBadge status={ev.status} />
                </div>
                <p className="text-xs text-slate-400">{new Date(ev.created_at).toLocaleDateString()}</p>
              </div>
            )}
          />
        )}

        {pending.length === 0 && responded.length === 0 && seen.length === 0 && (
          <div className="text-slate-400 text-sm italic">No submissions yet.</div>
        )}
      </div>
    </div>
  );
}
