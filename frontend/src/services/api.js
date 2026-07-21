// API calls will use relative paths so the React dev server proxy routes them to the backend
export async function getApiData(path) {
  try {
    const response = await fetch(path);

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
