const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export async function request(path, { signal, timeout = 15000, ...options } = {}) {
  const controller = !signal && timeout > 0 ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null
  try {
    const body = options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      body,
      signal: signal || controller?.signal,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) }
    })
    const payload = response.status === 204 ? null : await response.json().catch(() => null)
    if (!response.ok) throw new ApiError(payload?.message || `Request failed: ${response.status}`, response.status, payload)
    if (payload && payload.code !== undefined && payload.code !== 0 && payload.code !== 200) {
      throw new ApiError(payload.message || 'Request failed', response.status, payload)
    }
    return payload
  } finally {
    if (timer) clearTimeout(timer)
  }
}
