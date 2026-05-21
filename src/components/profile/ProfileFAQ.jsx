import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What is the Academic Evaluation System?", a: "The Academic Evaluation System (Student Clearance System) is a centralized platform for reviewing student academic records, evaluating clearance eligibility, and managing course progression for higher education institutions." },
  { q: "How does the student clearance workflow work?", a: "Evaluators search for a student record, review their grades and subject history, then submit an evaluation outcome with a clearance status. Administrators review all submitted evaluations in the Evaluator Evaluations panel for final processing." },
  { q: "What do the clearance statuses mean?", a: "Cleared (Green) — student meets all requirements and is cleared for enrollment. Flagged (Yellow) — student has minor issues requiring conditional enrollment. Not Cleared (Red) — student has unresolved deficiencies and cannot proceed." },
  { q: "How do I submit an evaluation?", a: "On the Evaluation Hub, search for a student by student number. Review their current subjects, grades, and prerequisite requirements, then submit your evaluation outcome with the appropriate clearance status." },
  { q: "What happens after I submit an evaluation?", a: "The evaluation is recorded and becomes visible to administrators in the Evaluator Evaluations panel. An admin reviews the outcome and can take further action as needed before enrollment is processed." },
  { q: "How do administrators review evaluations?", a: "Admins access the Evaluator Evaluations tab from the admin dashboard to view all submitted evaluations, filter by status, and oversee the clearance workflow." },
  { q: "How are students flagged as irregular?", a: "Students who exceed the configured irregular threshold (number of failed subjects) are automatically flagged as irregular and may require conditional clearance or remedial subject enrollment." },
  { q: "Can I modify a submitted evaluation?", a: "No. Once an evaluation is submitted, it cannot be edited or withdrawn. If changes are needed, contact an administrator to reject the evaluation so it can be resubmitted." },
  { q: "What roles and permissions are available?", a: "Administrators have full system access including configuration, user management, and evaluation oversight. Evaluators can review student records and submit clearance evaluations." },
  { q: "How do I update my profile?", a: "Click the Edit Profile button on your profile page to update your full name and email address. Use the Change Password option in the Security panel to update your password." },
];

export default function ProfileFAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="card p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-slate-500">Common questions about the Academic Evaluation System</p>
      </div>
      <div className="space-y-2">
        {FAQS.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div key={i} className="overflow-hidden rounded-lg border border-slate-100 bg-white transition-all">
              <button onClick={() => setOpenFaq(isOpen ? null : i)} className={`flex w-full items-center justify-between px-4 py-3 text-left transition ${isOpen ? "bg-slate-50" : "hover:bg-slate-50"}`}>
                <span className="pr-4 text-sm font-semibold text-slate-700">{faq.q}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-500">{faq.a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
