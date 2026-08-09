const API_URL = "http://localhost:5000/api/Poster";

// =========================
// Get All Posters
// =========================
export async function getPosters() {
  const res = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posters");
  }

  const result = await res.json();
  return result.data;
}

// =========================
// Get Poster By ID
// =========================
export async function getPoster(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch poster");
  }

  const result = await res.json();
  return result.data;
}

// =========================
// Upload Image
// =========================
export async function uploadPoster(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const result = await res.json();
  return result.data.url;
}

// =========================
// Create Poster
// =========================
export async function createPoster(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create poster");
  }

  return await res.json();
}

// =========================
// Update Poster
// =========================
export async function updatePoster(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update poster");
  }

  return await res.json();
}

// =========================
// Delete Poster
// =========================
export async function deletePoster(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete poster");
  }

  return await res.json();
}
