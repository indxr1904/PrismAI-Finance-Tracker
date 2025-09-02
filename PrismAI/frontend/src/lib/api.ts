export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}