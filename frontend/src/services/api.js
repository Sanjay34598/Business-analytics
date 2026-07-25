const API_BASE = (process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "https://web-production-71f38.up.railway.app").replace(/\/+$/, "");

export async function getApiData(path) {
  try {
    const fullPath = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const response = await fetch(fullPath);

    if (!response.ok) {
      throw new Error(`Unable to load data (${response.status}).`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error("Backend server is unreachable. Please verify that the Flask backend is running.");
    }
    throw error;
  }
}
