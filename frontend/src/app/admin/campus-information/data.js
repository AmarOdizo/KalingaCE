const API_URL =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api/CampusInformation"
    : "https://kalingace-4.onrender.com/api/CampusInformation";

/* ===========================
   GET ALL CAMPUS
=========================== */
export async function getCampusInformations() {
  const res = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch campus information");
  }

  const result = await res.json();
  return result.data;
}

/* ===========================
   GET SINGLE CAMPUS
=========================== */
export async function getCampusInformation(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch campus information");
  }

  const result = await res.json();
  return result.data;
}

/* ===========================
   CREATE CAMPUS
=========================== */
export async function createCampusInformation(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create campus information");
  }

  return result;
}

/* ===========================
   UPDATE CAMPUS
=========================== */
export async function updateCampusInformation(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update campus information");
  }

  return result;
}

/* ===========================
   DELETE CAMPUS
=========================== */
export async function deleteCampusInformation(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete campus information");
  }

  return result;
}

/* ===========================
   SET MAIN CAMPUS
=========================== */
export async function setMainCampus(id) {
  const res = await fetch(`${API_URL}/${id}/set-main`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to set main branch");
  }

  return result;
}
