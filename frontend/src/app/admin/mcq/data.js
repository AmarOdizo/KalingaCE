const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api/MCQ"
    : "https://kalingace-4.onrender.com/api/MCQ";

// ==============================
// GET All MCQs
// ==============================
export const getMCQs = async () => {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch MCQs");
  }

  return result.data;
};

// ==============================
// GET Single MCQ By ID (Mongoose/Seq ID)
// ==============================
export const getMCQById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch MCQ");
  }

  return result.data;
};

// ==============================
// GET MCQs By Subject
// ==============================
export const getMCQsBySubject = async (subject) => {
  const encodedSubject = encodeURIComponent(subject);
  const response = await fetch(`${API_URL}/subject/${encodedSubject}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch subject MCQs");
  }

  return result.data;
};

// ==============================
// GET All Subjects
// ==============================
export const getSubjects = async () => {
  const response = await fetch(`${API_URL}/subjects/all`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch subjects");
  }

  return result.data;
};

// ==============================
// CREATE MCQ
// ==============================
export const createMCQ = async (mcqData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mcqData),
  });

  return await response.json();
};

// ==============================
// UPDATE MCQ
// ==============================
export const updateMCQ = async (id, mcqData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mcqData),
  });

  return await response.json();
};

// ==============================
// DELETE MCQ
// ==============================
export const deleteMCQ = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return await response.json();
};
