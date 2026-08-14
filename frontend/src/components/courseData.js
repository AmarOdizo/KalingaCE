const API_URL = "https://kalingace-4.onrender.com/api/Course";

export async function getCourses() {
  const res = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await res.json();

  return result.data;
}

export async function getCourseById(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch course details");
  }

  const result = await res.json();

  return result.data;
}
