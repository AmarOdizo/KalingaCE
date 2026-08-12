const API_URL = "http://192.168.1.2:5000/api/Student";

// ===============================
// GET ALL STUDENTS
// ===============================
export const getStudents = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return await response.json();
};

// ===============================
// GET STUDENT BY ID
// ===============================
export const getStudent = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch student");
  }

  return await response.json();
};

// ===============================
// CREATE STUDENT
// ===============================
export const createStudent = async (student) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: student.name,
      subject: student.subject,
      batch: student.batch,
      totalMark: student.totalMark,
      gainMark: student.gainMark,
      image: student.image, // ImageKit URL
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create student");
  }

  return data;
};

/// ===============================
// UPDATE STUDENT
// ===============================
export const updateStudent = async (id, student) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: student.name,
      subject: student.subject,
      batch: student.batch,
      totalMark: student.totalMark,
      gainMark: student.gainMark,
      image: student.image, // ImageKit URL
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update student");
  }

  return data;
};

// ===============================
// DELETE STUDENT
// ===============================
export const deleteStudent = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete student");
  }

  return data;
};

// Upload Image
export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  return data;
};
