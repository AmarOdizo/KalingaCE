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
    <section className="bg-gray-100 py-16 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            ❓ Frequently Asked Questions
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Find answers to the most common questions about our courses.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>

                {openIndex === index ? (
                  <ChevronUp className="text-blue-600" />
                ) : (
                  <ChevronDown className="text-blue-600" />
                )}
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
