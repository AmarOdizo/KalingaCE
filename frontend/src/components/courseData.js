const API_URL = "http://localhost:5000/api/Course";

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
