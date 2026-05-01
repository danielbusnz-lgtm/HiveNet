export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

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
