// ==============================
// Format Date
// ==============================
export const formatDate = (date) => {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

// ==============================
// Short Text
// ==============================
export const truncateText = (text = "", length = 50) => {
  if (!text) return "";

  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// ==============================
// Status Color
// ==============================
export const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    case "Inactive":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

// ==============================
// Download PDF
// ==============================
export const downloadPDF = (url) => {
  if (!url) return;

  window.open(url, "_blank", "noopener,noreferrer");
};

// ==============================
// Form Validation
// ==============================
export const validateNote = (data) => {
  if (!data.subjectName?.trim()) return "Subject Name is required";

  if (!data.noteTitle?.trim()) return "Note Title is required";

  if (!data.thumbnail?.url) return "Thumbnail is required";

  if (!data.pdf?.url) return "PDF is required";

  if (!data.uploadedBy?.trim()) return "Uploaded By is required";

  return null;
};
