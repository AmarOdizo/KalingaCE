import MCQClient from "./MCQClient";

export const metadata = {
  title: "Online MCQ Practice Test & Assessments | Kalinga Computer Education",
  description: "Test your computer knowledge with subject-wise multiple choice questions (MCQs) for DCA, PGDCA, programming languages, and IT basics. Check explanations instantly.",
  alternates: {
    canonical: "/learning/mcq",
  },
};

export default function MCQPage() {
  const assessmentSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "Online MCQ Practice Test | Kalinga Computer Education",
    "description": "Interactive multiple choice tests with instant answers and explanations for computer concepts, programming languages, and DCA/PGDCA syllabus.",
    "url": "https://kalingace.in/learning/mcq",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(assessmentSchema) }}
      />
      <MCQClient />
    </>
  );
}
