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
      return "bg-green-100 text-green-700";

    case "Closed":
      return "bg-red-100 text-red-700";

    case "Coming Soon":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-700";
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
