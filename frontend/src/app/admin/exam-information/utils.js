// ==============================
// Format Date
// ==============================
export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==============================
// Status Color
// ==============================
export const getStatusColor = (status) => {
  switch (status) {
    case "Upcoming":
      return "bg-blue-100 text-blue-700";

    case "Ongoing":
      return "bg-green-100 text-green-700";

    case "Completed":
      return "bg-gray-200 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ==============================
// Format Batch
// ==============================
export const formatBatch = (batch) => {
  if (!batch) return "-";

  return Array.isArray(batch) ? batch.join(", ") : batch;
};

// ==============================
// Search Filter
// ==============================
export const filterExamInformation = (data, search) => {
  if (!search) return data;

  const keyword = search.toLowerCase();

  return data.filter((item) => {
    return (
      item.examName?.toLowerCase().includes(keyword) ||
      item.course?.toLowerCase().includes(keyword) ||
      item.venue?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword)
    );
  });
};
