"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
    <section className="bg-gradient-to-b from-white to-slate-100 py-20 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            ❓ <span className="gradient-text">Frequently Asked Questions</span>
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Find answers to the most common questions about our computer education courses.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 bg-white dark:bg-slate-900/60
                  ${
                    isOpen
                      ? "border-primary-500/80 shadow-md ring-4 ring-primary-500/5 dark:border-primary-500/50"
                      : "border-slate-200/80 shadow-premium dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left cursor-pointer"
                >
                  <h3 className="text-md font-extrabold text-slate-800 dark:text-white md:text-lg">
                    {faq.question}
                  </h3>

                  <div className={`rounded-xl p-1.5 transition-colors ${isOpen ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400" : "text-slate-400"}`}>
                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base border-t border-slate-50/50 pt-2.5 dark:border-slate-800/30">
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
