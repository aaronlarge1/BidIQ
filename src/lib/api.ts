// Base URL: set VITE_API_URL in .env (defaults to localhost:3001)
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001"

function getToken(): string | null {
  return localStorage.getItem("bidiq_token")
}

export function setToken(token: string): void {
  localStorage.setItem("bidiq_token", token)
}

export function clearToken(): void {
  localStorage.removeItem("bidiq_token")
  localStorage.removeItem("bidiq_company_id")
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => ({ error: "Invalid response" }))

  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? `HTTP ${res.status}`)
  }

  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T = void>(path: string) => request<T>(path, { method: "DELETE" }),
}

export { ApiError }
