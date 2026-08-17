const API_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.startsWith("10.") ||
    window.location.hostname.startsWith("172."))
    ? "http://localhost:5000/api/MCQ"
    : "https://kalingace-4.onrender.com/api/MCQ";

// ==============================
// GET All Subjects
// ==============================
export const getSubjects = async () => {
  try {
    const response = await fetch(`${API_URL}/subjects/all`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch subjects");
    }

    return result.data;
  } catch (error) {
    console.error("Fetch Subjects Error:", error);
    throw error;
  }
};

// ==============================
// GET MCQs By Subject
// ==============================
export const getMCQsBySubject = async (subject) => {
  try {
    const encodedSubject = encodeURIComponent(subject);
    const response = await fetch(`${API_URL}/subject/${encodedSubject}`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch subject MCQs");
    }

    // Only return Active MCQs (just in case the backend returns inactive ones,
    // though the backend route filter handles it, this is a safe safeguard).
    return result.data.filter((mcq) => mcq.status === "Active");
  } catch (error) {
    console.error("Fetch Subject MCQs Error:", error);
    throw error;
  }
};
