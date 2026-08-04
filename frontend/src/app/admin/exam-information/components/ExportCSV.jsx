"use client";

import { Download } from "lucide-react";

export default function ExportCSV({ exams }) {
  const exportCSV = () => {
    if (!exams || exams.length === 0) {
      alert("No data available.");
      return;
    }

    const headers = [
      "ID",
      "Exam Name",
      "Course",
      "Batch",
      "Exam Date",
      "Exam Time",
      "Duration",
      "Venue",
      "Status",
      "Description",
    ];

    const rows = exams.map((exam) => [
      exam.id,
      exam.examName,
      exam.course,
      Array.isArray(exam.batch) ? exam.batch.join(", ") : exam.batch,
      new Date(exam.examDate).toLocaleDateString(),
      exam.examTime,
      exam.duration,
      exam.venue,
      exam.status,
      exam.description || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((item) => `"${String(item ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "ExamInformation.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportCSV}
      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}
