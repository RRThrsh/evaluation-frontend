import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What is this system?", a: "The Academic Evaluation System determines whether a student is cleared to proceed to the next semester. It checks grades, prerequisites, and prior failures, then recommends a qualified/conditional/disqualified status." },
  { q: "What are the user roles?", a: "Superadmin — unrestricted system access. Admin — granular permission-based access to all management panels. Evaluator — reviews student records and submits clearance evaluations for their assigned courses." },
  { q: "How does the evaluation workflow work?", a: "An evaluator searches for a student, reviews their grades and prerequisite status, then submits a PENDING evaluation. An admin reviews the evaluation in the Pre-Enrolled panel and promotes it to PRE_ENROLLED, which stores a snapshot. Later the admin can finalize enrollment." },
  { q: "What do the evaluation statuses mean?", a: "PENDING — submitted by evaluator, awaiting admin review. PRE_ENROLLED — admin approved, subjects planned. FOR_ENROLLMENT — ready for enrollment. ENROLLED / IRREGULAR_ENROLLED — student is enrolled." },
  { q: "What does the qualification status mean?", a: "Qualified — all subjects passed, no blockers. Conditional — some current semester failures but can proceed with retakes. Disqualified — unresolved prior failures or failed prerequisites block progression." },
  { q: "What does INC mean?", a: "INC (Incomplete) means a student subject has no recorded grade. INC is not counted as a failure and does not block prerequisite progression. The system notes it as an ongoing subject." },
  { q: "How are students flagged as irregular?", a: "Students with more than the configured threshold of failed subjects (default: 1) are automatically flagged as irregular, which may require conditional clearance or remedial enrollment." },
  { q: "How do prerequisites work?", a: "Subjects can have a prerequisite. If the prerequisite is failed, that subject is blocked for the next semester. INC in a prerequisite is treated as met — only a FAIL blocks. The system automatically suggests gap-filler minor subjects when prerequisites block a subject." },
  { q: "Can a submitted evaluation be modified?", a: "No. Once an evaluation is submitted, it cannot be edited or withdrawn. If changes are needed, contact an administrator to delete the evaluation so it can be resubmitted." },
  { q: "How do I update my profile?", a: "Click the Edit Profile button on your profile page to update your full name and email address. Use the Change Password option to update your password." },
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
