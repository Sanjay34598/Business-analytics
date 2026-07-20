const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

export async function getApiData(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Unable to load data (${response.status}).`);
  }

  return response.json();
}
