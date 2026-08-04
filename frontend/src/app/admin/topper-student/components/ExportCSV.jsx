"use client";

import { Download } from "lucide-react";

export default function ExportCSV({ students }) {
  const exportCSV = () => {
    if (!students.length) {
      alert("No data found");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Subject",
      "Batch",
      "Total Mark",
      "Gain Mark",
      "Percentage",
      "Grade",
    ];

    const rows = students.map((student) => {
      const percentage = ((student.gainMark / student.totalMark) * 100).toFixed(
        2,
      );

      let grade = "Fail";

      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B+";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";

      return [
        student.id,
        student.name,
        student.subject,
        student.batch,
        student.totalMark,
        student.gainMark,
        percentage + "%",
        grade,
      ];
    });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "TopperStudent.csv";

    link.click();

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
