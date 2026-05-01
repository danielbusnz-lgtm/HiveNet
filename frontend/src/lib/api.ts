/** Backend API base URL. Falls back to localhost in dev. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

/**
 * Fetch wrapper that auto-attaches the JWT from localStorage and handles 401s.
 *
 * On 401, clears the token and redirects to /login.
 *
 * @param path - API path relative to {@link API_URL} (e.g., `/posts`).
 * @param init - Standard fetch options.
 * @returns The raw `Response`. Caller is responsible for `.json()` and status checks.
 * @throws If the response is 401 (after redirecting to login).
 */
export async function apiFetch(path: string, init: RequestInit = {}) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...init.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        throw new Error('Unauthorized')
    }

    return response
}
