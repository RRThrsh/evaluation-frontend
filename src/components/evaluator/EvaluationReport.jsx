const badgeColor = (overall) =>
  overall === "qualified"
    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
    : overall === "conditional"
    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
    : "bg-red-100 text-red-700 border-red-300";

const decisionColor = (decision) =>
  decision === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";

const statusColor = (status) =>
  ({ inc: "bg-yellow-50", passed: "bg-emerald-50", failed: "bg-red-50", pending: "bg-zinc-50" }[status] || "bg-zinc-50");

const gradeBadge = (grade) =>
  grade
    ? "text-xs font-bold px-2 py-0.5 rounded uppercase bg-emerald-200 text-emerald-800"
    : "text-xs font-bold px-2 py-0.5 rounded uppercase bg-yellow-200 text-yellow-800";

function PrereqBadge({ prereq_failed, prereq_met }) {
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded ${
      prereq_failed ? "bg-red-100 text-red-700" : prereq_met ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
    }`}>
      {prereq_failed ? "FAILED" : prereq_met ? "OK" : "PENDING"}
    </span>
  );
}

import { memo } from "react";

export default memo(function EvaluationReport({ evaluation }) {
  if (!evaluation) return null;
  const { student, summary, current_semester_subjects, next_semester_subjects, failed_subjects, unresolved_failed_subjects, retake_subjects, prerequisite_checks, recommendations, overall, decision, is_regular, is_irregular_candidate, is_graduating_candidate, graduation } = evaluation;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-zinc-800">Evaluation Report — {student?.full_name}</h2>
      </div>

      {student && (
        <div className="bg-zinc-50 border rounded-lg p-4 text-sm grid grid-cols-2 gap-2">
          <div><span className="font-medium">Student:</span> {student.full_name}</div>
          <div><span className="font-medium">Number:</span> {student.student_number}</div>
          <div><span className="font-medium">Course:</span> {student.course}</div>
          <div><span className="font-medium">Year:</span> {student.year_level} — Semester {student.current_semester}</div>
        </div>
      )}

      <div className={`p-4 rounded-lg border ${badgeColor(overall)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg uppercase">{overall}</span>
            {is_regular && <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-300">Regular</span>}
            {is_irregular_candidate && <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700 border border-purple-300">Irregular Candidate</span>}
          </div>
          {decision && <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${decisionColor(decision)}`}>{decision}</span>}
        </div>
      </div>

      {is_graduating_candidate && graduation && !graduation.can_graduate && graduation.blocking_subjects?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-red-600 font-bold text-sm shrink-0 mt-0.5">!</span>
          <div>
            <p className="text-xs font-semibold text-red-700">Cannot Graduate</p>
            <p className="text-xs text-red-600 mt-0.5">
              Student has {graduation.blocking_subjects.length} failed subject(s) with no retake path.
              Must repeat {graduation.repeat_semesters?.length === 2 ? "full 4th year" : `Y4S${graduation.repeat_semesters?.[0]}`} to retake: {graduation.blocking_subjects.map((s) => s.subject_code).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Current Semester */}
      <div className="border-l-4 border-blue-500 pl-3">
        <h3 className="font-bold text-sm text-blue-600 mb-2 uppercase tracking-wide">Current Semester — Subjects Taken</h3>
      </div>
      {current_semester_subjects?.length > 0 ? (
        <div className="divide-y border rounded-lg text-sm">
          {current_semester_subjects.map((cs, i) => (
            <div key={i} className={`p-3 flex justify-between items-center transition hover:brightness-90 ${cs.grade ? "bg-emerald-50" : "bg-yellow-50"}`}>
              <div>
                <span className="font-medium">{cs.subject_code}</span>
                <span className="text-zinc-400 ml-1">{cs.subject_name} ({cs.subject_type})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={gradeBadge(cs.grade)}>{cs.grade || "INC"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-sm text-zinc-400 italic p-3 bg-zinc-50 rounded-lg">No current semester subjects</div>}

      {/* Next Semester */}
      <div className="border-l-4 border-emerald-500 pl-3 mt-6">
        <h3 className="font-bold text-sm text-emerald-600 mb-2 uppercase tracking-wide">Next Semester — Subjects to Take</h3>
      </div>
      {next_semester_subjects?.length > 0 ? (
        <div className="divide-y border rounded-lg text-sm">
          {next_semester_subjects.map((ns, i) => (
            <div key={i} className={`p-3 flex items-center justify-between transition hover:brightness-90 ${ns.is_retake ? "bg-amber-50" : ""}`}>
              <div>
                <span className="font-medium">{ns.subject_code}</span>
                <span className="text-zinc-400 text-xs ml-2">({ns.subject_type})</span>
                {ns.prerequisite && <span className="text-zinc-400 text-xs ml-2">prereq: {ns.prerequisite}</span>}
                {ns.is_retake && <span className="text-amber-600 text-xs ml-2 font-bold">[RETAKE]</span>}
              </div>
              {ns.prerequisite && <PrereqBadge prereq_failed={ns.prereq_failed} prereq_met={ns.prereq_met} />}
            </div>
          ))}
        </div>
      ) : <div className="text-sm text-zinc-400 italic p-3 bg-zinc-50 rounded-lg">No next semester subjects</div>}

      {/* Failed / Retakes */}
      {(unresolved_failed_subjects?.length > 0 || retake_subjects?.length > 0) && (
        <>
          <div className="border-l-4 border-red-500 pl-3 mt-6">
            <h3 className="font-bold text-sm text-red-600 mb-2 uppercase tracking-wide">Failed Subjects — Needs to Retake</h3>
          </div>
          <div className="divide-y border border-red-200 rounded-lg text-sm">
            {retake_subjects?.map((rs, i) => (
              <div key={`retake-${i}`} className="p-3 flex justify-between bg-amber-50 transition hover:brightness-90">
                <div><span className="font-medium">{rs.subject_code} — {rs.subject_name}</span><span className="text-amber-600 text-xs ml-2 font-bold">[OFFERED NEXT SEM]</span></div>
                <span className="text-amber-600 font-bold">{rs.grade}</span>
              </div>
            ))}
            {unresolved_failed_subjects?.map((fs, i) => (
              <div key={`unresolved-${i}`} className="p-3 flex justify-between bg-red-50 transition hover:brightness-90">
                <div><span className="font-medium">{fs.subject_code} — {fs.subject_name}</span><span className="text-red-600 text-xs ml-2 font-bold">[NOT OFFERED NEXT SEM]</span></div>
                <span className="text-red-600 font-bold">{fs.grade}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {failed_subjects?.length > 0 && (
        <div>
          <div className="border-l-4 border-orange-500 pl-3 mt-6">
            <h3 className="font-bold text-sm text-orange-600 mb-2 uppercase tracking-wide">Current Semester Fails — Needs to Retake</h3>
          </div>
          <div className="divide-y border border-orange-200 rounded-lg text-sm">
            {failed_subjects.map((fs, i) => (
              <div key={i} className="p-3 flex justify-between bg-orange-50 transition hover:brightness-90">
                <span className="font-medium">{fs.subject_code} — {fs.subject_name}</span>
                <span className="text-orange-600 font-bold">{fs.grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {prerequisite_checks?.length > 0 && (
        <div className="mt-6">
          <div className="border-l-4 border-zinc-500 pl-3">
            <h3 className="font-bold text-sm text-zinc-600 mb-2 uppercase tracking-wide">Prerequisite Checks</h3>
          </div>
          <div className="divide-y border rounded-lg text-sm">
            {prerequisite_checks.map((pc, i) => (
              <div key={i} className="p-3 flex items-center justify-between transition hover:brightness-90">
                <div><span className="font-medium">{pc.subject_code}</span><span className="text-zinc-400 mx-1">→</span><span>prerequisite: {pc.prereq_code}</span></div>
                <PrereqBadge prereq_failed={pc.prereq_failed} prereq_met={pc.prereq_met} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
