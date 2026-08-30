export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, { headers: { "Content-Type": "application/json", ...options.headers }, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(payload.message || "Something went wrong"); error.status = response.status; throw error; }
  return payload.data;
}
