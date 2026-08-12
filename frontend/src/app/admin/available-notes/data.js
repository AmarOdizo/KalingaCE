const API_URL = "http://192.168.1.2:5000/api/Note";

// ==============================
// Get All Notes
// ==============================
export const getNotes = async () => {
  const response = await fetch(API_URL);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch notes");
  }

  return result.data;
};

// ==============================
// Get Single Note
// ==============================
export const getNote = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch note");
  }

  return result.data;
};

// ==============================
// Create Note
// ==============================
export const createNote = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create note");
  }

  return result;
};

// ==============================
// Update Note
// ==============================
export const updateNote = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update note");
  }

  return result;
};

// ==============================
// Delete Note
// ==============================
export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete note");
  }

  return result;
};

// ==============================
// Upload File (Image/PDF)
// ==============================
export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Upload failed");
  }

  return result.data;
};
