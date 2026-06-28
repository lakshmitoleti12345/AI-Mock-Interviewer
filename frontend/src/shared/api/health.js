const API_BASE = "/api/v1";

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/health`);

  if (!response.ok) {
    throw new Error("Backend is not reachable");
  }

  return response.json();
}
