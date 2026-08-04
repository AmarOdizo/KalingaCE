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
      Array.isArray(exam.batch) ? exam.batch.join("; ") : exam.batch,
      new Date(exam.examDate).toLocaleDateString(),
      exam.examTime,
      exam.duration,
      exam.venue,
      exam.status,
      exam.description || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((item) => `"${String(item ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

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
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/20 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200 hover:bg-emerald-600 hover:text-white dark:border-emerald-900/40 dark:bg-emerald-950/10 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white active:scale-95 cursor-pointer"
    >
      <Download size={16} />
      Export CSV
    </button>
  );
}
