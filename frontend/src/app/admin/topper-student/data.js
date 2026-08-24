const LOCAL_URL = "http://localhost:5000/api/Student";
const PROD_URL = "https://kalingace-4.onrender.com/api/Student";

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

// ===============================
// GET ALL STUDENTS
// ===============================
export const getStudents = async () => {
  const response = await customFetch("");

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return await response.json();
};

// ===============================
// GET STUDENT BY ID
// ===============================
export const getStudent = async (id) => {
  const response = await customFetch(`/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch student");
  }

  return await response.json();
};

// ===============================
// CREATE STUDENT
// ===============================
export const createStudent = async (student) => {
  const response = await customFetch("", {
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

// ===============================
// UPDATE STUDENT
// ===============================
export const updateStudent = async (id, student) => {
  const response = await customFetch(`/${id}`, {
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
  const response = await customFetch(`/${id}`, {
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

  const response = await customFetch("/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data;
};

// ===============================
// TOGGLE TOPPER PUBLICATION STATUS
// ===============================
export const togglePublishTopper = async (id) => {
  const response = await customFetch(`/${id}/publish`, {
    method: "PATCH",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle topper publication status");
  }

  return data;
};
