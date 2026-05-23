import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const FAQS = [
  {
    q: "What is this system?",
    a: "The Academic Evaluation System determines whether a student is cleared to proceed to the next semester. It checks grades, prerequisites, and prior failures, then recommends a qualified, conditional, or disqualified status.",
  },
  {
    q: "What are the user roles?",
    a: "Superadmin has unrestricted system access. Admin has permission-based access to management panels. Evaluator reviews student records and submits clearance evaluations for assigned courses.",
  },
  {
    q: "How does the evaluation workflow work?",
    a: "An evaluator searches for a student, reviews grades and prerequisites, then submits a pending evaluation. An admin reviews it in the Pre-Enrolled panel and promotes it to PRE_ENROLLED for enrollment processing.",
  },
  {
    q: "What do the evaluation statuses mean?",
    a: "PENDING means awaiting admin review. PRE_ENROLLED means approved and planned. FOR_ENROLLMENT means ready for enrollment. ENROLLED and IRREGULAR_ENROLLED indicate finalized enrollment states.",
  },
  {
    q: "What does the qualification status mean?",
    a: "Qualified means no blockers. Conditional means progression is allowed with retakes. Disqualified means unresolved failures or prerequisites prevent progression.",
  },
  {
    q: "What does INC mean?",
    a: "INC or Incomplete means no final grade has been recorded. INC does not count as a failed subject and does not block prerequisite progression.",
  },
  {
    q: "How are students flagged as irregular?",
    a: "Students exceeding the configured failed-subject threshold are automatically marked as irregular and may require remedial enrollment.",
  },
  {
    q: "How do prerequisites work?",
    a: "Failed prerequisites block dependent subjects. INC is treated as ongoing and does not block progression. The system may suggest gap-filler subjects automatically.",
  },
  {
    q: "Can a submitted evaluation be modified?",
    a: "No. Submitted evaluations cannot be edited or withdrawn. Contact an administrator if changes are required.",
  },
  {
    q: "How do I update my profile?",
    a: "Use the Edit Profile button to update your name and email. Use Change Password to update account credentials securely.",
  },
];

export default function ProfileFAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Common questions about the Academic Evaluation System.
          </p>
        </div>

        <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
          <Sparkles size={18} />
        </div>
      </div>

      {/* FAQ List */}
      <div className="divide-y divide-slate-100">
        {FAQS.map((faq, i) => {
          const isOpen = openFaq === i;

          return (
            <div
              key={i}
              className="group transition-all duration-300"
            >
              <button
                onClick={() =>
                  setOpenFaq(isOpen ? null : i)
                }
                className={`flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-all duration-300 ${
                  isOpen
                    ? "bg-slate-50"
                    : "hover:bg-slate-50/70"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                      isOpen
                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}
                  >
                    <HelpCircle size={18} />
                  </div>

                  {/* Question */}
                  <div>
                    <h3
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        isOpen
                          ? "text-slate-900"
                          : "text-slate-700"
                      }`}
                    >
                      {faq.q}
                    </h3>

                    {!isOpen && (
                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                        Click to view answer
                      </p>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <div
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                    isOpen
                      ? "rotate-180 bg-slate-200 text-slate-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {/* Answer */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-5">
                    <div className="pl-14">
                      <p className="text-sm leading-7 text-slate-600">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}