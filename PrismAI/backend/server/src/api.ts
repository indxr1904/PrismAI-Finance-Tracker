export async function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
