const API_URL = "http://192.168.1.2:5000/api/ExamInfo";

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
