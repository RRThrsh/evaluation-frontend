import { useState } from "react";
import SvgIcon from "../common/SvgIcon";

const FAQS = [
  { q: "What is the Evaluation System?", a: "The Evaluation System allows staff to submit student evaluation requests, moderators to review them, and administrators to oversee the entire workflow." },
  { q: "How do I submit an evaluation request?", a: "Staff members can submit an evaluation by entering the student number on the Staff Dashboard." },
  { q: "What happens after I submit?", a: "Once submitted, the request enters a Pending state for moderator review." },
  { q: "Can I delete my evaluation request?", a: "No, submitted requests cannot be deleted or withdrawn." },
  { q: "Who can review evaluations?", a: "Only moderators can review evaluation requests." },
  { q: "What roles are available?", a: "User, Staff, Moderator, and Admin roles are supported." },
];

export default function ProfileFAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-slate-500">Common questions about the Evaluation System</p>
      </div>
      <div className="space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all">
              <button onClick={() => setOpenFaq(isOpen ? null : i)}
                className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${isOpen ? "bg-slate-50" : "hover:bg-slate-50"}`}>
                <span className="pr-5 text-sm font-semibold text-slate-700">{faq.q}</span>
                <SvgIcon path="M19 9l-7 7-7-7" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-500">{faq.a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
