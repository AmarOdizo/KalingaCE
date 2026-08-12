const API_URL = "http://192.168.1.2:5000/api/CampusInformation";

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
