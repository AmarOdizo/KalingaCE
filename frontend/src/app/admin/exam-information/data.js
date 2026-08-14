const API_URL = "https://kalingace-4.onrender.com/api/ExamInfo";

// ==============================
// GET All Exam Information
// ==============================
export const getExamInformation = async () => {
  const response = await fetch(API_URL);

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
  const response = await fetch(`${API_URL}/${id}`);

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
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

// ==============================
// UPDATE Exam Information
// ==============================
export const updateExamInformation = async (id, formData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });

  return await response.json();
};

// ==============================
// DELETE Exam Information
// ==============================
export const deleteExamInformation = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
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

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return await response.json();
};
