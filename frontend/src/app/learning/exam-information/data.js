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
// Get All Exam Information
// ==============================
export async function getExamInformation() {
  try {
    const response = await customFetch("", {
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
