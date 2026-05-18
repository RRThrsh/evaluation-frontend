export default function EvaluationReport({ evalData }) {
  if (!evalData) return null;
  const { student, summary, current_semester_subjects, next_semester_subjects, unresolved_failed_subjects, retake_subjects, prerequisite_checks, recommendations, overall } = evalData;

  const badgeColor = overall === "qualified" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : overall === "conditional" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
    : "bg-red-50 text-red-700 border-red-200";

  const statusColor = (status) =>
    ({ enrolled: "bg-blue-50 text-blue-700", passed: "bg-emerald-50 text-emerald-700", failed: "bg-red-50 text-red-700", pending: "bg-zinc-50 text-zinc-500" }[status] || "bg-zinc-50 text-zinc-500");

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-lg border ${badgeColor}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold uppercase text-sm">{overall}</span>
        </div>
      </div>

      {student && (
        <div className="bg-zinc-50 border rounded-lg p-3 text-xs grid grid-cols-2 gap-1">
          <div><span className="font-medium">Student:</span> {student.full_name}</div>
          <div><span className="font-medium">Number:</span> {student.student_number}</div>
          <div><span className="font-medium">Course:</span> {student.course}</div>
          <div><span className="font-medium">Year:</span> {student.year_level} — Sem {student.current_semester}</div>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Enrolled", value: summary.current_enrolled, color: "bg-blue-50 text-blue-700" },
            { label: "Passed", value: summary.passed, color: "bg-emerald-50 text-emerald-700" },
            { label: "Failed", value: summary.current_failed, color: "bg-red-50 text-red-700" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} border rounded-lg p-2 text-center`}>
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {current_semester_subjects?.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Current Semester Subjects</h4>
          <div className="divide-y border rounded-lg text-xs max-h-48 overflow-y-auto">
            {current_semester_subjects.map((cs, i) => (
              <div key={i} className={`p-2 flex justify-between items-center ${statusColor(cs.status)}`}>
                <div>
                  <span className="font-medium">{cs.subject_code}</span>
                  <span className="text-zinc-400 ml-1">{cs.subject_name} ({cs.subject_type})</span>
                </div>
                <div className="flex items-center gap-2">
                  {cs.grade && <span className="font-bold">{cs.grade}</span>}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    cs.status === "passed" ? "bg-emerald-200 text-emerald-800" :
                    cs.status === "failed" ? "bg-red-200 text-red-800" :
                    cs.status === "enrolled" ? "bg-blue-200 text-blue-800" : "bg-zinc-200 text-zinc-600"
                  }`}>{cs.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unresolved_failed_subjects?.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-red-600 mb-1 uppercase">Unresolved Fails — Not Offered Next Semester</h4>
          <div className="divide-y border border-red-200 rounded-lg text-xs">
            {unresolved_failed_subjects.map((fs, i) => (
              <div key={i} className="p-2 flex justify-between bg-red-50">
                <span className="font-medium">{fs.subject_code} — {fs.subject_name}</span>
                <span className="text-red-600 font-bold">{fs.grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {retake_subjects?.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-amber-600 mb-1 uppercase">Retake Subjects (Next Semester)</h4>
          <div className="divide-y border border-amber-200 rounded-lg text-xs">
            {retake_subjects.map((rs, i) => (
              <div key={i} className="p-2 flex justify-between bg-amber-50">
                <span className="font-medium">{rs.subject_code} — {rs.subject_name}</span>
                <span className="text-amber-600 font-bold">{rs.grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {next_semester_subjects?.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Next Semester Subjects</h4>
          <div className="divide-y border rounded-lg text-xs">
            {next_semester_subjects.map((ns, i) => (
              <div key={i} className={`p-2 flex justify-between items-center ${ns.is_retake ? "bg-amber-50" : ""}`}>
                <div>
                  <span className="font-medium">{ns.subject_code}</span>
                  <span className="text-zinc-400 ml-1">({ns.subject_type})</span>
                  {ns.prerequisite && <span className="text-zinc-400 ml-1">prereq: {ns.prerequisite}</span>}
                  {ns.is_retake && <span className="text-amber-600 ml-1 font-bold">[RETAKE]</span>}
                </div>
                {ns.prerequisite && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    ns.prereq_failed ? "bg-red-100 text-red-700" : ns.prereq_met ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{ns.prereq_failed ? "FAILED" : ns.prereq_met ? "OK" : "PENDING"}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {prerequisite_checks?.length > 0 && (
        <div>
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Prerequisite Checks</h4>
          <div className="divide-y border rounded-lg text-xs">
            {prerequisite_checks.map((pc, i) => (
              <div key={i} className="p-2 flex justify-between">
                <span>{pc.subject_code} → {pc.prereq_code}</span>
                <span className={`font-bold ${pc.prereq_failed ? "text-red-600" : pc.prereq_met ? "text-emerald-600" : "text-yellow-600"}`}>
                  {pc.prereq_failed ? "FAILED" : pc.prereq_met ? "MET" : "PENDING"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations?.length > 0 && (
        <div className="bg-zinc-50 border rounded-lg p-3">
          <h4 className="font-bold text-xs text-zinc-600 mb-1 uppercase">Recommendations</h4>
          <ul className="space-y-0.5 text-xs">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-1"><span className="text-zinc-400">•</span><span>{r}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
