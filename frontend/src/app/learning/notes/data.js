const API_URL = "https://kalingace-4.onrender.com/api/Note";

// ==============================
// Get All Notes
// ==============================
export const getNotes = async () => {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch notes");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

// ==============================
// Get Single Note
// ==============================
export const getNote = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch note");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
