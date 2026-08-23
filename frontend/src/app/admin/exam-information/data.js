const LOCAL_URL = "http://localhost:5000/api/ExamInfo";
const PROD_URL = "https://kalingace-4.onrender.com/api/ExamInfo";

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
// GET All Exam Information
// ==============================
export const getExamInformation = async () => {
  const response = await customFetch("");

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};

// ==============================
// GET Exam Information By ID
// ==============================
export const getExamInformationById = async (id) => {
  const response = await customFetch(`/${id}`);

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};

// ==============================
// CREATE Exam Information
// ==============================
export const createExamInformation = async (formData) => {
  const response = await customFetch("", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

// ==============================
// UPDATE Exam Information
// ==============================
export const updateExamInformation = async (id, formData) => {
  const response = await customFetch(`/${id}`, {
    method: "PUT",
    body: formData,
  });

  return await response.json();
};

// ==============================
// DELETE Exam Information
// ==============================
export const deleteExamInformation = async (id) => {
  const response = await customFetch(`/${id}`, {
    method: "DELETE",
  });

  return await response.json();
};

// ==============================
// Upload Exam Image
// ==============================
export const uploadExamImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await customFetch("/upload", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

// ==============================
// MCQ API INTEGRATION
// ==============================
const MCQ_LOCAL_URL = "http://localhost:5000/api/MCQ";
const MCQ_PROD_URL = "https://kalingace-4.onrender.com/api/MCQ";

async function customMCQFetch(urlPath, options = {}) {
  const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  if (isLocal) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${MCQ_LOCAL_URL}${urlPath}`, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      console.warn("Local backend port 5000 is not active or timed out. Falling back to Render URL.");
    }
  }
  return fetch(`${MCQ_PROD_URL}${urlPath}`, options);
}

export const getMCQs = async () => {
  const response = await customMCQFetch("", {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch MCQs");
  }

  return result.data;
};

export const createMCQ = async (mcqData) => {
  const response = await customMCQFetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mcqData),
  });

  return await response.json();
};

export const updateMCQ = async (id, mcqData) => {
  const response = await customMCQFetch(`/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mcqData),
  });

  return await response.json();
};

export const deleteMCQ = async (id) => {
  const response = await customMCQFetch(`/${id}`, {
    method: "DELETE",
  });

  return await response.json();
};

export const createBulkMCQs = async (mcqList) => {
  const response = await customMCQFetch("/bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mcqs: mcqList }),
  });

  return await response.json();
};

// ==============================
// SQA API INTEGRATION
// ==============================
const SQA_LOCAL_URL = "http://localhost:5000/api/SQA";
const SQA_PROD_URL = "https://kalingace-4.onrender.com/api/SQA";

async function customSQAFetch(urlPath, options = {}) {
  const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  if (isLocal) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${SQA_LOCAL_URL}${urlPath}`, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      console.warn("Local backend port 5000 is not active. Falling back to Render URL.");
    }
  }
  return fetch(`${SQA_PROD_URL}${urlPath}`, options);
}

export const getSQAs = async () => {
  const response = await customSQAFetch("", {
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch SQAs");
  }

  return result.data;
};
