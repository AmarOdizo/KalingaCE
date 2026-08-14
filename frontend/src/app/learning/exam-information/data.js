const API_URL = "https://kalingace-4.onrender.com/api/ExamInfo";

// ==============================
// Get All Exam Information
// ==============================

export async function getExamInformation() {
  try {
    const response = await fetch(API_URL, {
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
