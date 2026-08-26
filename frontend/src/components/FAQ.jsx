"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Who can join these courses?",
    answer:
      "Anyone can join. Whether you are a beginner, student, or working professional, our courses are designed for all skill levels.",
  },
  {
    question: "Will I get a certificate after completing the course?",
    answer:
      "Yes, you will receive a course completion certificate after successfully finishing the program.",
  },
  {
    question: "Are the classes live or recorded?",
    answer:
      "We provide both live interactive classes and recorded lectures for flexible learning.",
  },
  {
    question: "Do you provide placement support?",
    answer:
      "Yes. We provide interview preparation, resume building, mock interviews, and placement assistance.",
  },
  {
    question: "Can I access the course on mobile?",
    answer:
      "Yes. You can access all course content on mobile, tablet, laptop, and desktop.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact us through our Contact page, email, or WhatsApp support anytime.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-24 dark:from-slate-900 dark:to-slate-950 border-t border-slate-100 dark:border-slate-800/40">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Header Section */}
        <div className="mb-16 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 uppercase tracking-widest">
            FAQ Helpdesk
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Find answers to the most common questions about our computer education courses and certifications.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all duration-350 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md
                  ${
                    isOpen
                      ? "border-indigo-200 shadow-md dark:border-indigo-950/60 ring-2 ring-indigo-500/5"
                      : "border-slate-200/60 shadow-premium dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.005] duration-200"
                  }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <HelpCircle size={18} className={`shrink-0 transition-colors duration-250 ${
                      isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-indigo-500"
                    }`} />
                    <h3 className={`text-sm font-extrabold leading-tight transition-colors duration-250 ${
                      isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                    }`}>
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-1.5 transition-all duration-300 shrink-0 ${
                    isOpen 
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rotate-180" 
                      : "text-slate-400 bg-slate-50 dark:bg-slate-800 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}>
                    <ChevronDown size={15} />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-350 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-xs text-slate-500 dark:text-slate-300 leading-relaxed pl-12 border-t border-slate-100/50 dark:border-slate-800/40 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
