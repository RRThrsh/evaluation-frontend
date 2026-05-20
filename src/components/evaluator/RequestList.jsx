import { useState } from "react";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 10;

export function RequestSection({ title, dotColor, requests, onOpen }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const paginated = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {title}
        <span className="text-xs text-zinc-400 font-normal normal-case">({requests.length})</span>
      </h2>
      {requests.length > 0 ? (
        <div className="bg-white border rounded-xl shadow-sm divide-y">
          {paginated.map((req, i) => (
            <div key={req.id ?? i} onClick={() => onOpen(req)} className="p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-50 transition">
              <div>
                <div className="flex gap-2 items-center">
                  <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                    req.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    req.status === "APPROVED" || req.status === "ENROLLED" || req.status === "IRREGULAR_ENROLLED" ? "bg-emerald-100 text-emerald-700" :
                    req.status === "FOR_ENROLLMENT" ? "bg-blue-100 text-blue-700" :
                    req.status === "IRREGULAR" ? "bg-purple-100 text-purple-700" :
                    "bg-rose-100 text-rose-600"
                  }`}>{req.status}</span>
                  {req.evaluation_result?.overall && (
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                      ["qualified", "conditional"].includes(req.evaluation_result.overall) ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}>{req.evaluation_result.overall}</span>
                  )}
                </div>
                <p className="text-sm text-zinc-700 mt-1">{req.student_number || "N/A"} — {req.reason ?? req.type}</p>
                {req.course_name && <p className="text-xs text-zinc-400 mt-0.5">{req.course_code || req.course_name}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">{new Date(req.created_at).toLocaleDateString()}</span>
                <span className="text-xs text-blue-500 font-medium ml-2">Click to evaluate →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm p-8 text-center text-zinc-400 text-sm">No requests.</div>
      )}
      {requests.length > PAGE_SIZE && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}

export default function RequestList({ pending, reviewed, onOpen }) {
  return (
    <div className="space-y-8">
      <RequestSection title="New Requests" dotColor="bg-yellow-400" requests={pending} onOpen={onOpen} />
      <RequestSection title="Reviewed" dotColor="bg-zinc-400" requests={reviewed} onOpen={onOpen} />
    </div>
  );
}
