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
      className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}
