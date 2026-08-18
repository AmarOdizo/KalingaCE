const LOCAL_URL = "http://localhost:5000/api/MCQ";
const PROD_URL = "https://kalingace-4.onrender.com/api/MCQ";

async function customFetch(urlPath, options = {}) {
  const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  if (isLocal) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${LOCAL_URL}${urlPath}`, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      console.warn("Local backend port 5000 is not active or timed out. Falling back to Render URL.");
    }
  }
  return fetch(`${PROD_URL}${urlPath}`, options);
}

// ==============================
// GET All MCQs
// ==============================
export const getMCQs = async () => {
  const response = await customFetch("", {
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
  const response = await customFetch(`/${id}`, {
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
  const response = await customFetch(`/subject/${encodedSubject}`, {
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
  const response = await customFetch("/subjects/all", {
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
  const response = await customFetch("", {
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
  const response = await customFetch(`/${id}`, {
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
  const response = await customFetch(`/${id}`, {
    method: "DELETE",
  });

  return await response.json();
};

// ==============================
// CREATE BULK MCQS
// ==============================
export const createBulkMCQs = async (mcqList) => {
  const response = await customFetch("/bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mcqs: mcqList }),
  });

  return await response.json();
};
