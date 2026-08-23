const MCQ_LOCAL_URL = "http://localhost:5000/api/MCQ";
const MCQ_PROD_URL = "https://kalingace-4.onrender.com/api/MCQ";

const SQA_LOCAL_URL = "http://localhost:5000/api/SQA";
const SQA_PROD_URL = "https://kalingace-4.onrender.com/api/SQA";

async function customFetch(baseUrl, urlPath, options = {}) {
  const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  if (isLocal) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${baseUrl}${urlPath}`, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      console.warn("Local backend port 5000 is not active or timed out. Falling back to Render URL.");
    }
  }
  const prodBase = baseUrl.includes("MCQ") ? MCQ_PROD_URL : SQA_PROD_URL;
  return fetch(`${prodBase}${urlPath}`, options);
}

// ==============================
// MCQ API CALLS
// ==============================
export const getMCQs = async () => {
  const response = await customFetch(MCQ_LOCAL_URL, "", { cache: "no-store" });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch MCQs");
  return result.data;
};

export const getMCQsByExam = async (examId) => {
  const response = await customFetch(MCQ_LOCAL_URL, `/exam/${examId}`, { cache: "no-store" });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch exam MCQs");
  return result.data;
};

export const createMCQ = async (mcqData) => {
  const response = await customFetch(MCQ_LOCAL_URL, "", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mcqData),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to create MCQ");
  return result;
};

export const createBulkMCQs = async (mcqList) => {
  const response = await customFetch(MCQ_LOCAL_URL, "/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mcqs: mcqList }),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to bulk create MCQs");
  return result;
};

export const updateMCQ = async (id, mcqData) => {
  const response = await customFetch(MCQ_LOCAL_URL, `/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mcqData),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to update MCQ");
  return result;
};

export const deleteMCQ = async (id) => {
  const response = await customFetch(MCQ_LOCAL_URL, `/${id}`, { method: "DELETE" });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to delete MCQ");
  return result;
};

// ==============================
// SQA API CALLS
// ==============================
export const getSQAs = async () => {
  const response = await customFetch(SQA_LOCAL_URL, "", { cache: "no-store" });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch SQAs");
  return result.data;
};

export const getSQAByExamId = async (examId) => {
  const response = await customFetch(SQA_LOCAL_URL, `/exam/${examId}`, { cache: "no-store" });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch SQA by Exam ID");
  return result.data;
};

export const createSQA = async (sqaData) => {
  const response = await customFetch(SQA_LOCAL_URL, "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sqaData),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to create SQA");
  return result;
};

export const updateSQA = async (id, sqaData) => {
  const response = await customFetch(SQA_LOCAL_URL, `/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sqaData),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to update SQA");
  return result;
};

export const deleteSQA = async (id) => {
  const response = await customFetch(SQA_LOCAL_URL, `/${id}`, { method: "DELETE" });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to delete SQA");
  return result;
};
