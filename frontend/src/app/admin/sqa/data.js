const LOCAL_URL = "http://localhost:5000/api/SQA";
const PROD_URL = "https://kalingace-4.onrender.com/api/SQA";

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
// GET All SQAs
// ==============================
export const getSQAs = async () => {
  const response = await customFetch("", {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch SQAs");
  }

  return result.data;
};

// ==============================
// GET Single SQA By ID
// ==============================
export const getSQAById = async (id) => {
  const response = await customFetch(`/${id}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch SQA");
  }

  return result.data;
};

// ==============================
// GET SQA By Exam ID
// ==============================
export const getSQAByExamId = async (examId) => {
  const response = await customFetch(`/exam/${examId}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch SQA by Exam ID");
  }

  return result.data;
};

// ==============================
// CREATE SQA
// ==============================
export const createSQA = async (sqaData) => {
  const response = await customFetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sqaData),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to create SQA");
  }

  return result;
};

// ==============================
// UPDATE SQA
// ==============================
export const updateSQA = async (id, sqaData) => {
  const response = await customFetch(`/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sqaData),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to update SQA");
  }

  return result;
};

// ==============================
// DELETE SQA
// ==============================
export const deleteSQA = async (id) => {
  const response = await customFetch(`/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to delete SQA");
  }

  return result;
};

// ==============================
// EVALUATE/CHECK STUDENT ANSWER
// ==============================
export const checkAnswer = async (id, answerId, checkData) => {
  const response = await customFetch(`/${id}/check-answer/${answerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkData),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to check answer");
  }

  return result;
};
