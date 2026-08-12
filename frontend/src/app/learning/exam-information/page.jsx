import ExamInfoClient from "./ExamInfoClient";

export const metadata = {
  title: "Upcoming Exams & Schedule",
  description: "Stay updated with the latest computer certification exam schedules, timetables, and evaluation information at Kalinga Computer Education.",
  alternates: {
    canonical: "/learning/exam-information",
  },
};

export default function ExamInformationPage() {
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Upcoming Exams & Schedule | Kalinga Computer Education",
    "description": "Stay updated with the latest exam timetables, schedules, upcoming computer certification tests, and results.",
    "url": "https://kalingacomputer.com/learning/exam-information"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <ExamInfoClient />
    </>
  );
}
