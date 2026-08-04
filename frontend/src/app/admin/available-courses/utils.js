// ==========================
// Format Fees
// ==========================
export const formatFees = (fees) => {
  if (!fees) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(fees);
};

// ==========================
// Status Color
// ==========================
export const getStatusColor = (status) => {
  switch (status) {
    case "Admission Open":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-450";

    case "Closed":
      return "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400";

    case "Coming Soon":
      return "bg-amber-55/70 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400";

    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-350";
  }
};

// ==========================
// Image Placeholder
// ==========================
export const imagePlaceholder = "/images/course-placeholder.png";

// ==========================
// Course Image
// ==========================
export const getCourseImage = (image) => {
  if (!image || image.trim() === "") {
    return imagePlaceholder;
  }

  return image;
};

// ==========================
// Duration
// ==========================
export const formatDuration = (duration) => {
  return duration || "N/A";
};

// ==========================
// Students
// ==========================
export const formatStudents = (students) => {
  return `${students || 0}+ Students`;
};
