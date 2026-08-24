import { Suspense } from "react";
import ResultClient from "./ResultClient";

export const metadata = {
  title: "Exam Results | Kalinga Computer Education",
  description: "Access and review your computer certification exam results, detailed scorecard, and answer keys.",
  alternates: {
    canonical: "/learning/result",
  },
};

export default function ResultPage() {
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Exam Results Lookup | Kalinga Computer Education",
    "description": "Access and review your computer certification exam results, detailed scorecard, and answer keys.",
    "url": "https://kalingacomputer.com/learning/result"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <Suspense fallback={
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-4" />
          <p className="font-semibold text-sm">Loading Results Dashboard...</p>
        </div>
      }>
        <ResultClient />
      </Suspense>
    </>
  );
}
