const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

/** Fetches JSON from the backend API and throws a helpful error on failure. */
export async function apiGet(path, params = {}) {
  const url = new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
  }

  const response = await fetch(url)
  const body = await response.json().catch(() => undefined)

  if (!response.ok) {
    throw new Error(body?.error || `Request to ${path} failed with status ${response.status}`)
  }

  return body
}
