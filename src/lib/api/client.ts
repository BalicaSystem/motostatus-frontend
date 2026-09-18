const API_URL = import.meta.env.VITE_API_URL

export async function api<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      const error = await response.json()

      throw new Error(
        error.message ?? `API error: ${response.status}`,
      )
    }

    throw new Error(`API error: ${response.status}`)
  }

  const contentType = response.headers.get('content-type')

  if (
    response.status === 204 ||
    !contentType?.includes('application/json')
  ) {
    return undefined as T
  }

  return response.json()
}
