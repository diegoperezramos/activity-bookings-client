import { API_BASE_URL } from '../config';

export async function apiFetch(path, options = {}) {
  const { jwt, headers: requestHeaders, ...requestOptions } = options;
  const headers = new Headers(requestHeaders);

  if (jwt) {
    headers.set('Authorization', `Bearer ${jwt}`);
  }

  const normalizedPath = path.replace(/^\/+/, '');
  const baseUrl = API_BASE_URL.replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/${normalizedPath}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    try {
      error.payload = await response.json();
    } catch {
      error.payload = undefined;
    }
    throw error;
  }

  return response.json();
}
