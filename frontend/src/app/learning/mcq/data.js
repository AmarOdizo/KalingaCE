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

// ==============================
// GET Exam By ID
// ==============================
export const getExamById = async (examId) => {
  try {
    const baseUrl = API_URL.replace("/api/MCQ", "/api/ExamInfo");
    const response = await fetch(`${baseUrl}/${examId}`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch exam details");
    }

    return result.data;
  } catch (error) {
    console.error("Fetch Exam By ID Error:", error);
    throw error;
  }
};

// ==============================
// GET MCQs By Exam ID
// ==============================
export const getMCQsByExam = async (examId) => {
  try {
    const response = await fetch(`${API_URL}/exam/${examId}`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch exam MCQs");
    }

    return result.data;
  } catch (error) {
    console.error("Fetch Exam MCQs Error:", error);
    throw error;
  }
};

// ==============================
// CHECK Exam Attempt (Last 5 Minutes)
// ==============================
export const checkExamAttempt = async (examId, mobileNumber) => {
  try {
    const baseUrl = API_URL.replace("/api/MCQ", "/api/ExamAttempt");
    const response = await fetch(`${baseUrl}/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ examId, mobileNumber }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to check exam attempt");
    }
    return result;
  } catch (error) {
    console.error("Check Exam Attempt Error:", error);
    throw error;
  }
};

// ==============================
// SUBMIT Exam Attempt
// ==============================
export const submitExamAttempt = async (attemptData) => {
  try {
    const baseUrl = API_URL.replace("/api/MCQ", "/api/ExamAttempt");
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attemptData),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to submit exam attempt");
    }
    return result;
  } catch (error) {
    console.error("Submit Exam Attempt Error:", error);
    throw error;
  }
};

// ==============================
// GET All Exam Attempts (for admin)
// ==============================
export const getAllExamAttempts = async () => {
  try {
    const baseUrl = API_URL.replace("/api/MCQ", "/api/ExamAttempt");
    const response = await fetch(baseUrl, {
      cache: "no-store",
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch all exam attempts");
    }
    return result.data;
  } catch (error) {
    console.error("Fetch All Exam Attempts Error:", error);
    throw error;
  }
};

// ==============================
// GET SQA By Exam ID
// ==============================
export const getSQAByExam = async (examId) => {
  try {
    const baseUrl = API_URL.replace("/api/MCQ", "/api/SQA");
    const response = await fetch(`${baseUrl}/exam/${examId}`, {
      cache: "no-store",
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch SQA details");
    }
    return result.data;
  } catch (error) {
    console.error("Fetch SQA by Exam ID Error:", error);
    throw error;
  }
};

// ==============================
// SUBMIT SQA Answer
// ==============================
export const submitSQAAnswer = async (sqaId, questionId, studentAnswer, studentName, mobileNumber) => {
  try {
    const baseUrl = API_URL.replace("/api/MCQ", "/api/SQA");
    const response = await fetch(`${baseUrl}/${sqaId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId, studentAnswer, studentName, mobileNumber }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to submit SQA answer");
    }
    return result;
  } catch (error) {
    console.error("Submit SQA Answer Error:", error);
    throw error;
  }
};

// ==============================
// UPDATE Exam Attempt Score
// ==============================
export const updateExamAttemptScore = async (attemptId, score) => {
  try {
    const baseUrl = API_URL.replace("/api/MCQ", "/api/ExamAttempt");
    const response = await fetch(`${baseUrl}/${attemptId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to update attempt score");
    }
    return result;
  } catch (error) {
    console.error("Update Exam Attempt Score Error:", error);
    throw error;
  }
};
