const API_URL = "https://kalingace-4.onrender.com/api/Course";

// ==========================
// Get All Courses
// ==========================
export async function getCourses() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await response.json();
  return result.data;
}

// ==========================
// Get Course By ID
// ==========================
export async function getCourseById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  const result = await response.json();
  return result.data;
}

// ==========================
// Create Course
// ==========================
export async function createCourse(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create course");
  }

  return result;
}

// ==========================
// Update Course
// ==========================
export async function updateCourse(id, formData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update course");
  }

  return result;
}

// ==========================
// Delete Course
// ==========================
export async function deleteCourse(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete course");
  }

  return result;
}
